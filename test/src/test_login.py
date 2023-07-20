from playwright.sync_api import Page

from src.user import User
from src.user_action import UserInteractionManager


def test_signup(page: Page, test_name: str, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.signup()


def test_signup_invalid_form(page: Page, test_name: str, user: User) -> None:
    invalid_email_user = User(
        name="invalid-email", email="invalid", password="invalid-email-password"
    )
    invalid_email = UserInteractionManager(test_name, invalid_email_user, page)
    invalid_email.goto_top_page()
    invalid_email.signup()


def test_login(page: Page, test_name: str, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.login(take_screenshot=True)
    client.screenshot("login after")


def test_login_invalid_password(page: Page, test_name: str, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()

    client.login(password="1", take_screenshot=True)


def test_signup_already_use_email(page: Page, test_name: str, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.signup(username="dupEmail")


def test_login_incorrect_password(page: Page, test_name: str, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.login(password="incorrect", take_screenshot=True)


def test_logout(page: Page, test_name: str, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.login(take_screenshot=True)
    client.logout()
    client.screenshot("logout after")
