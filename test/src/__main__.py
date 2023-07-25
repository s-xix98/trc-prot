from src.constants import (HEADLESS, MAX_WORKERS, TAKE_SCREENSHOT,
                           TEST_USER_COUNT, TOP_PAGE_URL, TRACE)
from src.logger import logger
from src.playwright_runner import (playwright_test_runner,
                                   playwright_test_runner_multiple_threads)
from src.test_basic import test_basic
from src.test_chat import (test_chat_scroll_to_the_bottom, test_chat_send_msg,
                           test_chat_send_some_msg, test_create_channel)
from src.test_login import (test_login, test_login_incorrect_password,
                            test_login_invalid_password, test_logout,
                            test_signup, test_signup_already_use_email,
                            test_signup_invalid_form)
from src.test_many_user import many_user_test_lst


def main() -> None:
    logger.info(f"TOP_PAGE_URL    : {TOP_PAGE_URL}")
    logger.info(f"HEADLESS        : {HEADLESS}")
    logger.info(f"TAKE_SCREENSHOT : {TAKE_SCREENSHOT}")
    logger.info(f"TRACE           : {TRACE}")

    playwright_test_runner(
        [
            test_basic,
            test_signup,
            test_signup_invalid_form,
            test_login,
            test_login_invalid_password,
            test_login_incorrect_password,
            test_signup_already_use_email,
            test_logout,
            test_create_channel,
            test_chat_send_msg,
            test_chat_send_some_msg,
            test_chat_scroll_to_the_bottom,
        ]
    )

    logger.info(f"--- MULTIPLE THREADS TEST ---")
    logger.info(f"MAX_WORKERS     : {MAX_WORKERS}")
    logger.info(f"TEST_USER_COUNT : {TEST_USER_COUNT}")
    playwright_test_runner_multiple_threads(many_user_test_lst)


if __name__ == "__main__":
    main()
