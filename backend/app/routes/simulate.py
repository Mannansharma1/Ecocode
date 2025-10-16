"""
Simulation endpoints to trigger ML runs from the backend.

These endpoints call into the ML cascade module to run immediate forecasts and
log results to SQLite, making it easy to prime data for the dashboard.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends

from ..auth import require_api_key

# Import ML cascade orchestrator
from ....ml.cascade import run_energy_forecast, run_water_forecast


router = APIRouter()


@router.post("/energy")
def simulate_energy(_: str = Depends(require_api_key)):
    # Trigger an on-demand energy forecast and DB log
    preds, anomaly, score = run_energy_forecast()
    return {
        "predictions_next_6h": preds.tolist() if preds.size else [],
        "anomaly": bool(anomaly),
        "anomaly_score": float(score),
    }


@router.post("/water")
def simulate_water(_: str = Depends(require_api_key)):
    # Trigger an on-demand water forecast and DB log
    preds, is_anom, errors = run_water_forecast()
    return {
        "predictions": preds.tolist() if preds.size else [],
        "anomaly_flags": is_anom.astype(bool).tolist() if is_anom.size else [],
        "errors": errors.tolist() if errors.size else [],
    }


