from src.playwright_runner import playwright_test_runner
from src.test_basic import test_basic

from src.constants import TOP_PAGE_URL


def main() -> None:
    print(f"TOP_PAGE_URL : {TOP_PAGE_URL}")
    playwright_test_runner([test_basic])


if __name__ == "__main__":
    main()
