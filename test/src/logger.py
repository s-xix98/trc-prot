import logging
from logging import Formatter, StreamHandler, getLogger

# DEBUG, INFO, WARNING, ERROR, CRITICAL

# COLOR
# ------------------------------------------------------------------------------------------
COLOR_RED = "\033[31m"
COLOR_GREEN = "\033[32m"
COLOR_YELLOW = "\033[33m"
COLOR_BLUE = "\033[34m"
COLOR_MAGENTA = "\033[35m"
COLOR_RESET = "\033[39m"


class ColorFormatter(logging.Formatter):
    color_map = {
        logging.DEBUG: COLOR_BLUE,
        logging.INFO: COLOR_GREEN,
        logging.WARNING: COLOR_YELLOW,
        logging.ERROR: COLOR_RED,
        logging.CRITICAL: COLOR_MAGENTA,
    }

    def format(self, record: logging.LogRecord) -> str:
        log_str = super().format(record)
        color = self.color_map.get(record.levelno, "")
        return f"{color}{log_str}{COLOR_RESET}"


# logger
# ------------------------------------------------------------------------------------------
logger = getLogger(__name__)
logger.setLevel(logging.DEBUG)
logger.propagate = False

# stream_handler
stream_handler = StreamHandler()
stream_handler.setFormatter(ColorFormatter())
logger.addHandler(stream_handler)
