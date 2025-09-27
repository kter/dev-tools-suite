
# Implementation Plan: Remove All GCP Integration

**Branch**: `001-gcp` | **Date**: 2025-09-27 | **Spec**: [001-gcp/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-gcp/spec.md`

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
Remove all Google Cloud Platform integration from the dev-tools-suite project to simplify architecture and reduce maintenance burden. This includes removing Terraform infrastructure, Firebase configuration, GitHub Actions GCP deployment steps, CDK multi-cloud routing, documentation references, and cross-platform navigation components. AWS deployment functionality must be preserved and remain fully operational.

## Technical Context
**Language/Version**: TypeScript 5.x, Node.js 20+, HCL (Terraform removal)
**Primary Dependencies**: Nuxt 3, AWS CDK, Tailwind CSS, Playwright
**Storage**: Static files (S3), Infrastructure as Code
**Testing**: Playwright E2E tests, CDK unit tests
**Target Platform**: AWS Cloud (S3 + CloudFront), Static site generation
**Project Type**: web - Multi-tool static site collection
**Performance Goals**: Static site performance, fast CI/CD deployment
**Constraints**: Must preserve AWS functionality, maintain constitutional compliance
**Scale/Scope**: 15+ development tools, dev/prod environments, complete GCP removal

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ❌ VIOLATION: Principle II - Multi-Cloud Resilience
**Issue**: Complete removal of GCP violates constitutional requirement for multi-cloud deployment
**Impact**: Eliminates redundancy and user choice between cloud providers
**Justification**: User explicitly requested complete GCP removal for architecture simplification

### ✅ COMPLIANT: Principle I - Infrastructure as Code
**Status**: Maintains IaC principles, removes Terraform but keeps CDK

### ✅ COMPLIANT: Principle III - Security-First Development
**Status**: No security implications, maintains all security practices

### ✅ COMPLIANT: Principle IV - Independent Tool Architecture
**Status**: Maintains tool independence, only removes deployment options

### ✅ COMPLIANT: Principle V - Test Coverage Requirements
**Status**: Playwright tests preserved, AWS deployment testing maintained

### ✅ COMPLIANT: Principle VI - Observability and Debugging
**Status**: AWS observability unchanged, reduces overall complexity

### ✅ COMPLIANT: Principle VII - Simplicity and Maintainability
**Status**: Actually improves by reducing complexity and maintenance burden

**GATE RESULT**: ❌ CONSTITUTIONAL VIOLATION - Requires explicit user approval or constitution amendment

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
# Multi-tool web application structure (current)
tools/
├── hash-generator/           # Individual Nuxt 3 apps
├── qr-generator/
├── landing-page/            # Contains GCP navigation - TO MODIFY
├── [other-tools]/
└── ...

infrastructure/
├── cdk/                     # AWS infrastructure (PRESERVE)
│   ├── lib/
│   │   ├── dev-tools-stack.ts     # Contains GCP references - TO MODIFY
│   │   └── multi-cloud-routing-stack.ts  # TO REMOVE
│   └── bin/
└── terraform/               # GCP infrastructure - TO REMOVE ENTIRELY

.github/
└── workflows/
    └── deploy.yml           # Contains GCP deployment - TO MODIFY

tests/                       # Playwright E2E tests (PRESERVE)
├── [tool-name].spec.js
└── playwright.config.js

# Root files
├── firebase.json           # TO REMOVE
└── CLAUDE.md              # Contains GCP docs - TO MODIFY
```

**Structure Decision**: Multi-tool web application with independent tool deployment. Each tool is a separate Nuxt 3 SPA with its own package.json. Infrastructure managed through AWS CDK (preserve) and Terraform (remove). CI/CD handles matrix deployment per tool.

## Phase 0: Outline & Research
✅ **COMPLETED**: Comprehensive research of GCP components in codebase

**Research Results**:
1. **Terraform Infrastructure**: Complete `infrastructure/terraform/` directory removal required
2. **Firebase Configuration**: `firebase.json` file removal required
3. **GitHub Actions**: GCP deployment steps in `.github/workflows/deploy.yml` need removal
4. **Documentation**: Extensive GCP references in `CLAUDE.md` require cleanup
5. **CDK Multi-Cloud**: `MultiCloudRoutingStack` and GCP references need removal
6. **Vue Components**: Landing page and tool navigation contain GCP links requiring updates

**Constitutional Conflict Identified**: Violation of Principle II (Multi-Cloud Resilience)

**Output**: ✅ research.md complete with all decisions documented

## Phase 1: Design & Contracts
✅ **COMPLETED**: Design artifacts and contracts generated

**Deliverables Created**:
1. ✅ **data-model.md**: File system entities, code references, constitutional violations
2. ✅ **contracts/file-removal.md**: Directory and file removal operations
3. ✅ **contracts/code-modification.md**: GCP reference removal and navigation updates
4. ✅ **quickstart.md**: Comprehensive verification and rollback procedures
5. ✅ **CLAUDE.md update**: Agent context updated via update-agent-context.sh

**Design Decisions**:
- **File Operations**: Clean removal of entire directories vs selective file editing
- **Code Modifications**: Preserve AWS functionality while removing GCP references
- **Validation Strategy**: Multi-stage verification with rollback capability
- **Constitutional Handling**: Document violation with user approval requirement

**Output**: ✅ All Phase 1 artifacts complete and ready for task generation

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

**Estimated Output**: 25-30 numbered, ordered tasks in tasks.md

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
| Multi-Cloud Resilience (Principle II) | User explicitly requested complete GCP removal for architecture simplification | Partial removal would leave broken/incomplete GCP integration |
| Constitutional Amendment Required | Complete removal requires updating constitution to reflect new single-cloud architecture | Maintaining constitution with unimplemented requirements creates inconsistency |


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
- [x] Initial Constitution Check: VIOLATION DOCUMENTED
- [x] Post-Design Constitution Check: VIOLATION REMAINS (requires user approval)
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution v2.1.1 - See `/memory/constitution.md`*
