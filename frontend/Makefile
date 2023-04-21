# FRONTEND
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
# etc...
# ------------------------------------------------------------------------------------------
.PHONY: $(PHONY)
