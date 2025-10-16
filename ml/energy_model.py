"""
Energy forecasting and anomaly detection module for EcoGrid AI Urban Resilience System.

This module provides utilities to fetch energy demand data (mocked if remote API
is unavailable), preprocess it, train an LSTM forecaster, run predictions for the
next 6 hours, and detect anomalies using a simple autoencoder approach on the
residuals (predicted vs actual when available).

Python: 3.10+
Dependencies: tensorflow, keras, pandas, numpy, scikit-learn, requests

Models are persisted under ./models and intermediate data under ./data.
"""

from __future__ import annotations

import os
import math
import time
import json
import logging
from datetime import datetime, timedelta
from typing import Tuple, Optional, List

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

try:
    import tensorflow as tf
    from tensorflow.keras import layers, models
except Exception:  # pragma: no cover - allow import fallback on systems without TF GPU
    # Lazy import in runtime environments missing TF; raise on actual usage
    tf = None  # type: ignore
    layers = None  # type: ignore
    models = None  # type: ignore

import requests


# ---------- Paths and Logger ----------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
MODELS_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)

ENERGY_MODEL_PATH = os.path.join(MODELS_DIR, "energy_lstm.h5")
ENERGY_AE_PATH = os.path.join(MODELS_DIR, "energy_residual_autoencoder.h5")

logger = logging.getLogger("energy_model")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
logger.setLevel(logging.INFO)


# ---------- Data Fetching ----------
def _simulate_energy_series(start: datetime, periods: int, freq_minutes: int = 60) -> pd.DataFrame:
    rng = pd.date_range(start=start, periods=periods, freq=f"{freq_minutes}min")
    # Simulate seasonality and daily cycle
    hours = np.arange(periods)
    daily_cycle = 1000 + 200 * np.sin(2 * np.pi * (hours % 24) / 24)
    weekly_cycle = 50 * np.sin(2 * np.pi * (hours % (24 * 7)) / (24 * 7))
    noise = np.random.normal(0, 30, size=periods)
    demand = np.maximum(300, daily_cycle + weekly_cycle + noise)

    # Weather-like features
    temperature = 25 + 7 * np.sin(2 * np.pi * (hours % 24) / 24) + np.random.normal(0, 0.5, periods)
    humidity = 60 + 10 * np.cos(2 * np.pi * (hours % 24) / 24) + np.random.normal(0, 1, periods)
    wind_speed = 5 + 2 * np.sin(2 * np.pi * (hours % 24) / 24 + 1) + np.random.normal(0, 0.2, periods)

    df = pd.DataFrame(
        {
            "timestamp": rng,
            "temperature": temperature,
            "humidity": humidity,
            "wind_speed": wind_speed,
            "hour": rng.hour,
            "day": rng.dayofweek,
            "demand": demand,
        }
    )
    return df


def fetch_energy_data(hours_back: int = 24 * 30, use_api: bool = False) -> pd.DataFrame:
    """Fetch energy demand time series.

    Attempts remote API if requested, else falls back to simulation.
    Returns a DataFrame with columns: timestamp, temperature, humidity, wind_speed, hour, day, demand
    """
    if use_api:
        try:
            # Placeholder: Use OpenEI or another endpoint if suitable; many require API keys.
            # We'll attempt a benign request and fall back if rate-limited/unavailable.
            _ = requests.get("https://api.openei.org/utility_rate", timeout=5)
            # In this template, still simulate due to schema mismatch.
        except Exception as exc:
            logger.warning("Energy API unavailable, using simulated data: %s", exc)

    start = datetime.utcnow() - timedelta(hours=hours_back)
    return _simulate_energy_series(start=start, periods=hours_back, freq_minutes=60)


# ---------- Preprocessing ----------
def preprocess_energy_data(df: pd.DataFrame, sequence_length: int = 24) -> Tuple[np.ndarray, np.ndarray, MinMaxScaler]:
    """Create supervised sequences for LSTM.

    X features: temperature, humidity, wind_speed, hour, day, previous_demand
    y: next 6-hour total demand (MW) or per-step; here we predict 6 future steps.
    """
    df = df.copy().sort_values("timestamp")
    df["previous_demand"] = df["demand"].shift(1)
    df.dropna(inplace=True)

    feature_cols = [
        "temperature",
        "humidity",
        "wind_speed",
        "hour",
        "day",
        "previous_demand",
    ]

    scaler = MinMaxScaler()
    features_scaled = scaler.fit_transform(df[feature_cols])

    # Build input-output sequences for next 6 steps
    horizon = 6
    X_list: List[np.ndarray] = []
    y_list: List[np.ndarray] = []
    for i in range(len(df) - sequence_length - horizon + 1):
        X_list.append(features_scaled[i : i + sequence_length])
        y_future = df["demand"].values[i + sequence_length : i + sequence_length + horizon]
        y_list.append(y_future)

    X = np.asarray(X_list, dtype=np.float32)
    y = np.asarray(y_list, dtype=np.float32)
    return X, y, scaler


# ---------- Models ----------
def _build_energy_lstm(input_shape: Tuple[int, int]) -> models.Model:
    if tf is None:
        raise RuntimeError("TensorFlow is required to build the model.")
    model = models.Sequential(
        [
            layers.Input(shape=input_shape),
            layers.LSTM(64, return_sequences=True),
            layers.Dropout(0.2),
            layers.LSTM(32),
            layers.Dense(32, activation="relu"),
            layers.Dense(6, activation="linear"),
        ]
    )
    model.compile(optimizer="adam", loss="mse")
    return model


def _build_residual_autoencoder(vector_length: int = 6) -> models.Model:
    if tf is None:
        raise RuntimeError("TensorFlow is required to build the model.")
    inp = layers.Input(shape=(vector_length,))
    x = layers.Dense(16, activation="relu")(inp)
    x = layers.Dense(8, activation="relu")(x)
    code = layers.Dense(4, activation="relu")(x)
    x = layers.Dense(8, activation="relu")(code)
    out = layers.Dense(vector_length, activation="linear")(x)
    model = models.Model(inputs=inp, outputs=out)
    model.compile(optimizer="adam", loss="mse")
    return model


# ---------- Training ----------
def train_energy_model(df: Optional[pd.DataFrame] = None, sequence_length: int = 24, epochs: int = 10) -> models.Model:
    if df is None:
        df = fetch_energy_data(hours_back=24 * 30)
    X, y, _ = preprocess_energy_data(df, sequence_length=sequence_length)
    if len(X) < 10:
        raise ValueError("Not enough data to train the energy model.")
    model = _build_energy_lstm(input_shape=(X.shape[1], X.shape[2]))
    model.fit(X, y, epochs=epochs, batch_size=32, validation_split=0.1, verbose=0)
    model.save(ENERGY_MODEL_PATH)
    logger.info("Saved energy model to %s", ENERGY_MODEL_PATH)
    return model


def _load_or_train_energy(df: Optional[pd.DataFrame] = None) -> models.Model:
    if os.path.exists(ENERGY_MODEL_PATH):
        try:
            return models.load_model(ENERGY_MODEL_PATH)
        except Exception:
            logger.warning("Failed to load energy model; retraining.")
    return train_energy_model(df=df)


# ---------- Inference ----------
def predict_energy_demand(df_recent: Optional[pd.DataFrame] = None, sequence_length: int = 24) -> Tuple[np.ndarray, np.ndarray]:
    """Predict next 6-hour energy demand.

    Returns (predictions, last_feature_vector_scaled) where predictions shape is (6,)
    and last_feature_vector_scaled is for potential post-processing.
    """
    if df_recent is None:
        df_recent = fetch_energy_data(hours_back=sequence_length + 6)
    model = _load_or_train_energy()

    # Prepare sequence for the last window
    df_recent = df_recent.sort_values("timestamp")
    df_recent["previous_demand"] = df_recent["demand"].shift(1)
    df_recent.dropna(inplace=True)

    feature_cols = ["temperature", "humidity", "wind_speed", "hour", "day", "previous_demand"]
    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df_recent[feature_cols])
    if len(scaled) < sequence_length:
        raise ValueError("Insufficient recent data for prediction.")
    last_seq = scaled[-sequence_length:]
    preds = model.predict(last_seq[np.newaxis, ...], verbose=0)[0]
    return preds, last_seq[-1]


# ---------- Anomaly Detection ----------
def train_residual_autoencoder(df: Optional[pd.DataFrame] = None, sequence_length: int = 24, epochs: int = 10) -> models.Model:
    """Train an autoencoder on historical residuals to detect anomalies."""
    if df is None:
        df = fetch_energy_data(hours_back=24 * 30)
    # Create rolling predictions to compute residuals
    model = _load_or_train_energy(df)
    X, y_true, _ = preprocess_energy_data(df, sequence_length=sequence_length)
    y_pred = model.predict(X, verbose=0)
    residuals = (y_true - y_pred).astype(np.float32)
    ae = _build_residual_autoencoder(vector_length=residuals.shape[1])
    ae.fit(residuals, residuals, epochs=epochs, batch_size=32, validation_split=0.1, verbose=0)
    ae.save(ENERGY_AE_PATH)
    logger.info("Saved energy residual AE to %s", ENERGY_AE_PATH)
    return ae


def _load_or_train_ae(df: Optional[pd.DataFrame] = None) -> models.Model:
    if os.path.exists(ENERGY_AE_PATH):
        try:
            return models.load_model(ENERGY_AE_PATH)
        except Exception:
            logger.warning("Failed to load residual AE; retraining.")
    return train_residual_autoencoder(df=df)


def detect_energy_anomalies(predicted: np.ndarray, actual_future: Optional[np.ndarray] = None, threshold: float = 2.5) -> Tuple[bool, float]:
    """Detect anomalies using residual AE reconstruction error or simple deviation.

    If actual_future is provided (length 6), compute residual and reconstruction error.
    Else, return False with 0 score as we cannot judge anomaly without actuals.
    """
    if actual_future is None or len(actual_future) != 6:
        return False, 0.0
    residual = (actual_future - predicted).astype(np.float32)
    try:
        ae = _load_or_train_ae()
        recon = ae.predict(residual[np.newaxis, ...], verbose=0)[0]
        error = float(np.mean((recon - residual) ** 2))
        is_anom = error > threshold
        return is_anom, error
    except Exception as exc:
        logger.warning("AE unavailable (%s); using MAE fallback.", exc)
        mae = float(np.mean(np.abs(residual)))
        return mae > threshold, mae


# Convenience combined flow
def fetch_and_predict() -> dict:
    df = fetch_energy_data(hours_back=24 * 2)
    preds, _ = predict_energy_demand(df_recent=df)
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "predictions_next_6h": preds.tolist(),
    }


__all__ = [
    "fetch_energy_data",
    "preprocess_energy_data",
    "train_energy_model",
    "predict_energy_demand",
    "detect_energy_anomalies",
    "train_residual_autoencoder",
    "fetch_and_predict",
]


