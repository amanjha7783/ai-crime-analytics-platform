from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

from backend.app.core.config import get_settings
from backend.app.core.security import create_access_token, hash_password, verify_password


@dataclass(frozen=True)
class DemoUser:
    username: str
    full_name: str
    role: str
    password_hash: str


class AuthService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._engine = self._create_engine() if self.settings.use_database else None
        self._users = {
            "admin@ksp.local": DemoUser(
                "admin@ksp.local",
                "KSP Command Admin",
                "Admin",
                hash_password("admin123"),
            ),
            "officer@ksp.local": DemoUser(
                "officer@ksp.local",
                "Station Police Officer",
                "Police Officer",
                hash_password("officer123"),
            ),
            "investigator@ksp.local": DemoUser(
                "investigator@ksp.local",
                "Crime Investigator",
                "Investigator",
                hash_password("investigator123"),
            ),
            "analyst@ksp.local": DemoUser(
                "analyst@ksp.local",
                "Crime Data Analyst",
                "Analyst",
                hash_password("analyst123"),
            ),
        }

    def _create_engine(self) -> Engine:
        return create_engine(self.settings.database_url)

    def _get_user_from_db(self, username: str) -> dict[str, str] | None:
        if self._engine is None:
            return None
        query = text(
            """
            SELECT u.username, u.password_hash, u.full_name, r.name AS role
            FROM users u
            JOIN roles r ON r.id = u.role_id
            WHERE lower(u.username) = lower(:username)
            """
        )
        with self._engine.connect() as connection:
            row = connection.execute(query, {"username": username}).mappings().first()
        if row is None:
            return None
        return {
            "username": row["username"],
            "password_hash": row["password_hash"],
            "full_name": row["full_name"],
            "role": row["role"],
        }

    def _get_user(self, username: str) -> DemoUser | dict[str, str] | None:
        if self.settings.use_database:
            db_user = self._get_user_from_db(username)
            if db_user is not None:
                return db_user
        return self._users.get(username.lower())

    def login(self, username: str, password: str) -> dict | None:
        user = self._get_user(username)
        if user is None:
            return None

        password_hash = user.password_hash if isinstance(user, DemoUser) else user["password_hash"]
        if not verify_password(password, password_hash):
            return None

        username = user.username if isinstance(user, DemoUser) else user["username"]
        full_name = user.full_name if isinstance(user, DemoUser) else user["full_name"]
        role = user.role if isinstance(user, DemoUser) else user["role"]

        return {
            "access_token": create_access_token(username, role, full_name),
            "token_type": "bearer",
            "user": {"username": username, "full_name": full_name, "role": role},
        }
