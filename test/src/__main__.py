from src.playwright_runner import playwright_test_runner
from src.test_basic import test_basic
from src.test_login import test_signup

from src.constants import TOP_PAGE_URL
from src.logger import logger


def main() -> None:
    logger.info(f"TOP_PAGE_URL : {TOP_PAGE_URL}")
    playwright_test_runner([test_basic, test_signup])


if __name__ == "__main__":
    main()
