
# Implementation Plan: Universal Support Me Button Implementation

**Branch**: `006-landing-page-support` | **Date**: 2025-09-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-landing-page-support/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Implement a universal Support Me floating button component across all 23 developer tools in the suite with identical behavior to the landing page. The button will be visible by default and fade out when users scroll to 70% of page height. Uses Ko-fi integration with 'kterr' username and shared component architecture from tools/shared/ directory. Requires individual E2E tests for each tool and auto-detection of scroll containers to handle different page layouts.

## Technical Context
**Language/Version**: TypeScript (strict mode) with Nuxt 3
**Primary Dependencies**: Vue 3, Tailwind CSS, Ko-fi Widget SDK, existing useScrollPosition composable
**Storage**: N/A (client-side state management only)
**Testing**: Playwright E2E tests (individual test files for all 23 tools), component tests with @vue/test-utils
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
**Project Type**: Web application (frontend modification to existing multi-tool suite)
**Performance Goals**: 60fps scroll performance, 300ms fade animation, <100ms scroll throttling
**Constraints**: Must work with existing tool architectures, maintain accessibility standards, respect prefers-reduced-motion
**Scale/Scope**: 23 independent tools modification, shared component distribution, universal button integration

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Constitutional Compliance Analysis
- **Infrastructure as Code**: ✅ PASS - No infrastructure changes required, frontend-only modification
- **Multi-Cloud Resilience**: ✅ PASS - Existing tools already deployed to AWS and GCP via CI/CD matrix
- **Security-First Development**: ✅ PASS - No secrets, API keys, or sensitive data involved
- **Independent Tool Architecture**: ✅ PASS - Each tool maintains independence with shared component import
- **Test Coverage Requirements**: ✅ PASS - E2E tests required for all 23 tools using existing Playwright framework
- **Observability and Debugging**: ✅ PASS - Clear error handling and accessibility features specified
- **Simplicity and Maintainability**: ✅ PASS - Leverages existing patterns, shared component approach

### Technology Standards Compliance
- **Frontend Stack**: ✅ Nuxt 3 (SPA mode), TypeScript (strict), Tailwind CSS
- **Build Process**: ✅ Uses existing `nuxt generate` static generation
- **Testing**: ✅ Playwright E2E tests following existing patterns

**Result**: PASS - No constitutional violations detected

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
tools/shared/
├── components/
│   ├── KofiButton.vue          # Universal Support Button Component
│   └── types.ts                # Component types and interfaces
├── composables/
│   └── useScrollPosition.ts    # Enhanced scroll tracking with auto-detection
└── utils/
    └── scroll-detection.ts     # Scroll container auto-detection utilities

tools/[each-tool]/              # All 23 tools (hash-generator, qr-generator, etc.)
├── app.vue                     # Integration point for KofiButton component
├── components/                 # Tool-specific components
├── nuxt.config.ts              # Tool configuration
└── package.json                # Tool dependencies

tests/
├── support-button-[tool].spec.js  # Individual E2E tests for each of 23 tools
├── shared-kofi-button.spec.js     # Shared component unit tests
└── scroll-detection.spec.js       # Scroll auto-detection utility tests
```

**Structure Decision**: Web application (frontend modification). This feature enhances the existing multi-tool suite by adding a shared component architecture. The KofiButton component is placed in tools/shared/ directory for reuse across all 23 tools via ../shared/ imports. Each tool integrates the component independently while maintaining the constitutional requirement of tool independence.

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: ✅ data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Shared component creation and enhancement tasks [P]
- Tool integration tasks (23 tools) - can be parallelized by tool category
- E2E test creation tasks (23 test files) - can be parallelized
- Validation and deployment tasks

**Ordering Strategy**:
- TDD order: Tests before implementation where applicable
- Dependency order: Shared components before tool integrations before testing
- Mark [P] for parallel execution (independent tools/tests)
- Group similar tools for batch processing efficiency

**Tool Categorization for Parallel Execution**:
- Text Processing: hash-generator, string-converter, regex-tester, json-yaml-converter, jwt-decoder
- Image/Media: qr-generator, image-converter, badger-image-generator, poster-splitter
- Developer Utilities: code-diff, markdown-preview, mic-test, ip-info, ip-calculator
- Content Generation: password-generator, lorem-ipsum-generator, placeholder-generator, timer
- Converters: timezone-converter, unix-time-converter, character-code-converter
- Landing: landing-page (reference implementation)

**Estimated Output**: 45-55 numbered, ordered tasks in tasks.md (shared components + 23 tool integrations + 23 tests + validation)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
