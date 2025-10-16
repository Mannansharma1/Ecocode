"""
Lightweight API key auth dependency for FastAPI.

This is a simple demonstration dependency. In production, integrate OAuth2/JWT.
"""

from __future__ import annotations

import os
from fastapi import Header, HTTPException, status, Depends


API_KEY = os.environ.get("ECOGRID_API_KEY", "dev-key")


def get_api_key(x_api_key: str | None = Header(default=None)) -> str:
    if not x_api_key or x_api_key != API_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key")
    return x_api_key


def require_api_key(api_key: str = Depends(get_api_key)) -> str:
    # Pass-through dependency to guard routes
    return api_key


