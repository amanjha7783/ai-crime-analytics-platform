CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id INTEGER NOT NULL REFERENCES roles(id),
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS states (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL,
    nationality_id INTEGER,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL,
    state_id INTEGER REFERENCES states(id),
    population INTEGER,
    population_density NUMERIC(12, 2),
    income_category VARCHAR(32),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    boundary GEOMETRY(MULTIPOLYGON, 4326)
);

CREATE TABLE IF NOT EXISTS unit_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    city_dist_state VARCHAR(64),
    hierarchy INTEGER,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS units (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    type_id INTEGER REFERENCES unit_types(id),
    parent_unit_id INTEGER REFERENCES units(id),
    nationality_id INTEGER,
    state_id INTEGER REFERENCES states(id),
    district_id INTEGER REFERENCES districts(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE (district_id, name)
);

CREATE TABLE IF NOT EXISTS police_stations (
    id SERIAL PRIMARY KEY,
    district_id INTEGER NOT NULL REFERENCES districts(id),
    name VARCHAR(128) NOT NULL,
    contact_number VARCHAR(32),
    location GEOMETRY(POINT, 4326) NOT NULL,
    UNIQUE (district_id, name)
);

CREATE TABLE IF NOT EXISTS ranks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    hierarchy INTEGER,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS designations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER
);

CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    district_id INTEGER REFERENCES districts(id),
    unit_id INTEGER REFERENCES units(id),
    rank_id INTEGER REFERENCES ranks(id),
    designation_id INTEGER REFERENCES designations(id),
    kgid VARCHAR(64) UNIQUE,
    first_name VARCHAR(128),
    employee_dob DATE,
    gender_id INTEGER,
    blood_group_id INTEGER,
    physically_challenged BOOLEAN NOT NULL DEFAULT FALSE,
    appointment_date DATE
);

CREATE TABLE IF NOT EXISTS case_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS gravity_offences (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS crime_heads (
    id SERIAL PRIMARY KEY,
    group_name VARCHAR(128) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS crime_sub_heads (
    id SERIAL PRIMARY KEY,
    crime_head_id INTEGER REFERENCES crime_heads(id),
    name VARCHAR(128) NOT NULL,
    seq_id INTEGER
);

CREATE TABLE IF NOT EXISTS case_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS acts (
    code VARCHAR(32) PRIMARY KEY,
    description VARCHAR(256),
    short_name VARCHAR(128),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS sections (
    act_code VARCHAR(32) REFERENCES acts(code),
    section_code VARCHAR(64),
    description VARCHAR(256),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (act_code, section_code)
);

CREATE TABLE IF NOT EXISTS crime_head_act_sections (
    crime_head_id INTEGER REFERENCES crime_heads(id),
    act_code VARCHAR(32) REFERENCES acts(code),
    section_code VARCHAR(64),
    PRIMARY KEY (crime_head_id, act_code, section_code),
    FOREIGN KEY (act_code, section_code) REFERENCES sections(act_code, section_code)
);

CREATE TABLE IF NOT EXISTS caste_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS religion_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS occupation_master (
    id SERIAL PRIMARY KEY,
    name VARCHAR(128) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS courts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district_id INTEGER REFERENCES districts(id),
    state_id INTEGER REFERENCES states(id),
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS case_master (
    id SERIAL PRIMARY KEY,
    crime_no VARCHAR(64) UNIQUE NOT NULL,
    case_no VARCHAR(64),
    crime_registered_date DATE,
    police_person_id INTEGER REFERENCES employees(id),
    police_station_id INTEGER REFERENCES units(id),
    case_category_id INTEGER REFERENCES case_categories(id),
    gravity_offence_id INTEGER REFERENCES gravity_offences(id),
    crime_major_head_id INTEGER REFERENCES crime_heads(id),
    crime_minor_head_id INTEGER REFERENCES crime_sub_heads(id),
    case_status_id INTEGER REFERENCES case_statuses(id),
    court_id INTEGER REFERENCES courts(id),
    incident_from_date TIMESTAMPTZ,
    incident_to_date TIMESTAMPTZ,
    info_received_ps_date TIMESTAMPTZ,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    brief_facts TEXT
);

CREATE TABLE IF NOT EXISTS complainant_details (
    id SERIAL PRIMARY KEY,
    case_master_id INTEGER NOT NULL REFERENCES case_master(id) ON DELETE CASCADE,
    name VARCHAR(255),
    age_year INTEGER,
    occupation_id INTEGER REFERENCES occupation_master(id),
    religion_id INTEGER REFERENCES religion_master(id),
    caste_id INTEGER REFERENCES caste_master(id),
    gender_id INTEGER
);

CREATE TABLE IF NOT EXISTS act_section_association (
    case_master_id INTEGER NOT NULL REFERENCES case_master(id) ON DELETE CASCADE,
    act_code VARCHAR(32) REFERENCES acts(code),
    section_code VARCHAR(64),
    act_order_id INTEGER,
    section_order_id INTEGER,
    FOREIGN KEY (act_code, section_code) REFERENCES sections(act_code, section_code)
);

CREATE TABLE IF NOT EXISTS victims (
    id SERIAL PRIMARY KEY,
    case_master_id INTEGER NOT NULL REFERENCES case_master(id) ON DELETE CASCADE,
    name VARCHAR(255),
    age_year INTEGER,
    gender_id INTEGER,
    is_police BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS accused (
    id SERIAL PRIMARY KEY,
    case_master_id INTEGER NOT NULL REFERENCES case_master(id) ON DELETE CASCADE,
    name VARCHAR(255),
    age_year INTEGER,
    gender_id INTEGER,
    person_id VARCHAR(16)
);

CREATE TABLE IF NOT EXISTS arrest_surrenders (
    id SERIAL PRIMARY KEY,
    case_master_id INTEGER NOT NULL REFERENCES case_master(id) ON DELETE CASCADE,
    arrest_surrender_type_id INTEGER,
    arrest_surrender_date DATE,
    arrest_surrender_state_id INTEGER REFERENCES states(id),
    arrest_surrender_district_id INTEGER REFERENCES districts(id),
    police_station_id INTEGER REFERENCES units(id),
    io_id INTEGER REFERENCES employees(id),
    court_id INTEGER REFERENCES courts(id),
    accused_id INTEGER REFERENCES accused(id),
    is_accused BOOLEAN NOT NULL DEFAULT FALSE,
    is_complainant_accused BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS chargesheet_details (
    id SERIAL PRIMARY KEY,
    case_master_id INTEGER NOT NULL REFERENCES case_master(id) ON DELETE CASCADE,
    csdate TIMESTAMPTZ,
    cstype CHAR(1),
    police_person_id INTEGER REFERENCES employees(id)
);

CREATE TABLE IF NOT EXISTS offenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    offender_code VARCHAR(64) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    age INTEGER,
    gender VARCHAR(32),
    known_aliases TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crimes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fir_id VARCHAR(64) UNIQUE NOT NULL,
    district_id INTEGER NOT NULL REFERENCES districts(id),
    police_station_id INTEGER NOT NULL REFERENCES police_stations(id),
    crime_type VARCHAR(128) NOT NULL,
    reported_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(64) NOT NULL,
    victim_gender VARCHAR(32),
    victim_age INTEGER,
    weapon_used VARCHAR(128),
    location GEOMETRY(POINT, 4326) NOT NULL,
    risk_score NUMERIC(5, 2),
    risk_level VARCHAR(32),
    hotspot_score NUMERIC(5, 2),
    threat_level VARCHAR(32),
    confidence_score NUMERIC(5, 2),
    trend_score NUMERIC(5, 2),
    seasonal_pattern VARCHAR(64),
    risk_zone VARCHAR(64),
    patrol_recommendation VARCHAR(128),
    day_night_indicator VARCHAR(32),
    crime_forecast VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crime_offenders (
    crime_id UUID NOT NULL REFERENCES crimes(id) ON DELETE CASCADE,
    offender_id UUID NOT NULL REFERENCES offenders(id) ON DELETE CASCADE,
    relationship_type VARCHAR(64) NOT NULL DEFAULT 'suspect',
    PRIMARY KEY (crime_id, offender_id)
);

CREATE TABLE IF NOT EXISTS predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    crime_id UUID REFERENCES crimes(id) ON DELETE CASCADE,
    model_name VARCHAR(128) NOT NULL,
    prediction_type VARCHAR(128) NOT NULL,
    score NUMERIC(8, 4) NOT NULL,
    explanation JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hotspots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id INTEGER NOT NULL REFERENCES districts(id),
    confidence NUMERIC(5, 4) NOT NULL,
    risk_level VARCHAR(32) NOT NULL,
    center GEOMETRY(POINT, 4326) NOT NULL,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id INTEGER REFERENCES districts(id),
    alert_type VARCHAR(128) NOT NULL,
    severity VARCHAR(32) NOT NULL,
    message TEXT NOT NULL,
    is_acknowledged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_master_crime_no ON case_master (crime_no);
CREATE INDEX IF NOT EXISTS idx_case_master_police_station_id ON case_master (police_station_id);
CREATE INDEX IF NOT EXISTS idx_case_master_case_status_id ON case_master (case_status_id);

CREATE INDEX IF NOT EXISTS idx_crimes_location_gist ON crimes USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_police_stations_location_gist ON police_stations USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_hotspots_center_gist ON hotspots USING GIST (center);
CREATE INDEX IF NOT EXISTS idx_crimes_reported_at ON crimes (reported_at);
CREATE INDEX IF NOT EXISTS idx_crimes_type_status ON crimes (crime_type, status);
