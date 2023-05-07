set -eux

# storybook
# npx storybook@latest init
npm install --save-dev @storybook/test-runner
npm install --save-dev jest-image-snapshot

# wait-on
npm install --save-dev wait-on
