#!/bin/bash -eux

npm install

npx prisma db push --force-reset
npx prisma generate
npx prisma db seed

npx prisma studio &

exec npm run start:dev
