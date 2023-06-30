from playwright.sync_api import Page

from src.user import E2E
from src.user_action import UserPageController


def test_signup(page: Page, test_name: str) -> None:
    e2e = UserPageController(test_name, E2E, page)
    e2e.goto_top_page()
    e2e.signup()


def test_login(page: Page, test_name: str) -> None:
    e2e = UserPageController(test_name, E2E, page)
    e2e.goto_top_page()
    e2e.login(take_screenshot=True)
    e2e.screenshot("login after")


def test_logout(page: Page, test_name: str) -> None:
    e2e = UserPageController(test_name, E2E, page)
    e2e.goto_top_page()
    e2e.login(take_screenshot=True)
    e2e.logout()
    e2e.screenshot("logout after")
