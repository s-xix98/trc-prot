import time

from dataclasses import dataclass

from playwright.sync_api import Page

from src.playwright_runner_utils import take_screenshot
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

    def screenshot(self, act_name: str) -> None:
        time.sleep(0.3)
        take_screenshot(
            self.page,
            self.test_name,
            f"{str(self.screenshot_counter)}-{act_name.replace(' ', '-').replace('_', '-')}",
        )
        time.sleep(0.3)
        self.screenshot_counter += 1

    def goto_top_page(self) -> None:
        page = self.page
        page.goto(TOP_PAGE_URL)
