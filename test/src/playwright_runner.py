from typing import Callable

from playwright.sync_api import Page, Playwright, expect, sync_playwright

from src.constants import HEADLESS
from src.logger import logger

TEST_FUNC_TYPE = Callable[[Page, str], None]


def run(playwright: Playwright, func: TEST_FUNC_TYPE) -> None:
    browser = playwright.chromium.launch(headless=HEADLESS)
    context = browser.new_context()
    page = context.new_page()

    # console
    page.on("console", lambda msg: logger.debug(msg.text))

    func(page, func.__name__)

    # ---------------------
    context.close()
    browser.close()


def playwright_test_runner(func_lst: list[TEST_FUNC_TYPE]) -> None:
    for func in func_lst:
        logger.info(f"--- RUN TEST : {func.__name__} ---")
        with sync_playwright() as playwright:
            run(playwright, func)
