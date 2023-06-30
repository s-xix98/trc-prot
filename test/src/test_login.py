from playwright.sync_api import Page

from src.test import UserPageController
from src.user import User

E2E = User(name="e2e-name", email="e2e@example.com", password="e2e-password")


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
