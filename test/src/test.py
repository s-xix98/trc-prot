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
    screenshot_counter: int = 1

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

    def signup(self) -> None:
        page = self.page
        user = self.user

        page.get_by_role("tab", name="SignUp").click()
        page.get_by_placeholder("username").fill(user.name)
        page.get_by_placeholder("email").fill(user.email)
        page.get_by_placeholder("password").fill(user.password)
        self.screenshot("signup-before")

        page.get_by_role("button", name="SignUp").click()
        self.screenshot("signup-after")
