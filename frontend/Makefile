# FRONTEND
# ------------------------------------------------------------------------------------------

# MAKE
# ------------------------------------------------------------------------------------------
PHONY	:=	all
all:

PHONY	+=	build
build:
	npm run build

PHONY	+=	setup
setup:
	npm install

# LINTER, FORMATTER
# ------------------------------------------------------------------------------------------
PHONY	+=	lint
lint:
	npm run lint
	npm run noEmit

PHONY	+=	lint-fix
lint-fix:
	npm run lint-fix

PHONY	+=	fmt
fmt:
	npm run fmt

PHONY	+=	fmt-ck
fmt-ck:
	npm run fmt-ck

PHONY += sb
sb:
	npm run storybook

PHONY += sb-ck-file
sb-ck-file:
	bash scripts/check_storybook_file.sh

PHONY += sb-create-file
sb-create-file:
	bash scripts/create_storybook_file.sh

PHONY += sb-test
sb-test:
	npm i
	export STORYBOOK_BACKEND="http://backend:8000" && npm run storybook-build
	python3 -m http.server 6006 --directory storybook-static &
	timeout 30 bash -c 'while ! >/dev/tcp/localhost/6006; do sleep 3; done'
	npm run storybook-test

PHONY += sb-update
sb-update:
	npm i
	rm -rf $(shell find src/ -type d -name '__image_snapshots__')
	export STORYBOOK_BACKEND="http://backend:8000" && npm run storybook-build
	python3 -m http.server 6006 --directory storybook-static &
	timeout 30 bash -c 'while ! >/dev/tcp/localhost/6006; do sleep 3; done'
	npm run storybook-update-snapshot

PHONY	+=	test-e2e
test-e2e:
	npm i
	export NEXT_PUBLIC_BACKEND="http://backend:8000" && make build
	npm run start &
	timeout 30 bash -c 'while ! >/dev/tcp/localhost/3000; do sleep 3; done'
	python3 test/e2e.py

# etc...
# ------------------------------------------------------------------------------------------
.PHONY: $(PHONY)
