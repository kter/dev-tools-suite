# Tasks: Remove All GCP Integration

**Input**: Design documents from `/specs/001-gcp/`
**Prerequisites**: plan.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

## Execution Flow (main)
```
1. Load plan.md from feature directory ✅
   → Tech stack: TypeScript, Node.js, Nuxt 3, AWS CDK, Terraform (removal)
   → Structure: Multi-tool web application with independent deployments
2. Load design documents: ✅
   → research.md: 6 GCP component categories identified
   → contracts/: File removal and code modification operations
   → quickstart.md: Verification procedures
3. Generate tasks by category:
   → Setup: Infrastructure preparation and validation
   → Tests: Verification tests before and after removal
   → Core: File/directory removal operations
   → Integration: Code modifications and documentation updates
   → Polish: Final validation and cleanup
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Sequential operations = no [P]
   → Verification before destructive operations
5. Tasks numbered T001-T025
6. Dependencies: Setup → Tests → Removal → Modifications → Validation
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Setup & Preparation
- [x] T001 Create backup of current git state and verify clean working directory
- [x] T002 [P] Stop all running development servers (hash-generator, qr-generator, timer, etc.)
- [x] T003 [P] Run full test suite to establish baseline (npx playwright test)

## Phase 3.2: Verification Tests (MUST COMPLETE BEFORE 3.3) ⚠️
**CRITICAL: These verification tests MUST pass/validate before ANY removal operations**
- [x] T004 [P] Create verification test for Terraform directory removal in tests/contract/test_terraform_removal.js
- [x] T005 [P] Create verification test for Firebase config removal in tests/contract/test_firebase_removal.js
- [x] T006 [P] Create verification test for GitHub Actions cleanup in tests/contract/test_workflow_cleanup.js
- [x] T007 [P] Create verification test for CDK build success in tests/contract/test_cdk_build.js
- [x] T008 [P] Create verification test for documentation cleanup in tests/contract/test_docs_cleanup.js
- [x] T009 [P] Create verification test for Vue component updates in tests/contract/test_vue_cleanup.js

## Phase 3.3: Infrastructure Removal (ONLY after verification tests exist)
- [x] T010 Remove entire infrastructure/terraform/ directory completely
- [x] T011 Remove firebase.json from repository root
- [x] T012 [P] Remove infrastructure/cdk/lib/multi-cloud-routing-stack.ts
- [x] T013 Verify no broken references after infrastructure removal

## Phase 3.4: Code Modifications
- [ ] T014 Remove GCP deployment steps from .github/workflows/deploy.yml preserving AWS deployment
- [ ] T015 Remove GCP references from infrastructure/cdk/lib/dev-tools-stack.ts
- [ ] T016 Remove GCP references from infrastructure/cdk/bin/deploy.ts
- [ ] T017 [P] Remove GCP navigation from tools/landing-page/app.vue
- [ ] T018 [P] Remove GCP platform references from tools/hash-generator/app.vue

## Phase 3.5: Documentation Updates
- [ ] T019 Remove Multi-Cloud Architecture section from CLAUDE.md
- [ ] T020 Remove Google Cloud Infrastructure commands from CLAUDE.md
- [ ] T021 Remove GCP Custom Domains documentation from CLAUDE.md
- [ ] T022 Remove SSL Certificate Troubleshooting (GCP) section from CLAUDE.md
- [ ] T023 Update Environment URLs to remove GCP domains from CLAUDE.md

## Phase 3.6: Final Validation & Testing
- [ ] T024 [P] Run CDK build verification (cd infrastructure/cdk && npm run build)
- [ ] T025 [P] Run complete Playwright test suite to verify no regressions
- [ ] T026 Execute quickstart verification procedure from specs/001-gcp/quickstart.md
- [ ] T027 Commit all changes with descriptive message about GCP removal

## Dependencies
- Setup (T001-T003) before verification tests (T004-T009)
- Verification tests (T004-T009) before infrastructure removal (T010-T013)
- Infrastructure removal (T010-T013) before code modifications (T014-T018)
- Code modifications (T014-T018) before documentation updates (T019-T023)
- All changes before final validation (T024-T027)

## Parallel Execution Groups

### Group 1: Verification Test Creation (T004-T009)
```bash
# All verification tests can be created in parallel as they're independent files
Task: "Create verification test for Terraform directory removal in tests/contract/test_terraform_removal.js"
Task: "Create verification test for Firebase config removal in tests/contract/test_firebase_removal.js"
Task: "Create verification test for GitHub Actions cleanup in tests/contract/test_workflow_cleanup.js"
Task: "Create verification test for CDK build success in tests/contract/test_cdk_build.js"
Task: "Create verification test for documentation cleanup in tests/contract/test_docs_cleanup.js"
Task: "Create verification test for Vue component updates in tests/contract/test_vue_cleanup.js"
```

### Group 2: Vue Component Updates (T017-T018)
```bash
# Landing page and hash generator updates can run in parallel (different files)
Task: "Remove GCP navigation from tools/landing-page/app.vue"
Task: "Remove GCP platform references from tools/hash-generator/app.vue"
```

### Group 3: Final Validation (T024-T025)
```bash
# CDK build and Playwright tests can run in parallel (independent operations)
Task: "Run CDK build verification (cd infrastructure/cdk && npm run build)"
Task: "Run complete Playwright test suite to verify no regressions"
```

## Constitutional Violation Notice ⚠️
**This implementation violates Constitutional Principle II (Multi-Cloud Resilience)**
- User has explicitly requested complete GCP removal despite constitutional requirements
- Constitutional amendment or explicit user approval required before execution
- All AWS functionality must be preserved and tested

## File Impact Analysis
### Files to be REMOVED:
- `infrastructure/terraform/` (entire directory)
- `firebase.json`
- `infrastructure/cdk/lib/multi-cloud-routing-stack.ts`

### Files to be MODIFIED:
- `.github/workflows/deploy.yml` (remove GCP deployment steps)
- `infrastructure/cdk/lib/dev-tools-stack.ts` (remove GCP references)
- `infrastructure/cdk/bin/deploy.ts` (remove GCP references)
- `tools/landing-page/app.vue` (remove GCP navigation)
- `tools/hash-generator/app.vue` (remove GCP references)
- `CLAUDE.md` (remove all GCP documentation sections)

### Files to be PRESERVED:
- All AWS CDK infrastructure (except MultiCloudRoutingStack)
- All individual tool configurations and dependencies
- All Playwright test files
- All AWS deployment workflows and documentation

## Validation Checklist
*GATE: Must be completed before marking implementation complete*

- [ ] All Terraform files removed and no references remain
- [ ] Firebase configuration completely removed
- [ ] GitHub Actions workflow deploys only to AWS
- [ ] CDK builds successfully without GCP references
- [ ] Vue components have no broken GCP links
- [ ] Documentation reflects AWS-only architecture
- [ ] All Playwright tests pass
- [ ] AWS deployment to dev environment succeeds
- [ ] No broken links or 404 errors in any tool
- [ ] Landing page navigation functions correctly

## Rollback Procedure
If any task fails and rollback is needed:
1. Use `git status` to check uncommitted changes
2. Use `git checkout .` to revert all changes
3. Use `git clean -fd` to remove any new untracked files
4. Restart from the failed task after investigating the issue
5. Ensure verification tests are updated to catch the failure scenario

## Notes
- [P] tasks = different files, no dependencies between them
- All destructive operations (removal) come after verification tests
- Preserve all AWS functionality throughout the process
- Constitutional violation must be acknowledged before execution
- Each task should result in a testable, verifiable state