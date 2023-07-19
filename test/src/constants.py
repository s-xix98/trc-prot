import argparse
import os
from typing import Final

parser = argparse.ArgumentParser()
parser.add_argument("--TAKE_SCREENSHOT", default=1, type=int)
parser.add_argument("--HEADLESS", default=1, type=int)

args = parser.parse_args()

TAKE_SCREENSHOT = True if args.TAKE_SCREENSHOT != 0 else False
HEADLESS = True if args.HEADLESS != 0 else False

TEST_IMG_DIR: Final = "img"

TOP_PAGE_URL: Final = os.environ.get("TOP_PAGE_URL") or "http://localhost:3000/"
