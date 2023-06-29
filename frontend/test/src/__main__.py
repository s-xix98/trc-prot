from src.playwright_runner import playwright_test_runner
from src.test_basic import test_basic


def main() -> None:
    playwright_test_runner([test_basic])


if __name__ == "__main__":
    main()
