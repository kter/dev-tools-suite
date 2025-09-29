
# Implementation Plan: Add Footer with Legal Disclosure to All Tools

**Branch**: `007-https-tomohiko-io` | **Date**: 2025-09-29 | **Spec**: [spec.md](/Users/ttakahashi/workspace/dev-tools-suite/specs/007-https-tomohiko-io/spec.md)
**Input**: Feature specification from `/Users/ttakahashi/workspace/dev-tools-suite/specs/007-https-tomohiko-io/spec.md`

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
Add consistent footer component to all developer tools that matches the landing page design and includes a legal disclosure link to comply with Japanese commercial law requirements.

## Technical Context
**Language/Version**: TypeScript with Nuxt 3.17.5, Vue 3 composition API
**Primary Dependencies**: Nuxt 3, Vue 3, Tailwind CSS, @nuxtjs/tailwindcss
**Storage**: Static site generation, no server-side storage required
**Testing**: Playwright E2E tests for each tool
**Target Platform**: Web browsers (Chrome, Firefox, Safari, Edge), responsive design for desktop and mobile
**Project Type**: Web application - multiple independent Nuxt 3 SPA tools
**Performance Goals**: Fast static site loading, responsive UI transitions
**Constraints**: Must maintain visual consistency across all tools, mobile-responsive design
**Scale/Scope**: 23+ developer tools requiring footer updates, consistent deployment across AWS and GCP

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Infrastructure as Code (NON-NEGOTIABLE): ✅ PASS
- No infrastructure changes required - this is a frontend-only feature
- All existing AWS/GCP infrastructure remains managed through CDK/Terraform

### Multi-Cloud Resilience: ✅ PASS
- Footer component will be deployed to both AWS and GCP platforms via existing CI/CD
- Feature maintains compatibility with current deployment architecture

### Security-First Development: ✅ PASS
- No hardcoded secrets or API keys involved
- External link to legal disclosure follows secure practices
- No user data handling required

### Independent Tool Architecture: ✅ PASS
- Each tool maintains its own package.json and dependencies
- Footer implementation respects tool independence
- No cross-dependencies introduced

### Test Coverage Requirements: ✅ PASS
- Playwright E2E tests will verify footer presence and legal link functionality
- Tests will be added for each tool to ensure footer consistency

### Observability and Debugging: ✅ PASS
- Footer implementation will include clear, descriptive components
- Error handling for external link availability

### Simplicity and Maintainability: ✅ PASS
- Reusable footer component pattern maintains simplicity
- Consistent styling via Tailwind CSS classes
- Clear implementation following existing tool patterns

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
├── hash-generator/
│   ├── app.vue
│   ├── components/
│   │   └── ThemeToggle.vue
│   ├── package.json
│   └── nuxt.config.ts
├── qr-generator/
│   ├── app.vue
│   ├── components/
│   └── package.json
├── password-generator/
│   ├── app.vue
│   ├── components/
│   └── package.json
├── [... 20+ other tools ...]
├── landing-page/
│   ├── app.vue
│   ├── components/
│   │   ├── ToolGrid.vue
│   │   ├── ToolSearch.vue
│   │   ├── ThemeToggle.vue
│   │   └── KofiButton.vue
│   └── package.json
└── shared/
    └── [shared utilities if needed]

tests/
├── hash-generator.spec.js
├── qr-generator.spec.js
├── [... tool-specific E2E tests ...]
└── playwright.config.js
```

**Structure Decision**: Multi-tool web application structure with each tool as an independent Nuxt 3 SPA. Footer component will be added to each tool's app.vue file to maintain the independent architecture while ensuring consistency.

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
- Each tool requires footer implementation task [P] (parallel execution)
- Landing page requires legal disclosure link addition [P]
- E2E test updates for footer verification [P]
- Sub-agent delegation tasks for Serena MCP and Chrome MCP usage

**Ordering Strategy**:
- Research and design tasks first (already completed)
- Shared component analysis before individual tool updates
- Tool updates can be executed in parallel [P]
- E2E test updates after implementation
- Verification tasks using Chrome MCP after implementation

**Sub-agent Task Distribution**:
- Each tool gets dedicated sub-agent for implementation
- Serena MCP usage for code analysis and modification
- Chrome MCP usage for visual verification and testing
- Independent tool updates maintain constitutional compliance

**Estimated Output**: 35-40 numbered, ordered tasks in tasks.md
- 1 landing page update task
- 23+ individual tool footer implementation tasks (parallelizable)
- 5-8 E2E test update tasks
- 3-5 verification and validation tasks

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
- [x] Complexity deviations documented (None - simple design complies with all principles)

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
