set -e

for file in $(find src -type f -name '*.tsx' ! -name '*.stories.tsx' | grep -v src/stories | grep -v main.tsx); do
	touch ${file%.tsx}.stories.tsx
done
