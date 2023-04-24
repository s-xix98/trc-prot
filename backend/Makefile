# BACKEND
# ------------------------------------------------------------------------------------------

# MAKE
# ------------------------------------------------------------------------------------------
PHONY	:=	all
all:

# LINTER, FORMATTER
# ------------------------------------------------------------------------------------------
PHONY	+=	lint
lint:
	npm run lint

PHONY	+=	lint-fix
lint-fix:
	npm run lint-fix

PHONY	+=	fmt
fmt:
	npm run format

PHONY	+=	fmt-ck
fmt-ck:
	npm run format-ck

PHONY += test
test:
	npm run test
# etc...
# ------------------------------------------------------------------------------------------
.PHONY: $(PHONY)
