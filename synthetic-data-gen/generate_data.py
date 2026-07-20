import pandas as pd
import numpy as np
from faker import Faker
import random
import os
import datetime
import json

fake = Faker('en_IN')

# Seed for reproducibility
np.random.seed(42)
random.seed(42)
Faker.seed(42)

OUTPUT_DIR = "dataset_output"
os.makedirs(OUTPUT_DIR, exist_ok=True)
for sub in ["csv", "json", "sql"]:
    os.makedirs(os.path.join(OUTPUT_DIR, sub), exist_ok=True)

# -----------------
# MASTER DATA
# -----------------

states = pd.DataFrame({
    "StateID": [1],
    "StateName": ["Karnataka"],
    "NationalityID": [1],
    "Active": [1]
})

districts = pd.DataFrame({
    "DistrictID": range(1, 32),
    "DistrictName": [
        "Bagalkot", "Ballari (Bellary)", "Belagavi (Belgaum)", "Bengaluru (Bangalore) Rural", 
        "Bengaluru (Bangalore) Urban", "Bidar", "Chamarajanagar", "Chikballapur", 
        "Chikkamagaluru (Chikmagalur)", "Chitradurga", "Dakshina Kannada", "Davanagere", 
        "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi (Gulbarga)", "Kodagu", 
        "Kolar", "Koppal", "Mandya", "Mysuru (Mysore)", "Raichur", "Ramanagara", 
        "Shivamogga (Shimoga)", "Tumakuru (Tumkur)", "Udupi", "Uttara Kannada (Karwar)", 
        "Vijayapura (Bijapur)", "Yadgir", "Vijayanagara"
    ],
    "StateID": 1,
    "Active": 1
})

unit_types = pd.DataFrame({
    "UnitTypeID": [1, 2, 3],
    "UnitTypeName": ["Police Station", "Circle Office", "SP Office"],
    "CityDistState": ["City", "District", "State"],
    "Hierarchy": [3, 2, 1],
    "Active": 1
})

# Generate 250 Police Stations
units_data = []
unit_id_counter = 1
for _, dist in districts.iterrows():
    num_stations = random.randint(5, 12)
    if dist["DistrictName"] == "Bengaluru (Bangalore) Urban":
        num_stations = 30  # More stations for Blr
    for i in range(num_stations):
        units_data.append({
            "UnitID": unit_id_counter,
            "UnitName": f"{fake.city()} Police Station",
            "TypeID": 1,
            "ParentUnit": None,
            "NationalityID": 1,
            "StateID": 1,
            "DistrictID": dist["DistrictID"],
            "Active": 1
        })
        unit_id_counter += 1
units = pd.DataFrame(units_data)

ranks = pd.DataFrame({
    "RankID": [1, 2, 3, 4, 5, 6],
    "RankName": ["Constable", "Head Constable", "Assistant Sub-Inspector (ASI)", "Sub-Inspector (SI)", "Inspector (PI)", "Deputy Superintendent (DSP)"],
    "Hierarchy": [6, 5, 4, 3, 2, 1],
    "Active": 1
})

designations = pd.DataFrame({
    "DesignationID": [1, 2, 3],
    "DesignationName": ["Station House Officer (SHO)", "Investigating Officer (IO)", "General Duty"],
    "Active": 1,
    "SortOrder": [1, 2, 3]
})

# Employees (500 officers)
employees_data = []
for i in range(1, 501):
    unit = units.sample(1).iloc[0]
    rank = ranks.sample(1).iloc[0]
    employees_data.append({
        "EmployeeID": i,
        "DistrictID": unit["DistrictID"],
        "UnitID": unit["UnitID"],
        "RankID": rank["RankID"],
        "DesignationID": random.choice([1, 2, 3]),
        "KGID": f"KGID{random.randint(10000, 99999)}",
        "FirstName": fake.first_name_male() if random.random() < 0.8 else fake.first_name_female(),
        "EmployeeDOB": fake.date_of_birth(minimum_age=25, maximum_age=58),
        "GenderID": random.choice([1, 2]),
        "BloodGroupID": random.choice([1, 2, 3, 4, 5, 6, 7, 8]),
        "PhysicallyChallenged": 0,
        "AppointmentDate": fake.date_between(start_date="-20y", end_date="-1y")
    })
employees = pd.DataFrame(employees_data)

courts_data = []
court_id_counter = 1
for _, dist in districts.iterrows():
    for _ in range(random.randint(2, 6)):
        courts_data.append({
            "CourtID": court_id_counter,
            "CourtName": f"{dist['DistrictName']} District Court",
            "DistrictID": dist["DistrictID"],
            "StateID": 1,
            "Active": 1
        })
        court_id_counter += 1
courts = pd.DataFrame(courts_data)

case_category = pd.DataFrame({
    "CaseCategoryID": [1, 2, 3, 4, 5],
    "LookupValue": ["FIR", "UDR", "Zero FIR", "NCR", "PAR"]
})

gravity_offence = pd.DataFrame({
    "GravityOffenceID": [1, 2, 3],
    "LookupValue": ["Heinous", "Non-Heinous", "Petty"]
})

case_status = pd.DataFrame({
    "CaseStatusID": [1, 2, 3, 4, 5],
    "CaseStatusName": ["Under Investigation", "Charge Sheeted", "Closed - False Case", "Closed - Undetected", "Transferred"]
})

crime_heads = pd.DataFrame({
    "CrimeHeadID": [1, 2, 3, 4, 5, 6, 7],
    "CrimeGroupName": ["Crimes Against Body", "Crimes Against Property", "Cyber Crimes", "Economic Offences", "Crimes Against Women", "Narcotics", "Traffic Offences"],
    "Active": 1
})

crime_subheads = pd.DataFrame({
    "CrimeSubHeadID": range(1, 15),
    "CrimeHeadID": [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7],
    "CrimeHeadName": ["Murder", "Assault", "Theft", "Burglary", "Phishing", "Identity Theft", "Fraud", "Counterfeiting", "Domestic Violence", "Sexual Harassment", "Drug Trafficking", "Drug Possession", "Fatal Accident", "DUI"],
    "SeqID": range(1, 15)
})

acts = pd.DataFrame({
    "ActCode": ["IPC", "IT", "NDPS", "MV", "POCSO"],
    "ActDescription": ["Indian Penal Code", "Information Technology Act", "Narcotic Drugs and Psychotropic Substances Act", "Motor Vehicles Act", "Protection of Children from Sexual Offences Act"],
    "ShortName": ["IPC", "IT Act", "NDPS", "MVA", "POCSO"],
    "Active": 1
})

sections = pd.DataFrame({
    "SectionCode": ["302", "307", "379", "420", "66C", "66D", "279", "304A", "20", "21"],
    "ActCode": ["IPC", "IPC", "IPC", "IPC", "IT", "IT", "IPC", "IPC", "NDPS", "NDPS"],
    "SectionDescription": ["Murder", "Attempt to Murder", "Theft", "Cheating", "Identity Theft", "Cheating by personation", "Rash driving", "Causing death by negligence", "Punishment for contravention in relation to cannabis plant and cannabis", "Punishment for contravention in relation to manufactured drugs and preparations"],
    "Active": 1
})

crime_head_act_section = pd.DataFrame({
    "CrimeHeadID": [1, 1, 2, 4, 3, 3, 7, 7, 6, 6],
    "ActCode": ["IPC", "IPC", "IPC", "IPC", "IT", "IT", "IPC", "IPC", "NDPS", "NDPS"],
    "SectionCode": ["302", "307", "379", "420", "66C", "66D", "279", "304A", "20", "21"]
})

occupation_master = pd.DataFrame({
    "OccupationID": [1, 2, 3, 4, 5],
    "OccupationName": ["Student", "Private Employee", "Government Employee", "Business", "Unemployed"]
})

religion_master = pd.DataFrame({
    "ReligionID": [1, 2, 3, 4],
    "ReligionName": ["Hindu", "Muslim", "Christian", "Other"]
})

caste_master = pd.DataFrame({
    "caste_master_id": [1, 2, 3, 4],
    "caste_master_name": ["General", "OBC", "SC", "ST"]
})

# Save Master Data
def save_table(df, name):
    df.to_csv(f"{OUTPUT_DIR}/csv/{name}.csv", index=False)
    df.to_json(f"{OUTPUT_DIR}/json/{name}.json", orient="records", indent=2)

print("Saving Master Tables...")
for name, df in zip(
    ["State", "District", "UnitType", "Unit", "Rank", "Designation", "Employee", "Court", "CaseCategory", "GravityOffence", "CaseStatusMaster", "CrimeHead", "CrimeSubHead", "Act", "Section", "CrimeHeadActSection", "OccupationMaster", "ReligionMaster", "CasteMaster"],
    [states, districts, unit_types, units, ranks, designations, employees, courts, case_category, gravity_offence, case_status, crime_heads, crime_subheads, acts, sections, crime_head_act_section, occupation_master, religion_master, caste_master]
):
    save_table(df, name)

# -----------------
# TRANSACTION DATA (100,000 cases)
# -----------------
print("Generating Cases...")
num_cases = 100000
case_master_data = []

start_date = datetime.date(2020, 1, 1)
end_date = datetime.date(2026, 12, 31)
time_between_dates = end_date - start_date
days_between_dates = time_between_dates.days

for i in range(1, num_cases + 1):
    random_number_of_days = random.randrange(days_between_dates)
    reg_date = start_date + datetime.timedelta(days=random_number_of_days)
    inc_date = reg_date - datetime.timedelta(days=random.randint(0, 10))
    
    unit = units.sample(1).iloc[0]
    district = districts[districts['DistrictID'] == unit['DistrictID']].iloc[0]
    
    # Logic for Crime Distribution
    is_blr = "Bengaluru" in district['DistrictName']
    is_kodagu = "Kodagu" in district['DistrictName']
    
    if is_blr and random.random() < 0.4:
        ch = crime_subheads[crime_subheads['CrimeHeadName'].isin(['Phishing', 'Identity Theft'])].sample(1).iloc[0]
    elif is_kodagu and random.random() < 0.3:
        ch = crime_subheads[crime_subheads['CrimeHeadName'] == 'Theft'].sample(1).iloc[0] # Approximating Forest Crime
    else:
        ch = crime_subheads.sample(1).iloc[0]
        
    case_cat = random.choice([1, 2]) # FIR, UDR
    year = reg_date.year
    crime_no = f"{case_cat}{unit['DistrictID']:04d}{unit['UnitID']:04d}{year}{i:05d}"
    case_no = f"{year}{i:05d}"
    
    # Generate coordinates based roughly on Karnataka (Lat: 11.5 to 18.5, Lon: 74.0 to 78.5)
    lat = round(random.uniform(11.5, 18.5), 6)
    lon = round(random.uniform(74.0, 78.5), 6)

    case_master_data.append({
        "CaseMasterID": i,
        "CrimeNo": crime_no,
        "CaseNo": case_no,
        "CrimeRegisteredDate": reg_date,
        "PolicePersonID": employees[employees['UnitID'] == unit['UnitID']].sample(1).iloc[0]['EmployeeID'] if not employees[employees['UnitID'] == unit['UnitID']].empty else employees.sample(1).iloc[0]['EmployeeID'],
        "PoliceStationID": unit['UnitID'],
        "CaseCategoryID": case_cat,
        "GravityOffenceID": random.choice([1, 2, 3]),
        "CrimeMajorHeadID": ch['CrimeHeadID'],
        "CrimeMinorHeadID": ch['CrimeSubHeadID'],
        "CaseStatusID": random.choice([1, 2, 3, 4, 5]),
        "CourtID": courts[courts['DistrictID'] == unit['DistrictID']].sample(1).iloc[0]['CourtID'] if not courts[courts['DistrictID'] == unit['DistrictID']].empty else courts.sample(1).iloc[0]['CourtID'],
        "IncidentFromDate": inc_date,
        "IncidentToDate": inc_date,
        "InfoReceivedPSDate": reg_date,
        "latitude": lat,
        "longitude": lon,
        "BriefFacts": fake.text(max_nb_chars=200),
        
        # AI Features Appended
        "RiskScore": random.randint(1, 100),
        "CrimeSeverity": random.choice(['Low', 'Medium', 'High', 'Critical']),
        "AI_PredictionLabel": random.choice(['High Likelihood of Repeat Offense', 'Low Risk', 'Gang Activity Suspected', 'Isolated Incident']),
        "HotspotScore": round(random.uniform(0, 1), 2)
    })

case_master = pd.DataFrame(case_master_data)
save_table(case_master, "CaseMaster")

# Complainants, Victims, Accused
print("Generating Linked Records...")
complainants_data = []
victims_data = []
accused_data = []
arrest_data = []
chargesheet_data = []
act_section_data = []

accused_counter = 1
victim_counter = 1
arrest_counter = 1
cs_counter = 1

for idx, case in case_master.iterrows():
    cid = case['CaseMasterID']
    
    # Complainant
    complainants_data.append({
        "ComplainantID": cid,
        "CaseMasterID": cid,
        "ComplainantName": fake.name(),
        "AgeYear": random.randint(18, 70),
        "OccupationID": random.choice([1, 2, 3, 4, 5]),
        "ReligionID": random.choice([1, 2, 3, 4]),
        "CasteID": random.choice([1, 2, 3, 4]),
        "GenderID": random.choice([1, 2])
    })
    
    # Victim
    num_victims = random.randint(1, 3)
    for v in range(num_victims):
        victims_data.append({
            "VictimMasterID": victim_counter,
            "CaseMasterID": cid,
            "VictimName": fake.name(),
            "AgeYear": random.randint(5, 80),
            "GenderID": random.choice([1, 2]),
            "VictimPolice": "0"
        })
        victim_counter += 1
        
    # Accused
    num_accused = random.randint(1, 4)
    accused_list = []
    for a in range(num_accused):
        accused_list.append(accused_counter)
        accused_data.append({
            "AccusedMasterID": accused_counter,
            "CaseMasterID": cid,
            "AccusedName": fake.name(),
            "AgeYear": random.randint(16, 60),
            "GenderID": random.choice([1, 2]),
            "PersonID": f"A{a+1}"
        })
        accused_counter += 1
        
    # Arrest
    if case['CaseStatusID'] in [1, 2] and random.random() < 0.6:
        for acc in accused_list:
            if random.random() < 0.8:
                arrest_data.append({
                    "ArrestSurrenderID": arrest_counter,
                    "CaseMasterID": cid,
                    "ArrestSurrenderTypeID": 1,
                    "ArrestSurrenderDate": case['CrimeRegisteredDate'] + datetime.timedelta(days=random.randint(1, 30)),
                    "ArrestSurrenderStateId": 1,
                    "ArrestSurrenderDistrictId": districts.sample(1).iloc[0]['DistrictID'],
                    "PoliceStationID": case['PoliceStationID'],
                    "IOID": case['PolicePersonID'],
                    "CourtID": case['CourtID'],
                    "AccusedMasterID": acc,
                    "IsAccused": 1,
                    "IsComplainantAccused": 0
                })
                arrest_counter += 1
                
    # Chargesheet
    if case['CaseStatusID'] == 2:
        chargesheet_data.append({
            "CSID": cs_counter,
            "CaseMasterID": cid,
            "csdate": case['CrimeRegisteredDate'] + datetime.timedelta(days=random.randint(30, 90)),
            "cstype": "A",
            "PolicePersonID": case['PolicePersonID']
        })
        cs_counter += 1
        
    # Act Section
    ch_acts = crime_head_act_section[crime_head_act_section['CrimeHeadID'] == case['CrimeMajorHeadID']]
    if not ch_acts.empty:
        sel_act = ch_acts.sample(1).iloc[0]
        act_section_data.append({
            "CaseMasterID": cid,
            "ActID": sel_act['ActCode'],
            "SectionID": sel_act['SectionCode'],
            "ActOrderID": 1,
            "SectionOrderID": 1
        })

save_table(pd.DataFrame(complainants_data), "ComplainantDetails")
save_table(pd.DataFrame(victims_data), "Victim")
save_table(pd.DataFrame(accused_data), "Accused")
save_table(pd.DataFrame(arrest_data), "ArrestSurrender")
save_table(pd.DataFrame(chargesheet_data), "ChargesheetDetails")
save_table(pd.DataFrame(act_section_data), "ActSectionAssociation")

print("All synthetic data generated successfully!")
