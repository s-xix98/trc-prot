from playwright.sync_api import Page

from src.test import UserPageController
from src.user import E2E


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


# chat を 開いた時に一番下まで行くか？
# test_chat_send_some_msg 実行後に行う必要あり
def test_chat_scroll_to_the_bottom(page: Page, test_name: str) -> None:
    e2e = UserPageController(test_name, E2E, page)

    e2e.goto_top_page()
    e2e.login()

    e2e.visit_chat_room("hogeRoom")
