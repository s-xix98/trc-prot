#!/bin/bash -eux

make setup

make build

exec npm run start
