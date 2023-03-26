all:
	docker compose up --build

down:
	docker compose down

re: down all

frontend-it:
	docker exec -it frontend bash

backend-it:
	docker exec -it backend bash

.PHONY: all down re frontend-it backend-it
