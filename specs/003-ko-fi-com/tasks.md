# Tasks: Ko-fi.com Support Me Float Button with Scroll-based Fade-in

**Input**: Design documents from `/specs/003-ko-fi-com/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓), quickstart.md (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: TypeScript/Nuxt 3, Vue 3, Tailwind CSS, Ko-fi Widget SDK
2. Load optional design documents:
   → data-model.md: KofiButton component, useScrollPosition composable
   → contracts/: component-interface.ts, test-contract.md
   → research.md: Technical decisions confirmed
3. Generate tasks by category:
   → Setup: branch creation, dependencies verification
   → Tests: E2E tests, component tests (TDD approach)
   → Core: composable, component, integration
   → Integration: Landing page integration, Ko-fi script
   → Polish: accessibility, cross-browser, documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Landing Page Tool**: `tools/landing-page/`
- **Tests**: `tests/` (repository root for E2E), `tools/landing-page/tests/` (component tests)
- **Components**: `tools/landing-page/components/`
- **Composables**: `tools/landing-page/composables/`

## Phase 3.1: Setup
- [x] T001 Verify feature branch 003-ko-fi-com is active and up to date with develop
- [x] T002 Install dependencies in tools/landing-page directory (npm install)
- [x] T003 [P] Verify Playwright is installed and configured for E2E testing

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [x] T004 [P] Create E2E test for Ko-fi button scroll behavior in tests/landing-kofi.spec.js
- [x] T005 [P] Create component test stub for KofiButton.vue in tools/landing-page/tests/kofi-button.spec.ts
- [x] T006 [P] Create composable test for useScrollPosition in tools/landing-page/tests/use-scroll-position.spec.ts
- [x] T007 Verify all tests fail with expected errors (components/composables not found)

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T008 [P] Create useScrollPosition composable in tools/landing-page/composables/useScrollPosition.ts with throttled scroll handler
- [x] T009 [P] Create KofiButton.vue component in tools/landing-page/components/KofiButton.vue with props and state management
- [x] T010 Add Ko-fi widget script integration to KofiButton.vue component
- [x] T011 Implement CSS classes for transitions and positioning in KofiButton.vue
- [x] T012 Add accessibility attributes (aria-hidden, aria-label, tabindex) to KofiButton.vue

## Phase 3.4: Integration
- [x] T013 Import and add KofiButton component to tools/landing-page/app.vue
- [x] T014 Configure Ko-fi username prop in app.vue (use environment variable or hardcode for testing)
- [x] T015 Add data-testid attributes for E2E test selectors
- [x] T016 Test scroll behavior integration with actual page content
- [x] T017 Verify Ko-fi widget loads and functions correctly

## Phase 3.5: Polish
- [x] T018 [P] Add prefers-reduced-motion CSS support for accessibility
- [x] T019 [P] Test and fix mobile scroll behavior (touch events)
- [x] T020 Cross-browser testing (Chrome, Firefox, Safari, Edge - last 2 versions)
- [x] T021 Performance optimization - verify 60fps scroll and 300ms animation
- [x] T022 [P] Update component documentation with usage examples
- [x] T023 Run full E2E test suite and fix any failures
- [x] T024 Execute quickstart.md verification steps manually

## Dependencies
- Setup (T001-T003) must complete first
- Tests (T004-T007) before any implementation
- T008 (composable) should complete before T009 (component)
- T009-T012 (component creation) before T013 (integration)
- T013-T014 (integration) before T015-T017 (testing integration)
- All implementation before polish (T018-T024)

## Parallel Execution Examples

### Test Creation (can run simultaneously):
```
# Launch T004-T006 together:
Task: "Create E2E test for Ko-fi button scroll behavior in tests/landing-kofi.spec.js"
Task: "Create component test stub for KofiButton.vue in tools/landing-page/tests/kofi-button.spec.ts"
Task: "Create composable test for useScrollPosition in tools/landing-page/tests/use-scroll-position.spec.ts"
```

### Core Implementation (can run simultaneously):
```
# Launch T008-T009 together after tests fail:
Task: "Create useScrollPosition composable in tools/landing-page/composables/useScrollPosition.ts"
Task: "Create KofiButton.vue component in tools/landing-page/components/KofiButton.vue"
```

### Polish Tasks (can run simultaneously):
```
# Launch T018-T019, T022 together:
Task: "Add prefers-reduced-motion CSS support for accessibility"
Task: "Test and fix mobile scroll behavior (touch events)"
Task: "Update component documentation with usage examples"
```

## Notes
- [P] tasks work on different files with no dependencies
- Verify tests fail before implementing any functionality
- Commit after each completed task for clean history
- Use existing Nuxt 3 and Vue 3 patterns from landing-page tool
- Ko-fi username should be configurable, not hardcoded in component

## Validation Checklist
*GATE: All items must pass before implementation*

- [x] All contracts have corresponding tests (T004-T006)
- [x] Component and composable have creation tasks (T008-T009)
- [x] All tests come before implementation (T004-T007 before T008-T017)
- [x] Parallel tasks truly independent (verified file paths)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Accessibility requirements covered (T012, T018)
- [x] Cross-browser testing included (T020)
- [x] Documentation tasks included (T022)

## Estimated Completion
- **Total Tasks**: 24
- **Parallel Groups**: 3 major groups (tests, core, polish)
- **Sequential Chains**: Setup → Tests → Implementation → Integration → Polish
- **Estimated Time**: 4-6 hours with parallel execution