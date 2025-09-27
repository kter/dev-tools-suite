<!-- Sync Impact Report
Version change: N/A → 1.0.0 (initial ratification)
Modified principles: None (initial creation)
Added sections: All sections newly created
Removed sections: None
Templates requiring updates:
  ✅ plan-template.md (will check after creation)
  ✅ spec-template.md (will check after creation)
  ✅ tasks-template.md (will check after creation)
  ✅ agent-file-template.md (will check after creation)
Follow-up TODOs:
  - RATIFICATION_DATE: Set to today (2025-01-27) as initial adoption
-->

# Dev Tools Suite Constitution

## Core Principles

### I. Infrastructure as Code (NON-NEGOTIABLE)
All infrastructure must be managed through code. AWS infrastructure is managed
exclusively through CDK in TypeScript. Google Cloud infrastructure is managed
exclusively through Terraform. Direct console or CLI modifications for
infrastructure are strictly forbidden. This ensures reproducibility,
version control, and disaster recovery capabilities.

**Rationale**: Infrastructure drift causes production incidents and makes
environments diverge. Code-based infrastructure is auditable, reviewable,
and recoverable.

### II. Multi-Cloud Resilience
Every tool must be deployable to both AWS and Google Cloud Platform with
feature parity. The application architecture must support simultaneous
deployment to both clouds. Cross-platform navigation must be maintained
in landing pages to allow users to switch between cloud providers.

**Rationale**: Cloud vendor lock-in creates business risk. Multi-cloud
deployment ensures service continuity and provides users with choice.

### III. Security-First Development
- NEVER hardcode passwords or API keys
- NEVER commit secrets to the repository
- NEVER delete user data without confirmation
- NEVER deploy to production without passing tests
- All public APIs must have documentation
- Error handling must be comprehensive

**Rationale**: Security breaches are catastrophic. These practices are
the minimum baseline for protecting user data and maintaining trust.

### IV. Independent Tool Architecture
Each tool must be self-contained with its own package.json, dependencies,
and build process. Tools must not have cross-dependencies on other tools.
Each tool must build and deploy independently through the CI/CD matrix.

**Rationale**: Monolithic coupling creates deployment bottlenecks and
cascading failures. Independent tools enable parallel development and
isolated deployments.

### V. Test Coverage Requirements
- E2E tests with Playwright are mandatory for each tool
- Tests must pass before production deployment
- Test failures block the deployment pipeline
- New features require corresponding test coverage

**Rationale**: Untested code is broken code. Automated testing prevents
regression and ensures quality at scale.

### VI. Observability and Debugging
- Error messages must be descriptive and actionable
- Complex logic must include explanatory comments
- Type definitions for complex structures require usage examples
- Build and deployment logs must be comprehensive

**Rationale**: Production issues are inevitable. Good observability
reduces mean time to resolution and improves developer experience.

### VII. Simplicity and Maintainability
- Start simple, follow YAGNI principles
- Maintain backward compatibility
- Consider performance impacts
- Prioritize clear, understandable implementations
- Follow existing code conventions and patterns

**Rationale**: Complex systems fail in complex ways. Simplicity reduces
cognitive load and improves reliability.

## Technology Standards

### Frontend Stack
- **Framework**: Nuxt 3 (SPA mode, SSR disabled)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Build Output**: Static generation via `nuxt generate`

### Infrastructure Stack
- **AWS**: CDK with TypeScript
- **GCP**: Terraform with HCL
- **DNS**: Route53 for all domain management
- **SSL**: Automatic provisioning on both platforms

### Development Standards
- **Node.js**: Version 20+ LTS required
- **Package Management**: npm (not yarn or pnpm)
- **Git Branching**: `develop` → dev env, `main` → production
- **Commit Messages**: Clear, descriptive, conventional format

## Quality Gates

### Pre-Deployment Checks
1. All tests must pass (Playwright E2E)
2. Build must complete successfully
3. No hardcoded secrets or credentials
4. Infrastructure changes must be in IaC

### Code Review Requirements
1. Verify compliance with constitution principles
2. Check for security vulnerabilities
3. Ensure test coverage for new features
4. Validate infrastructure changes are in CDK/Terraform

### Production Deployment
1. Must originate from `main` branch
2. Requires passing CI/CD pipeline
3. Automatic deployment via GitHub Actions
4. Manual infrastructure updates by administrators only

## Governance

### Amendment Process
1. Constitution changes require documented rationale
2. Version bump follows semantic versioning:
   - MAJOR: Removal or redefinition of principles
   - MINOR: New principles or sections added
   - PATCH: Clarifications and wording improvements
3. All dependent artifacts must be updated
4. Changes must be committed with descriptive message

### Compliance Verification
- All pull requests must verify constitutional compliance
- Complexity must be justified against principles
- Use CLAUDE.md for runtime development guidance
- Regular audits of infrastructure drift

### Enforcement
- CI/CD pipeline enforces test requirements
- Code reviews enforce security and quality standards
- Infrastructure changes outside IaC are automatically detected and rejected
- Non-compliant code is blocked from deployment

**Version**: 1.0.0 | **Ratified**: 2025-01-27 | **Last Amended**: 2025-01-27