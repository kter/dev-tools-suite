# Tasks: Support Me Button Visibility Reversal

**Input**: Design documents from `/specs/004-support-me/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓), quickstart.md (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: TypeScript/Nuxt 3, Vue 3, Tailwind CSS, existing components
2. Load optional design documents:
   → data-model.md: KofiButtonState, visibility logic inversion
   → contracts/: component-interface.ts, test-contract.md
   → research.md: Technical decisions confirmed
3. Generate tasks by category:
   → Setup: branch verification, dependencies check
   → Tests: E2E test updates, component behavior validation (TDD approach)
   → Core: component logic inversion, visibility state updates
   → Integration: Landing page integration verification
   → Polish: accessibility, cross-browser, documentation
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests updated before implementation changes (TDD)
5. Number tasks sequentially (T001, T002...)
6. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Landing Page Tool**: `tools/landing-page/`
- **Tests**: `tests/` (repository root for E2E)
- **Components**: `tools/landing-page/components/`
- **Composables**: `tools/landing-page/composables/`

## Phase 3.1: Setup
- [x] T001 Verify feature branch 004-support-me is active and up to date with develop
- [x] T002 Verify dependencies in tools/landing-page directory (npm install)
- [x] T003 [P] Verify existing KofiButton.vue and useScrollPosition.ts components exist

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These test updates MUST be completed and MUST PASS before ANY implementation changes**
- [x] T004 Update E2E test assertions in tests/landing-kofi.spec.js to expect button visible on load
- [x] T005 Update E2E test assertions in tests/landing-kofi.spec.js to expect button hidden when scrolled to 70%
- [x] T006 Update E2E test assertions in tests/landing-kofi.spec.js to expect button shown when scrolled back above threshold
- [x] T007 Update short page test assertion in tests/landing-kofi.spec.js to expect button always visible
- [x] T008 Update accessibility test assertions in tests/landing-kofi.spec.js for reversed visibility states
- [x] T009 Verify all updated tests fail with expected errors (reversed behavior not yet implemented)

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [x] T010 Modify visibility computed property in tools/landing-page/components/KofiButton.vue to invert isAtThreshold logic
- [x] T011 Update CSS classes in tools/landing-page/components/KofiButton.vue to match reversed visibility behavior
- [x] T012 Verify ARIA attributes in tools/landing-page/components/KofiButton.vue update correctly with new visibility logic
- [x] T013 Test initial state in tools/landing-page/components/KofiButton.vue ensures button is visible on component mount

## Phase 3.4: Integration
- [x] T014 Verify KofiButton integration in tools/landing-page/app.vue works with reversed behavior
- [x] T015 Test scroll behavior integration with actual landing page content
- [x] T016 Verify Ko-fi widget loads and functions correctly with new visibility states
- [x] T017 Add data-testid attributes verification for E2E test selectors

## Phase 3.5: Polish
- [x] T018 [P] Verify prefers-reduced-motion CSS support works with reversed behavior
- [x] T019 [P] Test and verify mobile scroll behavior (touch events) with new logic
- [x] T020 Cross-browser testing (Chrome, Firefox, Safari, Edge - last 2 versions) for reversed behavior
- [x] T021 Performance optimization verification - confirm 60fps scroll and 300ms animation maintained
- [x] T022 [P] Update component documentation with new behavior description
- [x] T023 Run full E2E test suite and fix any failures
- [x] T024 Execute quickstart.md verification steps manually

## Dependencies
- Setup (T001-T003) must complete first
- Test updates (T004-T009) before any implementation changes
- T010 (visibility logic) should complete before T011-T013 (related component changes)
- T010-T013 (component changes) before T014-T017 (integration testing)
- All implementation before polish (T018-T024)

## Parallel Execution Examples

### Test Updates (can run simultaneously):
```
# Launch T004-T008 together (different test scenarios):
Task: "Update E2E test assertions in tests/landing-kofi.spec.js to expect button visible on load"
Task: "Update E2E test assertions in tests/landing-kofi.spec.js to expect button hidden when scrolled to 70%"
Task: "Update E2E test assertions in tests/landing-kofi.spec.js to expect button shown when scrolled back above threshold"
Task: "Update short page test assertion in tests/landing-kofi.spec.js to expect button always visible"
Task: "Update accessibility test assertions in tests/landing-kofi.spec.js for reversed visibility states"
```

### Polish Tasks (can run simultaneously):
```
# Launch T018-T019, T022 together:
Task: "Verify prefers-reduced-motion CSS support works with reversed behavior"
Task: "Test and verify mobile scroll behavior (touch events) with new logic"
Task: "Update component documentation with new behavior description"
```

## Implementation Details

### Key Logic Changes Required

#### KofiButton.vue Visibility Logic
**Current Logic** (from 003-ko-fi-com):
```vue
computed: {
  isVisible() {
    return this.isAtThreshold || this.isShortPage;
  }
}
```

**New Logic** (004-support-me):
```vue
computed: {
  isVisible() {
    return !this.isAtThreshold || this.isShortPage;
  }
}
```

#### Test Assertion Updates
**Current Test Assertions**:
```javascript
// Button hidden on initial load
await expect(kofiButton).toBeHidden();

// Button shows when scrolled to 70%
await expect(kofiButton).toHaveClass(/kofi-button-visible/);
```

**New Test Assertions**:
```javascript
// Button visible on initial load
await expect(kofiButton).toBeVisible();

// Button hides when scrolled to 70%
await expect(kofiButton).toHaveClass(/kofi-button-hidden/);
```

### Files to Modify
1. `tools/landing-page/components/KofiButton.vue` - Core visibility logic
2. `tests/landing-kofi.spec.js` - E2E test assertions
3. Component documentation (if exists)

### Files to Preserve
- `tools/landing-page/composables/useScrollPosition.ts` - No changes needed
- `tools/landing-page/app.vue` - Ko-fi integration unchanged
- All animation timing and CSS transitions - Keep existing values

## Notes
- **Critical**: Test updates must be completed and failing before any implementation changes
- Use existing Nuxt 3 and Vue 3 patterns from landing-page tool
- Ko-fi username should remain configurable, not hardcoded in component
- Maintain all existing accessibility features and animation timings
- Preserve existing 300ms animation duration and 100ms scroll throttling

## Validation Checklist
*GATE: All items must pass before marking tasks complete*

- [ ] All test assertions inverted to match new behavior (T004-T008)
- [ ] Component visibility logic successfully inverted (T010)
- [ ] All tests pass with new implementation (T009, T023)
- [ ] Animation timing preserved (300ms fade, 100ms throttle)
- [ ] Accessibility requirements maintained (T012, T018)
- [ ] Cross-browser compatibility verified (T020)
- [ ] Performance requirements met (T021)
- [ ] Ko-fi widget integration verified (T016)

## Estimated Completion
- **Total Tasks**: 24
- **Critical Path**: Tests → Core Logic → Integration → Polish
- **Parallel Opportunities**: Test updates, polish tasks
- **Estimated Time**: 2-3 hours (simpler than 003-ko-fi-com due to logic inversion only)