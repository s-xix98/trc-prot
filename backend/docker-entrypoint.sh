#!/bin/bash -eux

make setup

npx prisma studio &

exec npm run start:dev
