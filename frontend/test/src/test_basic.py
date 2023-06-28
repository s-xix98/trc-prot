import time

from playwright.sync_api import Page, Playwright, expect, sync_playwright

from src.constants import TEST_IMG_DIR, TOP_PAGE_URL


def test_basic(page: Page) -> None:
    # ログインしてない状態だと、login に 飛ばされるはず
    page.goto(TOP_PAGE_URL)
    time.sleep(3)
    page.screenshot(path=f"{TEST_IMG_DIR}/1.png")

    # とりあえず適当にログイン
    page.get_by_role("button", name="login as fuga").click()
    time.sleep(3)
    page.screenshot(path=f"{TEST_IMG_DIR}/2.png")
