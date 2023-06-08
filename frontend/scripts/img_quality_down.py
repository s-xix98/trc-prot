import cv2
import sys

QUALITY = 95


def main() -> None:
    if len(sys.argv) != 2:
        print("invalid arg", file=sys.stderr)
        sys.exit(1)

    img_path = sys.argv[1]
    img_data = cv2.imread(img_path)

    cv2.imwrite(img_path, img_data, [cv2.IMWRITE_JPEG_QUALITY, QUALITY])


if __name__ == "__main__":
    main()
