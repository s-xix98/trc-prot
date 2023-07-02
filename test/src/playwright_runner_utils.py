from playwright.sync_api import Page

from src.constants import TEST_IMG_DIR


def take_screenshot(page: Page, test_name: str, name: str) -> None:
    test_name = test_name.replace("_", "-").replace(" ", "-")
    name = name.replace("_", "-").replace(" ", "-")
    page.screenshot(path=f"{TEST_IMG_DIR}/{test_name}--{name}.png")
