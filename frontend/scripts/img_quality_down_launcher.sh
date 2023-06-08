set -eu

for file in $(find src -type f -name '*.png'); do
    echo ${file}
    python3 scripts/img_quality_down.py "${file}"
done
