from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import DISCLAIMER_KO, get_settings
from app.routers import health, signals, stocks


settings = get_settings()

app = FastAPI(
    title="Global Stock Signal Engine",
    version="0.1.0",
    description=f"Research signal engine. {DISCLAIMER_KO}",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(stocks.router, prefix="/api")
app.include_router(signals.router, prefix="/api")

