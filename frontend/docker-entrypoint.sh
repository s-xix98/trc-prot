#!/bin/bash -eux

make setup

exec npm run concurrent
