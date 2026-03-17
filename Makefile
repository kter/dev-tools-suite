.PHONY: test test-unit test-unit-watch test-unit-coverage test-e2e test-e2e-dev test-all lint lint-tool format format-check check build deploy deploy-s3 deploy-invalidate help

ENV ?= dev
PARALLEL ?= 4

TOOLS := hash-generator qr-generator unix-time-converter password-generator ip-calculator \
         markdown-preview placeholder-generator ip-info timezone-converter string-converter \
         code-diff mic-test json-yaml-converter jwt-decoder regex-tester lorem-ipsum-generator \
         image-converter timer character-code-converter badger-image-generator poster-splitter \
         map-distance-calculator amazon-url-normalizer landing-page

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

## Format Biome-scope TS files in place
format:
	npx biome format --write tests/ tools/*/utils/ tools/shared/ vitest.config.ts playwright.config.ts

## Check formatting (non-destructive, exits 1 if changes needed)
format-check:
	npx biome format tests/ tools/*/utils/ tools/shared/ vitest.config.ts playwright.config.ts

## Run Biome + Oxlint on Biome-scope TS files
lint:
	npx biome lint --diagnostic-level=error tests/ tools/*/utils/ tools/shared/ vitest.config.ts playwright.config.ts
	npx oxlint tests/ tools/*/utils/ tools/shared/ vitest.config.ts playwright.config.ts

## Run ESLint for a specific tool (TOOL=ip-calculator required)
lint-tool:
ifdef TOOL
	cd tools/$(TOOL) && npx eslint .
else
	@echo "Usage: make lint-tool TOOL=<tool-name>"
endif

## Format + lint + import organize in one pass
check:
	npx biome check --write tests/ tools/*/utils/ tools/shared/ vitest.config.ts playwright.config.ts

## Build a specific tool (TOOL=<tool-name> required)
build:
ifndef TOOL
	@echo "Usage: make build TOOL=<tool-name>"
	@exit 1
endif
	cd tools/$(TOOL) && npm ci && npm run generate

## Sync built output to S3 (TOOL=<tool-name> required, ENV=dev|prd default=dev)
deploy-s3:
ifndef TOOL
	@echo "Usage: make deploy-s3 TOOL=<tool-name> [ENV=dev]"
	@exit 1
endif
	@STACK_NAME="DevToolsStack-$(ENV)"; \
	TOOL_KEY=$$(echo "$(TOOL)" | tr -d '-'); \
	BUCKET_NAME=$$(aws --profile "$(ENV)" \
          cloudformation describe-stacks \
	  --stack-name "$$STACK_NAME" \
	  --query "Stacks[0].Outputs[?OutputKey=='$${TOOL_KEY}bucketname'].OutputValue" \
	  --output text); \
	echo "Syncing to s3://$$BUCKET_NAME/"; \
	aws --profile "$(ENV)" s3 sync tools/$(TOOL)/.output/public/ s3://$$BUCKET_NAME/ --delete

## Invalidate CloudFront cache (TOOL=<tool-name> required, ENV=dev|prd default=dev)
deploy-invalidate:
ifndef TOOL
	@echo "Usage: make deploy-invalidate TOOL=<tool-name> [ENV=dev]"
	@exit 1
endif
	@STACK_NAME="DevToolsStack-$(ENV)"; \
	TOOL_KEY=$$(echo "$(TOOL)" | tr -d '-'); \
	DISTRIBUTION_ID=$$(aws --profile "$(ENV)" \
          cloudformation describe-stacks \
	  --stack-name "$$STACK_NAME" \
	  --query "Stacks[0].Outputs[?OutputKey=='$${TOOL_KEY}distributionid'].OutputValue" \
	  --output text); \
	echo "Invalidating CloudFront distribution $$DISTRIBUTION_ID"; \
	PAGER=cat aws --profile "$(ENV)" \
          cloudfront create-invalidation \
	  --distribution-id "$$DISTRIBUTION_ID" \
	  --paths "/*"

## Full deploy: build + S3 sync + CloudFront invalidation (TOOL=<tool> for single tool, omit for all tools, ENV=dev|prd default=dev, PARALLEL=N default=4)
deploy:
ifdef TOOL
	$(MAKE) build TOOL=$(TOOL) ENV=$(ENV)
	$(MAKE) deploy-s3 TOOL=$(TOOL) ENV=$(ENV)
	$(MAKE) deploy-invalidate TOOL=$(TOOL) ENV=$(ENV)
else
	@printf '%s\n' $(TOOLS) | xargs -P $(PARALLEL) -I{} $(MAKE) deploy TOOL={} ENV=$(ENV)
endif

## Show available targets
help:
	@grep -E '^##' Makefile | sed 's/## //'
