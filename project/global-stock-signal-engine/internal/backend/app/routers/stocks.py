from fastapi import APIRouter, HTTPException, Query

from app.schemas.stock_schema import StockDetailResponse, StockResponse
from app.services.signal_service import get_stock_detail, list_stocks

router = APIRouter(tags=["stocks"])


@router.get("/stocks", response_model=list[StockResponse])
def stocks(market: str | None = Query(default=None, pattern="^(KR|US)$")) -> list[StockResponse]:
    return list_stocks(market=market)


@router.get("/stocks/{ticker}", response_model=StockDetailResponse)
def stock_detail(ticker: str) -> StockDetailResponse:
    detail = get_stock_detail(ticker)
    if detail is None:
        raise HTTPException(status_code=404, detail="stock not found")
    return detail

