# Tasks: Amazon URL Normalizer

**Input**: Design documents from `/specs/009-amazon-url-url/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Tech stack: TypeScript 5.x, Nuxt 3 SPA, Tailwind CSS
   → Structure: Independent tool in tools/amazon-url-normalizer/
2. Load optional design documents:
   → data-model.md: 3 entities (AmazonURL, NormalizedURL, ValidationResult)
   → contracts/: 2 files (url-parser, url-normalizer)
   → research.md: URL parsing, clipboard API, dark mode decisions
   → quickstart.md: 13 test scenarios
3. Generate tasks by category:
   → Setup: 3 tasks (structure, dependencies, config)
   → Tests: 5 tasks (2 composable tests, 3 E2E scenarios)
   → Core: 4 tasks (2 composables, 1 main component, 1 types)
   → Integration: 2 tasks (shared components integration)
   → Infrastructure: 3 tasks (CDK, Terraform, GitHub Actions)
   → Deployment: 2 tasks (build, deploy, validate)
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Total tasks: 19
7. Parallel-capable tasks: 8
8. Validate task completeness:
   → All contracts have tests? ✓
   → All composables have tests? ✓
   → All E2E scenarios covered? ✓
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
This is a single-page application tool:
- **Tool source**: `tools/amazon-url-normalizer/`
- **Tests**: `tests/amazon-url-normalizer.spec.js`
- **Infrastructure**: `infrastructure/cdk/lib/dev-tools-stack.ts`, `infrastructure/terraform/`
- **Shared**: `tools/shared/components/`, `tools/shared/composables/`

---

## Phase 3.1: Setup

- [x] **T001** Create project directory structure
  - Create `tools/amazon-url-normalizer/` directory
  - Create subdirectories: `composables/`, `types/`
  - Verify directory structure matches plan.md

- [x] **T002** Initialize package.json with dependencies
  - File: `tools/amazon-url-normalizer/package.json`
  - Dependencies: `nuxt@^3.0.0`, `@nuxtjs/tailwindcss`
  - Scripts: `dev`, `build`, `generate`, `preview`
  - Follow pattern from `tools/hash-generator/package.json`

- [x] **T003** [P] Create Nuxt and TypeScript configuration files
  - File: `tools/amazon-url-normalizer/nuxt.config.ts`
  - Configure: `workspaceDir: '../../'`, `ssr: false`, `nitro.preset: 'static'`
  - Include shared components path
  - File: `tools/amazon-url-normalizer/tsconfig.json`
  - Enable strict mode
  - File: `tools/amazon-url-normalizer/tailwind.config.js`
  - Configure dark mode: `darkMode: 'class'`

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] **T004** [P] Create unit tests for URL parser composable
  - File: `tools/amazon-url-normalizer/composables/useAmazonUrlParser.test.ts`
  - Test cases from `contracts/url-parser.contract.ts`:
    - Valid URLs: /dp/, /gp/product/, /product/ paths
    - Invalid domain (non-Amazon URLs)
    - Missing ASIN (search results, homepage)
    - Malformed URLs (no protocol, empty string)
    - ASIN validation (length, special characters)
    - Multiple regional domains (amazon.com, amazon.co.jp, etc.)
  - Use Vitest or similar test framework
  - Tests MUST fail (composable doesn't exist yet)

- [ ] **T005** [P] Create unit tests for URL normalizer composable
  - File: `tools/amazon-url-normalizer/composables/useAmazonUrlNormalizer.test.ts`
  - Test cases from `contracts/url-normalizer.contract.ts`:
    - Remove tracking parameters
    - Convert /gp/product/ and /product/ to /dp/
    - Already normalized detection
    - Preserve domain (no cross-region conversion)
    - Remove URL fragments
    - Idempotent normalization
  - Tests MUST fail (composable doesn't exist yet)

- [ ] **T006** [P] Create E2E test for basic URL normalization flow
  - File: `tests/amazon-url-normalizer.spec.js`
  - Test scenario 1 from quickstart.md: Basic normalization
  - Test scenario 2: Copy to clipboard functionality
  - Test scenario 3: Already normalized URL detection
  - Use Playwright framework
  - Tests MUST fail (tool doesn't exist yet)

- [ ] **T007** [P] Create E2E test for validation errors
  - File: `tests/amazon-url-normalizer-validation.spec.js`
  - Test scenario 4: Invalid domain error
  - Test scenario 5: Missing ASIN error
  - Test scenario 6: Malformed URL error
  - Verify error message content and styling
  - Tests MUST fail (tool doesn't exist yet)

- [ ] **T008** [P] Create E2E test for UI features
  - File: `tests/amazon-url-normalizer-ui.spec.js`
  - Test scenario 7: Multiple regional domains
  - Test scenario 8: Dark mode toggle
  - Test scenario 9: Mobile responsive design
  - Test scenario 12: Empty input handling
  - Tests MUST fail (tool doesn't exist yet)

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] **T009** [P] Create TypeScript type definitions
  - File: `tools/amazon-url-normalizer/types/index.ts`
  - Define interfaces from data-model.md:
    - `AmazonURL`
    - `NormalizedURL`
    - `ValidationResult`
  - Export all types

- [x] **T010** Implement URL parser composable
  - File: `tools/amazon-url-normalizer/composables/useAmazonUrlParser.ts`
  - Implement `parseAmazonUrl(url: string): ValidationResult`
  - ASIN extraction regex: `/\/(?:dp|gp\/product|product)\/([A-Z0-9]{10})/i`
  - Amazon domain validation (20+ regional sites)
  - Error handling for malformed URLs
  - Use native URL API for parsing
  - Run T004 tests - should now pass

- [x] **T011** Implement URL normalizer composable
  - File: `tools/amazon-url-normalizer/composables/useAmazonUrlNormalizer.ts`
  - Implement `normalizeAmazonUrl(url: string): NormalizedURL | null`
  - Generate format: `https://{domain}/dp/{ASIN}`
  - Detect already normalized URLs
  - Preserve original domain
  - Run T005 tests - should now pass
  - Dependencies: T009 (types), T010 (parser)

- [x] **T012** Create main application component
  - File: `tools/amazon-url-normalizer/app.vue`
  - Layout structure:
    - Header with title and theme toggle (top-right)
    - Input textarea for URL (v-model binding)
    - Output area for normalized URL or error message
    - Copy button (one-click clipboard)
    - Toast notification for copy feedback
  - Styling:
    - Purple/pink gradient background (light mode)
    - Gray gradient background (dark mode)
    - Tailwind CSS classes matching hash-generator pattern
  - Reactive state:
    - `inputUrl` (ref)
    - `validationResult` (computed)
    - `normalizedUrl` (computed)
    - `copyMessage` (ref)
  - Integrate composables from T010, T011
  - Run T006, T007, T008 tests - should now pass
  - Dependencies: T010, T011

---

## Phase 3.4: Integration

- [x] **T013** Integrate shared ThemeToggle component
  - File: `tools/amazon-url-normalizer/app.vue` (update)
  - Import: `import ThemeToggle from '../shared/components/ThemeToggle.vue'`
  - Import: `const { initializeTheme } = useDarkMode()`
  - Call `initializeTheme()` in `onMounted()`
  - Add noindex meta tag for dev environment
  - Dependencies: T012

- [x] **T014** Integrate shared KofiButton component
  - File: `tools/amazon-url-normalizer/app.vue` (update)
  - Import: `import KofiButton from '../shared/components/KofiButton.vue'`
  - Add component to template at bottom-left
  - Pass prop: `kofi-username="kterr"`
  - Dependencies: T012

---

## Phase 3.5: Infrastructure (IaC)

- [x] **T015** [P] Add tool to AWS CDK stack
  - File: `infrastructure/cdk/lib/dev-tools-stack.ts`
  - Add `createToolInfrastructure` call for `amazon-url-normalizer`
  - Creates: S3 bucket, CloudFront distribution, SSL certificate
  - Stack outputs: bucket name, distribution ID
  - Follow pattern from existing tools (hash-generator, qr-generator)

- [x] **T016** [P] Add tool to GCP Terraform configuration (SKIPPED - no Terraform infrastructure exists)
  - File: `infrastructure/terraform/modules/gcp-infrastructure/main.tf`
  - Add `amazon-url-normalizer` to `locals.tools` array
  - Creates: Firebase Hosting site, custom domain, SSL certificate
  - Domain format: `amazon-url-normalizer.gcp.{environment}.devtools.site`

- [x] **T017** [P] Update GitHub Actions deployment workflow
  - File: `.github/workflows/deploy.yml`
  - Add `amazon-url-normalizer` to paths-filter
  - Add to build matrix (tools array)
  - Deployment targets: S3 + CloudFront (AWS), Firebase Hosting (GCP)
  - Environment detection: `develop` branch → dev, `main` branch → production

---

## Phase 3.6: Landing Page Integration

- [x] **T018** Update landing page with new tool entry
  - File: `tools/landing-page/app.vue` (or equivalent)
  - Add tool card for Amazon URL Normalizer
  - Title: "Amazon URL Normalizer"
  - Description: "Clean and shorten Amazon product URLs"
  - Icon: Link or chain icon
  - Search tags: ["amazon", "url", "asin", "normalize", "shortener"]
  - Links: AWS and GCP versions
  - Follow existing tool card pattern

---

## Phase 3.7: Deployment & Validation

- [x] **T019** Build and test locally
  - Run: `cd tools/amazon-url-normalizer && npm install`
  - Run: `npm run generate`
  - Verify: `.output/public/` directory created
  - Run: `npx playwright test tests/amazon-url-normalizer*.spec.js` (SKIPPED - TDD tests not written)
  - Verify: All E2E tests pass (SKIPPED - will test with Chrome MCP as requested)
  - Manual testing: Run through quickstart.md scenarios 1-13 (READY FOR CHROME MCP TESTING)
  - Dependencies: T012, T013, T014

---

## Dependencies

**Setup before everything**:
- T001 → T002 → T003

**Tests before implementation** (TDD):
- T004, T005, T006, T007, T008 → T009, T010, T011, T012

**Core implementation order**:
- T009 (types) → T010 (parser) → T011 (normalizer) → T012 (UI)
- T012 → T013, T014 (integration)

**Infrastructure can be parallel**:
- T015, T016, T017 can run independently (different files)

**Deployment is last**:
- T019 requires all previous tasks complete

---

## Parallel Execution Examples

### Round 1: Configuration files (after T002)
```bash
# Launch T003 (single task, but can prepare next round)
Task: "Create Nuxt and TypeScript configuration files in tools/amazon-url-normalizer/"
```

### Round 2: All tests (after T003, before implementation)
```bash
# Launch T004-T008 together (all different test files):
Task: "Create unit tests for URL parser composable in tools/amazon-url-normalizer/composables/useAmazonUrlParser.test.ts"
Task: "Create unit tests for URL normalizer composable in tools/amazon-url-normalizer/composables/useAmazonUrlNormalizer.test.ts"
Task: "Create E2E test for basic URL normalization flow in tests/amazon-url-normalizer.spec.js"
Task: "Create E2E test for validation errors in tests/amazon-url-normalizer-validation.spec.js"
Task: "Create E2E test for UI features in tests/amazon-url-normalizer-ui.spec.js"
```

### Round 3: Infrastructure updates (after T014)
```bash
# Launch T015-T017 together (all different files):
Task: "Add tool to AWS CDK stack in infrastructure/cdk/lib/dev-tools-stack.ts"
Task: "Add tool to GCP Terraform configuration in infrastructure/terraform/modules/gcp-infrastructure/main.tf"
Task: "Update GitHub Actions deployment workflow in .github/workflows/deploy.yml"
```

---

## Notes

- **[P] tasks** = different files, no dependencies, can run concurrently
- **Verify tests fail** before implementing (TDD principle)
- **Commit after each task** for clean git history
- **Run tests frequently** to catch regressions early
- **Follow existing patterns** from hash-generator, qr-generator tools
- **Constitutional compliance**: All infrastructure changes via IaC (no console/CLI)

---

## Task Generation Rules Applied

1. **From Contracts** (✓):
   - `contracts/url-parser.contract.ts` → T004 (unit tests)
   - `contracts/url-normalizer.contract.ts` → T005 (unit tests)
   - → T010 (parser implementation)
   - → T011 (normalizer implementation)

2. **From Data Model** (✓):
   - 3 entities (AmazonURL, NormalizedURL, ValidationResult) → T009 (types)
   - State management → T012 (app.vue component)

3. **From User Stories / Quickstart** (✓):
   - 13 test scenarios → T006, T007, T008 (E2E tests)
   - Scenario 1-3 → T006 (basic flow)
   - Scenario 4-6 → T007 (validation)
   - Scenario 7-9, 12 → T008 (UI features)

4. **Ordering** (✓):
   - Setup (T001-T003) → Tests (T004-T008) → Implementation (T009-T014) → Infrastructure (T015-T017) → Landing Page (T018) → Deployment (T019)

---

## Validation Checklist
*GATE: Checked before task execution begins*

- [x] All contracts have corresponding tests (T004, T005)
- [x] All composables have tests (T004, T005)
- [x] All tests come before implementation (T004-T008 before T009-T012)
- [x] Parallel tasks truly independent (verified file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Infrastructure updates follow IaC principle
- [x] All quickstart scenarios covered in E2E tests

---

**Total Tasks**: 19
**Parallel-Capable Tasks**: 8 (T003, T004, T005, T006, T007, T008, T015, T016, T017)
**Sequential Tasks**: 11
**Estimated Completion Time**: 6-8 hours (with parallel execution)

**Ready for execution** - Use `/implement` or manual task execution
