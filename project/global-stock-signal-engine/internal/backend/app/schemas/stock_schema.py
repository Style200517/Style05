from pydantic import BaseModel


class StockResponse(BaseModel):
    id: int
    ticker: str
    market: str
    exchange: str
    company_name: str
    company_name_kr: str | None
    country: str
    currency: str
    sector: str
    industry: str
    active: bool


class DailyPriceResponse(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    adjusted_close: float
    volume: int
    trading_value: float
    source: str
    as_of_time: str


class StockDetailResponse(BaseModel):
    stock: StockResponse
    prices: list[DailyPriceResponse]

