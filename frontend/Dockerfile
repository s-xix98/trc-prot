# TODO: node２０のバグを修正したら消す
# https://github.com/nodejs/node/issues/47822
FROM node:18-bullseye

WORKDIR /workdir

RUN set -eux \
  && apt-get update && apt-get install -y --no-install-recommends \
  chromium \
  && apt-get clean

COPY --chown=node:node package*.json ./

RUN npm i

RUN npx playwright install && npx playwright install-deps
