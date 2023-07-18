from playwright.sync_api import Page

from src.user import E2E, User
from src.user_action import UserInteractionManager


def test_signup(page: Page, test_name: str) -> None:
    e2e = UserInteractionManager(test_name, E2E, page)
    e2e.goto_top_page()
    e2e.signup()


def test_signup_invalid_form(page: Page, test_name: str) -> None:
    invalid_email_user = User(
        name="invalid-email", email="invalid", password="invalid-email-password"
    )
    invalid_email = UserInteractionManager(test_name, invalid_email_user, page)
    invalid_email.goto_top_page()
    invalid_email.signup()


def test_login(page: Page, test_name: str) -> None:
    e2e = UserInteractionManager(test_name, E2E, page)
    e2e.goto_top_page()
    e2e.login(take_screenshot=True)
    e2e.screenshot("login after")


def test_login_invalid_password(page: Page, test_name: str) -> None:
    e2e = UserInteractionManager(test_name, E2E, page)
    e2e.goto_top_page()

    e2e.login(password="1", take_screenshot=True)


def test_signup_already_use_email(page: Page, test_name: str) -> None:
    e2e = UserInteractionManager(test_name, E2E, page)
    e2e.goto_top_page()
    e2e.signup(username="dupEmail")


def test_login_incorrect_password(page: Page, test_name: str) -> None:
    e2e = UserInteractionManager(test_name, E2E, page)
    e2e.goto_top_page()
    e2e.login(password="incorrect", take_screenshot=True)


def test_logout(page: Page, test_name: str) -> None:
    e2e = UserInteractionManager(test_name, E2E, page)
    e2e.goto_top_page()
    e2e.login(take_screenshot=True)
    e2e.logout()
    e2e.screenshot("logout after")
