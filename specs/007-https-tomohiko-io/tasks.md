# Tasks: Add Footer with Legal Disclosure to All Tools

**Input**: Design documents from `/Users/ttakahashi/workspace/dev-tools-suite/specs/007-https-tomohiko-io/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Extract: Nuxt 3, Vue 3, Tailwind CSS, TypeScript
   → Structure: Multi-tool web application with independent SPAs
2. Load design documents:
   → data-model.md: Footer Component, Tool Application entities
   → contracts/: footer-component.schema.json, tool-footer-test.schema.json
   → research.md: Sub-agent delegation strategy with Serena and Chrome MCP
3. Generate tasks by category:
   → Setup: Landing page legal disclosure link
   → Tests: Contract tests for footer validation
   → Core: Footer implementation per tool using sub-agents
   → Integration: E2E test updates for footer verification
   → Polish: Cross-platform deployment verification
4. Apply task rules:
   → Different tools = mark [P] for parallel execution
   → Test updates = mark [P] for parallel execution
   → Sub-agent delegation for independent tool updates
5. Number tasks sequentially (T001, T002...)
6. SUCCESS: 38 tasks ready for execution
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- **Sub-agent**: Tasks delegated to specialized agents using Serena MCP and Chrome MCP
- Include exact file paths in descriptions

## Phase 3.1: Setup and Analysis
- [x] T001 Analyze current landing page footer implementation in `tools/landing-page/app.vue`
- [x] T002 [P] Create footer component contract tests in `tests/footer-contract.spec.js`
- [x] T003 [P] Create footer visual regression baseline tests in `tests/footer-visual.spec.js`

## Phase 3.2: Landing Page Enhancement (Base Implementation)
- [x] T004 Update landing page footer to include legal disclosure link in `tools/landing-page/app.vue`
- [x] T005 Verify landing page footer styling and responsive design
- [x] T006 Test legal disclosure link functionality on landing page

## Phase 3.3: Individual Tool Footer Implementation (Parallel Sub-agent Tasks) ⚠️ USE SERENA MCP
**CRITICAL: Each task uses sub-agent with Serena MCP for code analysis and Chrome MCP for verification**

### Core Developer Tools (Batch 1)
- [x] T007 [P] **Sub-agent**: Add footer to hash-generator using Serena MCP to analyze `tools/hash-generator/app.vue` and implement footer after main content
- [x] T008 [P] **Sub-agent**: Add footer to qr-generator using Serena MCP to analyze `tools/qr-generator/app.vue` and implement footer after main content
- [x] T009 [P] **Sub-agent**: Add footer to password-generator using Serena MCP to analyze `tools/password-generator/app.vue` and implement footer after main content
- [x] T010 [P] **Sub-agent**: Add footer to unix-time-converter using Serena MCP to analyze `tools/unix-time-converter/app.vue` and implement footer after main content

### Network and IP Tools (Batch 2)
- [x] T011 [P] **Sub-agent**: Add footer to ip-calculator using Serena MCP to analyze `tools/ip-calculator/app.vue` and implement footer after main content
- [x] T012 [P] **Sub-agent**: Add footer to ip-info using Serena MCP to analyze `tools/ip-info/app.vue` and implement footer after main content

### Text and Data Processing Tools (Batch 3)
- [x] T013 [P] **Sub-agent**: Add footer to string-converter using Serena MCP to analyze `tools/string-converter/app.vue` and implement footer after main content
- [x] T014 [P] **Sub-agent**: Add footer to json-yaml-converter using Serena MCP to analyze `tools/json-yaml-converter/app.vue` and implement footer after main content
- [x] T015 [P] **Sub-agent**: Add footer to jwt-decoder using Serena MCP to analyze `tools/jwt-decoder/app.vue` and implement footer after main content
- [x] T016 [P] **Sub-agent**: Add footer to regex-tester using Serena MCP to analyze `tools/regex-tester/app.vue` and implement footer after main content

### Content and Media Tools (Batch 4)
- [x] T017 [P] **Sub-agent**: Add footer to markdown-preview using Serena MCP to analyze `tools/markdown-preview/app.vue` and implement footer after main content
- [x] T018 [P] **Sub-agent**: Add footer to placeholder-generator using Serena MCP to analyze `tools/placeholder-generator/app.vue` and implement footer after main content
- [x] T019 [P] **Sub-agent**: Add footer to image-converter using Serena MCP to analyze `tools/image-converter/app.vue` and implement footer after main content
- [x] T020 [P] **Sub-agent**: Add footer to lorem-ipsum-generator using Serena MCP to analyze `tools/lorem-ipsum-generator/app.vue` and implement footer after main content

### Utility and Conversion Tools (Batch 5)
- [x] T021 [P] **Sub-agent**: Add footer to timezone-converter using Serena MCP to analyze `tools/timezone-converter/app.vue` and implement footer after main content
- [x] T022 [P] **Sub-agent**: Add footer to character-code-converter using Serena MCP to analyze `tools/character-code-converter/app.vue` and implement footer after main content
- [x] T023 [P] **Sub-agent**: Add footer to timer using Serena MCP to analyze `tools/timer/app.vue` and implement footer after main content

### Specialized Tools (Batch 6)
- [x] T024 [P] **Sub-agent**: Add footer to code-diff using Serena MCP to analyze `tools/code-diff/app.vue` and implement footer after main content
- [x] T025 [P] **Sub-agent**: Add footer to mic-test using Serena MCP to analyze `tools/mic-test/app.vue` and implement footer after main content
- [x] T026 [P] **Sub-agent**: Add footer to badger-image-generator using Serena MCP to analyze `tools/badger-image-generator/app.vue` and implement footer after main content
- [x] T027 [P] **Sub-agent**: Add footer to poster-splitter using Serena MCP to analyze `tools/poster-splitter/app.vue` and implement footer after main content

## Phase 3.4: Visual Verification (Chrome MCP Tasks) ⚠️ USE CHROME MCP
**CRITICAL: Each task uses Chrome MCP for browser-based verification**

### Visual and Responsive Design Testing
- [ ] T028 [P] **Chrome MCP**: Verify footer display and responsive design on hash-generator, qr-generator, password-generator, unix-time-converter
- [ ] T029 [P] **Chrome MCP**: Verify footer display and responsive design on ip-calculator, ip-info, string-converter, json-yaml-converter
- [ ] T030 [P] **Chrome MCP**: Verify footer display and responsive design on jwt-decoder, regex-tester, markdown-preview, placeholder-generator
- [ ] T031 [P] **Chrome MCP**: Verify footer display and responsive design on image-converter, lorem-ipsum-generator, timezone-converter, character-code-converter
- [ ] T032 [P] **Chrome MCP**: Verify footer display and responsive design on timer, code-diff, mic-test, badger-image-generator, poster-splitter

### Legal Disclosure Link Testing
- [ ] T033 [P] **Chrome MCP**: Test legal disclosure link functionality across all tools - verify opens https://www.tomohiko.io/legal-disclosure in new tab

## Phase 3.5: E2E Test Updates
- [ ] T034 [P] Update Playwright test for hash-generator to include footer verification in `tests/hash-generator.spec.js`
- [ ] T035 [P] Update Playwright tests for core tools (qr-generator, password-generator, unix-time-converter) to include footer verification
- [ ] T036 [P] Update Playwright tests for remaining tools to include footer verification

## Phase 3.6: Integration and Polish
- [ ] T037 Run comprehensive footer validation across all tools using contract schema
- [ ] T038 Verify multi-cloud deployment compatibility (AWS/GCP) with footer implementation

## Dependencies
- T001-T003 (setup) before all implementation tasks
- T004-T006 (landing page) before tool implementation (T007-T027)
- Tool implementation (T007-T027) before visual verification (T028-T033)
- Visual verification before E2E test updates (T034-T036)
- All implementation before integration testing (T037-T038)

## Parallel Execution Examples

### Sub-agent Tool Implementation (Batch 1)
```bash
# Launch T007-T010 together using Task tool with serena-expert agent:
Task: "Add footer to hash-generator using Serena MCP to analyze tools/hash-generator/app.vue and implement footer after main content"
Task: "Add footer to qr-generator using Serena MCP to analyze tools/qr-generator/app.vue and implement footer after main content"
Task: "Add footer to password-generator using Serena MCP to analyze tools/password-generator/app.vue and implement footer after main content"
Task: "Add footer to unix-time-converter using Serena MCP to analyze tools/unix-time-converter/app.vue and implement footer after main content"
```

### Chrome MCP Visual Verification
```bash
# Launch T028-T032 together using Chrome MCP:
Task: "Verify footer display and responsive design on hash-generator, qr-generator, password-generator, unix-time-converter using Chrome MCP"
Task: "Verify footer display and responsive design on ip-calculator, ip-info, string-converter, json-yaml-converter using Chrome MCP"
# ... continue for all batches
```

## Footer Implementation Template
Each sub-agent should implement this exact footer structure:

```html
<footer class="mt-20 text-center text-gray-500 dark:text-gray-400">
  <p>
    &copy; 2025 DevTools. Built with Nuxt 3 and deployed on AWS.
    <span class="mx-2">|</span>
    <a
      href="https://www.tomohiko.io/legal-disclosure"
      target="_blank"
      rel="noopener noreferrer"
      class="hover:text-gray-700 dark:hover:text-gray-300 underline transition-colors"
    >
      特定商取引法に基づく表記
    </a>
  </p>
</footer>
```

## Sub-agent Instructions

### For Serena MCP Tasks (T007-T027)
1. Use `mcp__serena__get_symbols_overview` to analyze the tool's app.vue structure
2. Use `mcp__serena__find_symbol` to locate the main template content
3. Use `mcp__serena__insert_after_symbol` to add footer after main content and before closing div
4. Ensure footer uses exact template above with consistent styling
5. Verify no syntax errors and proper Vue template structure

### For Chrome MCP Tasks (T028-T033)
1. Navigate to tool URL (dev environment: `https://[tool-name].dev.devtools.site`)
2. Take screenshot to verify footer appears at bottom of page
3. Test responsive design at mobile (320px), tablet (768px), and desktop (1200px) viewports
4. Verify dark mode compatibility by toggling theme
5. Click legal disclosure link and verify it opens https://www.tomohiko.io/legal-disclosure in new tab
6. Confirm footer styling matches design specifications

## Notes
- All [P] tasks target different files and can run in parallel
- Sub-agent delegation maintains tool independence per constitutional requirements
- Serena MCP provides token-efficient code modification
- Chrome MCP ensures visual consistency and functionality
- Legal disclosure link must use exact URL: https://www.tomohiko.io/legal-disclosure
- Footer styling must support both light and dark themes

## Validation Checklist
*GATE: Checked before task completion*

- [x] All tools have corresponding footer implementation tasks
- [x] All implementation tasks use Serena MCP for code analysis
- [x] All verification tasks use Chrome MCP for visual testing
- [x] Parallel tasks truly independent (different files)
- [x] Each task specifies exact file path and agent requirements
- [x] Legal disclosure link URL consistent across all tasks
- [x] Footer template matches landing page design
- [x] Responsive design verification included
- [x] E2E test updates planned for all tools