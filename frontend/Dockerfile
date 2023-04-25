FROM node

WORKDIR /workdir

COPY --chown=node:node package*.json ./

RUN npm i

RUN npx playwright install && npx playwright install-deps
