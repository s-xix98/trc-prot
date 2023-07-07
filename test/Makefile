# MAKE
# ------------------------------------------------------------------------------------------
PHONY	:=	all
all:
	$(MAKE) run-test

PHONY	+=	run-test
run-test:
	python3 -m src

PHONY	+=	test-e2e
test-e2e:
	timeout 60 bash -c 'while ! curl -sS frontend:3000; do sleep 3; done'
	timeout 60 bash -c 'while ! curl -sS backend:8000; do sleep 3; done'
	$(MAKE) run-test

# etc...
# ------------------------------------------------------------------------------------------
.PHONY: $(PHONY)
