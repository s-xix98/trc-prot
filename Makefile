# TRC-PROT
# ------------------------------------------------------------------------------------------

# MAKE
# ------------------------------------------------------------------------------------------
PHONY	:=	all
all:
	docker compose up --build

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
	docker exec -t frontend make fmt
	docker exec -t backend make fmt

PHONY	+=	fmt-ck
fmt-ck:
	docker exec -t frontend make fmt-ck
	docker exec -t backend make fmt-ck

PHONY	+=	lint
lint:
	docker exec -t frontend make lint
	docker exec -t backend make lint

PHONY	+=	lint-fix
lint-fix:
	docker exec -t frontend npm run lint-fix

# etc...
# ------------------------------------------------------------------------------------------
.PHONY: all down re frontend-it backend-it fmt lint lint-fix
