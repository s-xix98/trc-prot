import time

from playwright.sync_api import Page

from src.constants import TEST_USER_COUNT
from src.logger import logger
from src.playwright_runner import TEST_FUNC_TYPE
from src.user import User
from src.user_action import UserInteractionManager


# TODO : 消す
# test の同期を取るためだけに存在
def sleep(test_name: str, page: Page, user: User) -> None:
    time.sleep(5)


def test_create_many_user(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.signup(take_screenshot=False)
    client.logout()


def send_friend_req(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.login()

    for target_id in range(1, TEST_USER_COUNT + 1):
        if target_id == user.idx:
            continue
        logger.info(f"send friend req : {user.idx} -> user{target_id}")
        client.send_friend_req(f"user{target_id}")
    client.logout()


many_user_test_lst: list[TEST_FUNC_TYPE] = [
    test_create_many_user,
    sleep,
    send_friend_req,
]
