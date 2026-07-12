import pandas as pd
from ml.prediction.engine import PredictionEngine

frame = pd.read_csv('data/processed/crimes_sample.csv')
frame = frame.head(10)
engine = PredictionEngine()
prepared = engine.prepare(frame)
print('Prepared rows:', len(prepared))
output = engine.run(frame)
print('classifications:', len(output.classifications))
print('hotspots:', len(output.hotspots))
print('repeat_offenders:', len(output.repeat_offenders))
print('risk_scores:', len(output.risk_scores))
print('anomalies:', len(output.anomalies))
print('network keys:', list(output.network.keys()) if isinstance(output.network, dict) else type(output.network))
