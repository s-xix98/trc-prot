import os
from typing import Final

TEST_IMG_DIR: Final = "img"

TOP_PAGE_URL: Final = os.environ.get("TOP_PAGE_URL") or "http://localhost:3000/"
