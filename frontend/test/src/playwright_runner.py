from typing import Callable

from playwright.sync_api import Page, Playwright, expect, sync_playwright

TEST_FUNC_TYPE = Callable[[Page, str], None]


def run(playwright: Playwright, func: TEST_FUNC_TYPE) -> None:
    browser = playwright.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    # console
    page.on("console", lambda msg: print(msg.text))

    func(page, func.__name__)

    # ---------------------
    context.close()
    browser.close()


def playwright_test_runner(func_lst: list[TEST_FUNC_TYPE]) -> None:
    for func in func_lst:
        print(f"--- RUN TEST : {func.__name__} ---")
        with sync_playwright() as playwright:
            run(playwright, func)
        print()
