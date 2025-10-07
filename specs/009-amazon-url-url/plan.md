
# Implementation Plan: Amazon URL Normalizer

**Branch**: `009-amazon-url-url` | **Date**: 2025-10-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-amazon-url-url/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → Feature spec loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type: Single-page web application (Nuxt 3 SPA)
   → Set Structure Decision: Independent tool following existing pattern
3. Fill the Constitution Check section based on constitution
   → All constitutional principles satisfied
4. Evaluate Constitution Check section below
   → No violations detected
   → Update Progress Tracking: Initial Constitution Check ✓
5. Execute Phase 0 → research.md
   → Generate research on URL parsing patterns and validation
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → Generate API contracts, data models, and agent context
7. Re-evaluate Constitution Check section
   → No new violations introduced
   → Update Progress Tracking: Post-Design Constitution Check ✓
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Amazon URL Normalizer is a developer utility tool that cleans and shortens Amazon product URLs by extracting the ASIN (Amazon Standard Identification Number) and removing unnecessary tracking parameters, query strings, and path segments. The tool provides a simple interface to paste long Amazon URLs and receive the minimal valid format (https://[domain]/dp/[ASIN]), with one-click copy functionality and validation for invalid URLs. The tool follows the existing DevTools Suite architecture pattern using Nuxt 3 SPA with TypeScript, Tailwind CSS, dark mode support, and Ko-fi integration.

## Technical Context
**Language/Version**: TypeScript 5.x (strict mode), Node.js 20+ LTS
**Primary Dependencies**: Nuxt 3 (SPA mode), @nuxtjs/tailwindcss, shared components (ThemeToggle, KofiButton)
**Storage**: N/A (client-side only, no persistence)
**Testing**: Playwright E2E tests (browser-based testing)
**Target Platform**: Static web application (CloudFront + S3 on AWS, Firebase Hosting on GCP)
**Project Type**: Single-page application (independent tool in tools/ directory)
**Performance Goals**: <100ms URL normalization, <50ms clipboard copy operation
**Constraints**: Client-side only (no backend API), must work offline after initial load, responsive design for mobile devices
**Scale/Scope**: Single tool with 1 input field, 1 output field, copy button, validation messages

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Infrastructure as Code (NON-NEGOTIABLE)
- **Status**: PASS
- **Evidence**: Tool will be added to AWS CDK stack (infrastructure/cdk/lib/dev-tools-stack.ts) and Terraform config (infrastructure/terraform/modules/gcp-infrastructure/main.tf)
- **Action**: Infrastructure changes will be made through IaC, not console/CLI

### ✅ II. Multi-Cloud Resilience
- **Status**: PASS
- **Evidence**: Tool will be deployed to both AWS (CloudFront + S3) and GCP (Firebase Hosting) simultaneously via GitHub Actions workflow
- **Action**: Update both CDK and Terraform configurations, add to landing page with cross-platform links

### ✅ III. Security-First Development
- **Status**: PASS
- **Evidence**: No secrets required (client-side only), no user data persistence, input validation for URL parsing
- **Action**: Implement comprehensive error handling for URL validation

### ✅ IV. Independent Tool Architecture
- **Status**: PASS
- **Evidence**: Tool follows existing pattern with own package.json, independent dependencies, builds separately
- **Action**: Create tools/amazon-url-normalizer/ with isolated build process

### ✅ V. Test Coverage Requirements
- **Status**: PASS (pending implementation)
- **Evidence**: Playwright E2E tests will be created following existing pattern
- **Action**: Create tests/amazon-url-normalizer.spec.js with validation scenarios

### ✅ VI. Observability and Debugging
- **Status**: PASS
- **Evidence**: Clear error messages for invalid URLs, type definitions for URL parsing logic
- **Action**: Implement descriptive error states and logging for debugging

### ✅ VII. Simplicity and Maintainability
- **Status**: PASS
- **Evidence**: Simple client-side URL parsing, follows existing tool patterns, no complex state management
- **Action**: Use regex patterns for ASIN extraction, maintain consistency with existing tools

## Project Structure

### Documentation (this feature)
```
specs/009-amazon-url-url/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
tools/amazon-url-normalizer/
├── app.vue              # Main component (UI + logic)
├── nuxt.config.ts       # Nuxt 3 configuration
├── package.json         # Dependencies (isolated)
├── tailwind.config.js   # Tailwind configuration
├── tsconfig.json        # TypeScript configuration
└── .output/public/      # Build output directory

tools/shared/
├── components/
│   ├── ThemeToggle.vue  # Dark mode toggle (existing)
│   └── KofiButton.vue   # Ko-fi support button (existing)
└── composables/
    └── useDarkMode.ts   # Dark mode composable (existing)

tests/
└── amazon-url-normalizer.spec.js  # Playwright E2E tests

infrastructure/
├── cdk/
│   └── lib/dev-tools-stack.ts     # AWS CDK stack (add tool)
└── terraform/
    └── modules/gcp-infrastructure/
        └── main.tf                 # GCP Terraform (add tool)

.github/workflows/
└── deploy.yml                      # CI/CD workflow (add tool)
```

**Structure Decision**: Single-page application following the established pattern in tools/. The tool is self-contained with its own package.json and dependencies, builds independently via `npm run generate`, and deploys to both AWS and GCP through the matrix-based GitHub Actions workflow.

## Phase 0: Outline & Research

### Research Tasks
1. **Amazon URL Format Patterns**:
   - Decision: Use regex to extract ASIN from common Amazon URL formats
   - Patterns: /dp/{ASIN}, /gp/product/{ASIN}, /product/{ASIN}, /ASIN/
   - ASIN format: 10 characters (alphanumeric, uppercase)

2. **URL Validation Strategy**:
   - Decision: Validate Amazon domain first, then extract ASIN
   - Supported domains: amazon.com, amazon.co.jp, amazon.co.uk, amazon.de, amazon.fr, amazon.it, amazon.es, amazon.ca, etc.
   - Preserve original domain (no cross-region conversion)

3. **Client-Side URL Parsing**:
   - Decision: Use native JavaScript URL API + regex for parsing
   - No external dependencies needed for URL parsing
   - Handle malformed URLs with try-catch and clear error messages

4. **Copy to Clipboard Implementation**:
   - Decision: Use Clipboard API (navigator.clipboard.writeText)
   - Fallback for older browsers: document.execCommand('copy')
   - Visual feedback: Toast notification (2-second display)

5. **Dark Mode and Theming**:
   - Decision: Reuse existing useDarkMode composable and ThemeToggle component
   - Follow existing color scheme (purple/pink gradient theme)
   - Consistent with hash-generator and other tools

**Output**: research.md generated

## Phase 1: Design & Contracts

### 1. Data Model (data-model.md)
**Entities**:
- **AmazonURL**: Input URL string (can be long with tracking parameters)
  - Fields: rawUrl (string), domain (string), asin (string | null), isValid (boolean)
  - Validation: Must contain valid Amazon domain, must contain valid ASIN pattern

- **NormalizedURL**: Output URL string (shortest valid format)
  - Fields: normalizedUrl (string), domain (string), asin (string)
  - Format: `https://{domain}/dp/{asin}`

- **ValidationResult**: Result of URL validation
  - Fields: isValid (boolean), errorMessage (string | null), asin (string | null)
  - States: valid (ASIN extracted), invalid-domain (not Amazon), invalid-asin (no ASIN found), malformed (parsing error)

### 2. API Contracts (contracts/)
**Client-Side Functions** (no REST API, pure TypeScript functions):

```typescript
// contracts/url-parser.contract.ts
interface ParseAmazonUrlContract {
  input: { url: string }
  output: {
    isValid: boolean
    asin: string | null
    domain: string | null
    errorMessage: string | null
  }
  examples: [
    {
      input: "https://www.amazon.co.jp/dp/B0ABCDEF/ref=sr_1_1?keywords=example",
      output: { isValid: true, asin: "B0ABCDEF", domain: "amazon.co.jp", errorMessage: null }
    },
    {
      input: "https://example.com/product",
      output: { isValid: false, asin: null, domain: null, errorMessage: "Not a valid Amazon URL" }
    }
  ]
}

interface NormalizeAmazonUrlContract {
  input: { url: string }
  output: { normalizedUrl: string }
  precondition: "URL must be valid Amazon product URL"
  examples: [
    {
      input: "https://www.amazon.co.jp/dp/B0ABCDEF/ref=sr_1_1?keywords=example",
      output: { normalizedUrl: "https://www.amazon.co.jp/dp/B0ABCDEF" }
    }
  ]
}
```

### 3. Contract Tests (tests/contracts/)
Contract tests will validate URL parsing logic:
- Test ASIN extraction from various URL formats
- Test domain preservation across regional sites
- Test error handling for invalid URLs
- Test edge cases (malformed URLs, missing ASIN, etc.)

### 4. Integration Test Scenarios (from user stories)
From acceptance scenarios in spec.md:
- Scenario 1: Long URL → Normalized short URL
- Scenario 2: Copy button → Clipboard + success message
- Scenario 3: Already normalized URL → Confirmation message
- Scenario 4: Non-Amazon URL → Error message
- Scenario 5: Search URL (no ASIN) → Error message

### 5. Update Agent Context File
Run update script to add Amazon URL Normalizer context to CLAUDE.md:
- Tool name and purpose
- Key technologies (Nuxt 3, TypeScript, Tailwind)
- File locations
- Testing approach

**Output**: data-model.md, /contracts/*, quickstart.md, CLAUDE.md updated

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. **Setup Tasks**:
   - Create tool directory structure (tools/amazon-url-normalizer/)
   - Initialize package.json with dependencies
   - Create nuxt.config.ts, tailwind.config.js, tsconfig.json

2. **Core Logic Tasks** (TDD order):
   - Write URL parser contract tests [P]
   - Implement parseAmazonUrl composable
   - Write normalize URL contract tests [P]
   - Implement normalizeAmazonUrl function
   - Write validation logic tests [P]
   - Implement URL validation composable

3. **UI Component Tasks**:
   - Create app.vue with layout structure [P]
   - Implement URL input field
   - Implement normalized URL display area
   - Implement copy button with clipboard API
   - Implement error message display
   - Integrate ThemeToggle component
   - Integrate KofiButton component

4. **E2E Test Tasks**:
   - Write Playwright test for URL normalization flow
   - Write Playwright test for copy functionality
   - Write Playwright test for validation errors
   - Write Playwright test for dark mode toggle

5. **Infrastructure Tasks**:
   - Add tool to AWS CDK stack (dev-tools-stack.ts)
   - Add tool to Terraform config (main.tf)
   - Update GitHub Actions workflow (deploy.yml)
   - Update landing page with new tool entry

6. **Deployment & Validation**:
   - Build tool locally (npm run generate)
   - Run E2E tests (npx playwright test)
   - Deploy to dev environment
   - Test with Chrome DevTools MCP
   - Deploy to production

**Ordering Strategy**:
- Tests before implementation (TDD)
- Core logic before UI
- UI components before E2E tests
- Infrastructure updates before deployment
- Mark [P] for parallel execution (independent tasks)

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

No constitutional violations detected. Implementation follows established patterns.

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command) - 19 tasks created
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (N/A - no violations)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*
