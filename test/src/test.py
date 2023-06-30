import time
from dataclasses import dataclass

from playwright.sync_api import Page

from src.constants import TOP_PAGE_URL
from src.playwright_runner_utils import take_screenshot


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
            f"{str(self.screenshot_counter)}-{act_name}",
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

    def login(self, take_screenshot: bool = False) -> None:
        page = self.page
        user = self.user

        page.get_by_placeholder("email").fill(user.email)
        page.get_by_placeholder("password").fill(user.password)

        if take_screenshot:
            self.screenshot("login before")

        page.get_by_role("button", name="Login", exact=True).click()
        time.sleep(0.5)

    def logout(self) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("logout")
        page.locator("#outlined-multiline-static").press("Enter")

    def visit_chat_room(self, room_name: str) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./chat")
        page.locator("#outlined-multiline-static").press("Enter")

        page.get_by_text(room_name).click()

        self.screenshot("visit_chat_room")

    def send_msg(self, room_name: str, msg: str) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./chat")
        page.locator("#outlined-multiline-static").press("Enter")

        page.get_by_text(room_name).click()
        self.screenshot("send_msg before")

        page.get_by_role("textbox").fill(msg)
        page.get_by_role("textbox").press("Enter")

        self.screenshot("send_msg after")

    def send_some_msg(self, room_name: str, times: int) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./chat")
        page.locator("#outlined-multiline-static").press("Enter")

        page.get_by_text(room_name).click()
        self.screenshot("send_some_msg before")

        for i in range(times):
            msg = f"{i} " * i
            page.get_by_role("textbox").fill(msg)
            page.get_by_role("textbox").press("Enter")
            time.sleep(0.05)

        self.screenshot("send_some_msg after")
