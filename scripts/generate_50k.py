import pandas as pd
import numpy as np
from faker import Faker
import random
import datetime
import os

fake = Faker('en_IN')

# Seed for reproducibility
np.random.seed(42)
random.seed(42)
Faker.seed(42)

NUM_RECORDS = 50000
OUTPUT_DIR = "data/processed"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Smart Data Distribution Setup
DISTRICT_WEIGHTS = {
    "Bengaluru Urban": 0.25,
    "Mysuru": 0.08,
    "Hubballi Dharwad": 0.07,
    "Dakshina Kannada": 0.05,
    "Udupi": 0.04,
    "Kodagu": 0.03,
    "Chikkamagaluru": 0.03,
    "Belagavi": 0.05,
    "Kalaburagi": 0.04,
    "Mangaluru": 0.05,
    "Shivamogga": 0.04,
    "Ballari": 0.04,
    "Other": 0.23
}
districts = list(DISTRICT_WEIGHTS.keys())
weights = list(DISTRICT_WEIGHTS.values())

CRIME_TYPES = ["Theft", "Assault", "Cyber Crime", "Burglary", "Robbery", "Drug Trafficking", "Traffic Offence", "Property Dispute"]

data = []

start_date = datetime.date(2020, 1, 1)
end_date = datetime.date(2026, 12, 31)
days_between_dates = (end_date - start_date).days

for i in range(1, NUM_RECORDS + 1):
    district = np.random.choice(districts, p=weights)
    
    # Smart Distributions
    crime_type = random.choice(CRIME_TYPES)
    if district == "Bengaluru Urban" and random.random() < 0.6:
        crime_type = random.choice(["Cyber Crime", "Traffic Offence", "Financial Fraud"])
    elif district == "Mysuru" and random.random() < 0.5:
        crime_type = random.choice(["Theft", "Burglary"])
    elif district == "Hubballi Dharwad" and random.random() < 0.5:
        crime_type = "Robbery"
    elif district in ["Dakshina Kannada", "Udupi"] and random.random() < 0.5:
        crime_type = "Coastal Smuggling"
    elif district in ["Kodagu", "Chikkamagaluru"] and random.random() < 0.5:
        crime_type = random.choice(["Wildlife Crime", "Forest Theft"])
        
    random_days = random.randrange(days_between_dates)
    reg_date = start_date + datetime.timedelta(days=random_days)
    crime_hour = random.randint(0, 23)
    reg_time = datetime.datetime.combine(reg_date, datetime.time(hour=crime_hour, minute=random.randint(0, 59)))
    
    # Coordinates inside Karnataka
    lat = round(random.uniform(11.5, 18.5), 6)
    lon = round(random.uniform(74.0, 78.5), 6)
    
    risk_score = random.randint(10, 100)
    risk_level = "High" if risk_score > 75 else ("Medium" if risk_score > 40 else "Low")
    
    data.append({
        "fir_id": f"FIR-{reg_date.year}-{i:05d}",
        "crime_type": crime_type,
        "district": district,
        "police_station": f"{district} {random.choice(['Central', 'North', 'South', 'Rural', 'Cyber Cell'])}",
        "reported_at": reg_time.strftime("%Y-%m-%d %H:%M:%S"),
        "latitude": lat,
        "longitude": lon,
        "status": random.choice(["Open", "Under Investigation", "Solved", "Closed"]),
        "offender_id": f"OFF-{random.randint(1000, 5000)}",
        "victim_gender": random.choice(["Male", "Female", "Unknown"]),
        "victim_age": random.randint(15, 80),
        "weapon_used": random.choice(["Knife", "Digital", "Crowbar", "Firearm", "Stick", "Unknown"]),
        "crime_hour": crime_hour,
        "crime_day": reg_date.day,
        "crime_month": reg_date.month,
        "crime_year": reg_date.year,
        "is_weekend": 1 if reg_date.weekday() >= 5 else 0,
        "festival": random.choices([1, 0], [0.05, 0.95])[0],
        "season": "Summer" if 3 <= reg_date.month <= 6 else ("Monsoon" if 7 <= reg_date.month <= 10 else "Winter"),
        "income_category": random.choice(["Low", "Medium", "High"]),
        "population_density": random.choice([4500, 8000, 12000]),
        "crime_frequency": random.randint(1, 10),
        "repeat_offender_count": random.randint(1, 5),
        "time_since_last_crime": random.randint(10, 1000),
        "previous_crimes_nearby": random.randint(0, 15),
        "distance_from_police_station": round(random.uniform(1.0, 15.0), 2),
        "historical_hotspot_score": round(random.uniform(0, 100), 2),
        "risk_score": risk_score,
        "risk_level": risk_level,
        "threat_level": random.choice(["Low", "Moderate", "Severe"]),
        "confidence_score": round(random.uniform(0.5, 0.99), 2),
        "trend_score": round(random.uniform(-1, 1), 2),
        "seasonal_pattern": "Spike in Summer" if reg_date.month in [4,5,6] else "Normal",
        "risk_zone": "Red Zone" if risk_score > 80 else ("Orange Zone" if risk_score > 50 else "Green Zone"),
        "patrol_recommendation": "Increase Night Patrol" if crime_hour >= 20 or crime_hour <= 4 else "Standard Patrol",
        "day_night_indicator": "Night" if crime_hour >= 19 or crime_hour <= 5 else "Day",
        "crime_forecast": "Likely to Reoccur" if risk_score > 70 else "Isolated Incident"
    })

df = pd.DataFrame(data)

print(f"Generated {len(df)} records. Saving files...")

# Save CSV
df.to_csv(f"{OUTPUT_DIR}/crimes_features.csv", index=False)

# Save JSON
df.to_json(f"{OUTPUT_DIR}/crimes_features.json", orient="records")

# Try to save Excel
try:
    df.to_excel(f"{OUTPUT_DIR}/crimes_features.xlsx", index=False)
except Exception as e:
    print(f"Failed to generate Excel (might need openpyxl): {e}")

print("Dataset generation complete!")
