set -e

for file in $(find src -name '*.tsx' ! -name '*.stories.tsx' | grep -v src/stories | grep -v main.tsx); do
	echo ${file} && test -f ${file%.tsx}.stories.tsx
done
