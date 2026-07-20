import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

print("Generating 50,000 synthetic crime records...")

districts = [
    "Bengaluru Urban", "Mysuru", "Belagavi", "Hubballi Dharwad", "Mangaluru",
    "Kalaburagi", "Shivamogga", "Dakshina Kannada", "Udupi", "Tumakuru",
    "Ballari", "Vijayapura", "Davanagere", "Raichur", "Bagalkote",
    "Bidar", "Hassan", "Koppal", "Mandya", "Chitradurga", "Haveri",
    "Kolar", "Uttara Kannada", "Chikkamagaluru", "Chikkaballapura",
    "Yadgir", "Chamarajanagar", "Ramanagara", "Gadag", "Kodagu", "Bengaluru Rural"
]

crime_types = [
    "Theft", "Assault", "Cyber Crime", "Robbery", "Fraud",
    "Burglary", "Vandalism", "Drug Trafficking", "Murder", "Extortion",
    "Kidnapping", "Domestic Violence", "Financial Fraud", "Vehicle Theft"
]

statuses = ["Open", "Closed", "Under Investigation", "Resolved"]
risk_levels = ["Low", "Medium", "High"]

# Generate dates over the last 3 years
end_date = datetime.now()
start_date = end_date - timedelta(days=3 * 365)

# Bounding box roughly for Karnataka
lat_min, lat_max = 11.5, 18.5
lon_min, lon_max = 74.0, 78.5

records = []
for i in range(1, 50001):
    d = random.choice(districts)
    reported_at = start_date + timedelta(days=random.randint(0, 3 * 365), hours=random.randint(0, 23), minutes=random.randint(0, 59))
    
    records.append({
        "fir_id": f"FIR-{reported_at.year}-{i:05d}",
        "crime_type": random.choice(crime_types),
        "district": d,
        "police_station": f"{d} Central PS",
        "reported_at": reported_at.strftime("%Y-%m-%d %H:%M:%S"),
        "latitude": round(random.uniform(lat_min, lat_max), 5),
        "longitude": round(random.uniform(lon_min, lon_max), 5),
        "status": random.choices(statuses, weights=[30, 40, 20, 10])[0],
        "offender_id": f"OFF-{random.randint(1000, 9999)}",
        "risk_score": random.randint(10, 99),
        "risk_level": random.choices(risk_levels, weights=[50, 30, 20])[0],
        "crime_year": reported_at.year,
        "population_density": random.randint(500, 15000),
        "income_category": random.choice(["Low", "Medium", "High"]),
        "victim_gender": random.choice(["Male", "Female", "Other", "Unknown"]),
        "victim_age": random.randint(18, 85),
        "weapon_used": random.choice(["None", "Knife", "Firearm", "Blunt Object", "Other"])
    })

df = pd.DataFrame(records)
df.to_csv('data/processed/crimes_features.csv', index=False)
print("Successfully generated and saved 50,000 records to data/processed/crimes_features.csv")
