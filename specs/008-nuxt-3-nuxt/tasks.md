# Tasks: 地図距離計算ツール (Map Distance Calculator)

**Input**: Design documents from `/specs/008-nuxt-3-nuxt/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/composables.md, quickstart.md
**Branch**: `008-nuxt-3-nuxt`

## Execution Flow (main)
```
1. Load plan.md from feature directory ✅
   → Tech stack: Nuxt 3, TypeScript, Leaflet 1.9, Tailwind CSS
   → Structure: Single tool at tools/map-distance-calculator/
2. Load optional design documents: ✅
   → data-model.md: Marker, DistanceInfo, MapState entities
   → contracts/: useGeodesy, useDistanceFormat, useMapMarkers
   → research.md: Leaflet client-only pattern, haversine formula
3. Generate tasks by category: ✅
   → Setup: directory structure, dependencies, configs
   → Tests: composable unit tests, E2E tests
   → Core: composables, components, pages
   → Integration: infrastructure, landing page
   → Polish: build verification, deployment
4. Apply task rules: ✅
   → Different files = [P] for parallel
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001-T038) ✅
6. Generate dependency graph ✅
7. Create parallel execution examples ✅
8. Validate task completeness: ✅
   → All composables have unit tests ✅
   → All components implemented ✅
   → All acceptance scenarios have E2E tests ✅
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Phase 3.1: Project Setup

- [ ] **T001** Create tool directory structure
  - Create `tools/map-distance-calculator/` with subdirectories:
    - `pages/`, `components/`, `composables/`, `plugins/`
  - Path: `tools/map-distance-calculator/`

- [ ] **T002** Initialize package.json with dependencies
  - Create `tools/map-distance-calculator/package.json`
  - Add dependencies: `nuxt` (latest), `leaflet@^1.9.0`, `@nuxtjs/tailwindcss`
  - Add devDependencies: `@types/leaflet`, `typescript@^5.0.0`
  - Add scripts: `dev`, `build`, `generate`, `preview`
  - Path: `tools/map-distance-calculator/package.json`

- [ ] **T003** Configure nuxt.config.ts
  - Create `tools/map-distance-calculator/nuxt.config.ts`
  - Set `workspaceDir: '../../'`
  - Set `ssr: false`, `nitro.preset: 'static'`
  - Add `css: ['leaflet/dist/leaflet.css']`
  - Configure components to include `../shared/components`
  - Add Tailwind module
  - Configure app.head with Japanese title and meta tags
  - Path: `tools/map-distance-calculator/nuxt.config.ts`

- [ ] **T004** [P] Configure tailwind.config.js
  - Create `tools/map-distance-calculator/tailwind.config.js`
  - Follow existing tools pattern
  - Path: `tools/map-distance-calculator/tailwind.config.js`

- [ ] **T005** [P] Configure tsconfig.json
  - Create `tools/map-distance-calculator/tsconfig.json`
  - Extend Nuxt TypeScript config
  - Set strict mode
  - Path: `tools/map-distance-calculator/tsconfig.json`

- [ ] **T006** [P] Create Leaflet client plugin
  - Create `tools/map-distance-calculator/plugins/leaflet.client.ts`
  - Implement dynamic import: `const L = await import('leaflet')`
  - Provide Leaflet to app: `provide: { leaflet: L.default }`
  - Path: `tools/map-distance-calculator/plugins/leaflet.client.ts`

## Phase 3.2: Composables Unit Tests (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] **T007** [P] Unit test for useGeodesy composable
  - Create `tools/map-distance-calculator/composables/useGeodesy.spec.ts`
  - Test `calculateDistance()`:
    - Same point returns 0
    - Tokyo-Osaka returns ~400000m (±5000m tolerance)
    - Date line crossing (0°, 179° to 0°, -179°) returns ~222390m
    - Pole to pole returns ~20015086m
  - Test `calculateBearing()`:
    - East (0,0 to 0,1) returns 90°
    - North (0,0 to 1,0) returns 0°
    - West (0,0 to 0,-1) returns 270°
    - South (0,0 to -1,0) returns 180°
  - Test `normalizeLongitude()`:
    - 181 returns -179
    - -181 returns 179
    - 360 returns 0
  - Tests MUST FAIL initially (composable doesn't exist yet)
  - Path: `tools/map-distance-calculator/composables/useGeodesy.spec.ts`

- [ ] **T008** [P] Unit test for useDistanceFormat composable
  - Create `tools/map-distance-calculator/composables/useDistanceFormat.spec.ts`
  - Test `formatKm()`:
    - 1234m returns "1.234 km" (< 10km: 3 decimals)
    - 12345m returns "12.35 km" (≥ 10km: 2 decimals)
  - Test `formatM()`:
    - 123.45m returns "123.5 m" (1 decimal)
  - Test `formatMiles()`:
    - 1609.344m returns "1.000 mile" (3 decimals)
  - Test `formatBearing()`:
    - 45.67° returns "45.7°" (1 decimal)
  - Tests MUST FAIL initially
  - Path: `tools/map-distance-calculator/composables/useDistanceFormat.spec.ts`

- [ ] **T009** [P] Unit test for useMapMarkers composable
  - Create `tools/map-distance-calculator/composables/useMapMarkers.spec.ts`
  - Test `findNearestMarker()`:
    - No markers returns null
    - Only A exists returns 'A'
    - Only B exists returns 'B'
    - Both exist, closer to A returns 'A'
    - Both exist, closer to B returns 'B'
  - Note: Other functions require DOM/Leaflet, test via E2E
  - Tests MUST FAIL initially
  - Path: `tools/map-distance-calculator/composables/useMapMarkers.spec.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] **T010** [P] Implement useGeodesy composable
  - Create `tools/map-distance-calculator/composables/useGeodesy.ts`
  - Define `EARTH_RADIUS = 6371008.8` (WGS84 mean radius)
  - Implement `toRadians()` and `toDegrees()` helper functions
  - Implement `normalizeLongitude()` using atan2
  - Implement `calculateDistance()` using haversine formula:
    - a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
    - c = 2 ⋅ atan2(√a, √(1−a))
    - d = R ⋅ c
  - Implement `calculateBearing()` using atan2-based formula
  - Add JSDoc comments explaining formulas
  - Verify T007 tests now pass
  - Path: `tools/map-distance-calculator/composables/useGeodesy.ts`

- [ ] **T011** [P] Implement useDistanceFormat composable
  - Create `tools/map-distance-calculator/composables/useDistanceFormat.ts`
  - Implement `formatKm()` with conditional precision:
    - If km < 10: use `.toFixed(3)`
    - Else: use `.toFixed(2)`
  - Implement `formatM()` with `.toFixed(1)`
  - Implement `formatMiles()` with conversion (1609.344m/mile) and `.toFixed(3)`
  - Implement `formatBearing()` with `.toFixed(1)` and "°" suffix
  - Verify T008 tests now pass
  - Path: `tools/map-distance-calculator/composables/useDistanceFormat.ts`

- [ ] **T012** [P] Implement useMapMarkers composable
  - Create `tools/map-distance-calculator/composables/useMapMarkers.ts`
  - Accept `map: Ref<L.Map | null>` parameter
  - Create reactive refs: `markers: Ref<{A?: L.Marker, B?: L.Marker}>`
  - Create reactive ref: `polyline: Ref<L.Polyline | null>`
  - Implement `addMarker(id, lat, lng)`:
    - Remove existing marker if present
    - Create draggable marker with tooltip
    - Add to map
  - Implement `moveMarker(id, lat, lng)`:
    - Update marker position via `setLatLng()`
  - Implement `findNearestMarker(lat, lng)`:
    - Use `useGeodesy().calculateDistance()` to compare distances
    - Return 'A', 'B', or null
  - Implement `updatePolyline()`:
    - Remove existing polyline
    - If both markers exist, create new polyline (color: #3b82f6, weight: 3)
  - Implement `removeAllMarkers()`:
    - Remove all markers and polyline from map
  - Verify T009 tests now pass
  - Path: `tools/map-distance-calculator/composables/useMapMarkers.ts`

- [ ] **T013** Create DistancePanel component
  - Create `tools/map-distance-calculator/components/DistancePanel.vue`
  - Accept props: `distanceInfo: DistanceInfo | null`
  - Display distance in km, m, miles (show "---" if null)
  - Display bearing (show "---" if null)
  - Use Japanese labels: "距離", "方位角"
  - Style: ~320px width, sidebar layout, Tailwind classes
  - Path: `tools/map-distance-calculator/components/DistancePanel.vue`

- [ ] **T014** Create MapContainer component
  - Create `tools/map-distance-calculator/components/MapContainer.vue`
  - Wrap map div in `<ClientOnly>` tag
  - Create reactive `map: Ref<L.Map | null>`
  - On mount:
    - Initialize Leaflet map at Tokyo Station (35.681236, 139.767125), zoom 12
    - Add OpenStreetMap tile layer with attribution
  - Use `useMapMarkers(map)` composable
  - Implement map click handler:
    - Count clicks (1st → add A, 2nd → add B, 3rd+ → move nearest)
    - Call `addMarker()` or `moveMarker()` + `findNearestMarker()`
    - Emit 'markersUpdated' event with marker positions
  - Implement marker dragend handler:
    - Call `updatePolyline()`
    - Emit 'markersUpdated' event
  - Expose `centerMap(lat, lng)` method via defineExpose
  - Path: `tools/map-distance-calculator/components/MapContainer.vue`

- [ ] **T015** Create main page (index.vue)
  - Create `tools/map-distance-calculator/pages/index.vue`
  - Layout: 2-column (sidebar left, map right)
  - Import `MapContainer` and `DistancePanel` components
  - Create reactive state:
    - `markerA: Ref<{lat: number, lng: number} | null>`
    - `markerB: Ref<{lat: number, lng: number} | null>`
    - `distanceInfo: Ref<DistanceInfo | null>`
  - Add "クリア" button:
    - Calls MapContainer's removeAllMarkers()
    - Resets markerA, markerB, distanceInfo to null
  - Add "現在地へ" button:
    - Uses `navigator.geolocation.getCurrentPosition()`
    - On success: calls MapContainer's `centerMap()`
    - On failure: silent (no action)
  - Handle 'markersUpdated' event:
    - Update markerA and markerB state
    - If both exist, calculate distance and bearing using composables
    - Update distanceInfo state
  - Pass distanceInfo to DistancePanel
  - Add Japanese title: "地図距離計算ツール"
  - Path: `tools/map-distance-calculator/pages/index.vue`

## Phase 3.4: End-to-End Tests

- [ ] **T016** Create E2E test suite
  - Create `tests/map-distance-calculator.spec.ts`
  - Import Playwright test utilities
  - Define baseURL (localhost:3000 or deployed URL)
  - Path: `tests/map-distance-calculator.spec.ts`

- [ ] **T017** E2E test: Initial map rendering
  - Test: "displays map at Tokyo Station with zoom 12"
  - Navigate to page
  - Verify map container exists
  - Verify page title contains "地図距離計算"
  - Path: `tests/map-distance-calculator.spec.ts` (add test case)

- [ ] **T018** E2E test: Marker A placement
  - Test: "places marker A on first click"
  - Click map at specific coordinates
  - Verify marker A appears (check for tooltip "A")
  - Verify distance panel shows "---" (no distance yet)
  - Path: `tests/map-distance-calculator.spec.ts` (add test case)

- [ ] **T019** E2E test: Marker B placement with distance
  - Test: "places marker B on second click and shows distance"
  - Setup: place marker A
  - Click map at different coordinates
  - Verify marker B appears (tooltip "B")
  - Verify line connecting A and B is visible
  - Verify distance panel shows km, m, mile values (non-empty)
  - Verify bearing is shown (0-360°)
  - Path: `tests/map-distance-calculator.spec.ts` (add test case)

- [ ] **T020** E2E test: Marker dragging
  - Test: "updates distance when marker is dragged"
  - Setup: place markers A and B
  - Get initial distance value
  - Drag marker A to new position
  - Verify distance value changed
  - Verify line updated
  - Path: `tests/map-distance-calculator.spec.ts` (add test case)

- [ ] **T021** E2E test: Third click behavior
  - Test: "moves nearest marker on third click"
  - Setup: place markers A and B
  - Click near marker A
  - Verify marker A moved to new position
  - Verify marker B didn't move
  - Path: `tests/map-distance-calculator.spec.ts` (add test case)

- [ ] **T022** E2E test: Clear button
  - Test: "removes all markers and clears distance on clear button click"
  - Setup: place markers A and B
  - Click "クリア" button
  - Verify markers A and B removed
  - Verify line removed
  - Verify distance panel shows "---"
  - Path: `tests/map-distance-calculator.spec.ts` (add test case)

- [ ] **T023** E2E test: Geolocation success (mock)
  - Test: "centers map on current location when geolocation succeeds"
  - Grant geolocation permissions
  - Mock geolocation to return specific coordinates
  - Click "現在地へ" button
  - Verify map centered at mocked coordinates
  - Path: `tests/map-distance-calculator.spec.ts` (add test case)

- [ ] **T024** E2E test: Distance accuracy
  - Test: "calculates Tokyo-Osaka distance accurately"
  - Place marker A at Tokyo Station (35.681236, 139.767125)
  - Place marker B at Osaka Station (34.693738, 135.502165)
  - Verify distance is approximately 400km (398-402km acceptable)
  - Verify bearing is approximately 245° (Southwest)
  - Path: `tests/map-distance-calculator.spec.ts` (add test case)

- [ ] **T025** E2E test: Date line handling
  - Test: "handles date line crossing correctly"
  - Place marker A at 0°N, 179°E
  - Place marker B at 0°N, -179°W
  - Verify distance is approximately 222km (not half Earth circumference)
  - Path: `tests/map-distance-calculator.spec.ts` (add test case)

## Phase 3.5: Infrastructure Integration

- [ ] **T026** Add tool to AWS CDK stack
  - Edit `infrastructure/cdk/lib/dev-tools-stack.ts`
  - Add `createToolInfrastructure('map-distance-calculator', ...)` call
  - Follow existing tool pattern for S3 bucket and CloudFront distribution
  - Path: `infrastructure/cdk/lib/dev-tools-stack.ts`

- [ ] **T027** Add tool to GCP Terraform configuration
  - Edit `infrastructure/terraform/modules/gcp-infrastructure/main.tf`
  - Add 'map-distance-calculator' to `locals.tools` array
  - Verify Firebase Hosting site will be created
  - Path: `infrastructure/terraform/modules/gcp-infrastructure/main.tf`

- [ ] **T028** Update GitHub Actions workflow
  - Edit `.github/workflows/deploy.yml`
  - Add 'map-distance-calculator' to paths-filter section
  - Ensure tool is included in matrix strategy
  - Path: `.github/workflows/deploy.yml`

- [ ] **T029** Update landing page (AWS)
  - Edit `tools/landing-page/pages/index.vue`
  - Add card for "地図距離計算ツール"
  - Link to `/map-distance-calculator` (AWS) or `map-distance-calculator.dev.devtools.site`
  - Add description and icon
  - Path: `tools/landing-page/pages/index.vue`

- [ ] **T030** Update landing page (GCP)
  - Edit `tools/landing-page/pages/index.vue`
  - Add GCP link: `map-distance-calculator.gcp.dev.devtools.site`
  - Ensure cross-platform navigation works
  - Path: `tools/landing-page/pages/index.vue` (same file as T029)

## Phase 3.6: Build & Deployment Verification

- [ ] **T031** Install dependencies and verify
  - Run `cd tools/map-distance-calculator && npm install`
  - Verify all dependencies installed without errors
  - Check for peer dependency warnings
  - Path: `tools/map-distance-calculator/`

- [ ] **T032** Run development server and manual test
  - Run `npm run dev` in tool directory
  - Open browser to http://localhost:3000
  - Manually verify:
    - Map renders at Tokyo Station
    - Can place markers A and B
    - Distance calculations appear correct
    - Drag, clear, geolocation buttons work
  - Path: `tools/map-distance-calculator/`

- [ ] **T033** Run unit tests
  - Run test command (e.g., `npm run test` or `vitest`)
  - Verify all composable unit tests pass
  - Check coverage is reasonable (>80% for composables)
  - Path: `tools/map-distance-calculator/`

- [ ] **T034** Run E2E tests locally
  - Run `npx playwright test tests/map-distance-calculator.spec.ts`
  - Verify all acceptance scenario tests pass
  - Review test screenshots/videos if available
  - Path: Repository root

- [ ] **T035** Build production bundle
  - Run `npm run generate` in tool directory
  - Verify `.output/public/` directory created
  - Check bundle size is reasonable (<2MB total)
  - Verify index.html, _nuxt/ assets exist
  - Path: `tools/map-distance-calculator/`

- [ ] **T036** Test production build locally
  - Run `npx serve .output/public` or `npm run preview`
  - Open browser and test all functionality
  - Verify no console errors
  - Check Leaflet tiles load correctly
  - Path: `tools/map-distance-calculator/`

- [ ] **T037** Deploy to dev environment
  - Push branch to trigger GitHub Actions
  - Monitor deployment workflow
  - Verify AWS deployment succeeds (S3 + CloudFront)
  - Verify GCP deployment succeeds (Firebase Hosting)
  - Check both dev URLs are accessible:
    - `https://map-distance-calculator.dev.devtools.site` (AWS)
    - `https://map-distance-calculator.gcp.dev.devtools.site` (GCP)
  - Path: N/A (CI/CD)

- [ ] **T038** Verify deployed application
  - Test AWS deployed version:
    - All functionality works
    - Map tiles load
    - Distance calculations accurate
    - No console errors
  - Test GCP deployed version:
    - Feature parity with AWS version
    - Cross-platform navigation from landing page works
  - Run E2E tests against deployed URLs
  - Path: N/A (deployed environments)

## Dependencies

### Critical Path
```
T001 (structure) → T002 (package.json) → T003 (nuxt.config)
  → T006 (leaflet plugin)
  → T007-T009 (unit tests) [P]
  → T010-T012 (composables) [P]
  → T013 (DistancePanel)
  → T014 (MapContainer)
  → T015 (index page)
  → T016-T025 (E2E tests)
  → T031-T038 (build & deploy)
```

### Parallel Opportunities
- **Setup Phase**: T004, T005 (configs) after T003
- **Test Phase**: T007, T008, T009 (unit tests) independent
- **Implementation Phase**: T010, T011, T012 (composables) independent
- **Infrastructure**: T026, T027, T028 can be done in parallel

### Blocking Dependencies
- T007-T009 must complete before T010-T012 (TDD)
- T010-T012 must complete before T013-T015 (components need composables)
- T013-T015 must complete before T016-T025 (E2E needs working app)
- T031 must complete before T032-T036 (need dependencies to run)
- T035 must complete before T037 (need build artifacts to deploy)

## Parallel Execution Examples

### Example 1: Unit Test Creation (T007-T009)
```bash
# All three can run simultaneously (different files)
Task 1: "Create useGeodesy unit test in tools/map-distance-calculator/composables/useGeodesy.spec.ts"
Task 2: "Create useDistanceFormat unit test in tools/map-distance-calculator/composables/useDistanceFormat.spec.ts"
Task 3: "Create useMapMarkers unit test in tools/map-distance-calculator/composables/useMapMarkers.spec.ts"
```

### Example 2: Composable Implementation (T010-T012)
```bash
# All three can run simultaneously (different files)
Task 1: "Implement useGeodesy in tools/map-distance-calculator/composables/useGeodesy.ts"
Task 2: "Implement useDistanceFormat in tools/map-distance-calculator/composables/useDistanceFormat.ts"
Task 3: "Implement useMapMarkers in tools/map-distance-calculator/composables/useMapMarkers.ts"
```

### Example 3: Configuration Files (T004-T005)
```bash
# Can run after T003 completes
Task 1: "Configure Tailwind in tools/map-distance-calculator/tailwind.config.js"
Task 2: "Configure TypeScript in tools/map-distance-calculator/tsconfig.json"
```

### Example 4: Infrastructure Updates (T026-T028)
```bash
# All can run simultaneously (different files)
Task 1: "Add tool to CDK stack in infrastructure/cdk/lib/dev-tools-stack.ts"
Task 2: "Add tool to Terraform in infrastructure/terraform/modules/gcp-infrastructure/main.tf"
Task 3: "Update GitHub Actions in .github/workflows/deploy.yml"
```

## Validation Checklist

- [x] All composables have corresponding unit tests (T007-T009)
- [x] All tests come before implementation (T007-T009 before T010-T012)
- [x] All acceptance scenarios have E2E tests (T017-T025)
- [x] Parallel tasks are truly independent (different files, no shared state)
- [x] Each task specifies exact file path
- [x] No [P] task modifies same file as another [P] task
- [x] TDD order enforced (tests → implementation)
- [x] Dependencies documented clearly
- [x] Infrastructure integration included (T026-T028)
- [x] Build and deployment verification included (T031-T038)

## Notes

- **TDD Discipline**: Tasks T007-T009 MUST be completed before T010-T012. Tests must fail initially.
- **Leaflet Client-Only**: Ensure T006 plugin uses `.client.ts` suffix to avoid SSR issues.
- **Distance Accuracy**: Test T024 validates haversine implementation correctness.
- **Multi-Cloud**: Tasks T026-T028 ensure tool deploys to both AWS and GCP.
- **Constitution Compliance**: All tasks follow constitutional principles (IaC, testing, independence).
- **Commit Strategy**: Commit after completing each task or logical group.
- **Testing First**: E2E tests (T016-T025) validate all acceptance scenarios from spec.md.

## Success Criteria

Implementation is complete when:
- ✅ All 38 tasks are checked off
- ✅ All unit tests pass (T007-T012)
- ✅ All E2E tests pass (T016-T025)
- ✅ Production build succeeds (T035)
- ✅ Tool deployed to both AWS and GCP (T037)
- ✅ Manual testing scenarios from quickstart.md pass (T032, T038)
- ✅ No console errors in deployed versions
- ✅ Landing page updated with new tool links (T029-T030)

---
*Generated from plan.md, research.md, data-model.md, contracts/composables.md, and spec.md*
*Ready for execution on branch 008-nuxt-3-nuxt*