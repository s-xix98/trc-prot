#!/bin/bash -eux

make setup

# fuga は 人類にはまだ必要なので残しておく
make setup-db

# 便利なので、prisma studio は 走らせとく
npx prisma studio &

exec npm run start
