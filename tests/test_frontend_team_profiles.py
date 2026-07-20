from pathlib import Path


FRONTEND = Path("frontend")


def test_team_profiles_define_all_landing_team_slugs() -> None:
    team_data = (FRONTEND / "lib" / "team-data.ts").read_text(encoding="utf-8")

    for slug in [
        "ksp-data-science",
        "crimeops-command",
        "geo-surveillance",
        "security-trust",
    ]:
        assert f'slug: "{slug}"' in team_data


def test_team_pages_do_not_contain_placeholder_copy() -> None:
    searched_files = [
        FRONTEND / "app" / "page.tsx",
        FRONTEND / "app" / "team" / "[slug]" / "page.tsx",
        FRONTEND / "components" / "team-card.tsx",
        FRONTEND / "components" / "team-profile-page.tsx",
        FRONTEND / "lib" / "team-data.ts",
    ]
    joined = "\n".join(path.read_text(encoding="utf-8").lower() for path in searched_files)

    for forbidden in ["profile coming soon", "under construction", "placeholder"]:
        assert forbidden not in joined


def test_landing_page_uses_shared_team_data_and_card_component() -> None:
    landing = (FRONTEND / "app" / "page.tsx").read_text(encoding="utf-8")

    assert 'from "@/lib/team-data"' in landing
    assert 'from "@/components/team-card"' in landing
    assert "landingTeams.map" in landing
