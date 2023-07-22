from playwright.sync_api import Page

from src.user import User
from src.user_action import UserInteractionManager


def force_logout(test_name: str, user: User, page: Page) -> None:
    client = UserInteractionManager(test_name, user, page)
    client.goto_top_page()
    client.force_logout()
