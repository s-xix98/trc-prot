import time
from dataclasses import dataclass
from typing import Union

from playwright.sync_api import Page
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

from src.constants import TOP_PAGE_URL
from src.logger import logger
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

    def escape_back_to_home(self) -> None:
        page = self.page

        for _ in range(5):
            try:
                page.keyboard.press("Escape")
                page.keyboard.press("Escape")
                page.keyboard.press("Escape")
                page.get_by_role("heading", name="Terminal").click(timeout=100)
                break
            except PlaywrightTimeoutError:
                pass

    def signup(
        self,
        username: Union[str, None] = None,
        email: Union[str, None] = None,
        password: Union[str, None] = None,
        take_screenshot: bool = True,
    ) -> None:
        page = self.page
        user = self.user
        username = username if username else self.user.name
        email = email if email else self.user.email
        password = password if password else self.user.password

        page.get_by_role("tab", name="SignUp").click()
        page.locator('input[name="username"]').fill(username)
        page.locator('input[name="email"]').fill(email)
        page.locator('input[name="hashedPassword"]').fill(password)
        if take_screenshot:
            self.screenshot("signup-before")

        page.get_by_role("button", name="SignUp").click()
        if take_screenshot:
            self.screenshot("signup-after")
        # signup して home に行ったか確認
        self.escape_back_to_home()
        logger.info("signup end")

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

    def force_logout(self) -> None:
        page = self.page
        try:
            page.locator("#outlined-multiline-static").fill("logout", timeout=300)
            page.locator("#outlined-multiline-static").press("Enter", timeout=300)
        except PlaywrightTimeoutError as e:
            logger.info(f"{self.user.name} force_logout fail : {e}")

    def send_friend_req(self, target_friend_name: str) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./search")
        page.locator("#outlined-multiline-static").press("Enter")

        page.get_by_placeholder("username").fill(target_friend_name)
        page.get_by_text(target_friend_name, exact=True).click()
        page.get_by_role("button", name="Friend Req").click()
        time.sleep(0.1)
        self.escape_back_to_home()

    def send_block_req(self, target_friend_name: str) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./search")
        page.locator("#outlined-multiline-static").press("Enter")

        page.get_by_placeholder("username").fill(target_friend_name)
        page.get_by_text(target_friend_name, exact=True).click()
        page.get_by_role("button", name="Block Req").click()
        time.sleep(0.1)
        self.escape_back_to_home()

    def create_chat_room(self, room_name: str) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./chat")
        page.locator("#outlined-multiline-static").press("Enter")

        self.screenshot("create_chat_room before")

        page.get_by_text("ChannelCreate").click()
        page.get_by_placeholder("roomName").fill(room_name)
        page.get_by_role("button", name="create").click()

        self.screenshot("create_chat_room after")

    def create_some_chat_room(self, room_name: str, times: int) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./chat")
        page.locator("#outlined-multiline-static").press("Enter")

        self.screenshot("create_chat_room before")

        for i in range(times):
            page.get_by_text("ChannelCreate").click()
            page.get_by_placeholder("roomName").fill(f"{room_name}{i}")
            page.get_by_role("button", name="create").click()

        self.screenshot("create_chat_room after")

    def invite_chat_room(self, room_name: str, invite_user_name: str) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./chat")
        page.locator("#outlined-multiline-static").press("Enter")

        page.get_by_text(room_name).click()
        page.get_by_role("heading", name=f"ChatTalkArea {room_name}").click()

        self.screenshot("invite_chat_room prev")

        page.get_by_role("button", name="Invite").click()
        page.get_by_placeholder("username").fill(invite_user_name)
        page.get_by_role("button", name="Invite").click()

        page.keyboard.press("Escape")

        self.screenshot("invite_chat_room after")

    def search_and_join_chat_room(self, room_name: str) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./chat")
        page.locator("#outlined-multiline-static").press("Enter")

        page.get_by_text("Channel Search").click()
        page.get_by_placeholder("channel name").fill(room_name)

        self.screenshot("search_and_join_chat_room before")

        page.get_by_text(room_name).click()
        page.get_by_role("button", name="join").click()

        self.screenshot("search_and_join_chat_room after")

    def leave_chat_room(self, room_name: str) -> None:
        page = self.page

        page.locator("#outlined-multiline-static").fill("./chat")
        page.locator("#outlined-multiline-static").press("Enter")

        page.get_by_text(room_name).click()

        self.screenshot("leave_chat_room before")

        page.get_by_role("heading", name=f"ChatTalkArea {room_name}").click()
        page.get_by_role("button", name="Leave").click()

        self.screenshot("leave_chat_room after")

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
