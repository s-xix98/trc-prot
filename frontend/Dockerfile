# TODO: node２０のバグを修正したら消す
# https://github.com/nodejs/node/issues/47822
FROM node:19.9.0

WORKDIR /workdir

COPY --chown=node:node package*.json ./

RUN npm i

RUN npx playwright install && npx playwright install-deps
