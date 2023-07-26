from playwright.sync_api import Page

from src.playwright_runner import TEST_FUNC_TYPE
from src.user import User
from src.user_action import UserInteractionManager


def test_signup(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.signup()


def test_signup_invalid_form(test_name: str, page: Page, user: User) -> None:
    invalid_email_user = User(
        idx=-1, name="invalid-email", email="invalid", password="invalid-email-password"
    )
    invalid_email = UserInteractionManager(test_name, invalid_email_user, page)
    invalid_email.goto_top_page()
    invalid_email.signup()


def test_login(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.login(take_screenshot=True)
    client.screenshot("login after")


def test_login_invalid_password(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()

    client.login(password="1", take_screenshot=True)


def test_signup_already_use_email(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.signup(username="dupEmail")


def test_login_incorrect_password(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.login(password="incorrect", take_screenshot=True)


def test_logout(test_name: str, page: Page, user: User) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.login(take_screenshot=True)
    client.logout()
    client.screenshot("logout after")


test_login_lst: list[TEST_FUNC_TYPE] = [
    test_signup,
    test_signup_invalid_form,
    test_login,
    test_login_invalid_password,
    test_signup_already_use_email,
    test_login_incorrect_password,
    test_logout,
]
