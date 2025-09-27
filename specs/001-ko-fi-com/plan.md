
# Implementation Plan: Ko-fi Tip Widget Integration

**Branch**: `001-ko-fi-com` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ko-fi-com/spec.md`

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
Add Ko-fi donation widget to all 22 pages (21 tools + landing page) of the Dev Tools Suite. Widget appears as floating chat button, maintains consistent position across all pages, and hides completely when Ko-fi service is unavailable.

## Technical Context
**Language/Version**: TypeScript (Nuxt 3 SPA applications)
**Primary Dependencies**: Nuxt 3, Vue 3, Tailwind CSS, Ko-fi widget overlay script
**Storage**: N/A (widget configuration only)
**Testing**: Playwright E2E tests
**Target Platform**: Static web applications deployed to AWS S3/CloudFront and GCP Firebase Hosting
**Project Type**: web (multiple frontend applications)
**Performance Goals**: Widget load should not impact page performance (<100ms additional load time)
**Constraints**: Must work consistently across all environments, graceful degradation required
**Scale/Scope**: 22 independent Nuxt applications, multi-cloud deployment

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Infrastructure as Code**: ✅ PASS - No infrastructure changes required
**II. Multi-Cloud Resilience**: ✅ PASS - Widget will deploy to both AWS and GCP environments
**III. Security-First Development**: ✅ PASS - No secrets, external script from trusted source (Ko-fi)
**IV. Independent Tool Architecture**: ✅ PASS - Each tool adds widget independently
**V. Test Coverage Requirements**: ✅ PASS - Playwright E2E tests will verify widget presence
**VI. Observability and Debugging**: ✅ PASS - Graceful degradation with no error states
**VII. Simplicity and Maintainability**: ✅ PASS - Simple script inclusion, consistent implementation

**Overall Assessment**: PASS - No constitutional violations identified

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
tools/
├── landing-page/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── nuxt.config.ts
├── hash-generator/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── nuxt.config.ts
├── qr-generator/
│   └── [same structure as above]
└── [...19 more tools]/
    └── [same structure as above]

tests/
├── hash-generator.spec.js
├── qr-generator.spec.js
├── [...more tool tests]
└── playwright.config.js
```

**Structure Decision**: Multiple independent Nuxt 3 applications structure. Each tool is a separate SPA with its own build process. Widget integration will be added to each tool's layout or composable system for consistency across all 22 applications.

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
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Composable interface → contract test task [P]
- Widget configuration → model creation task [P]
- Each tool integration → implementation task (22 tasks)
- E2E tests → test creation tasks [P]
- Deployment verification → validation tasks

**Ordering Strategy**:
- TDD order: Tests before implementation
- Dependencies: Composable → tool integrations → E2E tests
- Mark [P] for parallel execution (independent tool modifications)
- Tool integrations can be done in parallel across all 22 applications

**Estimated Output**: 30-35 numbered, ordered tasks in tasks.md
- 1 composable creation task
- 22 tool integration tasks (parallel)
- 5-8 testing tasks
- 2-3 deployment verification tasks

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
- [x] Post-Design Constitution Check: PASS (no new violations introduced)
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (none required)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
