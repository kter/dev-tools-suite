
# Implementation Plan: Ko-fi.com Support Me Float Button with Scroll-based Fade-in

**Branch**: `003-ko-fi-com` | **Date**: 2025-09-29 | **Spec**: `/specs/003-ko-fi-com/spec.md`
**Input**: Feature specification from `/specs/003-ko-fi-com/spec.md`

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
Adding a Ko-fi.com Support Me float button to the landing page that fades in when users scroll to 70% of page height. The button should be unobtrusive initially but available when users are engaged with content. Technical approach will use scroll event listeners with CSS transitions for smooth fade animations.

## Technical Context
**Language/Version**: TypeScript with Nuxt 3 (Vue 3)
**Primary Dependencies**: Nuxt 3, Vue 3, Tailwind CSS, Ko-fi Widget SDK
**Storage**: N/A (client-side only feature)
**Testing**: Playwright E2E tests
**Target Platform**: Modern web browsers (last 2 versions of Chrome, Firefox, Safari, Edge)
**Project Type**: web - Frontend only (static site generation)
**Performance Goals**: 300ms fade animation, smooth 60fps scroll performance
**Constraints**: Must work in SPA mode, respect reduced motion preferences, maintain accessibility
**Scale/Scope**: Single component added to landing page tool

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Core Principles Compliance
- ✅ **Infrastructure as Code**: N/A - No infrastructure changes needed
- ✅ **Multi-Cloud Resilience**: Feature works on both AWS and GCP deployments
- ✅ **Security-First**: No API keys or secrets, client-side only
- ✅ **Independent Tool Architecture**: Modifying only landing-page tool
- ✅ **Test Coverage**: Will add Playwright E2E tests for the feature
- ✅ **Observability**: Simple UI feature with clear visual feedback
- ✅ **Simplicity**: Single component with straightforward scroll behavior

### Technology Standards
- ✅ **Frontend Stack**: Using Nuxt 3, TypeScript, Tailwind CSS as required
- ✅ **Build Process**: Uses existing `nuxt generate` for static deployment
- ✅ **Development Standards**: Following existing patterns in landing-page tool

### Quality Gates
- ✅ Tests will be written before implementation (TDD approach)
- ✅ No hardcoded secrets or credentials
- ✅ Following existing code conventions

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
tools/landing-page/
├── components/
│   └── KofiButton.vue        # New scroll-aware Ko-fi button component
├── composables/
│   └── useScrollPosition.ts  # New composable for scroll tracking
├── app.vue                   # Modified to include KofiButton component
└── tests/
    └── kofi-button.spec.ts  # New E2E tests for Ko-fi button

tests/
└── landing-kofi.spec.js      # New integration test for Ko-fi feature
```

**Structure Decision**: Frontend-only modification within the existing landing-page tool. The feature will be implemented as a Vue component with a supporting composable for scroll logic, following the existing Nuxt 3 patterns in the landing-page tool.

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

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
The /tasks command will generate approximately 15-20 tasks based on:
1. **Test Creation Tasks** (TDD approach):
   - Create E2E test file for Ko-fi button scroll behavior [P]
   - Create component test for KofiButton.vue [P]
   - Create composable test for useScrollPosition [P]

2. **Implementation Tasks**:
   - Create useScrollPosition composable with throttled scroll handler
   - Create KofiButton.vue component with props and state management
   - Integrate Ko-fi widget script
   - Add component to landing page app.vue
   - Implement CSS transitions and positioning classes

3. **Configuration Tasks**:
   - Add Ko-fi username configuration
   - Configure test-id attributes for E2E testing
   - Add accessibility attributes

4. **Validation Tasks**:
   - Run E2E tests to verify scroll behavior
   - Test short page behavior
   - Verify accessibility compliance
   - Test reduced motion preference
   - Cross-browser testing

**Ordering Strategy**:
1. Tests first (failing tests as per TDD)
2. Core composable implementation
3. Component implementation
4. Integration into landing page
5. Styling and animations
6. Validation and cross-browser testing

**Parallel Execution Opportunities [P]**:
- Test files can be created in parallel
- CSS and component files can be developed simultaneously
- Documentation updates can happen alongside implementation

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

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
- [x] Complexity deviations documented (none needed)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
