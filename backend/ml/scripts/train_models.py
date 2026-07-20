import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import joblib
import os

DATA_PATH = "../../data/processed/crimes_features.csv"
MODEL_DIR = "saved_models"

print("Loading dataset...")
df = pd.read_csv(DATA_PATH)

print(f"Dataset loaded with {len(df)} rows.")

# Select numeric features for simplicity and robustness
features = [
    'latitude', 'longitude', 'crime_hour', 'crime_day', 'crime_month',
    'is_weekend', 'population_density', 'historical_hotspot_score',
    'repeat_offender_count', 'distance_from_police_station'
]

# Drop missing values for these columns just in case
df = df.dropna(subset=features + ['risk_score', 'risk_level'])

X = df[features]
y_risk = df['risk_score']
y_level = df['risk_level']

print("Splitting data...")
X_train, X_test, y_risk_train, y_risk_test, y_level_train, y_level_test = train_test_split(
    X, y_risk, y_level, test_size=0.2, random_state=42
)

print("Training Risk Score Regressor...")
risk_model = RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42, n_jobs=-1)
risk_model.fit(X_train, y_risk_train)
risk_score_path = os.path.join(MODEL_DIR, "risk_score_model.pkl")
joblib.dump(risk_model, risk_score_path)
print(f"Saved risk model to {risk_score_path}")

print("Training Crime Severity Classifier...")
le = LabelEncoder()
y_level_train_encoded = le.fit_transform(y_level_train)
level_model = RandomForestClassifier(n_estimators=50, max_depth=10, random_state=42, n_jobs=-1)
level_model.fit(X_train, y_level_train_encoded)

level_model_path = os.path.join(MODEL_DIR, "crime_severity_model.pkl")
joblib.dump({'model': level_model, 'classes': le.classes_}, level_model_path)
print(f"Saved severity model to {level_model_path}")

print("Training Hotspot Clustering (KMeans)...")
# We cluster locations into 50 major hotspots across the state
coords = df[['latitude', 'longitude']]
kmeans = KMeans(n_clusters=50, random_state=42, n_init=10)
kmeans.fit(coords)

hotspot_path = os.path.join(MODEL_DIR, "hotspot_kmeans.pkl")
joblib.dump(kmeans, hotspot_path)
print(f"Saved hotspot clusterer to {hotspot_path}")

print("Model training complete.")
