from dataclasses import dataclass
from typing import Final


@dataclass(frozen=True)
class User:
    name: str
    email: str
    password: str


E2E: Final = User(name="e2e-name", email="e2e@example.com", password="e2e-password")
