for dir in $(find src/ -type d -name '__image_snapshots__'); do
    echo "${dir}" "->" "${dir}_prev"
    mv "${dir}" "${dir}_prev"
done
