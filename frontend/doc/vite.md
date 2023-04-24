# vite

- [Vite | 次世代フロントエンドツール](https://ja.vitejs.dev/)

## init

setup pr : [セットアップした](https://github.com/s-xix98/trc-prot/pull/2)

```shell
npm create vite@latest . -- --template react-ts
```

## setting

vite 設定ファイル : [/frontend/vite.config.ts](/frontend/vite.config.ts)

- 設定参考リンクなど

- config
  - [サーバオプション | Vite](https://ja.vitejs.dev/config/server-options.html)
- import alias
  - [共通オプション | Vite](https://ja.vitejs.dev/config/shared-options.html)
  - [Vite+React+TypeScript+EsLint で、Import パスにエイリアスを使うためにハマったこと](https://zenn.dev/longbridge/articles/5e33ff1a625158)
- [型 チェック 用の プラグイン の 導入](#vite-plugin-checker)
  - [特徴 | Vite](https://ja.vitejs.dev/guide/features.html)
  - > Vite は .ts ファイルのトランスパイルを行うだけで、型チェックは行わないことに注意してください。型チェックは IDE やビルドプロセスで行われることを想定しています。
  - `tsc --noEmit`
    - TypeScript のコンパイルエラーのみをチェック

### [vite-plugin-checker](https://vite-plugin-checker.netlify.app/)

pr : [41 vite がコンパイルエラー握り潰すけことがあるっぽいから vite plugin checker を入れる](https://github.com/s-xix98/trc-prot/pull/43)

```shell
npm i -D vite-plugin-checker
```
