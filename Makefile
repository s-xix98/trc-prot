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
	docker compose up

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
	docker compose -f docker-compose.yml -f docker-compose.e2e.yml up

# etc...
# ------------------------------------------------------------------------------------------
.PHONY: $(PHONY)
