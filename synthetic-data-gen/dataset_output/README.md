# Karnataka State Police Synthetic Crime Database

## Overview
This synthetic dataset was generated for the **AI-Driven Crime Analytics & Visualization Platform**. It contains 100,000 synthetic FIR records spanning from January 2020 to December 2026, alongside related victims, accused, and chargesheets.

## Features
- **Privacy Safe**: All names, dates, and locations are 100% synthetic and generated using Python's `Faker`.
- **Geographically Accurate**: Data includes all 31 districts of Karnataka, correctly mapping synthetic stations and geographical coordinates to their respective districts.
- **Smart Data Distribution**: 
    - Cybercrime cases are artificially spiked in Bengaluru Urban.
    - Forest crimes (proxied as theft) are artificially spiked in Kodagu.
- **AI-Ready**: Includes pre-calculated ML features such as `RiskScore`, `CrimeSeverity`, `HotspotScore`, and `AI_PredictionLabel` attached directly to the FIR `CaseMaster` table.
- **ERD Compliant**: Maintains strict adherence to the provided Karnataka Police ER Diagram, enforcing proper Primary Key and Foreign Key constraints across 25+ tables.

## Data Volumes
- 100,000 FIRs (`CaseMaster`)
- 250+ Police Stations (`Unit`)
- 500 Police Officers (`Employee`)
- ~200,000 Victims
- ~250,000 Accused
- ~60,000 Arrest Records
- ~20,000 Chargesheets

## Included Files
1. **`csv/`**: Contains raw data tables in CSV format.
2. **`json/`**: Contains raw data tables in JSON array format.
3. **`sql/`**: 
    - `schema.sql`: Contains the `CREATE TABLE` definitions matching the ER Diagram.
    - `data_import.sql`: Contains PostgreSQL `\copy` commands to seamlessly ingest the CSV files into your database.
4. **`Data_Dictionary.md`**: Provides a detailed description of all tables and columns.

## How to Import into PostgreSQL
1. Open your terminal or `psql` shell.
2. Run `\i dataset_output/sql/schema.sql` to create the table structures.
3. Run `\i dataset_output/sql/data_import.sql` to populate the tables from the CSV files.

*(Ensure the terminal working directory is correctly set so the relative paths in the import script can find the CSV files).*
