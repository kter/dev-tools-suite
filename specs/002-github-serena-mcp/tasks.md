# Tasks: GitHub-style Tool Search with Keyboard Shortcut

**Input**: Design documents from `/specs/002-github-serena-mcp/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Flow Summary
This implementation adds GitHub-style search functionality to the dev tools landing page using:
- **Tech Stack**: TypeScript, Nuxt 3 (SPA mode), Vue.js, Tailwind CSS
- **Architecture**: Vue composables with Teleport overlay, debounced real-time filtering
- **Testing**: Playwright E2E tests covering all acceptance scenarios
- **Structure**: Components in `tools/landing-page/`, E2E tests in `tests/`

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- File paths relative to repository root

## Phase 3.1: Setup & Type Definitions

- [x] **T001** [P] Create Tool interface in `tools/landing-page/types/tool.ts` with TypeScript definitions for id, name, description, url, icon?, tags?
- [x] **T002** [P] Create SearchState interface in `tools/landing-page/types/search.ts` for isOpen, query, selectedIndex, results properties
- [x] **T003** [P] Create component prop interfaces in `tools/landing-page/types/components.ts` from contracts (ToolSearchProps, ToolSearchEmits, ToolGridProps)

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (from contracts/component-tests.spec.ts)
- [x] **T004** [P] Create Tool interface validation test in `tools/landing-page/tests/tool.test.ts` - validates Tool schema and rejects invalid objects
- [x] **T005** [P] Create search filtering contract test in `tools/landing-page/tests/search-logic.test.ts` - tests filterTools function against name, description, tags
- [x] **T006** [P] Create keyboard navigation contract test in `tools/landing-page/tests/keyboard-nav.test.ts` - tests arrow key selection and bounds checking

### E2E Tests (from quickstart.md scenarios)
- [x] **T007** [P] E2E test for search activation in `tests/tool-search-activation.spec.js` - press '/' key, verify overlay appears and input focused
- [x] **T008** [P] E2E test for real-time filtering in `tests/tool-search-filtering.spec.js` - type "password", verify filtering works in real-time
- [x] **T009** [P] E2E test for clear/escape behavior in `tests/tool-search-clear.spec.js` - clear input and press Escape, verify all tools reappear
- [x] **T010** [P] E2E test for no results state in `tests/tool-search-no-results.spec.js` - type "nonexistent", verify empty space displayed
- [x] **T011** [P] E2E test for modal closing in `tests/tool-search-close.spec.js` - click outside and Escape key, verify modal closes
- [x] **T012** [P] E2E test for tool navigation in `tests/tool-search-navigation.spec.js` - click tool from results, verify navigation works

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Composables (from data-model.md component flow)
- [ ] **T013** [P] Create useToolSearch composable in `tools/landing-page/composables/useToolSearch.ts` - implements search logic with debounced filtering, case-insensitive matching
- [ ] **T014** [P] Create useSearchModal composable in `tools/landing-page/composables/useSearchModal.ts` - manages modal open/close state, focus handling
- [ ] **T015** [P] Create useKeyboardNavigation composable in `tools/landing-page/composables/useKeyboardNavigation.ts` - handles arrow key selection, bounds checking

### Components (from contracts/tool-search-api.ts)
- [ ] **T016** Create ToolSearch overlay component in `tools/landing-page/components/ToolSearch.vue` - implements fixed overlay with Teleport, search input, keyboard shortcuts
- [ ] **T017** Enhance ToolGrid component in `tools/landing-page/components/ToolGrid.vue` - add filtering support, show/hide tools based on search results
- [ ] **T018** Update landing page in `tools/landing-page/pages/index.vue` - integrate search modal, add keyboard event handling, tool data provider

## Phase 3.4: Integration & Accessibility

- [ ] **T019** Add global keyboard shortcuts in `tools/landing-page/plugins/keyboard.client.ts` - implement defineShortcuts for '/' and Escape keys
- [ ] **T020** Implement ARIA compliance in ToolSearch component - add combobox pattern, live regions, proper roles and labels
- [ ] **T021** Add click-outside detection in ToolSearch component - close modal when clicking backdrop
- [ ] **T022** Implement focus management - trap focus in modal, return focus on close

## Phase 3.5: Polish & Performance

- [ ] **T023** [P] Add unit tests for search composables in `tools/landing-page/tests/composables/` - test edge cases, debouncing, state management
- [ ] **T024** [P] Performance optimization for search filtering - verify <50ms response time target from research.md
- [ ] **T025** [P] Add accessibility tests in `tests/tool-search-accessibility.spec.js` - screen reader compatibility, keyboard-only navigation
- [ ] **T026** [P] Cross-browser testing validation - test in Chrome, Firefox, Safari, Edge per quickstart.md requirements
- [ ] **T027** Bundle size analysis - verify <5KB increase per performance goals in plan.md
- [ ] **T028** Run complete quickstart.md validation scenarios - all acceptance criteria must pass

## Dependencies

**Critical Dependencies**:
- **T001-T003** (Type definitions) → **T004-T006** (Contract tests) → **T013-T015** (Composables)
- **T007-T012** (E2E tests) → **T016-T018** (Components) → **T019-T022** (Integration)
- **T013-T015** (Composables) → **T016** (ToolSearch component)
- **T016** (ToolSearch) → **T017** (ToolGrid) → **T018** (Landing page integration)
- **T016-T018** (Core components) → **T019-T022** (Integration)
- **All implementation** → **T023-T028** (Polish)

**Blocking Relationships**:
- T016 blocks T017 (ToolSearch must exist before ToolGrid integration)
- T017 blocks T018 (ToolGrid enhancement before landing page integration)
- T018 blocks T019-T022 (Landing page integration before global features)

## Parallel Execution Examples

### Phase 3.1 (All files independent):
```bash
# Run T001-T003 in parallel:
Task: "Create Tool interface in tools/landing-page/types/tool.ts"
Task: "Create SearchState interface in tools/landing-page/types/search.ts"
Task: "Create component interfaces in tools/landing-page/types/components.ts"
```

### Phase 3.2 Tests (All independent test files):
```bash
# Run T004-T012 in parallel:
Task: "Tool interface validation test in tools/landing-page/tests/tool.test.ts"
Task: "Search filtering test in tools/landing-page/tests/search-logic.test.ts"
Task: "Keyboard navigation test in tools/landing-page/tests/keyboard-nav.test.ts"
Task: "E2E search activation test in tests/tool-search-activation.spec.js"
Task: "E2E filtering test in tests/tool-search-filtering.spec.js"
Task: "E2E clear behavior test in tests/tool-search-clear.spec.js"
Task: "E2E no results test in tests/tool-search-no-results.spec.js"
Task: "E2E modal closing test in tests/tool-search-close.spec.js"
Task: "E2E tool navigation test in tests/tool-search-navigation.spec.js"
```

### Phase 3.3 Composables (Independent files):
```bash
# Run T013-T015 in parallel:
Task: "useToolSearch composable in tools/landing-page/composables/useToolSearch.ts"
Task: "useSearchModal composable in tools/landing-page/composables/useSearchModal.ts"
Task: "useKeyboardNavigation composable in tools/landing-page/composables/useKeyboardNavigation.ts"
```

### Phase 3.5 Polish (Independent validations):
```bash
# Run T023-T027 in parallel:
Task: "Unit tests for composables in tools/landing-page/tests/composables/"
Task: "Performance optimization validation"
Task: "Accessibility tests in tests/tool-search-accessibility.spec.js"
Task: "Cross-browser testing validation"
Task: "Bundle size analysis"
```

## Notes

- **TDD Approach**: All tests (T004-T012) must be written and failing before any implementation (T013+)
- **File Isolation**: [P] tasks operate on different files and can run simultaneously
- **Constitutional Compliance**: Playwright E2E tests required, no infrastructure changes, maintains independent tool architecture
- **Performance Targets**: <50ms search response, <5KB bundle increase, real-time filtering
- **Accessibility**: Full ARIA compliance with screen reader and keyboard-only navigation support

## Validation Checklist

**Before marking complete**:
- [ ] All 6 quickstart scenarios have corresponding E2E tests (T007-T012)
- [ ] All 3 main entities have implementation tasks (Tool types, Search composables, Components)
- [ ] All contract interfaces have validation tests (T004-T006)
- [ ] Tests are written before implementation (T004-T012 before T013+)
- [ ] Parallel tasks operate on independent files
- [ ] Constitutional requirements met (Playwright tests, no infrastructure changes)
- [ ] Performance and accessibility requirements addressed (T024-T025)

## Task Generation Rules Applied

1. **From Contracts**: tool-search-api.ts → T004-T006 contract tests, T013-T015 composables, T016-T018 components
2. **From Data Model**: Tool, SearchState, SearchFilters entities → T001-T003 type definitions, T013 search logic
3. **From Quickstart Scenarios**: 6 scenarios → T007-T012 E2E tests covering all acceptance criteria
4. **TDD Ordering**: Tests (T004-T012) → Implementation (T013-T018) → Integration (T019-T022) → Polish (T023-T028)
5. **Parallel Marking**: Different files marked [P], same file dependencies sequential