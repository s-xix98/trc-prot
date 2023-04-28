set -e

for file in $(find src -type f -name '*.tsx' ! -name '*.stories.tsx' | grep -v -e 'src/stories' -e 'main\.tsx'); do
	touch ${file%.tsx}.stories.tsx
done
