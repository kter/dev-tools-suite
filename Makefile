.PHONY: test test-unit test-unit-watch test-unit-coverage test-e2e test-e2e-dev test-all lint help

# Default target
.DEFAULT_GOAL := test

## Run unit tests (TOOL=ip-calculator to filter)
test:
ifdef TOOL
	npx vitest run --reporter=verbose $(TOOL)
else
	npx vitest run
endif

## Run unit tests with coverage
test-unit:
	npx vitest run --coverage

## Run unit tests in watch mode
test-unit-watch:
	npx vitest

## Run E2E tests against localhost (requires dev servers running)
test-e2e:
	npx playwright test

## Run E2E tests against dev.devtools.site
test-e2e-dev:
	TARGET=dev npx playwright test --project=dev

## Run all tests (unit + E2E)
test-all:
	npm run test:unit && npm run test:e2e

## Run ESLint for a specific tool (TOOL=ip-calculator required)
lint:
ifdef TOOL
	cd tools/$(TOOL) && npx eslint .
else
	@echo "Usage: make lint TOOL=<tool-name>"
	@echo "Example: make lint TOOL=ip-calculator"
endif

## Show available targets
help:
	@grep -E '^##' Makefile | sed 's/## //'
