
# Implementation Plan: GitHub-style Tool Search with Keyboard Shortcut

**Branch**: `002-github-serena-mcp` | **Date**: 2025-09-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-github-serena-mcp/spec.md`

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
Implement GitHub-style tool search functionality for the dev tools landing page. Users can press '/' to trigger a fixed overlay search input at the top center of the page, then filter tools in real-time by typing queries that match against both tool names and descriptions. The search provides clean show/hide filtering without highlighting, displaying empty space when no results match.

## Technical Context
**Language/Version**: TypeScript with Nuxt 3 (SPA mode, SSR disabled)
**Primary Dependencies**: Vue.js, Tailwind CSS, Nuxt 3 composables
**Storage**: N/A (client-side search filtering)
**Testing**: Playwright E2E tests (per constitution requirement)
**Target Platform**: Static web application (deployed to AWS S3 + CloudFront, GCP Firebase Hosting)
**Project Type**: web - frontend tool enhancement
**Performance Goals**: Real-time search filtering (<50ms response time), smooth keyboard interactions
**Constraints**: Must work in landing page context, minimal bundle size impact, keyboard accessibility
**Scale/Scope**: Small feature enhancement affecting landing page only, ~10-20 tools to filter

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Infrastructure as Code**: ✅ PASS - No infrastructure changes required, pure frontend feature
**Multi-Cloud Resilience**: ✅ PASS - Feature works on both AWS and GCP deployments
**Security-First Development**: ✅ PASS - No secrets, APIs, or user data involved
**Independent Tool Architecture**: ✅ PASS - Landing page enhancement, no cross-tool dependencies
**Test Coverage Requirements**: ✅ PASS - Playwright E2E tests planned for search functionality
**Observability and Debugging**: ✅ PASS - Simple client-side feature, standard error handling
**Simplicity and Maintainability**: ✅ PASS - Straightforward keyboard + search filtering implementation

**Constitution Compliance**: ✅ ALL CHECKS PASS - No violations detected

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
│   ├── ToolSearch.vue      # New search overlay component
│   └── ToolGrid.vue        # Enhanced tool grid with search filtering
├── composables/
│   └── useToolSearch.ts    # Search logic composable
├── pages/
│   └── index.vue           # Landing page with search integration
├── types/
│   └── tool.ts             # Tool interface definitions
└── package.json

tests/
├── landing-page-search.spec.js  # E2E tests for search functionality
└── playwright.config.js
```

**Structure Decision**: Web application structure using existing Nuxt 3 tools architecture. The search functionality will be added as new components within the existing landing-page tool, maintaining the independent tool principle while enhancing the existing landing page.

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

**Output**: ✅ research.md completed - Technical decisions documented for Nuxt 3 search implementation

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

**Output**: ✅ Phase 1 completed:
- data-model.md: Entity definitions and search algorithm
- contracts/: API interfaces and contract tests
- quickstart.md: Complete testing scenarios
- CLAUDE.md: Updated agent context

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract → contract test task [P]
- Each entity → model creation task [P] 
- Each user story → integration test task
- Implementation tasks to make tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Models before services before UI
- Mark [P] for parallel execution (independent files)

**Task Generation Strategy**:
1. **Component Creation Tasks** (from data model and contracts):
   - Create Tool interface type definition
   - Create ToolSearch overlay component
   - Create ToolGrid component with filtering
   - Create useToolSearch composable
   - Create useSearchModal composable
   - Create useKeyboardNavigation composable

2. **Integration Tasks** (from quickstart scenarios):
   - Integrate search trigger in landing page
   - Add search modal to landing page layout
   - Implement tool data provider
   - Add keyboard event handling

3. **Testing Tasks** (from quickstart validation):
   - E2E test for search activation (Scenario 1)
   - E2E test for real-time filtering (Scenario 2)
   - E2E test for clear/escape behavior (Scenario 3)
   - E2E test for no results state (Scenario 4)
   - E2E test for modal closing (Scenario 5)
   - E2E test for tool navigation (Scenario 6)
   - Accessibility testing for screen readers
   - Performance testing for search response time

**Ordering Strategy**: TDD approach with tests before implementation
1. Component interface definitions
2. Failing component tests
3. Component implementations
4. Integration tests
5. Integration implementation
6. E2E validation tests

**Estimated Output**: 18-22 numbered, ordered tasks in tasks.md

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
- [x] Post-Design Constitution Check: PASS - No constitutional violations in design
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented - None required

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
