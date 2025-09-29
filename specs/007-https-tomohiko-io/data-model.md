# Data Model: Footer Implementation

## Entities

### Footer Component (UI Entity)
- **Purpose**: Consistent footer display across all developer tools
- **Fields**:
  - `copyright`: string - Copyright notice text
  - `buildInfo`: string - Technology stack information
  - `legalDisclosureUrl`: string - URL to legal disclosure page
  - `legalDisclosureText`: string - Display text for legal link
- **Relationships**:
  - One-to-one with each tool's app.vue component
  - No cross-tool dependencies
- **State**: Static content, no dynamic state management required

### Tool Application (Container Entity)
- **Purpose**: Individual developer tool application
- **Fields**:
  - `toolName`: string - Unique identifier for the tool
  - `hasFooter`: boolean - Indicates if footer is implemented
  - `footerPosition`: string - CSS class positioning for footer
- **Relationships**:
  - Contains footer component
  - Independent of other tool applications
- **Validation Rules**:
  - Each tool must have exactly one footer
  - Footer must be positioned after main content

### Legal Disclosure Link (External Reference)
- **Purpose**: Link to external legal compliance page
- **Fields**:
  - `url`: string - "https://www.tomohiko.io/legal-disclosure"
  - `linkText`: string - "特定商取引法に基づく表記"
  - `target`: string - "_blank" (new tab/window)
  - `rel`: string - "noopener noreferrer" (security attributes)
- **Validation Rules**:
  - URL must be valid HTTPS URL
  - Must open in new tab for external navigation
  - Must include security attributes for external links

## State Transitions

### Footer Implementation State
```
[No Footer] → [Footer Added] → [Footer Tested] → [Footer Deployed]
```

**State Descriptions**:
- **No Footer**: Tool exists without footer component
- **Footer Added**: Footer HTML/Vue template added to app.vue
- **Footer Tested**: Footer functionality verified via E2E tests
- **Footer Deployed**: Footer live on both AWS and GCP platforms

### Tool Update Process
```
[Identify Tool] → [Analyze Structure] → [Implement Footer] → [Verify Display] → [Test Links] → [Complete]
```

## Validation Rules

### Footer Content Validation
- Copyright year must be current (2025)
- Legal disclosure link must point to exact URL: https://www.tomohiko.io/legal-disclosure
- Footer text must be accessible and screen-reader friendly
- Footer styling must support both light and dark themes

### Responsive Design Validation
- Footer must display correctly on mobile viewports (320px+)
- Footer must display correctly on tablet viewports (768px+)
- Footer must display correctly on desktop viewports (1024px+)
- Footer text must remain readable at all viewport sizes

### Link Behavior Validation
- Legal disclosure link must open in new tab/window
- Link must include proper security attributes (rel="noopener noreferrer")
- Link hover state must provide visual feedback
- Link must be keyboard accessible (tab navigation)

## Data Constraints

### Technical Constraints
- Footer implementation must not exceed 50 lines of HTML/Vue template
- Footer styling must use only existing Tailwind CSS classes
- Footer must not introduce new dependencies to any tool
- Footer must not affect existing tool functionality

### Content Constraints
- Copyright notice: Fixed format "© 2025 DevTools"
- Build information: "Built with Nuxt 3 and deployed on AWS"
- Legal text: Exact Japanese text "特定商取引法に基づく表記"
- Separator: Use " | " between content sections

### Performance Constraints
- Footer must not impact tool loading time
- Footer must not affect tool bundle size significantly (<1KB addition)
- Footer must render without layout shift
- Footer styles must not conflict with existing tool styles