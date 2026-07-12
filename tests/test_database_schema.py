from pathlib import Path


SCHEMA = Path("database/schema.sql")


def test_schema_defines_required_tables_and_postgis_geometry() -> None:
    sql = SCHEMA.read_text(encoding="utf-8").lower()

    for table in [
        "states",
        "districts",
        "unit_types",
        "units",
        "courts",
        "employees",
        "case_master",
        "case_categories",
        "gravity_offences",
        "crime_heads",
        "crime_sub_heads",
        "case_statuses",
        "acts",
        "sections",
        "crime_head_act_sections",
        "caste_master",
        "religion_master",
        "occupation_master",
        "complainant_details",
        "act_section_association",
        "victims",
        "accused",
        "arrest_surrenders",
        "chargesheet_details",
        "police_stations",
        "crimes",
        "offenders",
        "crime_offenders",
        "predictions",
        "hotspots",
        "alerts",
        "users",
        "roles",
    ]:
        assert f"create table if not exists {table}" in sql

    assert "create extension if not exists postgis" in sql
    assert "geometry(point, 4326)" in sql
    assert "gist" in sql
