#!/bin/bash -eux

make setup
make setup-db

npx prisma studio &

exec npm run start
