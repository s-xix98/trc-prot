import argparse
import os
from typing import Final

parser = argparse.ArgumentParser()
parser.add_argument("--TAKE_SCREENSHOT", default=1, type=int)
parser.add_argument("--TRACE", default=0, type=int)
parser.add_argument("--HEADLESS", default=1, type=int)

args = parser.parse_args()

TAKE_SCREENSHOT = True if args.TAKE_SCREENSHOT != 0 else False
TRACE = True if args.TRACE != 0 else False
HEADLESS = True if args.HEADLESS != 0 else False

TEST_IMG_DIR: Final = "img"

TOP_PAGE_URL: Final = os.environ.get("TOP_PAGE_URL") or "http://localhost:3000/"

MAX_WORKERS = 5
TEST_USER_COUNT = 5

# POSTGRES
POSTGRES_USER = "test"
POSTGRES_PASSWORD = "test"
POSTGRES_DATABASE = "test"
POSTGRES_HOST = "localhost"
POSTGRES_PORT = "5432"

# DB_TABLE_NAME
DB_TABLE_NAME_USER = "User"
DB_TABLE_NAME_CHAT_ROOM = "ChatRoom"
DB_TABLE_NAME_MESSAGE = "Message"
