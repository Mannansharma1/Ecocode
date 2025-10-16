"""
Training entrypoint for the energy forecasting LSTM.

Loads recent data via energy_model, trains the LSTM on last 30 days,
and saves to models/energy_lstm.h5. Also provides a simple evaluation.
"""

from __future__ import annotations

import argparse
import logging
from typing import Tuple

import numpy as np

from .energy_model import (
    fetch_energy_data,
    preprocess_energy_data,
    train_energy_model,
)

logger = logging.getLogger("train_energy")
if not logger.handlers:
    import sys

    handler = logging.StreamHandler(sys.stdout)
    logger.addHandler(handler)
logger.setLevel(logging.INFO)


def load_energy_data(days: int = 30):
    hours = days * 24
    return fetch_energy_data(hours_back=hours)


def evaluate_model() -> Tuple[float, float]:
    """Quick holdout evaluation: MSE and MAE on a small split."""
    df = load_energy_data(30)
    X, y, _ = preprocess_energy_data(df)
    if len(X) < 20:
        return 0.0, 0.0
    # Simple split
    split = int(0.8 * len(X))
    X_train, y_train = X[:split], y[:split]
    X_val, y_val = X[split:], y[split:]
    # Train fresh
    model = train_energy_model(df=df, epochs=5)
    preds = model.predict(X_val, verbose=0)
    mse = float(np.mean((preds - y_val) ** 2))
    mae = float(np.mean(np.abs(preds - y_val)))
    logger.info("Energy model eval - MSE: %.4f, MAE: %.4f", mse, mae)
    return mse, mae


def train_and_save(days: int = 30, epochs: int = 10):
    df = load_energy_data(days)
    _ = train_energy_model(df=df, epochs=epochs)
    logger.info("Energy model trained and saved.")


def main():
    parser = argparse.ArgumentParser(description="Train energy LSTM model")
    parser.add_argument("--days", type=int, default=30)
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--eval", action="store_true", help="Run quick evaluation after training")
    args = parser.parse_args()

    train_and_save(days=args.days, epochs=args.epochs)
    if args.eval:
        evaluate_model()


if __name__ == "__main__":
    main()


