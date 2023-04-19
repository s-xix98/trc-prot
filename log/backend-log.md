# backend log

## NestJS

```shell
npm i -g @nestjs/cli
nest new . --strict
```

- [Documentation | NestJS - A progressive Node.js framework](https://docs.nestjs.com/)

### gateway

```shell
npx nest g gateway Events
npm i --save @nestjs/websockets @nestjs/platform-socket.io
```


### Swagger

```shell
npm install --save @nestjs/swagger
```
- [install swagger](https://docs.nestjs.com/openapi/introduction)

### prisma
```shell
npm install prisma --save-dev
npx prisma init
npm install @prisma/client
npx prisma db push --preview-feature
npx prisma studio
```
-[prisma install](https://docs.nestjs.com/recipes/prisma)


### class-validator
```shell
npm install class-validator --save
```
-[class validator](https://github.com/typestack/class-validator)

### config
```
npm i --save @nestjs/config
```
-[config](https://docs.nestjs.com/techniques/configuration)