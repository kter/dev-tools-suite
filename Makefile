.PHONY: test test-unit test-unit-watch test-unit-coverage test-e2e test-e2e-dev test-all lint lint-tool format format-check check build deploy deploy-s3 deploy-invalidate setup clean-deps disk help

ENV ?= dev
PARALLEL ?= 4
AWS = aws --profile "$(ENV)"

TOOLS := hash-generator qr-generator unix-time-converter password-generator ip-calculator \
         markdown-preview placeholder-generator ip-info timezone-converter string-converter \
         code-diff mic-test json-yaml-converter jwt-decoder regex-tester lorem-ipsum-generator \
         image-converter timer character-code-converter badger-image-generator poster-splitter \
         map-distance-calculator amazon-url-normalizer landing-page

# Default target
.DEFAULT_GOAL := test

BUN ?= bun

## Run unit tests (TOOL=ip-calculator to filter)
test:
ifdef TOOL
	$(BUN) run vitest run --reporter=verbose $(TOOL)
else
	$(BUN) run test:unit
endif

## Run unit tests with coverage
test-unit:
	$(BUN) run test:unit:coverage

## Run unit tests in watch mode
test-unit-watch:
	$(BUN) run test:unit:watch

## Run E2E tests against localhost (requires dev servers running)
test-e2e:
	$(BUN) run test:e2e

## Run E2E tests against dev.devtools.site
test-e2e-dev:
	TARGET=dev $(BUN) run playwright test --project=dev

## Run all tests (unit + E2E)
test-all:
	$(BUN) run test:all

## Format Biome-scope TS files in place
format:
	$(BUN) run format

## Check formatting (non-destructive, exits 1 if changes needed)
format-check:
	$(BUN) run format:check

## Run Biome + Oxlint on Biome-scope TS files
lint:
	$(BUN) run lint

## Run ESLint for a specific tool (TOOL=ip-calculator required)
lint-tool:
ifdef TOOL
	cd tools/$(TOOL) && $(BUN) run lint
else
	@echo "Usage: make lint-tool TOOL=<tool-name>"
endif

## Format + lint + import organize in one pass
check:
	$(BUN) run check

## Build a specific tool (TOOL=<tool-name> required)
build:
ifndef TOOL
	@echo "Usage: make build TOOL=<tool-name>"
	@exit 1
endif
	cd tools/$(TOOL) && $(BUN) install --frozen-lockfile && $(BUN) run generate

## Sync built output to S3 (TOOL=<tool-name> required, ENV=dev|prd default=dev)
deploy-s3:
ifndef TOOL
	@echo "Usage: make deploy-s3 TOOL=<tool-name> [ENV=dev]"
	@exit 1
endif
	@STACK_NAME="DevToolsStack-$(ENV)"; \
	TOOL_KEY=$$(echo "$(TOOL)" | tr -d '-'); \
	BUCKET_NAME=$$($(AWS) cloudformation describe-stacks \
	  --stack-name "$$STACK_NAME" \
	  --query "Stacks[0].Outputs[?OutputKey=='$${TOOL_KEY}bucketname'].OutputValue" \
	  --output text); \
	echo "Syncing to s3://$$BUCKET_NAME/"; \
	$(AWS) s3 sync tools/$(TOOL)/.output/public/ s3://$$BUCKET_NAME/ --delete

## Invalidate CloudFront cache (TOOL=<tool-name> required, ENV=dev|prd default=dev)
deploy-invalidate:
ifndef TOOL
	@echo "Usage: make deploy-invalidate TOOL=<tool-name> [ENV=dev]"
	@exit 1
endif
	@STACK_NAME="DevToolsStack-$(ENV)"; \
	TOOL_KEY=$$(echo "$(TOOL)" | tr -d '-'); \
	DISTRIBUTION_ID=$$($(AWS) cloudformation describe-stacks \
	  --stack-name "$$STACK_NAME" \
	  --query "Stacks[0].Outputs[?OutputKey=='$${TOOL_KEY}distributionid'].OutputValue" \
	  --output text); \
	echo "Invalidating CloudFront distribution $$DISTRIBUTION_ID"; \
	$(AWS) cloudfront create-invalidation \
	  --distribution-id "$$DISTRIBUTION_ID" \
	  --paths "/*" \
	  --no-paginate

## Full deploy: build + S3 sync + CloudFront invalidation (TOOL=<tool> for single tool, omit for all tools, ENV=dev|prd default=dev, PARALLEL=N default=4)
deploy:
ifdef TOOL
	$(MAKE) build TOOL=$(TOOL) ENV=$(ENV)
	$(MAKE) deploy-s3 TOOL=$(TOOL) ENV=$(ENV)
	$(MAKE) deploy-invalidate TOOL=$(TOOL) ENV=$(ENV)
else
	@printf '%s\n' $(TOOLS) | xargs -P $(PARALLEL) -I{} $(MAKE) deploy TOOL={} ENV=$(ENV)
endif

## Install deps for a tool after clean-deps (TOOL=<tool-name> required)
setup:
ifndef TOOL
	@echo "Usage: make setup TOOL=<tool-name>"
	@exit 1
endif
	cd tools/$(TOOL) && $(BUN) install --frozen-lockfile
	@mkdir -p tools/$(TOOL)/.nuxt
	@test -f tools/$(TOOL)/.nuxt/tsconfig.json || echo '{"compilerOptions":{}}' > tools/$(TOOL)/.nuxt/tsconfig.json

## Remove every tools/*/node_modules to reclaim disk (root and CDK deps are kept)
clean-deps:
	@du -sch tools/*/node_modules 2>/dev/null | tail -1 || true
	rm -rf tools/*/node_modules
	@echo "Reinstall with: make setup TOOL=<tool-name>"

## Show disk usage breakdown for this repository
disk:
	@du -sh . 2>/dev/null
	@du -sch tools/*/node_modules node_modules infrastructure/cdk/node_modules 2>/dev/null | tail -1 | sed 's/total/total (node_modules)/'
	@du -sch tools/*/.nuxt tools/*/.output tools/*/dist 2>/dev/null | tail -1 | sed 's/total/total (build artifacts)/'

## Show available targets
help:
	@grep -E '^##' Makefile | sed 's/## //'
