# Quickstart Guide: Map Distance Calculator

**Feature**: 008-nuxt-3-nuxt
**Date**: 2025-09-30

## Prerequisites
- Node.js 20+ LTS installed
- npm package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Local Development Setup

### 1. Navigate to Tool Directory
```bash
cd tools/map-distance-calculator
```

### 2. Install Dependencies
```bash
npm install
```

**Expected dependencies**:
- `nuxt` (latest v3)
- `leaflet` (1.9.x)
- `@nuxtjs/tailwindcss`
- `@types/leaflet` (dev dependency)

### 3. Run Development Server
```bash
npm run dev
```

**Expected output**:
```
Nuxt 3.x.x with Nitro 2.x.x

  ➜ Local:   http://localhost:3000/
  ➜ Network: use --host to expose
```

### 4. Open in Browser
Navigate to `http://localhost:3000`

**Expected UI**:
- Map centered on Tokyo Station (35.681236, 139.767125)
- Zoom level 12
- Sidebar on the left (~320px width) with:
  - Title: "地図距離計算"
  - "クリア" button
  - "現在地へ" button
  - Empty distance info panel
- Interactive OpenStreetMap tiles

## Manual Testing Scenarios

### Test 1: Basic Marker Placement
1. **Action**: Click anywhere on the map
2. **Expected**: Marker A appears with tooltip "A"
3. **Action**: Click different location
4. **Expected**:
   - Marker B appears with tooltip "B"
   - Blue line connects A and B
   - Sidebar shows distance in km, m, mile
   - Sidebar shows bearing (0-360°)

### Test 2: Marker Dragging
1. **Setup**: Place markers A and B
2. **Action**: Drag marker A to new location
3. **Expected**:
   - Marker A moves smoothly
   - Line updates in real-time
   - Distance values recalculate
   - Bearing updates

### Test 3: Third Click Behavior
1. **Setup**: Place markers A and B
2. **Action**: Click location near marker A
3. **Expected**: Marker A moves to clicked location (nearest marker)
4. **Action**: Click location near marker B
5. **Expected**: Marker B moves to clicked location

### Test 4: Distance Accuracy
**Test Tokyo to Osaka**:
1. Place marker A at Tokyo Station: ~35.681, 139.767
2. Place marker B at Osaka Station: ~34.694, 135.502
3. **Expected Distance**: ~400km (398-402km acceptable)
4. **Expected Bearing**: ~245° (Southwest)

**Test Short Distance**:
1. Place markers very close (~100m apart)
2. **Expected**:
   - km shows 3 decimals (e.g., "0.098 km")
   - m shows 1 decimal (e.g., "98.4 m")

**Test Long Distance**:
1. Place markers far apart (~1000km)
2. **Expected**: km shows 2 decimals (e.g., "1023.45 km")

### Test 5: Clear Functionality
1. **Setup**: Place markers A and B
2. **Action**: Click "クリア" button
3. **Expected**:
   - Both markers disappear
   - Line disappears
   - Distance panel clears

### Test 6: Geolocation
1. **Action**: Click "現在地へ" button
2. **Browser prompts**: Allow location access
3. **Expected**: Map centers on your current location
4. **Action**: Click "現在地へ" button
5. **Browser prompts**: Deny location access
6. **Expected**: Map stays at current position, no error message

### Test 7: Date Line Crossing
1. Place marker A at: 0°N, 179°E
2. Place marker B at: 0°N, -179°W
3. **Expected**: Distance ~222km (NOT half Earth circumference)
4. **Validates**: Longitude normalization is working

## Running E2E Tests

### Install Playwright (if not already installed)
```bash
npx playwright install
```

### Run All E2E Tests
```bash
# From repository root
npx playwright test tests/map-distance-calculator.spec.ts
```

### Run Tests in UI Mode (Interactive)
```bash
npx playwright test tests/map-distance-calculator.spec.ts --ui
```

### Run Specific Test
```bash
npx playwright test tests/map-distance-calculator.spec.ts -g "marker placement"
```

**Expected test scenarios**:
- Initial map rendering
- Marker A placement
- Marker B placement with distance calculation
- Marker dragging and updates
- Third click behavior
- Clear button functionality
- Geolocation button (success and failure cases)

## Building for Production

### Generate Static Site
```bash
npm run generate
```

**Expected output**:
```
ℹ Building Nuxt
✔ Nuxt built in xxxms
ℹ Generating pages
✔ Generated .output/public
```

### Verify Build Output
```bash
ls -la .output/public/
```

**Expected files**:
- `index.html` (main page)
- `_nuxt/` (JavaScript bundles, CSS)
- `favicon.ico`

### Preview Production Build Locally
```bash
npx serve .output/public
```

Navigate to `http://localhost:3000` and verify all functionality works.

## Verifying Distance Calculations

### Manual Calculation Check
Use this reference to verify haversine calculations:

**Formula**:
```
R = 6,371,008.8 m (WGS84 mean radius)
a = sin²(Δφ/2) + cos φ1 ⋅ cos φ2 ⋅ sin²(Δλ/2)
c = 2 ⋅ atan2(√a, √(1−a))
d = R ⋅ c
```

**Known reference distances**:
- Tokyo (35.681, 139.767) ↔ Osaka (34.694, 135.502): ~400km
- New York (40.7128, -74.0060) ↔ London (51.5074, -0.1278): ~5,570km
- North Pole (90, 0) ↔ South Pole (-90, 0): ~20,015km (half Earth circumference)

### Online Calculators (for comparison)
- https://www.movable-type.co.uk/scripts/latlong.html
- https://www.nhc.noaa.gov/gccalc.shtml

Compare your tool's output with these calculators (±0.1% tolerance acceptable).

## Debugging Tips

### Map Not Rendering
- Check browser console for errors
- Verify Leaflet CSS is loaded: inspect `<head>` for `leaflet.css`
- Check network tab for tile loading (should see requests to OpenStreetMap)

### Distance Calculations Wrong
- Verify EARTH_RADIUS = 6,371,008.8m in `useGeodesy()`
- Check longitude normalization is applied
- Test with known reference points

### Markers Not Appearing
- Check console for Leaflet errors
- Verify map is initialized: `map.value` should not be null
- Check marker creation in devtools: markers should be in DOM

### TypeScript Errors
- Ensure `@types/leaflet` is installed
- Check `tsconfig.json` includes Nuxt types
- Verify `nuxt.config.ts` has `typescript.strict: true`

## Common Issues

**Issue**: "window is not defined" during build
**Solution**: Verify `plugins/leaflet.client.ts` uses `.client.ts` suffix and dynamic import

**Issue**: Map tiles not loading
**Solution**: Check internet connection, OpenStreetMap tile server may be rate-limited

**Issue**: Geolocation not working
**Solution**: Requires HTTPS in production (localhost HTTP is fine for dev)

**Issue**: Markers disappear after refresh
**Solution**: Expected behavior, no state persistence by design

## Success Criteria

You have successfully set up the tool when:
- ✅ Map renders at Tokyo Station with zoom 12
- ✅ Clicking places markers A and B
- ✅ Distance between markers is displayed in km, m, and miles
- ✅ Bearing is displayed (0-360°)
- ✅ Markers are draggable with real-time updates
- ✅ Third click moves nearest marker
- ✅ "Clear" button removes all markers
- ✅ "Current location" button centers map (when allowed)
- ✅ All E2E tests pass
- ✅ Production build generates static files
- ✅ No console errors in browser

## Next Steps

After verifying local functionality:
1. Review implementation against `spec.md` requirements
2. Run full E2E test suite
3. Deploy to dev environment (AWS + GCP)
4. Update landing page to include new tool
5. Verify multi-cloud deployment works

## Support

If you encounter issues:
1. Check browser console for errors
2. Review `research.md` for implementation details
3. Verify against `contracts/composables.md` specifications
4. Compare with existing tools in `tools/*` directory
5. Check `CLAUDE.md` for codebase conventions