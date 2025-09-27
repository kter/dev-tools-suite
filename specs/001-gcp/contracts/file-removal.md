# File Removal Contract

## Operations

### removeDirectory(path: string, verify_empty: boolean = true)
**Purpose**: Remove entire directories related to GCP
**Preconditions**:
- Directory exists
- Directory contains only GCP-related files
- No AWS dependencies in directory
**Postconditions**:
- Directory is completely removed
- No broken references remain
- AWS deployment unaffected

**Example**: `removeDirectory("infrastructure/terraform/")`

### removeFile(path: string, backup: boolean = false)
**Purpose**: Remove individual GCP-related files
**Preconditions**:
- File exists
- File contains only GCP configuration
- No shared AWS/GCP content
**Postconditions**:
- File is removed
- No broken imports/references
- Optional backup created

**Example**: `removeFile("firebase.json")`

### cleanWorkflowStep(workflow_path: string, step_pattern: string)
**Purpose**: Remove GCP deployment steps from GitHub Actions
**Preconditions**:
- Workflow file exists
- Steps are clearly identifiable as GCP-only
- AWS deployment steps preserved
**Postconditions**:
- GCP steps removed
- AWS workflow remains functional
- Dependencies correctly updated

### updateDocumentation(file_path: string, remove_sections: string[])
**Purpose**: Remove GCP references from documentation
**Preconditions**:
- Documentation file exists
- Sections clearly marked for removal
- AWS documentation preserved
**Postconditions**:
- GCP sections removed
- AWS information intact
- Links updated or removed