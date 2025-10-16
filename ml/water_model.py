"""
Water forecasting and anomaly detection module for EcoGrid AI Urban Resilience System.

Provides simulated SCADA/IoT water sensor data for Delhi zones, an autoencoder for
anomaly detection (pressure/flow deviation), an LSTM forecaster for next-hour flow
and pressure, and helper utilities to train, predict, and detect anomalies.

Python: 3.10+
Dependencies: tensorflow, keras, pandas, numpy, scikit-learn
"""

from __future__ import annotations

import os
import logging
from datetime import datetime, timedelta
from typing import Tuple, Optional, List

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

try:
    import tensorflow as tf
    from tensorflow.keras import layers, models
except Exception:  # pragma: no cover
    tf = None  # type: ignore
    layers = None  # type: ignore
    models = None  # type: ignore


# ---------- Paths and Logger ----------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

WATER_AE_PATH = os.path.join(MODELS_DIR, "water_autoencoder.h5")
WATER_LSTM_PATH = os.path.join(MODELS_DIR, "water_lstm.h5")

logger = logging.getLogger("water_model")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
logger.setLevel(logging.INFO)


# ---------- Data Simulation ----------
def fetch_water_data(hours_back: int = 48, zones: int = 5) -> pd.DataFrame:
    """Simulate water SCADA sensor readings for multiple zones.

    Columns: timestamp, zone_id, pressure, flow, turbidity, temperature
    """
    end = datetime.utcnow()
    start = end - timedelta(hours=hours_back)
    timestamps = pd.date_range(start=start, end=end, freq="10min")
    records: List[dict] = []
    for zone_id in range(1, zones + 1):
        base_pressure = 3.0 + 0.2 * zone_id
        base_flow = 50 + 5 * zone_id
        for i, ts in enumerate(timestamps):
            # Diurnal patterns
            diurnal = np.sin(2 * np.pi * ((ts.hour * 60 + ts.minute) / (24 * 60)))
            pressure = base_pressure + 0.3 * diurnal + np.random.normal(0, 0.05)
            flow = base_flow + 10 * diurnal + np.random.normal(0, 1.5)
            turbidity = 1.0 + 0.2 * np.abs(diurnal) + np.random.normal(0, 0.05)
            temperature = 22 + 4 * np.sin(2 * np.pi * ts.hour / 24) + np.random.normal(0, 0.3)
            records.append(
                {
                    "timestamp": ts,
                    "zone_id": zone_id,
                    "pressure": max(0.1, float(pressure)),
                    "flow": max(0.0, float(flow)),
                    "turbidity": float(turbidity),
                    "temperature": float(temperature),
                }
            )
    df = pd.DataFrame.from_records(records)
    return df


# ---------- Preprocessing ----------
def preprocess_water_data(df: pd.DataFrame, sequence_length: int = 12) -> Tuple[np.ndarray, np.ndarray, MinMaxScaler]:
    """Build sequences for LSTM forecasting next-step flow and pressure.

    Input features per step: pressure, flow, turbidity, temperature, zone_id (scaled)
    Output: next-step [flow, pressure]
    """
    df = df.copy().sort_values(["zone_id", "timestamp"]).reset_index(drop=True)
    feature_cols = ["pressure", "flow", "turbidity", "temperature", "zone_id"]

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df[feature_cols])
    df_scaled = pd.DataFrame(scaled, columns=feature_cols)
    df_scaled[["timestamp", "zone_id_orig"]] = df[["timestamp", "zone_id"]]

    X_list: List[np.ndarray] = []
    y_list: List[np.ndarray] = []
    for zone_id, g in df_scaled.groupby("zone_id_orig"):
        g = g.sort_values("timestamp")
        values = g[feature_cols].values
        for i in range(len(values) - sequence_length - 1):
            X_list.append(values[i : i + sequence_length])
            next_step = values[i + sequence_length]
            # Output positions: flow=1, pressure=0
            y_list.append(next_step[[1, 0]])

    X = np.asarray(X_list, dtype=np.float32)
    y = np.asarray(y_list, dtype=np.float32)
    return X, y, scaler


# ---------- Models ----------
def _build_water_lstm(input_shape: Tuple[int, int]) -> models.Model:
    if tf is None:
        raise RuntimeError("TensorFlow is required to build water LSTM.")
    model = models.Sequential(
        [
            layers.Input(shape=input_shape),
            layers.LSTM(64, return_sequences=True),
            layers.Dropout(0.2),
            layers.LSTM(32),
            layers.Dense(16, activation="relu"),
            layers.Dense(2, activation="linear"),  # [flow, pressure]
        ]
    )
    model.compile(optimizer="adam", loss="mse")
    return model


def _build_water_autoencoder(vector_length: int = 2) -> models.Model:
    if tf is None:
        raise RuntimeError("TensorFlow is required to build water AE.")
    inp = layers.Input(shape=(vector_length,))
    x = layers.Dense(8, activation="relu")(inp)
    code = layers.Dense(4, activation="relu")(x)
    x = layers.Dense(8, activation="relu")(code)
    out = layers.Dense(vector_length, activation="linear")(x)
    model = models.Model(inputs=inp, outputs=out)
    model.compile(optimizer="adam", loss="mse")
    return model


# ---------- Training ----------
def train_water_autoencoder(df: Optional[pd.DataFrame] = None, epochs: int = 10) -> models.Model:
    if df is None:
        df = fetch_water_data(hours_back=72)
    # Assume most of the data is normal; train AE on [flow, pressure]
    feats = df.sort_values(["zone_id", "timestamp"])[["flow", "pressure"]].values.astype(np.float32)
    ae = _build_water_autoencoder(vector_length=2)
    ae.fit(feats, feats, epochs=epochs, batch_size=64, validation_split=0.1, verbose=0)
    ae.save(WATER_AE_PATH)
    logger.info("Saved water AE to %s", WATER_AE_PATH)
    return ae


def train_water_lstm(df: Optional[pd.DataFrame] = None, sequence_length: int = 12, epochs: int = 10) -> models.Model:
    if df is None:
        df = fetch_water_data(hours_back=72)
    X, y, _ = preprocess_water_data(df, sequence_length=sequence_length)
    if len(X) < 10:
        raise ValueError("Not enough data to train water LSTM.")
    model = _build_water_lstm(input_shape=(X.shape[1], X.shape[2]))
    model.fit(X, y, epochs=epochs, batch_size=64, validation_split=0.1, verbose=0)
    model.save(WATER_LSTM_PATH)
    logger.info("Saved water LSTM to %s", WATER_LSTM_PATH)
    return model


def _load_or_train_water_lstm() -> models.Model:
    if os.path.exists(WATER_LSTM_PATH):
        try:
            return models.load_model(WATER_LSTM_PATH)
        except Exception:
            logger.warning("Failed to load water LSTM; retraining.")
    return train_water_lstm()


def _load_or_train_water_ae() -> models.Model:
    if os.path.exists(WATER_AE_PATH):
        try:
            return models.load_model(WATER_AE_PATH)
        except Exception:
            logger.warning("Failed to load water AE; retraining.")
    return train_water_autoencoder()


# ---------- Inference ----------
def predict_water_conditions(df_recent: Optional[pd.DataFrame] = None, sequence_length: int = 12) -> Tuple[np.ndarray, dict]:
    """Forecast next-step [flow, pressure] per zone using LSTM.

    Returns tuple of (predictions array of shape (num_zones, 2), meta dict)
    """
    if df_recent is None:
        df_recent = fetch_water_data(hours_back=6)
    model = _load_or_train_water_lstm()

    # Use latest window per zone
    df_recent = df_recent.sort_values(["zone_id", "timestamp"]).reset_index(drop=True)
    feature_cols = ["pressure", "flow", "turbidity", "temperature", "zone_id"]
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df_recent[feature_cols])
    df_scaled = pd.DataFrame(scaled, columns=feature_cols)
    df_scaled[["timestamp", "zone_id_orig"]] = df_recent[["timestamp", "zone_id"]]

    preds: List[np.ndarray] = []
    zones: List[int] = []
    for zone_id, g in df_scaled.groupby("zone_id_orig"):
        values = g[feature_cols].values
        if len(values) < sequence_length:
            continue
        seq = values[-sequence_length:]
        pred = model.predict(seq[np.newaxis, ...], verbose=0)[0]
        preds.append(pred)
        zones.append(int(zone_id))
    if not preds:
        raise ValueError("Insufficient data for any zone to predict.")
    return np.vstack(preds), {"zones": zones}


def detect_water_anomalies(observed: np.ndarray, threshold: float = 0.8) -> Tuple[np.ndarray, np.ndarray]:
    """Detect anomalies using AE reconstruction error on [flow, pressure].

    Returns (is_anomaly_bool_array, reconstruction_errors)
    """
    ae = _load_or_train_water_ae()
    recon = ae.predict(observed, verbose=0)
    errors = np.mean((recon - observed) ** 2, axis=1)
    return (errors > threshold), errors


# ---------- GNN Placeholder ----------
# from tensorflow.keras import Model  # Placeholder for future GNN integration
# class WaterZonalImpactGNN(Model):
#     pass


__all__ = [
    "fetch_water_data",
    "preprocess_water_data",
    "train_water_autoencoder",
    "train_water_lstm",
    "predict_water_conditions",
    "detect_water_anomalies",
]


