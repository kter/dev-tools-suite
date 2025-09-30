# Implementation Plan: 地図距離計算ツール (Map Distance Calculator)

**Branch**: `008-nuxt-3-nuxt` | **Date**: 2025-09-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-nuxt-3-nuxt/spec.md`

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
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
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
地図距離計算ツール（Map Distance Calculator）は、ユーザーが地図上で2つの地点を選択し、それらの間の大円距離（直線距離）と初期方位角を視覚的に確認できるインタラクティブなウェブアプリケーションです。マーカーのドラッグによる位置調整、複数単位での距離表示、現在位置への移動機能を提供し、東京駅を中心とした初期表示で開始します。技術スタックはNuxt 3、TypeScript、Leaflet 1.9を使用し、OpenStreetMapタイルを利用した静的サイトとして構築されます。

## Technical Context
**Language/Version**: TypeScript (strict mode), Node.js 20+ LTS
**Primary Dependencies**: Nuxt 3 (latest), Leaflet 1.9.x, @nuxtjs/tailwindcss, @types/leaflet
**Storage**: N/A (client-side only, no persistent storage)
**Testing**: Playwright E2E tests
**Target Platform**: Web browsers (modern browsers supporting Geolocation API)
**Project Type**: Single tool project (independent Nuxt 3 SPA)
**Performance Goals**: Interactive map rendering <1s, distance calculations <50ms
**Constraints**: Client-side only (no server), SSR disabled, static site generation
**Scale/Scope**: Single page application, 2 markers max, minimal UI (~320px sidebar + map)

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Infrastructure as Code (NON-NEGOTIABLE)
- ✅ **PASS**: Tool will follow existing IaC patterns
  - AWS infrastructure managed via CDK (TypeScript)
  - GCP infrastructure managed via Terraform
  - No direct console/CLI modifications required
  - Tool added to `infrastructure/cdk/lib/dev-tools-stack.ts`
  - Tool added to `infrastructure/terraform/modules/gcp-infrastructure/main.tf`

### Multi-Cloud Resilience
- ✅ **PASS**: Tool deployable to both AWS and GCP
  - Static site works on both S3+CloudFront and Firebase Hosting
  - No cloud-specific APIs used (client-side only)
  - Landing page navigation includes both AWS and GCP links

### Security-First Development
- ✅ **PASS**: No security concerns
  - No API keys required (OpenStreetMap is attribution-only)
  - No user data storage or persistence
  - No authentication or authorization needed
  - Geolocation API uses browser permissions model

### Independent Tool Architecture
- ✅ **PASS**: Self-contained tool
  - Own package.json with independent dependencies
  - No cross-tool dependencies
  - Independent build process
  - Follows existing tools/* directory structure

### Test Coverage Requirements
- ✅ **PASS**: E2E tests planned
  - Playwright tests for all acceptance scenarios
  - Test map rendering, marker placement, distance calculations
  - Test UI interactions (clear, geolocation)
  - Tests must pass before deployment

### Observability and Debugging
- ✅ **PASS**: Clear error handling
  - Descriptive error messages for geolocation failures
  - Type definitions for all functions and composables
  - Comments for complex geodesy calculations
  - Console logging for debugging during development

### Simplicity and Maintainability
- ✅ **PASS**: Simple, maintainable approach
  - Composable pattern for reusable logic (useGeodesy, useDistanceFormat)
  - Standard Nuxt 3 patterns and conventions
  - Clear separation of concerns (UI, logic, calculations)
  - Follows existing tool structure in codebase

**Constitution Check Result**: ✅ All gates passed, no violations

## Project Structure

### Documentation (this feature)
```
specs/008-nuxt-3-nuxt/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command)
```

### Source Code (repository root)
```
tools/map-distance-calculator/
├── pages/
│   └── index.vue           # Main page with map and sidebar
├── components/
│   ├── MapContainer.vue    # Map rendering with Leaflet
│   └── DistancePanel.vue   # Distance info sidebar
├── composables/
│   ├── useGeodesy.ts       # Haversine & bearing calculations
│   ├── useDistanceFormat.ts # Distance formatting utilities
│   └── useMapMarkers.ts    # Marker management logic
├── plugins/
│   └── leaflet.client.ts   # Client-only Leaflet initialization
├── nuxt.config.ts          # Nuxt config with Leaflet CSS
├── package.json            # Tool-specific dependencies
├── tailwind.config.js      # Tailwind configuration
└── tsconfig.json           # TypeScript configuration

tests/
└── map-distance-calculator.spec.ts  # Playwright E2E tests
```

**Structure Decision**: Single tool project following existing tools/* pattern. Each tool in this repository is an independent Nuxt 3 application with its own dependencies, build process, and deployment configuration. The map-distance-calculator tool will be added as `tools/map-distance-calculator/` and follow the established conventions (SPA mode, static generation, shared components access via `../shared/components`).

## Phase 0: Outline & Research

### Research Tasks

1. **Leaflet Integration with Nuxt 3**
   - How to properly import Leaflet in client-only mode
   - Plugin pattern for dynamic imports
   - TypeScript type definitions (@types/leaflet)
   - CSS integration in nuxt.config.ts

2. **Haversine Formula Implementation**
   - WGS84 ellipsoid constants (R = 6,371,008.8m)
   - Longitude normalization for date line handling
   - Initial bearing calculation formula
   - TypeScript implementation with proper types

3. **Distance Formatting Requirements**
   - Conditional precision logic (km: <10 → 3 decimals, ≥10 → 2 decimals)
   - Unit conversions (m, mile)
   - Bearing display (0-360°)
   - Number formatting in Japanese locale

4. **Marker Management Strategy**
   - Leaflet marker API and draggable markers
   - Distance calculation to determine "nearest marker" on 3rd+ click
   - Polyline rendering and updates
   - Event handling for click and drag events

5. **Geolocation API Best Practices**
   - Browser permission handling
   - Error handling and silent failures
   - Fallback behavior when unavailable
   - Privacy considerations

**Output**: research.md with implementation details for each area

## Phase 1: Design & Contracts

### 1. Data Model
**Entities**:
- `Marker`: { id: 'A' | 'B', lat: number, lng: number, leafletMarker?: L.Marker }
- `DistanceInfo`: { meters: number, km: string, m: string, miles: string, bearing: string }
- `MapState`: { markers: Marker[], polyline?: L.Polyline, distanceInfo?: DistanceInfo }

### 2. API Contracts
Since this is a client-side only application, there are no backend APIs. Instead, we define **internal composable contracts**:

**Composables**:
```typescript
// useGeodesy.ts
export function useGeodesy() {
  return {
    calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number) => number
    calculateBearing: (lat1: number, lng1: number, lat2: number, lng2: number) => number
    normalizeLongitude: (lng: number) => number
  }
}

// useDistanceFormat.ts
export function useDistanceFormat() {
  return {
    formatKm: (meters: number) => string
    formatM: (meters: number) => string
    formatMiles: (meters: number) => string
    formatBearing: (degrees: number) => string
  }
}

// useMapMarkers.ts
export function useMapMarkers(map: Ref<L.Map | null>) {
  return {
    addMarker: (id: 'A' | 'B', lat: number, lng: number) => void
    moveMarker: (id: 'A' | 'B', lat: number, lng: number) => void
    removeAllMarkers: () => void
    findNearestMarker: (lat: number, lng: number) => 'A' | 'B' | null
    updatePolyline: () => void
  }
}
```

### 3. Contract Tests
Since these are TypeScript composables without a network layer, contract tests will be unit tests that verify:
- Type signatures match the declared interfaces
- Functions return expected data structures
- Edge cases are handled (null checks, boundary values)

### 4. Test Scenarios (from user stories)
1. Initial map loads at Tokyo Station (35.681236, 139.767125) with zoom 12
2. Click once → Marker A appears
3. Click twice → Marker B appears, line drawn, distance calculated
4. Drag marker → Distance and bearing update in real-time
5. Third click → Nearest marker moves to new position
6. "Clear" button → All markers and lines removed
7. "Current location" button → Map centers on user location (if available)
8. Geolocation failure → No error shown, map unchanged

### 5. Quickstart
Create `quickstart.md` with:
- How to run the tool locally (`cd tools/map-distance-calculator && npm install && npm run dev`)
- How to run E2E tests (`npx playwright test tests/map-distance-calculator.spec.ts`)
- How to verify distance calculations manually
- How to build for production (`npm run generate`)

### 6. Update Agent Context
Run `.specify/scripts/bash/update-agent-context.sh claude` to add:
- Leaflet 1.9 integration patterns
- Composable structure for geodesy calculations
- Map tool specific conventions

**Outputs**:
- `data-model.md` (entities and state structure)
- `contracts/composables.md` (TypeScript interfaces)
- `quickstart.md` (developer setup guide)
- `CLAUDE.md` update (incremental)

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. **Setup & Configuration** (parallel-safe [P])
   - Create tool directory structure
   - Setup package.json with dependencies
   - Configure nuxt.config.ts with Leaflet CSS
   - Create tailwind.config.js
   - Create tsconfig.json

2. **Composables Implementation** (parallel-safe [P])
   - Implement useGeodesy composable (haversine, bearing, normalization)
   - Implement useDistanceFormat composable (formatting functions)
   - Implement useMapMarkers composable (marker management)
   - Write unit tests for each composable

3. **Plugin & Client-Only Setup**
   - Create plugins/leaflet.client.ts with dynamic import
   - Verify SSR is disabled in nuxt.config

4. **Components Implementation** (depends on composables)
   - Create MapContainer.vue (map rendering, click handlers)
   - Create DistancePanel.vue (sidebar with distance info)
   - Wire up marker dragging and updates

5. **Main Page Assembly**
   - Create pages/index.vue with layout
   - Integrate MapContainer and DistancePanel
   - Add "Clear" and "Current Location" buttons
   - Implement event handlers

6. **E2E Testing** (depends on components)
   - Write Playwright tests for all acceptance scenarios
   - Verify marker placement, dragging, distance calculations
   - Test geolocation handling

7. **Infrastructure Integration**
   - Add tool to CDK stack (createToolInfrastructure call)
   - Add tool to Terraform (locals.tools array)
   - Update GitHub Actions workflow (paths-filter)

8. **Build & Deploy Verification**
   - Run `npm run generate` and verify output
   - Test local deployment
   - Run E2E tests
   - Deploy to dev environment

**Ordering Strategy**:
- TDD order: Composables + tests first, then components, then integration
- Parallel tasks marked [P] for independent execution
- Infrastructure tasks at the end to avoid blocking development

**Estimated Output**: 30-35 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*No constitutional violations - this section is empty*

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✅ 2025-09-30
- [x] Phase 1: Design complete (/plan command) ✅ 2025-09-30
- [x] Phase 2: Task planning complete (/plan command - describe approach only) ✅ 2025-09-30
- [x] Phase 3: Tasks generated (/tasks command) ✅ 2025-09-30
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅ 2025-09-30
- [x] Post-Design Constitution Check: PASS ✅ 2025-09-30
- [x] All NEEDS CLARIFICATION resolved ✅ 2025-09-30
- [x] Complexity deviations documented (none) ✅ 2025-09-30

**Artifacts Generated**:
- [x] research.md (Phase 0)
- [x] data-model.md (Phase 1)
- [x] contracts/composables.md (Phase 1)
- [x] quickstart.md (Phase 1)
- [x] CLAUDE.md updated (Phase 1)

---
*Based on Constitution v1.0.0 - See `.specify/memory/constitution.md`*