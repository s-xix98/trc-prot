from playwright.sync_api import Page

from src.test import User, UserPageController

E2E = User(name="e2e-name", email="e2e@example.com", password="e2e-password")


def test_chat_send_msg(page: Page, test_name: str) -> None:
    e2e = UserPageController(test_name, E2E, page)

    e2e.goto_top_page()
    e2e.login()

    e2e.send_msg("hogeRoom", "this is test msg")


def test_chat_send_some_msg(page: Page, test_name: str) -> None:
    e2e = UserPageController(test_name, E2E, page)

    e2e.goto_top_page()
    e2e.login()

    e2e.send_some_msg("hogeRoom", 100)
