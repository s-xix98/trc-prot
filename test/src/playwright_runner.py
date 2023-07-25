import time
from typing import Callable

from playwright.sync_api import Page, Playwright
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import expect, sync_playwright

from src.constants import HEADLESS, MAX_WORKERS, TEST_USER_COUNT, TRACE
from src.logger import logger
from src.user import E2E, User

TEST_FUNC_TYPE = Callable[[str, Page, User], None]

from concurrent.futures import ThreadPoolExecutor

from src.user_action_utils import force_logout


def run(func_lst: list[TEST_FUNC_TYPE], user_lst: list[User]) -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=HEADLESS)

        # context = browser.new_context(record_video_dir="videos/",record_video_size={"width": 640 * 2, "height": 480 * 2},)
        context = browser.new_context()

        #  python -m playwright show-trace xxx.zip
        if TRACE:
            context.tracing.start(screenshots=True, snapshots=True, sources=True)

        context.set_default_timeout(5000)
        page = context.new_page()

        # console
        page.on("console", lambda msg: logger.debug(msg.text))

        # ブラウザ表示してtest実行時,少し待ってから実行するように
        # 複数ブラウザ表示の際、ブラウザの位置とか変えたいので
        if HEADLESS == False:
            time.sleep(15)

        for func in func_lst:
            # TODO : マルチスレッドで実行時、テストの同期取るように
            for user in user_lst:
                logger.info(f"--- RUN TEST : {func.__name__}, user : {user.name} ---")
                try:
                    func(func.__name__, page, user)
                except PlaywrightTimeoutError as e:
                    logger.error(
                        f"PlaywrightTimeoutError :  {func.__name__}, user : {user.name}, {str(e)}"
                    )
                    page.screenshot(path=f"error/{func.__name__}-{user.name}-error.png")
                except Exception as e:
                    logger.error(
                        f"Exception : {func.__name__}, user : {user.name}, {str(e)}"
                    )
                    page.screenshot(path=f"error/{func.__name__}-{user.name}-error.png")
                logger.info(f"--- END TEST : {func.__name__}, user : {user.name} ---")
                # local storage が残ってしまうので、test のたびに logout するように
                force_logout("force-logout", user, page)
                # local storage 参照すると、新しいタブを開いてるのか？しらんけど、一瞬白くなるので、参照しないように, 毎回 logout
                # logger.info(f"storage_state : {context.storage_state()}")
                # if context.storage_state() != {"cookies": [], "origins": []}:
                #     force_logout("force-logout", user, page)
                #     logger.info(
                #         f"force_logout - storage_state : {context.storage_state()}"
                #     )

        logger.info(f"--- END ALL TEST ---")

        if TRACE:
            context.tracing.stop(
                path=f"log/trace/{'-'.join([u.name for u in user_lst])}-trace.zip"
            )
        # ---------------------
        context.close()
        browser.close()


def playwright_test_runner(func_lst: list[TEST_FUNC_TYPE]) -> None:
    run(func_lst, [E2E])


def playwright_test_runner_multiple_threads(func_lst: list[TEST_FUNC_TYPE]) -> None:
    executor = ThreadPoolExecutor(max_workers=MAX_WORKERS)
    all_test_user: list[User] = [
        User(i, f"user{i}", f"{i}@example.com", f"{i}{i}{i}")
        for i in range(1, TEST_USER_COUNT + 1)
    ]
    for i in range(MAX_WORKERS):
        user_lst = all_test_user[i::MAX_WORKERS]
        logger.info(str([u.name for u in user_lst]))
        executor.submit(run, func_lst=func_lst, user_lst=user_lst)
    executor.shutdown()
