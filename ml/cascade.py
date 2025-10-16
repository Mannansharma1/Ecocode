    """
Cascade orchestrator for EcoGrid AI Urban Resilience System.

Schedules periodic prediction and retraining jobs for Energy and Water models
using APScheduler. Logs predictions and anomalies to a local SQLite database.

Run: python -m ml.cascade  (or python ml/cascade.py if PYTHONPATH is set)
"""

from __future__ import annotations

import os
import sqlite3
import logging
from datetime import datetime
from typing import Tuple

import numpy as np

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

from .energy_model import (
    fetch_energy_data,
    predict_energy_demand,
    detect_energy_anomalies,
    train_energy_model,
    train_residual_autoencoder,
)
from .water_model import (
    fetch_water_data,
    predict_water_conditions,
    detect_water_anomalies,
    train_water_autoencoder,
    train_water_lstm,
)


# ---------- Paths and Logger ----------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
DATA_DIR = os.path.join(BASE_DIR, "data")
DB_PATH = os.path.join(BASE_DIR, "ecogrid.db")
os.makedirs(DATA_DIR, exist_ok=True)

logger = logging.getLogger("cascade")
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
logger.setLevel(logging.INFO)


# ---------- DB Setup ----------
def _init_db():
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS energy_predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            preds_json TEXT,
            anomaly INTEGER,
            anomaly_score REAL
        )
        """
    )
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS water_predictions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            zone_ids TEXT,
            preds_json TEXT,
            anomaly_count INTEGER,
            avg_anomaly_score REAL
        )
        """
    )
    con.commit()
    con.close()


# ---------- Orchestrated Steps ----------
def run_energy_forecast() -> Tuple[np.ndarray, bool, float]:
    try:
        logger.info("Running energy forecast...")
        df_recent = fetch_energy_data(hours_back=30)
        preds, _ = predict_energy_demand(df_recent=df_recent)
        # No actuals in live mode; simulate a small random variation as pseudo-actuals for anomaly demo
        simulated_actual = preds + np.random.normal(0, 10, size=preds.shape)
        is_anom, score = detect_energy_anomalies(predicted=preds, actual_future=simulated_actual)
        _log_energy_result(preds, is_anom, score)
        if is_anom:
            logger.warning("Energy anomaly detected! score=%.3f", score)
        else:
            logger.info("Energy forecast complete. No anomaly.")
        return preds, is_anom, score
    except Exception as exc:
        logger.exception("Energy forecast failed: %s", exc)
        return np.array([]), False, 0.0


def run_water_forecast() -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    try:
        logger.info("Running water forecast...")
        df_recent = fetch_water_data(hours_back=12)
        preds, meta = predict_water_conditions(df_recent=df_recent)
        # Treat predictions as observed for demo; add noise for anomaly simulation
        observed = preds + np.random.normal(0, 0.5, size=preds.shape)
        is_anom, errors = detect_water_anomalies(observed)
        _log_water_result(meta.get("zones", []), preds, is_anom, errors)
        if np.any(is_anom):
            logger.warning("Water anomalies detected in %d zones", int(np.sum(is_anom)))
        else:
            logger.info("Water forecast complete. No anomalies.")
        return preds, is_anom, errors
    except Exception as exc:
        logger.exception("Water forecast failed: %s", exc)
        return np.array([]), np.array([]), np.array([])


def detect_anomalies():
    """Manual trigger for anomaly checks if needed (covered in forecast functions)."""
    return run_energy_forecast(), run_water_forecast()


def _log_energy_result(preds: np.ndarray, anomaly: bool, score: float):
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute(
        "INSERT INTO energy_predictions(timestamp, preds_json, anomaly, anomaly_score) VALUES (?, ?, ?, ?)",
        (
            datetime.utcnow().isoformat(),
            str(preds.tolist()),
            int(anomaly),
            float(score),
        ),
    )
    con.commit()
    con.close()


def _log_water_result(zones, preds: np.ndarray, is_anom: np.ndarray, errors: np.ndarray):
    con = sqlite3.connect(DB_PATH)
    cur = con.cursor()
    cur.execute(
        "INSERT INTO water_predictions(timestamp, zone_ids, preds_json, anomaly_count, avg_anomaly_score) VALUES (?, ?, ?, ?, ?)",
        (
            datetime.utcnow().isoformat(),
            str(list(zones)),
            str(preds.tolist()),
            int(np.sum(is_anom)) if is_anom.size else 0,
            float(np.mean(errors)) if errors.size else 0.0,
        ),
    )
    con.commit()
    con.close()


def _retrain_energy_models():
    logger.info("Retraining energy models (LSTM + residual AE)...")
    try:
        df = fetch_energy_data(hours_back=24 * 30)
        train_energy_model(df=df, epochs=5)
        train_residual_autoencoder(df=df, epochs=5)
        logger.info("Energy models retrained.")
    except Exception as exc:
        logger.exception("Energy retraining failed: %s", exc)


def _retrain_water_models():
    logger.info("Retraining water models (AE + LSTM)...")
    try:
        df = fetch_water_data(hours_back=72)
        train_water_autoencoder(df=df, epochs=5)
        train_water_lstm(df=df, epochs=5)
        logger.info("Water models retrained.")
    except Exception as exc:
        logger.exception("Water retraining failed: %s", exc)


def schedule_jobs():
    _init_db()
    scheduler = BackgroundScheduler()
    # Real-time prediction every 10 minutes
    scheduler.add_job(run_energy_forecast, trigger=IntervalTrigger(minutes=10), id="energy_forecast")
    scheduler.add_job(run_water_forecast, trigger=IntervalTrigger(minutes=10), id="water_forecast")
    # Retraining every 12 hours
    scheduler.add_job(_retrain_energy_models, trigger=IntervalTrigger(hours=12), id="energy_retrain")
    scheduler.add_job(_retrain_water_models, trigger=IntervalTrigger(hours=12), id="water_retrain")
    scheduler.start()
    logger.info("Scheduler started: energy/water forecasts every 10m, retraining every 12h")
    return scheduler


def main():
    scheduler = schedule_jobs()
    try:
        # Keep main thread alive
        import time

        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Shutting down scheduler...")
        scheduler.shutdown()


if __name__ == "__main__":
    main()


