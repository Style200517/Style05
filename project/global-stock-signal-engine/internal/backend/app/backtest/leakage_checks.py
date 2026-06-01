from datetime import datetime


def assert_observable_before_signal(observed_at: datetime, signal_time: datetime) -> None:
    if observed_at > signal_time:
        raise ValueError("future data leakage detected: observed_at is after signal_time")

