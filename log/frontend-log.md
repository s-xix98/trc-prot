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
