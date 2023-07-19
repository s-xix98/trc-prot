from playwright.sync_api import Page

from src.constants import TAKE_SCREENSHOT, TEST_IMG_DIR


def take_screenshot(page: Page, test_name: str, name: str) -> None:
    if TAKE_SCREENSHOT == False:
        return
    test_name = test_name.replace("_", "-").replace(" ", "-")
    name = name.replace("_", "-").replace(" ", "-")
    page.screenshot(path=f"{TEST_IMG_DIR}/{test_name}--{name}.png")
