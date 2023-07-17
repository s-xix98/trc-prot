# TRC-PROT
# ------------------------------------------------------------------------------------------

# MAKE
# ------------------------------------------------------------------------------------------
DOCKER_FILES		:=	frontend/Dockerfile backend/Dockerfile
DOCKER_BUILD_TXT	:=	.docker_build

PHONY	:=	all
all: $(DOCKER_BUILD_TXT)
	$(MAKE) local-npm-i
	$(MAKE) local-prisma-generate
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

$(DOCKER_BUILD_TXT): $(DOCKER_FILES)
	date > $(DOCKER_BUILD_TXT)
	docker compose build

PHONY	+=	local-npm-i
local-npm-i:
	cd frontend && npm i
	cd backend && npm i

PHONY	+=	local-prisma-generate
local-prisma-generate:
	cd backend && npx prisma generate

PHONY	+=	down
down:
	docker compose down

PHONY	+=	re
re: down all

PHONY	+=	frontend-it
frontend-it:
	docker exec -it frontend bash

PHONY	+=	backend-it
backend-it:
	docker exec -it backend bash

# LINTER, FORMATTER
# ------------------------------------------------------------------------------------------
PHONY	+=	fmt
fmt:
	npx prettier --write .github
	npx prettier --write docker-compose.yml
	docker compose run --rm frontend make fmt
	docker compose run --rm backend make fmt

PHONY	+=	fmt-ck
fmt-ck:
	npx prettier --check .github
	npx prettier --check docker-compose.yml
	docker compose run --rm frontend make fmt-ck
	docker compose run --rm backend make fmt-ck

PHONY	+=	lint
lint:
	docker compose run --rm frontend make lint
	docker compose run --rm backend make lint

PHONY	+=	lint-fix
lint-fix:
	docker compose run --rm frontend make lint-fix
	docker compose run --rm backend make lint-fix

PHONY += sb-test
sb-test:
	docker compose run --rm frontend make sb-test

PHONY += sb-update
sb-update:
	docker compose run --rm frontend make sb-update

# backend  : DB の初期化
# frontend : build して test 実行
PHONY	+=	test-e2e
test-e2e:
	docker compose down || :
	docker compose -f docker-compose.yml -f docker-compose.e2e.yml up --abort-on-container-exit
# docker compose down の際に、docker-compose.yml にない、サービスが落ちてくれないので、COMPOSE_FILE でファイル指定して down
# docker compose down になぜか `-f` オプションがない
	export COMPOSE_FILE=docker-compose.yml:docker-compose.e2e.yml && docker compose down

# ローカルで実行
# 自分でローカルに必要なもの install する必要あるかも
# back, front ともに buildはされない, コンテナが動作中である必要あり。
# DB は 初期化
# TAKE_SCREENSHOT=0 : スクショ も更新されない
# HEADLESS=0        : ブラウザ出して動作確認できる
PHONY	+=	test-e2e-local
test-e2e-local:
	docker compose run --rm backend make setup-db
	cd test && python3 -m src --TAKE_SCREENSHOT=0 --HEADLESS=0

# etc...
# ------------------------------------------------------------------------------------------
.PHONY: $(PHONY)
