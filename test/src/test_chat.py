from playwright.sync_api import Page

from src.playwright_runner import TEST_FUNC_TYPE
from src.postgres_ctl import postgres_ctl
from src.user import User
from src.user_action import UserInteractionManager


def test_create_channel(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.create_chat_room("test-room")

    chat_room_dic = postgres_ctl.get_all_chat_room()
    assert chat_room_dic["test-room"] != None


def test_create_some_channel(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.create_some_chat_room("test-some-room", 100)

    chat_room_dic = postgres_ctl.get_all_chat_room()
    for i in range(100):
        assert chat_room_dic[f"test-some-room{i}"] != None


def test_chat_send_msg(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.send_msg("test-room", "this is test msg")

    msg_lst = postgres_ctl.get_all_chat_room_msg("test-room")
    assert len(msg_lst) == 1
    assert msg_lst[0].content == "this is test msg"


def test_chat_send_some_msg(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    prev_msgs = postgres_ctl.get_all_chat_room_msg("test-room")

    client.send_some_msg("test-room", 100)

    after_msgs = postgres_ctl.get_all_chat_room_msg("test-room")

    assert len(prev_msgs) + 100 == len(after_msgs)


# chat を 開いた時に一番下まで行くか？
# test_chat_send_some_msg 実行後に行う必要あり
def test_chat_scroll_to_the_bottom(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.visit_chat_room("test-room")


def test_chat_invite(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.invite_chat_room("test-room", "piyo")


def leave_chat_room(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.leave_chat_room("test-room")


def test_join_chat_room(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)

    client.goto_top_page()
    client.login()

    client.search_and_join_chat_room("test-room")


test_chat_lst: list[TEST_FUNC_TYPE] = [
    test_create_channel,
    test_create_some_channel,
    test_chat_send_msg,
    test_chat_send_some_msg,
    test_chat_scroll_to_the_bottom,
    test_chat_invite,
    leave_chat_room,
    test_join_chat_room,
]
