"""
Sensors CRUD routes.

Provides basic in-memory CRUD endpoints for sensor metadata.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Depends
from typing import List

from ..auth import require_api_key
from ..models.user_model import Sensor, SensorUpdate, SENSORS


router = APIRouter()


@router.get("/", response_model=List[Sensor])
def list_sensors(_: str = Depends(require_api_key)):
    # Return all sensors in memory
    return list(SENSORS.values())


@router.post("/", response_model=Sensor, status_code=201)
def create_sensor(sensor: Sensor, _: str = Depends(require_api_key)):
    # Create sensor if ID is unused
    if sensor.id in SENSORS:
        raise HTTPException(status_code=409, detail="Sensor ID already exists")
    SENSORS[sensor.id] = sensor
    return sensor


@router.get("/{sensor_id}", response_model=Sensor)
def get_sensor(sensor_id: str, _: str = Depends(require_api_key)):
    # Fetch single sensor
    if sensor_id not in SENSORS:
        raise HTTPException(status_code=404, detail="Sensor not found")
    return SENSORS[sensor_id]


@router.put("/{sensor_id}", response_model=Sensor)
def update_sensor(sensor_id: str, update: SensorUpdate, _: str = Depends(require_api_key)):
    # Update fields atomically
    if sensor_id not in SENSORS:
        raise HTTPException(status_code=404, detail="Sensor not found")
    current = SENSORS[sensor_id]
    updated = current.copy(update=update.dict(exclude_unset=True))
    SENSORS[sensor_id] = updated
    return updated


@router.delete("/{sensor_id}", status_code=204)
def delete_sensor(sensor_id: str, _: str = Depends(require_api_key)):
    # Delete sensor by ID
    if sensor_id not in SENSORS:
        raise HTTPException(status_code=404, detail="Sensor not found")
    del SENSORS[sensor_id]
    return None


