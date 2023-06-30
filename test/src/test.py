from dataclasses import dataclass

from playwright.sync_api import Page

from src.constants import TOP_PAGE_URL


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

    def goto_top_page(self) -> None:
        page = self.page
        page.goto(TOP_PAGE_URL)
