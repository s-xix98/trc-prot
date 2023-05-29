# storybook

## init

init pr : [storybook 使うます](https://github.com/s-xix98/trc-prot/pull/40)

```shell
npx storybook@latest init
npm run storybook
```

- [install strybook](https://storybook.js.org/docs/react/get-started/install)

## Interaction tests

pr : [88 storybook を 使って UI テスト](https://github.com/s-xix98/trc-prot/pull/89)

```shell
npm install --save-dev @storybook/test-runner
npm install --save-dev @storybook/jest
npm install --save-dev jest-image-snapshot
```

- [Interaction tests](https://storybook.js.org/docs/react/writing-tests/interaction-testing)
- [GitHub - storybookjs/test-runner: 🚕 Turn stories into executable tests](https://github.com/storybookjs/test-runner)
- [Test runner Addon | Storybook: Frontend workshop for UI development](https://storybook.js.org/addons/@storybook/test-runner)
- [Storybook 単体でインタラクションテストを実施する](https://zenn.dev/azukiazusa/articles/storybook-interaction-testing)
- [GitHub - americanexpress/jest-image-snapshot: ✨ Jest matcher for image comparisons. Most commonly used for visual regression testing.](https://github.com/americanexpress/jest-image-snapshot)

## ci test

pr : [98 storybook の スナップショットテストを ci で 走らせる](https://github.com/s-xix98/trc-prot/pull/99)

```shell
npm install --save-dev wait-on
```

- [GitHub - storybookjs/test-runner: 🚕 Turn stories into executable tests](https://github.com/storybookjs/test-runner)
- [GitHub - jeffbski/wait-on: wait-on is a cross-platform command line utility and Node.js API which will wait for files, ports, sockets, and http(s) resources to become available](https://github.com/jeffbski/wait-on)
