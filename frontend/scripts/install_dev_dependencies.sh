set -eux

# concurrently
npm install --save-dev concurrently

# storybook
# npx storybook@latest init
npm install --save-dev @storybook/test-runner
npm install --save-dev jest-image-snapshot

# wait-on
npm install --save-dev wait-on

# prettier, eslint
npm install --save-dev prettier
npm install --save-dev eslint-config-prettier

# https://typescript-eslint.io/getting-started/
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin

npm install --save-dev eslint-plugin-react
npm install --save-dev eslint-plugin-react-hooks

npm install --save-dev eslint-plugin-import
