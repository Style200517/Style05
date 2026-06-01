from fastapi import APIRouter

from app.config import DISCLAIMER_KO

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "global-stock-signal-engine",
        "version": "0.1.0",
        "mode": "sample-data",
        "disclaimer": DISCLAIMER_KO,
    }

