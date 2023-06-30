from dataclasses import dataclass

from playwright.sync_api import Page


@dataclass
class User:
    name: str
    email: str
    password: str


@dataclass
class UserPageController:
    test_name: str
    user: User
    page: Page
