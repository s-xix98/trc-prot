set -e

for file in $(find src -type f -name '*.tsx' ! -name '*.stories.tsx' ! -path 'src/features/game/Game.tsx' ! -name './src/lib/*'  ! -path 'src/lib/*' | grep -v -e 'src/stories' -e 'main\.tsx'); do
	echo ${file} && test -f ${file%.tsx}.stories.tsx
done
