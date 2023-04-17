all:
	docker compose up --build

down:
	docker compose down

re: down all

frontend-it:
	docker exec -it frontend bash

backend-it:
	docker exec -it backend bash

fmt:
	docker exec -t frontend make fmt
	docker exec -t backend make fmt

lint:
	docker exec -t frontend make lint
	docker exec -t backend make lint

lint-fix:
	docker exec -t frontend npm run lint-fix

.PHONY: all down re frontend-it backend-it fmt lint lint-fix
