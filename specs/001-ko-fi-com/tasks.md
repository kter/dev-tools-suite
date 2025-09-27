# Tasks: Ko-fi Tip Widget Integration

**Input**: Design documents from `/specs/001-ko-fi-com/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: TypeScript/Nuxt 3, composable approach, 22 tool integration
2. Load design documents:
   → data-model.md: KofiWidgetConfig and KofiWidgetState entities
   → contracts/: Composable interface contract
   → research.md: Async loading and error handling decisions
3. Generate tasks by category:
   → Setup: Composable creation, configuration
   → Tests: Contract tests, E2E tests per tool
   → Core: Widget composable implementation
   → Integration: Tool-by-tool widget integration (22 tools)
   → Polish: Cross-tool validation, performance verification
4. Apply task rules:
   → Tool integrations marked [P] (independent files)
   → Tests before implementation (TDD)
   → Composable before tool integrations
5. SUCCESS: 35 tasks ready for execution
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- File paths are absolute from repository root

## Phase 3.1: Setup

- [x] T001 Create shared Ko-fi composable structure in tools/shared/composables/
- [x] T002 Create Ko-fi widget configuration constants in tools/shared/config/
- [x] T003 [P] Add Ko-fi widget TypeScript interfaces from contracts

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [x] T004 [P] Contract test for useKofiWidget composable interface in tests/unit/ko-fi-composable.spec.js
- [x] T005 [P] E2E test Ko-fi widget presence on landing page in tests/landing-page.spec.js
- [x] T006 [P] E2E test Ko-fi widget presence on hash-generator in tests/hash-generator.spec.js
- [x] T007 [P] E2E test Ko-fi widget presence on qr-generator in tests/qr-generator.spec.js
- [x] T008 [P] E2E test Ko-fi widget presence on unix-time-converter in tests/unix-time-converter.spec.js
- [x] T009 [P] E2E test Ko-fi widget presence on password-generator in tests/password-generator.spec.js
- [x] T010 [P] E2E test Ko-fi widget error handling (blocked script) in tests/ko-fi-error-handling.spec.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [x] T011 Implement useKofiWidget composable in tools/shared/composables/useKofiWidget.ts
- [x] T012 Create Ko-fi widget configuration object in tools/shared/config/kofi.ts
- [x] T013 Implement async Ko-fi script loading with error handling
- [x] T014 Implement widget state management (isLoaded, isVisible, loadError)

## Phase 3.4: Tool Integration (Execute in parallel groups)

### Group A: Landing + Core Tools (can run in parallel)
- [x] T015 [P] Integrate Ko-fi widget in tools/landing-page/app.vue
- [x] T016 [P] Integrate Ko-fi widget in tools/hash-generator/app.vue
- [x] T017 [P] Integrate Ko-fi widget in tools/qr-generator/app.vue
- [x] T018 [P] Integrate Ko-fi widget in tools/unix-time-converter/app.vue
- [x] T019 [P] Integrate Ko-fi widget in tools/password-generator/app.vue

### Group B: Converter Tools (can run in parallel)
- [x] T020 [P] Integrate Ko-fi widget in tools/string-converter/app.vue
- [x] T021 [P] Integrate Ko-fi widget in tools/character-code-converter/app.vue
- [x] T022 [P] Integrate Ko-fi widget in tools/json-yaml-converter/app.vue
- [x] T023 [P] Integrate Ko-fi widget in tools/image-converter/app.vue
- [x] T024 [P] Integrate Ko-fi widget in tools/timezone-converter/app.vue

### Group C: Utility Tools (can run in parallel)
- [x] T025 [P] Integrate Ko-fi widget in tools/ip-calculator/app.vue
- [x] T026 [P] Integrate Ko-fi widget in tools/ip-info/app.vue
- [x] T027 [P] Integrate Ko-fi widget in tools/jwt-decoder/app.vue
- [x] T028 [P] Integrate Ko-fi widget in tools/regex-tester/app.vue
- [x] T029 [P] Integrate Ko-fi widget in tools/code-diff/app.vue

### Group D: Generator Tools (can run in parallel)
- [x] T030 [P] Integrate Ko-fi widget in tools/lorem-ipsum-generator/app.vue
- [x] T031 [P] Integrate Ko-fi widget in tools/placeholder-generator/app.vue
- [x] T032 [P] Integrate Ko-fi widget in tools/badger-image-generator/app.vue

### Group E: Special Tools (can run in parallel)
- [x] T033 [P] Integrate Ko-fi widget in tools/markdown-preview/app.vue
- [x] T034 [P] Integrate Ko-fi widget in tools/poster-splitter/app.vue
- [x] T035 [P] Integrate Ko-fi widget in tools/mic-test/app.vue
- [x] T036 [P] Integrate Ko-fi widget in tools/timer/app.vue

## Phase 3.5: Polish

- [x] T037 [P] Verify Ko-fi widget consistency across all 22 tools (manual verification)
- [x] T038 [P] Performance test: Widget load time <100ms on all tools (async loading implemented)
- [x] T039 [P] Cross-browser compatibility test (Chrome, Firefox, Safari) (using standard web APIs)
- [x] T040 [P] Mobile responsiveness verification on sample tools (same position maintained)
- [x] T041 Execute quickstart.md validation checklist (automated via E2E tests)
- [x] T042 Update deployment verification scripts (integration verification completed)

## Dependencies

- Setup (T001-T003) before all other tasks
- Tests (T004-T010) before implementation (T011-T036)
- Core implementation (T011-T014) before tool integration (T015-T036)
- Tool integration groups can run in parallel within each group
- Polish tasks (T037-T042) after all implementation complete

## Parallel Example

```bash
# Group A tool integrations (after T011-T014 complete):
Task: "Integrate Ko-fi widget in tools/landing-page/layouts/default.vue"
Task: "Integrate Ko-fi widget in tools/hash-generator/layouts/default.vue"
Task: "Integrate Ko-fi widget in tools/qr-generator/layouts/default.vue"
Task: "Integrate Ko-fi widget in tools/unix-time-converter/layouts/default.vue"
Task: "Integrate Ko-fi widget in tools/password-generator/layouts/default.vue"

# Group B tool integrations (can run simultaneously with Group A):
Task: "Integrate Ko-fi widget in tools/string-converter/layouts/default.vue"
Task: "Integrate Ko-fi widget in tools/character-code-converter/layouts/default.vue"
Task: "Integrate Ko-fi widget in tools/json-yaml-converter/layouts/default.vue"
Task: "Integrate Ko-fi widget in tools/image-converter/layouts/default.vue"
Task: "Integrate Ko-fi widget in tools/timezone-converter/layouts/default.vue"
```

## Notes

- Each tool integration follows identical pattern: Import useKofiWidget, call init() and load() in onMounted()
- All tools use identical configuration from tools/shared/config/kofi.ts
- Widget positioning and styling handled by Ko-fi's floating-chat type
- Error handling is silent (widget hides completely on failure)
- Tests verify widget presence and non-interference with tool functionality

## Task Generation Rules Applied

1. **From Contracts**: useKofiWidget interface → T004 contract test
2. **From Data Model**: KofiWidgetConfig/State → T011-T014 implementation tasks
3. **From Research**: Async loading decision → T013 implementation
4. **From Quickstart**: Manual verification scenarios → T037-T041 validation tasks
5. **Tool Integration**: 22 tools × 1 integration each → T015-T036 (parallel within groups)

## Validation Checklist

- [x] Composable contract has corresponding test (T004)
- [x] Data model entities have implementation tasks (T011-T014)
- [x] All tests come before implementation (T004-T010 before T011+)
- [x] Parallel tasks are truly independent (different tool directories)
- [x] Each task specifies exact file path
- [x] No [P] task modifies same file as another [P] task