"""
Training entrypoint for the water anomaly autoencoder.

Loads simulated SCADA data via water_model, trains the AE on mostly-normal
readings, and saves to models/water_autoencoder.h5. Provides simple evaluation.
"""

from __future__ import annotations

import argparse
import logging
from typing import Tuple

import numpy as np

from .water_model import (
    fetch_water_data,
    train_water_autoencoder,
)

logger = logging.getLogger("train_water_autoencoder")
if not logger.handlers:
    import sys

    handler = logging.StreamHandler(sys.stdout)
    logger.addHandler(handler)
logger.setLevel(logging.INFO)


def load_water_data(hours: int = 72):
    return fetch_water_data(hours_back=hours)


def evaluate_autoencoder() -> float:
    """Compute reconstruction MSE on a small validation split."""
    df = load_water_data(72)
    feats = df.sort_values(["zone_id", "timestamp"])[["flow", "pressure"]].values.astype(np.float32)
    split = int(0.8 * len(feats))
    train, val = feats[:split], feats[split:]
    model = train_water_autoencoder(df=df, epochs=5)
    recon = model.predict(val, verbose=0)
    mse = float(np.mean((recon - val) ** 2))
    logger.info("Water AE eval - MSE: %.4f", mse)
    return mse


def train_and_save(hours: int = 72, epochs: int = 10):
    df = load_water_data(hours)
    _ = train_water_autoencoder(df=df, epochs=epochs)
    logger.info("Water AE trained and saved.")


def main():
    parser = argparse.ArgumentParser(description="Train water autoencoder model")
    parser.add_argument("--hours", type=int, default=72)
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--eval", action="store_true", help="Run quick evaluation after training")
    args = parser.parse_args()

    train_and_save(hours=args.hours, epochs=args.epochs)
    if args.eval:
        evaluate_autoencoder()


if __name__ == "__main__":
    main()


