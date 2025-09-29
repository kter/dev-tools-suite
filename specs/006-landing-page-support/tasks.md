# Tasks: Universal Support Me Button Implementation

**Input**: Design documents from `/specs/006-landing-page-support/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓), quickstart.md (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: TypeScript/Nuxt 3, Vue 3, Tailwind CSS, Ko-fi Widget SDK
2. Load optional design documents:
   → data-model.md: KofiButtonState, ScrollPosition, ToolIntegration entities
   → contracts/: component-interface.ts, test-contract.md
   → research.md: Technical decisions confirmed
3. Generate tasks by category:
   → Setup: shared directory, component enhancement
   → Tests: E2E test creation for all 23 tools (TDD approach)
   → Core: shared component creation, tool integrations
   → Integration: Tool-by-tool implementation across all 23 tools
   → Polish: validation, performance testing, documentation
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
- **Shared Components**: `tools/shared/` directory
- **Tool Directories**: `tools/[tool-name]/` for each of 23 tools
- **Tests**: `tests/` (repository root for E2E)
- **Components**: `tools/[tool-name]/app.vue` for integration

## Phase 3.1: Setup
- [x] T001 Create shared component directory structure tools/shared/components, tools/shared/composables, tools/shared/utils
- [x] T002 Verify existing landing page KofiButton.vue and useScrollPosition.ts implementations as reference
- [x] T003 [P] Create TypeScript interfaces in tools/shared/components/types.ts from contracts/component-interface.ts

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These E2E tests MUST be written and MUST FAIL before ANY implementation**

### Text Processing Tools Tests (5 tools)
- [x] T004 [P] E2E test for hash-generator in tests/support-button-hash-generator.spec.js
- [x] T005 [P] E2E test for string-converter in tests/support-button-string-converter.spec.js
- [x] T006 [P] E2E test for regex-tester in tests/support-button-regex-tester.spec.js
- [x] T007 [P] E2E test for json-yaml-converter in tests/support-button-json-yaml-converter.spec.js
- [x] T008 [P] E2E test for jwt-decoder in tests/support-button-jwt-decoder.spec.js

### Image/Media Tools Tests (4 tools)
- [x] T009 [P] E2E test for qr-generator in tests/support-button-qr-generator.spec.js
- [x] T010 [P] E2E test for image-converter in tests/support-button-image-converter.spec.js
- [x] T011 [P] E2E test for badger-image-generator in tests/support-button-badger-image-generator.spec.js
- [x] T012 [P] E2E test for poster-splitter in tests/support-button-poster-splitter.spec.js

### Developer Utilities Tests (5 tools)
- [x] T013 [P] E2E test for code-diff in tests/support-button-code-diff.spec.js
- [x] T014 [P] E2E test for markdown-preview in tests/support-button-markdown-preview.spec.js
- [x] T015 [P] E2E test for mic-test in tests/support-button-mic-test.spec.js
- [x] T016 [P] E2E test for ip-info in tests/support-button-ip-info.spec.js
- [x] T017 [P] E2E test for ip-calculator in tests/support-button-ip-calculator.spec.js

### Content Generation Tools Tests (4 tools)
- [x] T018 [P] E2E test for password-generator in tests/support-button-password-generator.spec.js
- [x] T019 [P] E2E test for lorem-ipsum-generator in tests/support-button-lorem-ipsum-generator.spec.js
- [x] T020 [P] E2E test for placeholder-generator in tests/support-button-placeholder-generator.spec.js
- [x] T021 [P] E2E test for timer in tests/support-button-timer.spec.js

### Converter Tools Tests (3 tools)
- [x] T022 [P] E2E test for timezone-converter in tests/support-button-timezone-converter.spec.js
- [x] T023 [P] E2E test for unix-time-converter in tests/support-button-unix-time-converter.spec.js
- [x] T024 [P] E2E test for character-code-converter in tests/support-button-character-code-converter.spec.js

### Reference Implementation Test (1 tool)
- [x] T025 [P] E2E test for landing-page in tests/support-button-landing-page.spec.js (reference validation)

### Shared Component Tests
- [x] T026 [P] Unit test for shared KofiButton component in tests/shared-kofi-button.spec.js
- [x] T027 [P] Unit test for scroll detection utilities in tests/scroll-detection.spec.js

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Shared Component Creation
- [x] T028 Create enhanced scroll container auto-detection in tools/shared/utils/scroll-detection.ts
- [x] T029 Enhance useScrollPosition composable in tools/shared/composables/useScrollPosition.ts with auto-detection
- [x] T030 Create universal KofiButton component in tools/shared/components/KofiButton.vue based on landing page implementation
- [x] T031 Add TypeScript type definitions in tools/shared/components/types.ts for component interfaces

### Tool Integration - Text Processing Tools (5 tools)
- [ ] T032 [P] Integrate KofiButton in tools/hash-generator/app.vue with kofiUsername="kterr"
- [ ] T033 [P] Integrate KofiButton in tools/string-converter/app.vue with kofiUsername="kterr"
- [ ] T034 [P] Integrate KofiButton in tools/regex-tester/app.vue with kofiUsername="kterr"
- [ ] T035 [P] Integrate KofiButton in tools/json-yaml-converter/app.vue with kofiUsername="kterr"
- [ ] T036 [P] Integrate KofiButton in tools/jwt-decoder/app.vue with kofiUsername="kterr"

### Tool Integration - Image/Media Tools (4 tools)
- [ ] T037 [P] Integrate KofiButton in tools/qr-generator/app.vue with kofiUsername="kterr"
- [ ] T038 [P] Integrate KofiButton in tools/image-converter/app.vue with kofiUsername="kterr"
- [ ] T039 [P] Integrate KofiButton in tools/badger-image-generator/app.vue with kofiUsername="kterr"
- [ ] T040 [P] Integrate KofiButton in tools/poster-splitter/app.vue with kofiUsername="kterr"

### Tool Integration - Developer Utilities (5 tools)
- [ ] T041 [P] Integrate KofiButton in tools/code-diff/app.vue with kofiUsername="kterr"
- [ ] T042 [P] Integrate KofiButton in tools/markdown-preview/app.vue with kofiUsername="kterr"
- [ ] T043 [P] Integrate KofiButton in tools/mic-test/app.vue with kofiUsername="kterr"
- [ ] T044 [P] Integrate KofiButton in tools/ip-info/app.vue with kofiUsername="kterr"
- [ ] T045 [P] Integrate KofiButton in tools/ip-calculator/app.vue with kofiUsername="kterr"

### Tool Integration - Content Generation Tools (4 tools)
- [ ] T046 [P] Integrate KofiButton in tools/password-generator/app.vue with kofiUsername="kterr"
- [ ] T047 [P] Integrate KofiButton in tools/lorem-ipsum-generator/app.vue with kofiUsername="kterr"
- [ ] T048 [P] Integrate KofiButton in tools/placeholder-generator/app.vue with kofiUsername="kterr"
- [ ] T049 [P] Integrate KofiButton in tools/timer/app.vue with kofiUsername="kterr"

### Tool Integration - Converter Tools (3 tools)
- [ ] T050 [P] Integrate KofiButton in tools/timezone-converter/app.vue with kofiUsername="kterr"
- [ ] T051 [P] Integrate KofiButton in tools/unix-time-converter/app.vue with kofiUsername="kterr"
- [ ] T052 [P] Integrate KofiButton in tools/character-code-converter/app.vue with kofiUsername="kterr"

## Phase 3.4: Integration Validation
- [ ] T053 Verify all E2E tests pass with new implementations
- [ ] T054 Test cross-browser compatibility (Chrome, Firefox, Safari, Edge) for representative tools
- [ ] T055 Validate scroll detection auto-detection works across different tool layouts
- [ ] T056 Verify Ko-fi integration opens correct 'kterr' profile for all tools
- [ ] T057 Test accessibility compliance (ARIA attributes, keyboard navigation) across tools
- [ ] T058 Validate reduced motion preference handling across all tools

## Phase 3.5: Polish
- [ ] T059 [P] Performance testing - verify 60fps scroll and 300ms animations maintained
- [ ] T060 [P] Mobile responsiveness testing across sample tools
- [ ] T061 [P] Update shared component documentation with usage examples
- [ ] T062 Run full quickstart.md validation workflow manually
- [ ] T063 Verify CI/CD pipeline handles all 23 tools correctly with new dependencies
- [ ] T064 Clean up any duplicate code between landing page and shared implementations

## Dependencies
- Setup (T001-T003) must complete first
- All E2E tests (T004-T027) before any implementation changes
- Shared components (T028-T031) before tool integrations (T032-T052)
- Tool integrations before validation (T053-T058)
- All implementation before polish (T059-T064)

## Parallel Execution Examples

### E2E Test Creation (can run simultaneously):
```
# Launch T004-T008 together (Text Processing Tools):
Task: "E2E test for hash-generator in tests/support-button-hash-generator.spec.js"
Task: "E2E test for string-converter in tests/support-button-string-converter.spec.js"
Task: "E2E test for regex-tester in tests/support-button-regex-tester.spec.js"
Task: "E2E test for json-yaml-converter in tests/support-button-json-yaml-converter.spec.js"
Task: "E2E test for jwt-decoder in tests/support-button-jwt-decoder.spec.js"
```

### Tool Integration by Category (can run simultaneously):
```
# Launch T032-T036 together (Text Processing Tools):
Task: "Integrate KofiButton in tools/hash-generator/app.vue with kofiUsername='kterr'"
Task: "Integrate KofiButton in tools/string-converter/app.vue with kofiUsername='kterr'"
Task: "Integrate KofiButton in tools/regex-tester/app.vue with kofiUsername='kterr'"
Task: "Integrate KofiButton in tools/json-yaml-converter/app.vue with kofiUsername='kterr'"
Task: "Integrate KofiButton in tools/jwt-decoder/app.vue with kofiUsername='kterr'"
```

### Polish Tasks (can run simultaneously):
```
# Launch T059-T061 together:
Task: "Performance testing - verify 60fps scroll and 300ms animations maintained"
Task: "Mobile responsiveness testing across sample tools"
Task: "Update shared component documentation with usage examples"
```

## Implementation Details

### Key Component Integration Pattern

Each tool integration follows this pattern:
```vue
<!-- tools/[tool-name]/app.vue -->
<template>
  <div>
    <!-- Existing tool content -->
    <KofiButton kofi-username="kterr" />
  </div>
</template>

<script setup>
import KofiButton from '../shared/components/KofiButton.vue'
</script>
```

### E2E Test Pattern

Each E2E test follows the 7 required test cases from contracts/test-contract.md:
1. Initial visibility test
2. Scroll hide test (70% threshold)
3. Scroll show test
4. Short page test
5. Ko-fi integration test
6. Accessibility test
7. Reduced motion test

### Files to Create/Modify

#### New Files:
- `tools/shared/components/KofiButton.vue` (enhanced version)
- `tools/shared/composables/useScrollPosition.ts` (enhanced version)
- `tools/shared/utils/scroll-detection.ts` (new auto-detection utilities)
- `tools/shared/components/types.ts` (TypeScript interfaces)
- 23 E2E test files in `tests/support-button-[tool].spec.js`
- 2 Unit test files for shared components

#### Modified Files:
- 22 `tools/[tool-name]/app.vue` files (all tools except landing-page which already has it)

## Notes
- **Critical**: E2E tests must be written and failing before implementation begins (TDD)
- Use existing landing-page KofiButton implementation as reference
- Ko-fi username must be 'kterr' across all tools
- Maintain existing tool functionality - only add Support Me button
- Auto-detection should handle different scroll containers automatically
- All tests must pass before production deployment

## Validation Checklist
*GATE: All items must pass before marking tasks complete*

- [ ] All 23 tools have Support Me button integrated
- [ ] All 25 E2E tests pass (23 tools + 2 shared component tests)
- [ ] Shared component works consistently across all tools
- [ ] Auto-detection handles different tool layouts correctly
- [ ] Ko-fi integration works with 'kterr' username for all tools
- [ ] Accessibility requirements met across all tools
- [ ] Performance standards maintained (60fps, 300ms animations)
- [ ] Cross-browser compatibility verified
- [ ] Reduced motion preference respected

## Estimated Completion
- **Total Tasks**: 64
- **Critical Path**: Tests → Shared Components → Tool Integrations → Validation → Polish
- **Parallel Opportunities**: E2E test creation, tool integrations by category, polish tasks
- **Estimated Time**: 8-12 hours (significant scale but leveraging existing patterns)