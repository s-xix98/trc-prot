import time
from dataclasses import dataclass
from typing import Union

from playwright.sync_api import Page

from src.constants import TOP_PAGE_URL
from src.playwright_runner_utils import take_screenshot
from src.user import User


@dataclass
class UserInteractionManager:
    test_name: str
    user: User
    page: Page
    screenshot_counter: int = 1

    def screenshot(self, act_name: str) -> None:
        time.sleep(1)
        take_screenshot(
            self.page,
            self.test_name,
            f"{str(self.screenshot_counter)}-{act_name}",
        )
        self.screenshot_counter += 1

    def goto_top_page(self) -> None:
        page = self.page
        page.goto(TOP_PAGE_URL)

    def signup(self) -> None:
        page = self.page
        user = self.user

        page.get_by_role("tab", name="SignUp").click()
        page.locator('input[name="username"]').fill(user.name)
        page.locator('input[name="email"]').fill(user.email)
        page.locator('input[name="hashedPassword"]').fill(user.password)
        self.screenshot("signup-before")

        page.get_by_role("button", name="SignUp").click()
        self.screenshot("signup-after")

    def login(
        self,
        email: Union[str, None] = None,
        password: Union[str, None] = None,
        take_screenshot: bool = False,
    ) -> None:
        page = self.page
        user = self.user
        email = email if email else self.user.email
        password = password if password else self.user.password

        page.locator('input[name="email"]').fill(email)
        page.locator('input[name="hashedPassword"]').fill(password)

        if take_screenshot:
            self.screenshot("login before")

        page.get_by_role("button", name="Login", exact=True).click()
        if take_screenshot:
            self.screenshot("login after")

    def logout(self) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("logout")
        page.locator("#outlined-multiline-static").press("Enter")

    def create_chat_room(self, room_name: str) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./chat")
        page.locator("#outlined-multiline-static").press("Enter")

        self.screenshot("create_chat_room before")

        page.get_by_text("ChannelCreate").click()
        page.get_by_placeholder("roomName").fill(room_name)
        page.get_by_role("button", name="create").click()

        self.screenshot("create_chat_room after")

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
