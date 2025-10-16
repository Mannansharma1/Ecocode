"""
Pydantic models and in-memory stores for demo CRUD.

Replace with database models (SQLAlchemy) for production.
"""

from __future__ import annotations

from pydantic import BaseModel, Field
from typing import Dict, Optional


class Sensor(BaseModel):
    id: str = Field(..., description="Unique sensor ID")
    zone_id: int = Field(..., description="Zone identifier")
    type: str = Field(..., description="Sensor type e.g. pressure, flow")
    location: Optional[str] = None


class SensorUpdate(BaseModel):
    zone_id: Optional[int] = None
    type: Optional[str] = None
    location: Optional[str] = None


# Simple in-memory store for demo
SENSORS: Dict[str, Sensor] = {}


