# frontend log

## vite

```shell
npm create vite@latest . -- --template react-ts
```

- config
  - [サーバオプション | Vite](https://ja.vitejs.dev/config/server-options.html)

## prettier, eslint

```shell
# ✔ How would you like to use ESLint? · problems
# ✔ What type of modules does your project use? · esm
# ✔ Which framework does your project use? · react
# ✔ Does your project use TypeScript? · No / Yes
# ✔ Where does your code run? · browser
# ✔ What format do you want your config file to be in? · JavaScript
# ✔ Would you like to install them now? · No / Yes
# ✔ Which package manager do you want to use? · npm
npm init @eslint/config

npm install --save-dev prettier eslint-config-prettier
```

- [Getting Started with ESLint - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/use/getting-started)
- [ESLint + Prettier を導入した TypeScript 開発環境](https://zenn.dev/big_tanukiudon/articles/c1ab3dba7ba111)

```
    "settings" : {
        "react": {
            "version": "detect"
        }
    },
    "rules": {
        'react/react-in-jsx-scope': 'off'
    }
```

- [GitHub - jsx-eslint/eslint-plugin-react: React-specific linting rules for ESLint](https://github.com/jsx-eslint/eslint-plugin-react#configuration)
- [React v17 create-react-app で作ったアプリで ESLint に怒られまくった - かもメモ](https://chaika.hatenablog.com/entry/2020/12/04/083000)
- mv extends prettier to last
  - [GitHub - prettier/eslint-config-prettier: Turns off all rules that are unnecessary or might conflict with Prettier.](https://github.com/prettier/eslint-config-prettier)

### eslint-plugin-import

```shell
npm install --save-dev eslint-plugin-import
```

- [GitHub - import-js/eslint-plugin-import: ESLint plugin with rules that help validate proper imports.](https://github.com/import-js/eslint-plugin-import)
- [eslint-plugin-import/order.md at main · import-js/eslint-plugin-import · GitHub](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md)

## socket.io-client

```shell
npm install socket.io-client
```

- [Client Installation | Socket.IO](https://socket.io/docs/v4/client-installation/)
- [How to use with React | Socket.IO](https://socket.io/how-to/use-with-react)

## MUI

```shell
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

- [MUI: The React component library you always wanted](https://mui.com/)
- [Installation - Material UI](https://mui.com/material-ui/getting-started/installation/)

## storybook
```shell
npx storybook@latest init
npm run storybook
```

- [install strybook](https://storybook.js.org/docs/react/get-started/install)

### Interaction tests

```shell
npm install --save-dev @storybook/test-runner
```

- [Test runner Addon | Storybook: Frontend workshop for UI development](https://storybook.js.org/addons/@storybook/test-runner)

## [vite-plugin-checker](https://vite-plugin-checker.netlify.app/)
```shell
npm i -D vite-plugin-checker
```

- noEmit
  - [特徴 | Vite](https://ja.vitejs.dev/guide/features.html)

## axios

```shell
npm install axios
```

- [GitHub - axios/axios: Promise based HTTP client for the browser and node.js](https://github.com/axios/axios)
