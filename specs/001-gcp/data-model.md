# Data Model: GCP Removal Entities

## File System Entities

### 1. DirectoryEntity
**Purpose**: Represents directories to be removed
**Attributes**:
- path: string (absolute path)
- reason: string (removal justification)
- contains_files: boolean
- estimated_size: string

**Example**: `infrastructure/terraform/` directory

### 2. FileEntity
**Purpose**: Represents individual files to be removed or modified
**Attributes**:
- path: string (absolute path)
- action: enum (REMOVE, MODIFY)
- content_type: enum (CONFIG, CODE, DOCUMENTATION)
- gcp_references: string[] (list of GCP references found)

**Example**: `firebase.json`, `.github/workflows/deploy.yml`

### 3. CodeReferenceEntity
**Purpose**: Represents GCP references within files that need modification
**Attributes**:
- file_path: string
- line_numbers: number[]
- reference_type: enum (DOMAIN, SERVICE, COMMAND, DOCUMENTATION)
- replacement_strategy: enum (DELETE_LINE, REPLACE_CONTENT, DELETE_SECTION)
- content_snippet: string

**Example**: GCP domain references in Vue components

## Configuration Entities

### 4. WorkflowStepEntity
**Purpose**: Represents GitHub Actions workflow steps related to GCP
**Attributes**:
- workflow_file: string
- step_name: string
- depends_on: string[]
- affects_aws: boolean (whether removal affects AWS deployment)

### 5. DocumentationSectionEntity
**Purpose**: Represents documentation sections to be removed/updated
**Attributes**:
- file_path: string
- section_title: string
- section_content: string
- references_aws: boolean
- replacement_content: string | null

## Constitutional Entities

### 6. ConstitutionalViolationEntity
**Purpose**: Tracks violations of constitutional principles
**Attributes**:
- principle_number: string (e.g., "II")
- principle_name: string
- violation_description: string
- justification: string
- requires_amendment: boolean

**Example**: Multi-Cloud Resilience principle violation

## Validation Rules

### File Removal Rules
- NEVER remove files that contain AWS-only references
- ALWAYS verify removal doesn't break AWS deployment
- ALWAYS backup critical configuration patterns

### Content Modification Rules
- PRESERVE all AWS-related functionality
- REMOVE only GCP-specific references
- UPDATE navigation to remove broken links

### Deployment Integrity Rules
- AWS deployment must remain functional
- No broken references in final state
- All tests must pass after removal