from dataclasses import dataclass
from typing import Final


@dataclass
class User:
    idx: int
    name: str
    email: str
    password: str


E2E: Final = User(
    idx=0, name="e2e-name", email="e2e@example.com", password="e2e-password"
)
