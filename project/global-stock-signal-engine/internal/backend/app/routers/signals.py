from fastapi import APIRouter, HTTPException, Query

from app.schemas.signal_schema import SignalListResponse, SignalResponse
from app.services.signal_service import get_latest_signal, get_signal_history, list_today_signals

router = APIRouter(tags=["signals"])


@router.get("/signals/today", response_model=SignalListResponse)
def today_signals(
    market: str | None = Query(default=None, pattern="^(KR|US)$"),
    label: str | None = Query(default=None, pattern="^(strong_watch|watch|neutral|risk|exclude)$"),
    min_score: float | None = Query(default=None, ge=0, le=100),
) -> SignalListResponse:
    return list_today_signals(market=market, label=label, min_score=min_score)


@router.get("/signals/{ticker}", response_model=SignalResponse)
def signal_detail(ticker: str) -> SignalResponse:
    signal = get_latest_signal(ticker)
    if signal is None:
        raise HTTPException(status_code=404, detail="signal not found")
    return signal


@router.get("/signals/{ticker}/history", response_model=list[SignalResponse])
def signal_history(ticker: str, limit: int = Query(default=10, ge=1, le=30)) -> list[SignalResponse]:
    history = get_signal_history(ticker, limit=limit)
    if history is None:
        raise HTTPException(status_code=404, detail="signal history not found")
    return history

