# Feature Specification: Universal Support Me Button Implementation

**Feature Branch**: `006-landing-page-support`
**Created**: 2025-09-29
**Status**: Draft
**Input**: User description: "全てのツールにおいて、landing-pageのようにSupport Meフローティングボタンをページ下部70％までスクロールしたら消えるようにしてください"

## Execution Flow (main)
```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors, actions, data, constraints
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (if data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements
- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation
When creating this spec from a user prompt:
1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., "login system" without auth method), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## Clarifications

### Session 2025-09-29
- Q: What support mechanism should the button use across all tools? → A: Same Ko-fi integration as landing page (kofiUsername prop required)
- Q: How should the support button component be distributed to all tools? → A: Shared component in tools/shared/ directory (import from ../shared/)
- Q: What Ko-fi username should be used across all tools? → A: same as landing-page 'kterr'
- Q: How should the component handle different tool page structures? → A: Auto-detect scroll container (document.body vs main content area)
- Q: What testing strategy should cover all 23 tools? → A: Individual E2E tests for every tool (23 separate test files)

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a user of any developer tool in the suite (hash generator, QR generator, password generator, etc.), I want to see a Support Me floating button that is initially visible when I load the page and then disappears smoothly when I scroll to 70% of the page height, so that I can easily support the developer when I first arrive but the button doesn't obstruct my view of content near the end of the page.

### Acceptance Scenarios
1. **Given** I visit any tool page (hash-generator, qr-generator, password-generator, etc.), **When** the page loads completely, **Then** the Support Me floating button should be visible and accessible
2. **Given** the Support Me button is visible on any tool page, **When** I scroll down to 70% of the page height, **Then** the button should fade out smoothly with the same behavior as the landing page
3. **Given** I have scrolled past 70% and the button is hidden, **When** I scroll back up above the 70% threshold, **Then** the button should fade back in consistently across all tools
4. **Given** a tool page has content shorter than the viewport, **When** I view the page, **Then** the button should remain visible at all times
5. **Given** I click the Support Me button on any tool, **When** the click is processed, **Then** the Ko-fi support page should open in a new tab with the same integration as the landing page

### Edge Cases
- What happens when tools have different content heights and scroll behaviors?
- How does the system handle tools with different layouts (single page vs multi-section)?
- What happens when users rapidly switch between different tools?
- How does the button behave on mobile devices with different viewport sizes across tools?

### Testing Requirements
- Individual E2E test files must be created for all 23 developer tools to ensure consistent button behavior
- Each test must verify: initial visibility, 70% scroll threshold, fade animations, Ko-fi integration, and accessibility compliance
- Tests must validate auto-detection of scroll containers works correctly for each tool's specific layout

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: All developer tools MUST display a Support Me floating button visible on initial page load
- **FR-002**: Each tool MUST implement identical scroll position tracking to the landing page (70% threshold)
- **FR-003**: Button MUST fade out smoothly when user scrolls to 70% of page height on any tool
- **FR-004**: Button MUST fade back in when user scrolls above the 70% threshold on any tool
- **FR-005**: System MUST maintain consistent button styling and positioning across all tools
- **FR-006**: System MUST preserve button visibility for pages shorter than viewport height on all tools
- **FR-007**: Button MUST use identical smooth CSS transitions (300ms) across all tools for consistency
- **FR-008**: System MUST respect user's reduced motion preferences by disabling animations on all tools
- **FR-009**: Button MUST maintain consistent accessibility attributes (ARIA labels, focus states) across all tools
- **FR-010**: Button MUST provide identical Ko-fi integration across all tools using kofiUsername='kterr'
- **FR-011**: System MUST implement consistent scroll event throttling (100ms) across all tools for performance
- **FR-012**: Button MUST be positioned consistently (bottom-left, 20px margins) across all 23 developer tools
- **FR-013**: System MUST auto-detect appropriate scroll container (document.body vs main content area) to handle different tool layouts without breaking button functionality

### Key Entities
- **Universal Support Button Component**: Reusable component located in tools/shared/ directory with standardized scroll behavior, styling, and positioning for deployment across all tools via ../shared/ imports
- **Scroll Position Tracker**: Standardized scroll percentage calculation with auto-detection of scroll container and threshold detection for consistent behavior across different page heights and layouts
- **Tool Integration Interface**: Mechanism for each tool to incorporate the support button without modifying existing tool-specific functionality

---

## Review & Acceptance Checklist
*GATE: Automated checks run during main() execution*

### Content Quality
- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness
- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status
*Updated by main() during processing*

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

---