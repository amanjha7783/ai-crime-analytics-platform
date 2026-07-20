from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
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
    """Handles authentication against in-memory demo users and optionally a
    PostgreSQL database when ``USE_DATABASE=true``."""

    def __init__(self) -> None:
        self.settings = get_settings()
        self._engine = self._create_engine() if self.settings.use_database else None

        # Pre-hashed demo users (bcrypt).  Hashes are computed once at startup.
        self._users: dict[str, DemoUser] = {}
        self._runtime_users: dict[str, DemoUser] = {}  # users created via signup

        # Build the four demo accounts
        _demo_accounts = [
            ("admin@ksp.local", "KSP Command Admin", "Admin", "admin123"),
            ("officer@ksp.local", "Station Police Officer", "Police Officer", "officer123"),
            ("investigator@ksp.local", "Crime Investigator", "Investigator", "investigator123"),
            ("analyst@ksp.local", "Crime Data Analyst", "Analyst", "analyst123"),
        ]
        for uname, fname, role, pwd in _demo_accounts:
            self._users[uname.lower()] = DemoUser(
                username=uname,
                full_name=fname,
                role=role,
                password_hash=hash_password(pwd),
            )

    # ------------------------------------------------------------------
    # Database helpers
    # ------------------------------------------------------------------
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
        try:
            with self._engine.connect() as connection:
                row = connection.execute(query, {"username": username}).mappings().first()
        except OperationalError:
            raise RuntimeError("Database connection failed")
            
        if row is None:
            return None
        return {
            "username": row["username"],
            "password_hash": row["password_hash"],
            "full_name": row["full_name"],
            "role": row["role"],
        }

    # ------------------------------------------------------------------
    # Unified user lookup
    # ------------------------------------------------------------------
    def _get_user(self, username: str) -> DemoUser | dict[str, str] | None:
        key = username.strip().lower()
        # 1. Database (if enabled)
        if self.settings.use_database:
            db_user = self._get_user_from_db(key)
            if db_user is not None:
                return db_user
        # 2. In-memory demo users
        if key in self._users:
            return self._users[key]
        # 3. Runtime-created users (signup)
        return self._runtime_users.get(key)

    def _extract(self, user: DemoUser | dict[str, str]) -> dict[str, str]:
        """Normalise a user record to a plain dict."""
        if isinstance(user, DemoUser):
            return {
                "username": user.username,
                "password_hash": user.password_hash,
                "full_name": user.full_name,
                "role": user.role,
            }
        return user

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def login(self, username: str, password: str) -> dict | None:
        user = self._get_user(username)
        if user is None:
            return None

        info = self._extract(user)
        if not verify_password(password, info["password_hash"]):
            return None

        return {
            "access_token": create_access_token(info["username"], info["role"], info["full_name"]),
            "token_type": "bearer",
            "user": {
                "username": info["username"],
                "full_name": info["full_name"],
                "role": info["role"],
            },
        }

    def signup(self, username: str, password: str, full_name: str, role: str = "Analyst") -> dict:
        """Register a new user.  Returns a dict with user info or raises ValueError."""
        key = username.strip().lower()

        # Duplicate check across all user stores
        if self._get_user(key) is not None:
            raise ValueError("A user with this username already exists")

        new_user = DemoUser(
            username=username.strip(),
            full_name=full_name.strip(),
            role=role,
            password_hash=hash_password(password),
        )

        # If database is enabled, insert there
        if self.settings.use_database and self._engine is not None:
            self._signup_db(new_user)
        else:
            self._runtime_users[key] = new_user

        return {
            "username": new_user.username,
            "full_name": new_user.full_name,
            "role": new_user.role,
        }

    def _signup_db(self, user: DemoUser) -> None:
        """Insert a user into the database."""
        if self._engine is None:
            return
        # Find or create role
        try:
            with self._engine.begin() as conn:
                role_row = conn.execute(
                    text("SELECT id FROM roles WHERE name = :name"),
                    {"name": user.role},
                ).first()
                if role_row is None:
                    role_row = conn.execute(
                        text("INSERT INTO roles (name) VALUES (:name) RETURNING id"),
                        {"name": user.role},
                    ).first()
                role_id = role_row[0]  # type: ignore[index]
    
                conn.execute(
                    text(
                        """
                        INSERT INTO users (role_id, username, password_hash, full_name)
                        VALUES (:role_id, :username, :password_hash, :full_name)
                        """
                    ),
                    {
                        "role_id": role_id,
                        "username": user.username,
                        "password_hash": user.password_hash,
                        "full_name": user.full_name,
                    },
                )
        except OperationalError:
            raise RuntimeError("Database connection failed")

    def get_user_info(self, username: str) -> dict[str, str] | None:
        """Return public user info (no password hash) or None."""
        user = self._get_user(username)
        if user is None:
            return None
        info = self._extract(user)
        return {
            "username": info["username"],
            "full_name": info["full_name"],
            "role": info["role"],
        }
