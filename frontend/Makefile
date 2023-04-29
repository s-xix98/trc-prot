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
	npm run storybook-test

PHONY += sb-update
sb-update:
	npm run storybook-update-snapshot

# etc...
# ------------------------------------------------------------------------------------------
.PHONY: $(PHONY)
