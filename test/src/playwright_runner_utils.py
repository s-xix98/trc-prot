from playwright.sync_api import Page

from src.constants import TEST_IMG_DIR


def take_screenshot(page: Page,test_name:str, name:str) -> None:
    page.screenshot(path=f"{TEST_IMG_DIR}/{test_name}--{name}.png")
