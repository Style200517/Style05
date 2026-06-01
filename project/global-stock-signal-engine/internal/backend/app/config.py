from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


DISCLAIMER_KO = "본 서비스는 투자 판단 보조용 리서치 도구이며 투자 손실 가능성이 존재합니다."
SCORING_VERSION = "mvp1-rule-v1"
FEATURE_SET_VERSION = "mvp1-sample-v1"


class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str = "sqlite:///./local.db"
    redis_url: str = "redis://localhost:6379/0"
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    return Settings()

