from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from ml.training.pipeline import train_baseline_models


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train baseline crime intelligence models.")
    parser.add_argument("--data", default="data/processed/crimes_sample.csv", help="Processed crime CSV path.")
    parser.add_argument("--output", default="ml/training/model_metrics.json", help="Metrics output JSON path.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    metrics = train_baseline_models(Path(args.data))
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()
