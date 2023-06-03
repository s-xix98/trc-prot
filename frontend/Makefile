# FRONTEND
# ------------------------------------------------------------------------------------------

# MAKE
# ------------------------------------------------------------------------------------------
PHONY	:=	all
all:

PHONY	+=	build
build:
	npm run build

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
	export STORYBOOK_BACKEND="http://backend:8000" && npm i && npm run storybook-test-ci

PHONY += sb-update
sb-update:
	rm -rf $(shell find src/ -type d -name '__image_snapshots__')
	export STORYBOOK_BACKEND="http://backend:8000" && npm i && npm run storybook-update-snapshot-ci

# etc...
# ------------------------------------------------------------------------------------------
.PHONY: $(PHONY)
