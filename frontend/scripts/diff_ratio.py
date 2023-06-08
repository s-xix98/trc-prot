import sys
import difflib


def get_file_data(file_path) -> bytes:
    with open(file_path, "rb") as file:
        s = file.read()
    return s


def main() -> None:
    if len(sys.argv) != 3:
        print("invalid arg", file=sys.stderr)
        sys.exit(1)
    path1 = sys.argv[1]
    path2 = sys.argv[2]

    b1 = get_file_data(path1)
    b2 = get_file_data(path2)

    print(difflib.SequenceMatcher(None, b1, b2).ratio() * 100)


if __name__ == "__main__":
    main()
