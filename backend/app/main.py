"""
FastAPI application entrypoint for EcoGrid AI backend.

Exposes CRUD APIs, ML prediction retrieval, and simulation triggers.
Integrates routers under /api/* and enables CORS for local dev.
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.predict import router as predict_router
from .routes.sensors import router as sensors_router
from .routes.simulate import router as simulate_router


def create_app() -> FastAPI:
    app = FastAPI(title="EcoGrid AI Backend", version="0.1.0")

    # Allow local dev frontends (Vite/React) to call API
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # tighten in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(sensors_router, prefix="/api/sensors", tags=["sensors"])
    app.include_router(predict_router, prefix="/api/predict", tags=["predict"])
    app.include_router(simulate_router, prefix="/api/simulate", tags=["simulate"])

    @app.get("/health")
    def health():
        # Basic liveness endpoint
        return {"status": "ok"}

    return app


app = create_app()


