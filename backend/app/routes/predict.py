"""
Prediction retrieval endpoints.

Reads latest entries from SQLite DB written by the ML cascade orchestrator
and returns energy/water predictions and anomaly summaries.
"""

from __future__ import annotations

import os
import sqlite3
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException

from ..auth import require_api_key


router = APIRouter()

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir, os.pardir))
DB_PATH = os.path.join(BASE_DIR, "ecogrid.db")


def _fetch_one(query: str) -> Dict[str, Any] | None:
    if not os.path.exists(DB_PATH):
        return None
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    cur = con.cursor()
    cur.execute(query)
    row = cur.fetchone()
    con.close()
    if not row:
        return None
    return dict(row)


@router.get("/energy")
def get_latest_energy(_: str = Depends(require_api_key)):
    # Return latest energy prediction row
    row = _fetch_one("SELECT * FROM energy_predictions ORDER BY id DESC LIMIT 1")
    if not row:
        raise HTTPException(status_code=404, detail="No energy predictions found")
    return row


@router.get("/water")
def get_latest_water(_: str = Depends(require_api_key)):
    # Return latest water prediction row
    row = _fetch_one("SELECT * FROM water_predictions ORDER BY id DESC LIMIT 1")
    if not row:
        raise HTTPException(status_code=404, detail="No water predictions found")
    return row


