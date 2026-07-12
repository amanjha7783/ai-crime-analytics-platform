from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from etl.pipeline import run_etl_pipeline


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run the crime analytics ETL pipeline.")
    parser.add_argument("--input", default="data/processed/crimes_sample.csv", help="Raw or staged CSV path.")
    parser.add_argument("--output", default="data/processed/crimes_features.csv", help="Processed feature CSV path.")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    summary = run_etl_pipeline(Path(args.input), Path(args.output))
    print(summary)


if __name__ == "__main__":
    main()
