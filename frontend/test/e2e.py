from playwright.sync_api import Playwright, sync_playwright, expect

TEST_IMG_DIR = "test/img"

import time


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch()
    context = browser.new_context()
    page = context.new_page()

    page.on("console", lambda msg: print(msg.text))

    # ログインしてない状態だと、login に 飛ばされるはず
    page.goto("http://localhost:3000/")
    time.sleep(3)
    page.screenshot(path=f"{TEST_IMG_DIR}/1.png")

    # とりあえず適当にログイン
    page.get_by_role("button", name="login as fuga").click()
    time.sleep(3)
    page.screenshot(path=f"{TEST_IMG_DIR}/2.png")

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
