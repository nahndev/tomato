.DEFAULT_GOAL := help

ifeq (cdc,$(firstword $(MAKECMDGOALS)))
CDC_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
.PHONY: $(CDC_ARGS)
$(CDC_ARGS): ; @:
endif

.PHONY: help setup db-init cdc

help:
	@echo "make setup                           First-time setup"
	@echo "make db-init                         Apply init.sql to an existing volume"
	@echo "make cdc status                      Show the connector status"
	@echo "make cdc register                    Create or update the connector"
	@echo "make cdc snapshot [table...]         Replay existing rows"
	@echo "make cdc stop-snapshot [table...]    Stop a running snapshot"

setup:
	@scripts/setup.sh

db-init:
	@scripts/db-init.sh

cdc:
	@scripts/cdc.sh $(CDC_ARGS)
