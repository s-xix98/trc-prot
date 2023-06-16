#!/bin/bash -eux

make setup

npm run storybook &

exec npm run dev
