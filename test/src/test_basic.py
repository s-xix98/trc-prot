import time

from playwright.sync_api import Page, Playwright, expect, sync_playwright

from src.constants import TOP_PAGE_URL
from src.playwright_runner_utils import take_screenshot


def test_basic(page: Page, test_name: str) -> None:
    # ログインしてない状態だと、login に 飛ばされるはず
    page.goto(TOP_PAGE_URL)
    time.sleep(3)
    take_screenshot(page, test_name, "redirect-to-login-page")

    # とりあえず適当にログイン
    page.get_by_role("button", name="login as fuga").click()
    time.sleep(3)
    take_screenshot(page, test_name, "login-as-fuga")
