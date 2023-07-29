from typing import Any, Type, TypeVar

T = TypeVar("T")


def enforce_type(x: Any, expect_type: Type[T]) -> T:
    if not isinstance(x, expect_type):
        raise TypeError()
    return x
