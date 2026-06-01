import os
import sys
import unittest
from pathlib import Path


BACKEND_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_ROOT))

from app.collectors.mock_collector import MockMarketDataCollector
from app.services.scoring_service import calculate_signal
from app.services.signal_service import list_today_signals


class ScoringEngineTests(unittest.TestCase):
    def setUp(self) -> None:
        self.collector = MockMarketDataCollector()

    def test_sample_dataset_has_required_size(self) -> None:
        securities = self.collector.list_securities()
        self.assertEqual(len([item for item in securities if item.market == "KR"]), 6)
        self.assertEqual(len([item for item in securities if item.market == "US"]), 6)
        for security in securities:
            self.assertGreaterEqual(len(self.collector.get_daily_prices(security.ticker)), 90)

    def test_scoring_range_0_100(self) -> None:
        for security in self.collector.list_securities():
            signal = calculate_signal(
                security,
                self.collector.get_daily_prices(security.ticker),
                self.collector.get_market_index_prices(security.market),
            )
            self.assertGreaterEqual(signal.final_score, 0)
            self.assertLessEqual(signal.final_score, 100)

    def test_low_liquidity_exclusion(self) -> None:
        signals = {signal.ticker: signal for signal in list_today_signals().signals}
        self.assertEqual(signals["333333"].label, "exclude")
        self.assertEqual(signals["SMLC"].label, "exclude")
        self.assertEqual(signals["333333"].confidence, "D")

    def test_label_assignment(self) -> None:
        signals = list_today_signals().signals
        labels = {signal.label for signal in signals}
        self.assertIn("exclude", labels)
        self.assertTrue(labels.intersection({"strong_watch", "watch", "neutral", "risk"}))

    def test_ui_contains_no_banned_terms(self) -> None:
        frontend_root = BACKEND_ROOT.parents[0] / "frontend"
        banned_terms = ["매수하세요", "매도하세요", "무조건 오릅니다", "수익 보장", "급등 확정", "AI 추천주"]
        for path in frontend_root.rglob("*"):
            if path.suffix not in {".tsx", ".ts"}:
                continue
            text = path.read_text(encoding="utf-8")
            for term in banned_terms:
                self.assertNotIn(term, text, f"{term} found in {path}")


@unittest.skipUnless(os.environ.get("RUN_API_TESTS") == "1", "set RUN_API_TESTS=1 after installing FastAPI dependencies")
class ApiSmokeTests(unittest.TestCase):
    def test_api_smoke(self) -> None:
        from fastapi.testclient import TestClient
        from app.main import app

        client = TestClient(app)
        self.assertEqual(client.get("/api/health").status_code, 200)
        self.assertEqual(client.get("/api/stocks").status_code, 200)
        self.assertEqual(client.get("/api/signals/today").status_code, 200)
        self.assertEqual(client.get("/api/signals/005930").status_code, 200)
        self.assertEqual(client.get("/api/signals/005930/history").status_code, 200)


if __name__ == "__main__":
    unittest.main()

