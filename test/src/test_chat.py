from playwright.sync_api import Page

from src.user import User
from src.user_action import UserInteractionManager


def test_create_channel(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.create_chat_room("test-room")


def test_create_some_channel(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.create_some_chat_room("test-some-room", 100)


def test_chat_send_msg(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.send_msg("test-room", "this is test msg")


def test_chat_send_some_msg(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.send_some_msg("test-room", 100)


# chat を 開いた時に一番下まで行くか？
# test_chat_send_some_msg 実行後に行う必要あり
def test_chat_scroll_to_the_bottom(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.visit_chat_room("test-room")
