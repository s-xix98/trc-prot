# TODO: node２０のバグを修正したら消す
# https://github.com/nodejs/node/issues/47822
FROM node:18-bullseye

WORKDIR /workdir

RUN set -eux \
  && apt-get update && apt-get install -y --no-install-recommends \
  chromium \
  python3-pip \
  && apt-get clean

RUN pip install playwright
RUN playwright install && playwright install-deps
RUN pip install pandas psycopg2-binary
