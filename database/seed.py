from __future__ import annotations

import os
from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, text

from backend.app.core.security import hash_password
from ml.prediction.engine import PredictionEngine


DATA_PATH = Path(os.getenv("CRIME_DATA_PATH", "data/processed/crimes_features.csv"))
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://crime_user:crime_password@localhost:5432/crime_ai",
)


def seed() -> None:
    frame = PredictionEngine().prepare(pd.read_csv(DATA_PATH))
    engine = create_engine(DATABASE_URL)
    with engine.begin() as connection:
        for role in ["Admin", "Police Officer", "Investigator", "Analyst"]:
            connection.execute(
                text(
                    "INSERT INTO roles (name, description) VALUES (:name, :description) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": role, "description": f"{role} access profile"},
            )
        for username, full_name, role, password in [
            ("admin@ksp.local", "KSP Command Admin", "Admin", "admin123"),
            ("officer@ksp.local", "Station Police Officer", "Police Officer", "officer123"),
            ("investigator@ksp.local", "Crime Investigator", "Investigator", "investigator123"),
            ("analyst@ksp.local", "Crime Data Analyst", "Analyst", "analyst123"),
        ]:
            connection.execute(
                text(
                    """
                    INSERT INTO users (role_id, username, password_hash, full_name)
                    SELECT r.id, :username, :password_hash, :full_name
                    FROM roles r
                    WHERE r.name = :role
                    ON CONFLICT (username) DO NOTHING
                    """
                ),
                {
                    "username": username,
                    "password_hash": hash_password(password),
                    "full_name": full_name,
                    "role": role,
                },
            )

        for state in [("Karnataka", 1)]:
            connection.execute(
                text(
                    "INSERT INTO states (name, nationality_id, active) "
                    "VALUES (:name, :nationality_id, TRUE) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": state[0], "nationality_id": state[1]},
            )

        for unit_type in [
            ("Police Station", "District", 1),
            ("Circle Office", "District", 2),
        ]:
            connection.execute(
                text(
                    "INSERT INTO unit_types (name, city_dist_state, hierarchy, active) "
                    "VALUES (:name, :city_dist_state, :hierarchy, TRUE) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {
                    "name": unit_type[0],
                    "city_dist_state": unit_type[1],
                    "hierarchy": unit_type[2],
                },
            )

        for rank in [("Constable", 20), ("Inspector", 10), ("DSP", 5)]:
            connection.execute(
                text(
                    "INSERT INTO ranks (name, hierarchy, active) "
                    "VALUES (:name, :hierarchy, TRUE) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": rank[0], "hierarchy": rank[1]},
            )

        for designation, sort_order in [
            ("Investigating Officer", 1),
            ("SHO", 2),
            ("Police Officer", 3),
        ]:
            connection.execute(
                text(
                    "INSERT INTO designations (name, active, sort_order) "
                    "VALUES (:name, TRUE, :sort_order) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": designation, "sort_order": sort_order},
            )

        for category in [("FIR",), ("UDR",), ("PAR",)]:
            connection.execute(
                text(
                    "INSERT INTO case_categories (name) VALUES (:name) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": category[0]},
            )

        for gravity in [("Heinous",), ("Non-Heinous",)]:
            connection.execute(
                text(
                    "INSERT INTO gravity_offences (name) VALUES (:name) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": gravity[0]},
            )

        for crime_head in [
            ("Crimes Against Property",),
            ("Crimes Against Body",),
            ("Other Crimes",),
        ]:
            connection.execute(
                text(
                    "INSERT INTO crime_heads (group_name, active) VALUES (:name, TRUE) "
                    "ON CONFLICT (group_name) DO NOTHING"
                ),
                {"name": crime_head[0]},
            )

        for crime_sub_head, head_name, seq in [
            ("Theft", "Crimes Against Property", 1),
            ("Assault", "Crimes Against Body", 2),
            ("Cyber Crime", "Other Crimes", 3),
            ("Burglary", "Crimes Against Property", 4),
            ("Robbery", "Crimes Against Property", 5),
        ]:
            connection.execute(
                text(
                    "INSERT INTO crime_sub_heads (crime_head_id, name, seq_id) "
                    "SELECT ch.id, :name, :seq_id FROM crime_heads ch WHERE ch.group_name = :group_name "
                    "ON CONFLICT (crime_head_id, name) DO NOTHING"
                ),
                {"name": crime_sub_head, "group_name": head_name, "seq_id": seq},
            )

        for status in [("Open",), ("Under Investigation",), ("Solved",), ("Closed",)]:
            connection.execute(
                text(
                    "INSERT INTO case_statuses (name) VALUES (:name) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": status[0]},
            )

        for act in [
            ("IPC", "Indian Penal Code", "IPC"),
            ("NDPS", "Narcotic Drugs and Psychotropic Substances Act", "NDPS"),
        ]:
            connection.execute(
                text(
                    "INSERT INTO acts (code, description, short_name, active) "
                    "VALUES (:code, :description, :short_name, TRUE) "
                    "ON CONFLICT (code) DO NOTHING"
                ),
                {"code": act[0], "description": act[1], "short_name": act[2]},
            )

        for section in [
            ("IPC", "302", "Murder"),
            ("IPC", "379", "Theft"),
            ("IPC", "323", "Causing Hurt"),
            ("IPC", "420", "Cheating"),
            ("NDPS", "20", "Possession of Narcotics"),
        ]:
            connection.execute(
                text(
                    "INSERT INTO sections (act_code, section_code, description, active) "
                    "VALUES (:act_code, :section_code, :description, TRUE) "
                    "ON CONFLICT (act_code, section_code) DO NOTHING"
                ),
                {
                    "act_code": section[0],
                    "section_code": section[1],
                    "description": section[2],
                },
            )

        for head, act_code, section_code in [
            ("Crimes Against Property", "IPC", "379"),
            ("Crimes Against Body", "IPC", "302"),
            ("Crimes Against Body", "IPC", "323"),
            ("Other Crimes", "IPC", "420"),
            ("Crimes Against Property", "NDPS", "20"),
        ]:
            connection.execute(
                text(
                    "INSERT INTO crime_head_act_sections (crime_head_id, act_code, section_code) "
                    "SELECT ch.id, :act_code, :section_code FROM crime_heads ch WHERE ch.group_name = :group_name "
                    "ON CONFLICT (crime_head_id, act_code, section_code) DO NOTHING"
                ),
                {"group_name": head, "act_code": act_code, "section_code": section_code},
            )

        for caste in [("General",), ("OBC",), ("SC",), ("ST",)]:
            connection.execute(
                text(
                    "INSERT INTO caste_master (name) VALUES (:name) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": caste[0]},
            )

        for religion in [("Hindu",), ("Muslim",), ("Christian",), ("Other",)]:
            connection.execute(
                text(
                    "INSERT INTO religion_master (name) VALUES (:name) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": religion[0]},
            )

        for occupation in [("Farmer",), ("Government Employee",), ("Business",), ("Student",), ("Other",)]:
            connection.execute(
                text(
                    "INSERT INTO occupation_master (name) VALUES (:name) "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": occupation[0]},
            )

        for district in sorted(frame["district"].unique()):
            connection.execute(
                text(
                    "INSERT INTO districts (name, state_id, active) "
                    "SELECT :name, s.id, TRUE FROM states s WHERE s.name = 'Karnataka' "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": district},
            )

        for court_name, district_name, state_name in [
            ("Bengaluru City Court", "Bengaluru Urban", "Karnataka"),
            ("Mysuru District Court", "Mysuru", "Karnataka"),
            ("State High Court", "Bengaluru Urban", "Karnataka"),
        ]:
            connection.execute(
                text(
                    "INSERT INTO courts (name, district_id, state_id, active) "
                    "SELECT :name, d.id, s.id, TRUE FROM districts d JOIN states s ON s.name = :state_name "
                    "WHERE d.name = :district_name "
                    "ON CONFLICT (name) DO NOTHING"
                ),
                {"name": court_name, "district_name": district_name, "state_name": state_name},
            )

        for unit_name, district_name in [
            ("Central", "Bengaluru Urban"),
            ("Lashkar", "Mysuru"),
            ("Whitefield", "Bengaluru Urban"),
            ("Hubballi Town", "Hubballi Dharwad"),
            ("Pandeshwar", "Mangaluru"),
        ]:
            connection.execute(
                text(
                    "INSERT INTO units (name, type_id, district_id, state_id, active) "
                    "SELECT :name, ut.id, d.id, s.id, TRUE "
                    "FROM unit_types ut "
                    "JOIN districts d ON d.name = :district_name "
                    "JOIN states s ON s.name = 'Karnataka' "
                    "WHERE ut.name = 'Police Station' "
                    "ON CONFLICT (district_id, name) DO NOTHING"
                ),
                {"name": unit_name, "district_name": district_name},
            )

        for first_name, district_name, unit_name, rank_name, designation_name in [
            ("Shivakumar", "Bengaluru Urban", "Central", "Inspector", "Investigating Officer"),
            ("Meera", "Mysuru", "Lashkar", "Constable", "Police Officer"),
        ]:
            connection.execute(
                text(
                    "INSERT INTO employees (first_name, district_id, unit_id, rank_id, designation_id, appointment_date) "
                    "SELECT :first_name, d.id, u.id, r.id, des.id, CURRENT_DATE "
                    "FROM districts d "
                    "JOIN units u ON u.name = :unit_name AND u.district_id = d.id "
                    "JOIN ranks r ON r.name = :rank_name "
                    "JOIN designations des ON des.name = :designation_name "
                    "WHERE d.name = :district_name "
                    "ON CONFLICT (first_name) DO NOTHING"
                ),
                {
                    "first_name": first_name,
                    "district_name": district_name,
                    "unit_name": unit_name,
                    "rank_name": rank_name,
                    "designation_name": designation_name,
                },
            )

        for row in frame.drop_duplicates(["district", "police_station"]).to_dict("records"):
            connection.execute(
                text(
                    """
                    INSERT INTO police_stations (district_id, name, location)
                    SELECT d.id, :station, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)
                    FROM districts d
                    WHERE d.name = :district
                    ON CONFLICT (district_id, name) DO NOTHING
                    """
                ),
                {
                    "district": row["district"],
                    "station": row["police_station"],
                    "latitude": row["latitude"],
                    "longitude": row["longitude"],
                },
            )
        for offender in sorted(frame["offender_id"].unique()):
            connection.execute(
                text(
                    "INSERT INTO offenders (offender_code, display_name) VALUES (:code, :name) "
                    "ON CONFLICT (offender_code) DO NOTHING"
                ),
                {"code": offender, "name": offender},
            )
        for row in frame.to_dict("records"):
            connection.execute(
                text(
                    """
                    INSERT INTO crimes (
                        fir_id,
                        district_id,
                        police_station_id,
                        crime_type,
                        reported_at,
                        status,
                        victim_gender,
                        victim_age,
                        weapon_used,
                        location,
                        risk_score,
                        risk_level,
                        hotspot_score,
                        threat_level,
                        confidence_score,
                        trend_score,
                        seasonal_pattern,
                        risk_zone,
                        patrol_recommendation,
                        day_night_indicator,
                        crime_forecast
                    )
                    SELECT
                        :fir_id,
                        d.id,
                        ps.id,
                        :crime_type,
                        :reported_at,
                        :status,
                        :victim_gender,
                        :victim_age,
                        :weapon_used,
                        ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
                        :risk_score,
                        :risk_level,
                        :hotspot_score,
                        :threat_level,
                        :confidence_score,
                        :trend_score,
                        :seasonal_pattern,
                        :risk_zone,
                        :patrol_recommendation,
                        :day_night_indicator,
                        :crime_forecast
                    FROM districts d
                    JOIN police_stations ps ON ps.district_id = d.id AND ps.name = :police_station
                    WHERE d.name = :district
                    ON CONFLICT (fir_id) DO NOTHING
                    """
                ),
                {
                    "fir_id": row["fir_id"],
                    "district": row["district"],
                    "police_station": row["police_station"],
                    "crime_type": row["crime_type"],
                    "reported_at": row["reported_at"],
                    "status": row["status"],
                    "victim_gender": row["victim_gender"],
                    "victim_age": int(row["victim_age"]),
                    "weapon_used": row["weapon_used"],
                    "longitude": float(row["longitude"]),
                    "latitude": float(row["latitude"]),
                    "risk_score": float(row["risk_score"]),
                    "risk_level": row["risk_level"],
                    "hotspot_score": float(row.get("historical_hotspot_score", row.get("hotspot_score", 0))),
                    "threat_level": row.get("threat_level", "Unknown"),
                    "confidence_score": float(row.get("confidence_score", 0)),
                    "trend_score": float(row.get("trend_score", 0)),
                    "seasonal_pattern": row.get("seasonal_pattern", "Unknown"),
                    "risk_zone": row.get("risk_zone", "Unknown"),
                    "patrol_recommendation": row.get("patrol_recommendation", "Unknown"),
                    "day_night_indicator": row.get("day_night_indicator", "Unknown"),
                    "crime_forecast": row.get("crime_forecast", "Unknown"),
                },
            )
            connection.execute(
                text(
                    """
                    INSERT INTO crime_offenders (crime_id, offender_id)
                    SELECT c.id, o.id
                    FROM crimes c
                    JOIN offenders o ON o.offender_code = :offender_code
                    WHERE c.fir_id = :fir_id
                    ON CONFLICT DO NOTHING
                    """
                ),
                {"fir_id": row["fir_id"], "offender_code": row["offender_id"]},
            )


if __name__ == "__main__":
    seed()
