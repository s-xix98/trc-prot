// [Test runner Addon | Storybook: Frontend workshop for UI development]
// (https://storybook.js.org/addons/@storybook/test-runner)

// .storybook/test-runner.js
const { toMatchImageSnapshot } = require('jest-image-snapshot');

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

module.exports = {
  setup() {
    expect.extend({ toMatchImageSnapshot });
  },
  async postRender(page, context) {
    // If you want to take screenshot of multiple browsers, use
    // page.context().browser().browserType().name() to get the browser name to prefix the file name

    // `SkipSnapshotTest` の文字列が含まれている場合、スナップショットのテストをスキップ
    // name が パスカルケースのとき、間にスペースを入れてくる
    // (SkipSnapshotTest -> `Skip Snapshot Test`)
    // ので `Skip Snapshot Test` にしている
    if (context.name.includes('Skip Snapshot Test')) {
      console.log('Skip Snapshot Test :', context.name);
      return;
    }

    // モーションのあるコンポーネントだと、diffが発生するので少し待ってからスクショ撮るように
    await sleep(500);

    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      customSnapshotIdentifier: context.id,
    });
  },
};
