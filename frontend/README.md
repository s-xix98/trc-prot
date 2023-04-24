# frontend

## coding-style

- prettier, eslit を使用
- make lint && make fmt で prettier, eslit の実行
- coding-style doc : [/frontend/doc/coding-style.md](/frontend/doc/coding-style.md)

## 使用しているライブラリなど

- dependencies
  - react
    - vite を ビルドツールとして使用
    - vite doc : [/frontend/doc/vite.md](/frontend/doc/vite.md)
  - axios, socket.io-client
    - バックエンドと 通信するために 使用
    - axios & socket.io-client doc : [/frontend/doc/axios-socket-io-client.md](/frontend/doc/axios-socket-io-client.md)
  - mui : material-ui
    - ui ライブラリ, ブラウザで、button の ui などに使用
  - emotion
    - mui が 依存している ライブラリ？
- devDependencies
  - storybook
    - コンポーネント の 各コンポーネントの 見た目 表示, test で使用
    - storybook doc : [/frontend/doc/storybook.md](/frontend/doc/storybook.md)
