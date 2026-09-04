# DRM04 Disaster Response Platform — Design System v2

> **Design direction:** Apple-inspired, calm, precise, human-centered, operationally trustworthy.  
> **Primary goal:** Make disaster reporting, verification, response, and decision-making feel immediate, understandable, and trustworthy — without looking like an AI-generated dashboard.

---

# 0. Table of Contents

**Foundations** — [1](#1-design-north-star) North Star · [2](#2-design-principles) Principles · [3](#3-visual-personality) Visual Personality · [4](#4-color-architecture) Color · [5](#5-accent-system) Accent · [6](#6-semantic-colors) Semantic Colors · [7](#7-ai--verification-visual-language) AI/Verification Language · [8](#8-typography) Typography · [9](#9-display-typography) Display Type · [10](#10-typography-rules) Type Rules · [11](#11-layout-system) Layout · [22](#22-radius-system) Radius · [45](#45-motion-system) Motion System · [69](#69-design-tokens) Design Tokens · [70](#70-z-index-architecture) Z-Index

**Structure & Navigation** — [12](#12-page-composition) Page Composition · [13](#13-responsive-design) Responsive · [14](#14-navigation) Navigation · [15](#15-navigation-states) Nav States · [59](#59-responsive-content-priority) Responsive Priority · [63](#63-information-density) Density

**Components** — [16](#16-buttons) Buttons · [17](#17-button-hierarchy) Button Hierarchy · [18](#18-interaction-states) Interaction States (canonical) · [19](#19-cards) Cards · [20](#20-elevation) Elevation · [21](#21-liquid-glass) Liquid Glass · [23](#23-forms) Forms · [24](#24-input-specification) Inputs · [35](#35-tables) Tables · [36](#36-status-badges) Badges · [37](#37-alerts) Alerts · [38](#38-toasts) Toasts · [39](#39-modal-dialogs) Modals · [40](#40-bottom-sheets) Bottom Sheets · [52](#52-iconography) Iconography · [53](#53-icon-rules) Icon Rules

**Product Flows** — [25](#25-report-submission-ux) Report Submission · [26](#26-report-progress) Report Progress · [27](#27-evidence-upload) Evidence Upload · [28](#28-location-ux) Location UX · [29](#29-maps) Maps · [30](#30-map-marker-system) Map Markers · [31](#31-dashboard-philosophy) Dashboard Philosophy · [32](#32-authority-dashboard) Authority Dashboard · [33](#33-metrics) Metrics · [34](#34-data-visualization) Data Viz · [60](#60-mobile-report-screen) Mobile Report Screen · [61](#61-mobile-sticky-cta) Mobile Sticky CTA · [62](#62-desktop-detail-view) Desktop Detail View · [64](#64-search) Search · [65](#65-filtering) Filtering · [66](#66-destructive-actions) Destructive Actions · [68](#68-notification-priority) Notifications

**States & Content** — [41](#41-empty-states) Empty · [42](#42-loading-states) Loading · [43](#43-error-states) Error · [44](#44-offline--poor-network) Offline · [54](#54-content-design) Content Design · [55](#55-ai-ux) AI UX · [56](#56-trust--provenance) Trust & Provenance · [57](#57-privacy) Privacy · [58](#58-security-ux) Security UX · [67](#67-microcopy) Microcopy

**Quality & Ops** — [46](#46-motion-patterns) Motion Patterns · [47](#47-reduced-motion) Reduced Motion · [48](#48-accessibility) Accessibility · [49](#49-touch-targets) Touch Targets · [50](#50-focus) Focus · [51](#51-accessibility-beyond-color) Beyond Color · [71](#71-component-architecture) Component Architecture · [72](#72-component-consistency) Consistency · [73](#73-design-anti-patterns) Anti-Patterns · [74](#74-apple-inspired--apple-clone) Apple-Inspired ≠ Clone · [75](#75-premium-visual-formula)–[76](#76-visual-hierarchy-formula) Visual/Hierarchy Formula · [77](#77-performance)–[78](#78-motion-performance) Performance · [79](#79-dark-mode)–[80](#80-dark-mode-principle) Dark Mode · [81](#81-internationalization)–[82](#82-indian-context) i18n/India Context · [83](#83-device-testing)–[90](#90-final-rule) QA & Checklists · [91](#91-implementation-directive) Implementation Directive · [92](#92-design-references) References

---

# 0.1 Changelog

*Fill this in with real deltas — it's a placeholder, not a record of what actually changed.*

```text
## v2 — [date]
- What changed from v1 and why (one line per change)
- Open questions left for v3

## v1 — [date]
- Initial version
```

Keep this at the top going forward. A 2,000+ line spec with no changelog means every future reader has to diff the whole file to find out what moved.

---

# 1. Design North Star

The interface should feel like a **premium public-service product**, not a generic SaaS dashboard.

### The experience should communicate

**Calm under pressure**  
Users may interact with the platform during stressful situations. Reduce cognitive load rather than adding visual noise.

**Trust before decoration**  
Every visual treatment must reinforce clarity, provenance, confidence, or action.

**One decision at a time**  
Each screen should make the next meaningful action obvious.

**Human authority**  
AI can assist assessment and prioritization, but verified human decisions remain visually and semantically authoritative.

**Progressive disclosure**  
Show essential information first. Reveal complexity only when the user asks for it.

**Native-feeling interaction**  
Controls should behave predictably and consistently across the entire product.

**Premium restraint**  
Avoid visual effects whose only purpose is to look impressive.

---

# 2. Design Principles

1. **Purpose over decoration**
2. **Clarity over density**
3. **Hierarchy over uniformity**
4. **Content over chrome**
5. **Human verification over AI confidence**
6. **Progressive disclosure over overwhelming interfaces**
7. **Motion with purpose**
8. **Accessibility from the beginning**
9. **Responsive behavior is designed, not merely scaled**
10. **Every state is intentional**
11. **Every action has feedback**
12. **Every destructive action is recoverable where possible**
13. **Privacy is visible without becoming distracting**
14. **Use familiar interaction patterns**
15. **Premium does not mean complicated**

---

# 3. Visual Personality

The product should feel:

- Calm
- Intelligent
- Reliable
- Modern
- Institutional
- Precise
- Human
- Fast
- Accessible
- Operational

It should **not** feel:

- Cyberpunk
- Gaming-inspired
- Cryptocurrency-like
- Overly futuristic
- Neon
- AI-template-generated
- Excessively glassy
- Gradient-heavy
- Card-heavy
- Over-animated

---

# 4. Color Architecture

The existing navy/amber foundation is retained, but the palette becomes more semantic and adaptive.

## 4.1 Brand Neutrals

```css
--ink-950: #0B1020;
--ink-900: #111827;
--ink-800: #1F2937;
--ink-700: #374151;
--ink-600: #4B5563;
--ink-500: #6B7280;
--ink-400: #9CA3AF;
--ink-300: #D1D5DB;
--ink-200: #E5E7EB;
--ink-100: #F1F3F5;
--ink-50:  #F8FAFC;
```

## 4.2 Surfaces

```css
--surface-page: #F7F8FA;
--surface-primary: #FFFFFF;
--surface-secondary: #F3F5F7;
--surface-tertiary: #ECEFF2;
--surface-inverse: #0B1020;
```

Do not use pure white everywhere.

Use subtle surface differentiation to establish hierarchy without excessive shadows.

---

# 5. Accent System

Amber remains the primary brand accent.

```css
--accent-700: #92400E;
--accent-600: #B45309;
--accent-500: #D97706;
--accent-400: #F59E0B;
--accent-300: #FBBF24;
--accent-100: #FEF3C7;
--accent-50:  #FFFBEB;
```

### Accent usage

Amber is reserved for:

- Primary actions
- Active navigation
- Important attention states
- Verification actions
- Key data highlights
- Progress indicators
- Selected controls

### Never

- Use amber as the background of large page sections.
- Use amber for every button.
- Use amber simply because something is important.
- Turn every status into an amber badge.

---

# 6. Semantic Colors

The platform needs a semantic system beyond brand color.

```css
--success-600: #15803D;
--success-500: #16A34A;
--success-100: #DCFCE7;
--success-50:  #F0FDF4;

--warning-600: #B45309;
--warning-500: #D97706;
--warning-100: #FEF3C7;
--warning-50:  #FFFBEB;

--danger-600: #B91C1C;
--danger-500: #DC2626;
--danger-100: #FEE2E2;
--danger-50:  #FEF2F2;

--info-600: #0369A1;
--info-500: #0284C7;
--info-100: #E0F2FE;
--info-50:  #F0F9FF;
```

### Critical rule

**Never communicate status through color alone.**

Use:

- Color
- Icon
- Label
- Optional supporting text

Example:

`● Verified`

not simply a green dot.

---

# 7. AI / Verification Visual Language

AI and human verification must have unmistakably different visual semantics.

## AI-generated information

Use:

- Neutral surface
- Small AI indicator
- "AI assessment" label
- Confidence displayed numerically or categorically
- Timestamp
- Source/provenance where applicable

Example:

```text
AI Assessment
High likelihood of structural damage

Confidence 87%
Generated 2 min ago
```

## Human verification

Human verification receives stronger authority.

```text
✓ Human Verified
Verified by Response Officer
4 min ago
```

Human verification should never look like merely another AI badge.

---

# 8. Typography

Geist remains the primary typeface.

```css
font-family:
  Geist,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

### Indic script fallback

Geist has no Devanagari or other Indic glyphs, so §81's Indian-language requirement has nothing to render with yet. Extend the stack per active locale rather than bundling every script at once — a single font file covering all of them fights the low-bandwidth requirement in §82:

```css
/* Hindi / Marathi locale */
font-family:
  Geist,
  "Noto Sans",
  "Noto Sans Devanagari",
  -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

Load the matching Noto Sans subset (Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Gurmukhi, Odia…) only for the locale in use. Keep numerals as Western Arabic (0–9) across all locales — that's standard in Indian digital products even inside Devanagari/regional-script UI, so §10's tabular-numeral rule doesn't need to change.

## Type scale

```css
--text-xs:   12px;
--text-sm:   14px;
--text-md:   16px;
--text-lg:   18px;
--text-xl:   21px;
--text-2xl:  28px;
--text-3xl:  36px;
--text-4xl:  48px;
--text-5xl:  64px;
```

## Body

Default body text:

```css
font-size: 16px;
line-height: 1.5;
font-weight: 400;
```

Do not force 17px everywhere.

Use 17px where a large reading-oriented surface benefits from it.

---

# 9. Display Typography

Large headings use restrained negative tracking.

```css
letter-spacing: -0.035em;
```

Do not over-tighten small text.

### Example hierarchy

```text
Eyebrow
12px / 600

Page title
36px / 600

Section title
21px / 600

Body
16px / 400

Supporting text
14px / 400
```

---

# 10. Typography Rules

### Do

- Use short headings.
- Use sentence case.
- Prefer verbs for actions.
- Keep labels predictable.
- Use numbers with strong hierarchy.
- Use tabular numerals for dashboards and metrics.

### Avoid

- ALL CAPS for normal navigation.
- Excessive bold text.
- Long paragraphs inside cards.
- Decorative typography.
- Five different text weights in one component.

---

# 11. Layout System

Use a 4px base grid.

```css
4
8
12
16
20
24
32
40
48
64
80
96
```

## Container widths

```css
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1200px;
--container-2xl: 1440px;
```

Desktop application content should generally remain within:

```text
1200–1440px
```

Avoid unnecessarily stretching content across ultra-wide displays.

### Breakpoints ↔ containers

The test viewports in §83 and the container tokens above describe the same scale — keep them mapped explicitly so they don't drift apart:

| Range | Container | Test viewport (§83) | Layout mode (§13) |
|---|---|---|---|
| 0–599px | fluid | 360, 390 | Mobile |
| 600–1023px | fluid → `--container-md` | 768 | Tablet |
| 1024–1439px | `--container-lg` / `--container-xl` | 1280 | Desktop |
| 1440px+ | `--container-2xl` cap | 1440, 1920 | Desktop (capped) |

---

# 12. Page Composition

Prefer this hierarchy:

```text
Global Navigation
        ↓
Page Context
        ↓
Primary Action / Key Metric
        ↓
Primary Content
        ↓
Supporting Information
        ↓
Secondary Actions
```

Do not create equal visual weight for every section.

---

# 13. Responsive Design

Responsive design must change **information priority**, not merely column count.

## Desktop

Use:

- Persistent navigation
- Multi-column layouts
- Data tables
- Maps
- Side panels
- Rich dashboards

## Tablet

Use:

- Collapsible navigation
- Reduced columns
- Larger touch targets
- Condensed tables

## Mobile

Use:

- Bottom navigation where appropriate
- Single-column content
- Sticky primary action
- Progressive disclosure
- Bottom sheets instead of oversized modal dialogs
- Simplified data visualization

---

# 14. Navigation

Navigation should answer three questions immediately:

1. Where am I?
2. What can I do?
3. What needs my attention?

## Citizen navigation

Keep navigation extremely small.

Example:

```text
Home
Report
My Reports
Alerts
Profile
```

## Authority navigation

Example:

```text
Overview
Reports
Map
Response
Analytics
Settings
```

Do not expose every feature in the primary navigation.

---

# 15. Navigation States

Every navigation item has:

- Default
- Hover
- Focus
- Active
- Disabled

Active navigation should use a subtle surface treatment plus an accent indicator.

Avoid oversized colored pills around navigation items.

---

# 16. Buttons

Buttons should feel tactile but quiet.

## Primary

```text
Background: accent-500
Text: white
Height: 44px
Radius: 10px
```

## Secondary

```text
Background: surface-primary
Border: ink-200
Text: ink-900
Height: 44px
Radius: 10px
```

## Tertiary

Text button with no container.

## Destructive

Use danger semantic colors.

## Icon button

Minimum interaction area:

```text
44 × 44px
```

even when the visible icon is smaller.

---

# 17. Button Hierarchy

A screen should normally contain:

```text
1 Primary CTA
0–2 Secondary actions
Additional actions inside menus
```

If everything is primary, nothing is primary.

---

# 18. Interaction States

Every interactive component must define:

```text
Default
Hover
Focus-visible
Pressed
Disabled
Loading
Success
Error
```

No component should be considered complete without all relevant states.

---

# 19. Cards

Cards should be used only when grouping information provides meaningful comprehension.

### Default card

```css
background: var(--surface-primary);
border: 1px solid var(--ink-200);
border-radius: 16px;
```

Use:

```text
16–24px
```

internal spacing depending on content density.

### Important

Do not turn every piece of information into a card.

Prefer:

```text
Page
 ├── Heading
 ├── Metrics
 ├── Table
 └── Supporting section
```

over:

```text
Card
Card
Card
Card
Card
Card
```

---

# 20. Elevation

Use elevation sparingly.

Recommended hierarchy:

```text
Level 0 — page surface
Level 1 — cards / panels
Level 2 — popovers / menus
Level 3 — dialogs / sheets
Level 4 — critical overlays
```

Prefer borders and surface contrast before shadows.

### Shadow tokens

```css
--shadow-xs:
  0 1px 2px rgba(15, 23, 42, 0.04);

--shadow-sm:
  0 2px 8px rgba(15, 23, 42, 0.06);

--shadow-md:
  0 8px 24px rgba(15, 23, 42, 0.08);

--shadow-lg:
  0 20px 50px rgba(15, 23, 42, 0.12);
```

Never use shadows to compensate for poor hierarchy.

---

# 21. Liquid Glass

Glass remains an enhancement, not the foundation.

Use it for:

- Floating navigation
- Contextual overlays
- Map controls
- Bottom sheets
- Temporary panels
- Important transient surfaces

Do not use glass for:

- Every card
- Every button
- Every section
- Long-form reading surfaces
- Dense tables

### Glass token

```css
background: rgba(255,255,255,0.72);
backdrop-filter: blur(20px) saturate(1.4);
-webkit-backdrop-filter: blur(20px) saturate(1.4);
border: 1px solid rgba(255,255,255,0.65);
```

Always provide a solid fallback when backdrop filtering is unavailable.

---

# 22. Radius System

Avoid excessive rounded containers.

```css
--radius-sm: 8px;
--radius-md: 10px;
--radius-lg: 14px;
--radius-xl: 18px;
--radius-2xl: 24px;
--radius-pill: 999px;
```

Recommended:

```text
Inputs: 10px
Buttons: 10px
Cards: 16px
Dialogs: 18–24px
Pills: 999px
```

---

# 23. Forms

Forms should feel calm and sequential.

Use:

```text
Label
Helper text
Input
Validation message
```

Do not rely on placeholder text as the label.

---

# 24. Input Specification

```css
height: 44px;
padding: 0 14px;
border-radius: 10px;
border: 1px solid var(--ink-200);
background: var(--surface-primary);
```

Focus:

```css
border-color: var(--accent-500);
box-shadow: 0 0 0 3px rgba(217,119,6,0.14);
```

Error:

```css
border-color: var(--danger-500);
```

Success:

```css
border-color: var(--success-500);
```

---

# 25. Report Submission UX

The disaster-reporting workflow should be optimized for speed.

Preferred sequence:

```text
1. What happened?
        ↓
2. Where?
        ↓
3. What is affected?
        ↓
4. Add evidence
        ↓
5. Review
        ↓
6. Submit
```

Do not make users complete a giant form.

Use progressive disclosure.

---

# 26. Report Progress

Show a simple progress indicator.

```text
1 Incident
2 Location
3 Evidence
4 Review
```

The user should always know:

- Current step
- Completed steps
- Remaining steps

---

# 27. Evidence Upload

Evidence should support:

- Camera
- Gallery
- Files
- Location
- Timestamp

After upload:

```text
Preview
File name
Upload status
Validation status
Remove action
```

Never make users wonder whether an image actually uploaded.

---

# 28. Location UX

Location should be treated as a first-class interaction.

Show:

```text
Current location
Accuracy
Address
Map preview
Edit location
```

If GPS confidence is low:

```text
Location accuracy is low
Move the pin to improve accuracy.
```

Never silently assume location is correct.

---

# 29. Maps

Maps are operational tools, not decoration.

Prioritize:

1. Current incident
2. Severity
3. Verification status
4. Response status
5. User location
6. Supporting layers

Avoid displaying every possible layer simultaneously.

---

# 30. Map Marker System

Markers must remain understandable at multiple zoom levels.

Use:

```text
Critical
High
Moderate
Low
Verified
Unverified
Responding
Resolved
```

Never rely on color alone.

Markers should combine:

- Shape
- Icon
- Color
- Label when zoom permits

---

# 31. Dashboard Philosophy

The authority dashboard should answer:

```text
What is happening?
Where is it happening?
How serious is it?
What has been verified?
What needs action now?
What changed recently?
```

If a dashboard cannot answer those questions within a few seconds, the information hierarchy is wrong.

---

# 32. Authority Dashboard

Recommended composition:

```text
┌──────────────────────────────────────────────┐
│ Header / Global status                       │
├──────────────────────────────────────────────┤
│ Critical metrics                             │
├─────────────────────────────┬────────────────┤
│                             │ Priority queue  │
│          LIVE MAP           │                │
│                             │                │
├─────────────────────────────┴────────────────┤
│ Recent reports / operational activity        │
└──────────────────────────────────────────────┘
```

The map should generally be the visual center of operational monitoring.

---

# 33. Metrics

Metrics should emphasize decisions, not vanity numbers.

Good:

```text
18
Reports awaiting verification
```

Better than:

```text
18
Total Reports
```

when the actionable metric is verification backlog.

Use:

```text
Value
Label
Trend
Context
```

Example:

```text
24
Critical incidents
↑ 6 since 09:00
```

---

# 34. Data Visualization

Charts should answer a question.

Examples:

```text
Incident volume over time
Response time trend
Severity distribution
Geographic concentration
Verification backlog
```

Avoid charts merely because empty dashboard space exists.

---

# 35. Tables

Tables are appropriate for authority workflows.

Required features:

- Sort
- Filter
- Search
- Pagination or virtualization
- Row focus
- Responsive fallback
- Empty state
- Loading state
- Error state

Important columns should appear first.

On mobile, transform tables into stacked information rows rather than forcing horizontal scrolling whenever practical.

---

# 36. Status Badges

Use badges for compact status only.

Good:

```text
Verified
Pending
Critical
Responding
Resolved
```

Bad:

```text
Every category
Every number
Every label
```

Badges should not dominate the interface.

---

# 37. Alerts

Alerts should be prioritized by urgency.

```text
Critical
Warning
Information
Success
```

Critical alerts should be:

- Persistent when necessary
- Dismissible when safe
- Actionable
- Clearly explained

Do not use toast notifications for critical information.

---

# 38. Toasts

Toasts are for lightweight feedback.

Good:

```text
Report submitted
Photo uploaded
Changes saved
```

Bad:

```text
Critical disaster detected
Emergency response required
```

Critical information belongs in the main interface.

---

# 39. Modal Dialogs

Use dialogs for decisions requiring focused attention.

Examples:

- Delete report
- Confirm assignment
- Review verification
- Important privacy decision

Avoid dialogs for ordinary navigation.

---

# 40. Bottom Sheets

Use bottom sheets on mobile for:

- Filters
- Map details
- Report details
- Secondary actions

They should support:

```text
Drag / close
Clear title
Primary action
```

Do not hide essential information behind gestures.

---

# 41. Empty States

Every empty state should answer:

1. What is empty?
2. Why?
3. What can I do?

Example:

```text
No reports yet

Reports submitted from this account
will appear here.

[Submit a report]
```

Never display:

```text
No data
```

alone.

---

# 42. Loading States

Prefer skeletons for content-heavy surfaces.

Skeletons should approximate:

- Text dimensions
- Card dimensions
- Image dimensions
- Table structure

Do not animate every element aggressively.

Respect reduced-motion preferences.

---

# 43. Error States

Errors should be useful.

Structure:

```text
Something went wrong

We couldn't load recent reports.

[Try again]
```

If the issue is actionable:

```text
Your session expired.

[Sign in again]
```

Never expose raw stack traces or technical implementation details to normal users.

---

# 44. Offline / Poor Network

Because disaster response may occur under unreliable connectivity, the interface should explicitly support degraded connectivity.

Show:

```text
Offline
Last synced 2 min ago
```

Queue actions where technically possible.

Example:

```text
Report saved locally
Will upload when connection returns
```

Never pretend an operation succeeded remotely when it only succeeded locally.

---

# 45. Motion System

Motion should communicate:

- State
- Spatial relationship
- Progress
- Confirmation
- Focus

Not decoration.

```css
--motion-fast: 120ms;
--motion-normal: 180ms;
--motion-slow: 280ms;
```

Use ease-out for most UI transitions.

---

# 46. Motion Patterns

### Page transition

Subtle fade:

```text
opacity 0 → 1
```

### Modal

```text
opacity + small scale
```

### Drawer

```text
translate + fade
```

### Button press

Very subtle scale:

```text
0.98
```

Avoid exaggerated bouncing.

---

# 47. Reduced Motion

Always respect:

```css
@media (prefers-reduced-motion: reduce)
```

Disable:

- Decorative motion
- Repetitive animation
- Large transforms
- Pulsing indicators

Replace motion with immediate state changes or subtle fades.

---

# 48. Accessibility

Target:

**WCAG 2.2 AA.**

Requirements:

- Keyboard navigation
- Visible focus
- Semantic HTML
- Screen-reader labels
- Sufficient contrast
- Logical heading hierarchy
- Form labels
- Error announcements
- Accessible dialogs
- Accessible tables
- Reduced motion
- Minimum comfortable touch targets

WCAG 2.2 specifically includes requirements around focus visibility and minimum pointer target size.

---

# 49. Touch Targets

Default interactive target:

```text
44 × 44px
```

This is a design best practice for comfortable interaction even though WCAG 2.2's minimum target-size criterion is 24 × 24 CSS pixels under specified conditions.

Maintain sufficient spacing between adjacent controls.

---

# 50. Focus

Never remove focus indicators.

Preferred:

```css
outline: 2px solid var(--accent-500);
outline-offset: 3px;
```

Focus must remain visible even inside:

- Modals
- Sticky headers
- Sidebars
- Bottom sheets
- Tables
- Menus

WCAG 2.2 adds explicit guidance around ensuring focus is not obscured.

---

# 51. Accessibility Beyond Color

Never communicate:

```text
Critical = red only
Verified = green only
AI = purple only
```

Instead:

```text
Icon + label + color + context
```

This also makes the system easier to understand at a glance.

---

# 52. Iconography

Use one consistent icon family.

Recommended:

- Lucide
- Phosphor
- Another single coherent SVG icon system

Do not mix random icon libraries.

Icons should generally be:

```text
16px — inline
18px — controls
20px — standard UI
24px — prominent controls
32px+ — empty states
```

Never use emojis as primary interface icons.

---

# 53. Icon Rules

Icons must:

- Have consistent stroke weight
- Have accessible labels where needed
- Never replace critical text unnecessarily
- Align optically with adjacent text

Icon-only controls require accessible names.

---

# 54. Content Design

Use direct language.

Prefer:

```text
Submit report
Verify incident
Assign response team
View location
```

Avoid:

```text
Proceed with submission
Initiate verification workflow
```

The interface should sound like a capable human assistant, not a government form generator.

---

# 55. AI UX

AI should be transparent.

Whenever AI is involved, expose:

```text
What AI did
Why it matters
Confidence
Timestamp
Human verification status
```

Never present AI predictions as facts.

Preferred:

```text
AI assessment
Possible structural damage

Confidence: 87%

Needs human verification
```

Not:

```text
Structural damage detected
```

unless independently verified.

---

# 56. Trust & Provenance

Important information should support provenance.

Where applicable show:

```text
Source
Timestamp
Location
Verification status
Reporter
AI-assisted / Human verified
```

This is especially important for authority workflows.

---

# 57. Privacy

Privacy information should be:

- Visible
- Short
- Understandable
- Contextual

Avoid enormous privacy banners.

Example:

```text
Your location is used to improve incident accuracy.
```

Provide:

```text
Why?
What is collected?
Who can access it?
```

when users need more information.

---

# 58. Security UX

Never rely on visual hiding for security.

Sensitive information must be protected by:

- Authorization
- Server-side access control
- Secure APIs
- Database policies
- Proper authentication

The frontend only communicates the state.

---

# 59. Responsive Content Priority

When space decreases, remove secondary information first.

Priority:

```text
1 Critical status
2 Primary action
3 Core content
4 Supporting context
5 Secondary controls
6 Decorative elements
```

Never hide the primary action simply because the viewport became smaller.

---

# 60. Mobile Report Screen

Recommended structure:

```text
Report an Incident

What happened?
[Incident type]

Where?
[Map / location]

What is affected?
[Category]

Add evidence
[Camera] [Photos]

────────────

[Review Report]
```

The primary CTA remains visible near the bottom.

---

# 61. Mobile Sticky CTA

For long workflows:

```text
┌──────────────────────────────────┐
│        Review Report             │
└──────────────────────────────────┘
```

Use a subtle surface with safe-area support.

Never obscure focused inputs or keyboard content.

---

# 62. Desktop Detail View

Use a split layout where appropriate:

```text
┌───────────────────────────┬──────────────────┐
│                           │ Incident details │
│                           │                  │
│           MAP             │ Status           │
│                           │ Evidence         │
│                           │ Verification     │
│                           │ Actions          │
└───────────────────────────┴──────────────────┘
```

The map and details should remain contextually synchronized.

---

# 63. Information Density

Citizen experience:

```text
Low density
Large touch targets
Minimal choices
Clear CTA
```

Authority experience:

```text
Medium/high density
Tables
Filters
Maps
Metrics
Keyboard efficiency
```

Do not force the same UI density onto both audiences.

---

# 64. Search

Search should feel immediate.

Provide:

- Clear search field
- Recent searches where useful
- Search suggestions
- Keyboard support
- Empty results explanation
- Clear button

Search results should preserve context.

---

# 65. Filtering

Filters should expose:

```text
Active filters
Clear all
Result count
```

Example:

```text
Critical · Pune · Unverified

24 results
```

Do not force users to remember what filters are active.

---

# 66. Destructive Actions

For irreversible actions:

```text
Action
↓
Confirmation
↓
Clear consequence
↓
Final action
```

Where possible, prefer undo over confirmation dialogs.

Example:

```text
Report deleted
[Undo]
```

---

# 67. Microcopy

Good microcopy reduces cognitive load.

Examples:

```text
Checking location…
Location confirmed
Uploading 2 photos…
Upload complete
Waiting for verification
Verified by response officer
```

Avoid technical wording such as:

```text
HTTP request failed
Mutation unsuccessful
Invalid payload
```

unless shown in developer diagnostics.

---

# 68. Notification Priority

Notifications should be classified:

```text
Critical
Action required
Informational
Success
```

Do not interrupt users for low-value information.

---

# 69. Design Tokens

Centralize all design tokens.

Never hard-code visual values repeatedly across components.

Use:

```text
colors
typography
spacing
radius
shadows
motion
z-index
breakpoints
```

Components consume tokens.

Components must not invent their own design language.

### Export format

The CSS variables in §4–§6, §22, §45, and §70 are the source of truth — generate a machine-readable copy from them (e.g. with Style Dictionary), don't hand-maintain a second version:

```json
{
  "color": {
    "surface": { "page": "#F7F8FA", "primary": "#FFFFFF", "secondary": "#F3F5F7" },
    "accent": { "500": "#D97706", "400": "#F59E0B" },
    "semantic": {
      "success": { "500": "#16A34A" },
      "warning": { "500": "#D97706" },
      "danger": { "500": "#DC2626" },
      "info": { "500": "#0284C7" }
    }
  },
  "radius": { "sm": 8, "md": 10, "lg": 14, "xl": 18, "2xl": 24, "pill": 999 },
  "motion": { "fast": 120, "normal": 180, "slow": 280 },
  "zIndex": { "sticky": 100, "dropdown": 200, "popover": 300, "drawer": 400, "modal": 500, "toast": 600 }
}
```

This is what a design tool (Figma variables) or a Tailwind theme extension actually imports — without it, "centralize all design tokens" only holds inside hand-written CSS.

---

# 70. Z-Index Architecture

Define predictable layers.

```css
--z-base: 0;
--z-sticky: 100;
--z-dropdown: 200;
--z-popover: 300;
--z-drawer: 400;
--z-modal: 500;
--z-toast: 600;
```

Do not randomly use:

```text
z-[9999]
z-[99999]
```

throughout the application.

---

# 71. Component Architecture

Every reusable component should define:

```text
Visual states
Interaction states   (the 8 states in §18 — don't re-derive a shorter list per component)
Responsive behavior
Accessibility behavior
Loading behavior
Error behavior
Empty behavior
```

Example:

```text
ReportCard
 ├── default
 ├── hover
 ├── selected
 ├── loading
 ├── error
 ├── verified
 └── mobile
```

---

# 72. Component Consistency

If two components perform the same conceptual action, they should look and behave similarly.

Examples:

```text
Save
Submit
Verify
Cancel
Close
Back
```

Consistency reduces learning time.

---

# 73. Design Anti-Patterns

The following are explicitly prohibited:

### AI Slop

- Purple/blue AI gradients
- Neon glows
- Excessive sparkle effects
- Generic AI illustrations
- Floating cards everywhere
- Excessive glassmorphism
- Random gradients
- Huge rounded containers
- Unnecessary 3D graphics
- Excessive animated blobs
- Decorative dashboards

### SaaS Slop

- 20 identical cards
- Every statistic inside a colored tile
- Sidebar containing every feature
- Badge on every label
- Five CTAs competing for attention
- Excessive tooltips
- Excessive modal dialogs

### Government Portal Slop

- Giant forms
- Dense walls of text
- Tiny controls
- Inconsistent spacing
- Long dropdowns
- Unclear status
- Technical error messages
- Navigation with dozens of links

---

# 74. Apple-Inspired ≠ Apple Clone

The goal is not to copy Apple's interface.

Borrow:

- Hierarchy
- Restraint
- Typography discipline
- Motion quality
- Familiar interactions
- Material depth
- Accessibility
- Spatial consistency
- Attention to detail

Do not copy:

- Apple's branding
- Apple's exact layouts
- Apple's proprietary assets
- Apple's product-specific navigation
- Apple's visual identity

The result must have its own DRM04 identity.

---

# 75. Premium Visual Formula

Use this approximate visual balance:

```text
70% neutral surfaces
20% typography / structure
8% semantic colors
2% brand accent
```

This keeps the interface sophisticated.

---

# 76. Visual Hierarchy Formula

Every screen should have:

```text
1 dominant area
1 primary action
1–3 supporting areas
Everything else subordinate
```

If a screenshot contains five visually dominant objects, hierarchy has failed.

---

# 77. Performance

Visual quality must not sacrifice performance.

Avoid unnecessary:

- Backdrop filters
- Large blur regions
- Continuous animations
- Huge images
- Excessive shadows
- Unoptimized map layers

Prefer:

- CSS transitions
- GPU-friendly transforms
- Lazy loading
- Optimized images
- Virtualized large lists
- Skeleton states
- Progressive rendering

---

# 78. Motion Performance

Animations should generally target:

```text
transform
opacity
```

Avoid animating layout-heavy properties when possible.

Never animate large numbers of map markers or table rows unnecessarily.

---

# 79. Dark Mode

Dark mode should be designed independently.

Do not simply invert colors.

Use:

```text
Dark background
Elevated dark surfaces
High-contrast text
Subtle borders
Semantic status colors adjusted for dark surfaces
```

The same hierarchy must remain intact.

---

# 80. Dark Mode Principle

Dark mode is not:

```text
black background + white cards
```

It is:

```text
layered dark surfaces
+
controlled contrast
+
reduced glare
+
preserved hierarchy
```

### Dark tokens

Reuse the existing `--ink` scale for dark surfaces instead of inventing a second palette:

```css
--surface-page-dark: var(--ink-950);       /* #0B1020 */
--surface-primary-dark: #131A2E;           /* level 1 — cards/panels */
--surface-secondary-dark: #1A2238;         /* level 2 — popovers/menus */
--surface-tertiary-dark: #212A44;          /* level 3 — dialogs/sheets */

--border-dark: #2A3350;
--border-dark-strong: #3A4468;

--text-primary-dark: var(--ink-50);
--text-secondary-dark: var(--ink-300);
--text-tertiary-dark: var(--ink-500);

/* Accent steps up one shade for AA contrast on dark surfaces */
--accent-dark-default: var(--accent-400);  /* #F59E0B */
--accent-dark-hover: var(--accent-300);    /* #FBBF24 */
--accent-dark-pressed: var(--accent-500);  /* #D97706 */

/* Semantic — lighter tints read better on dark than the light-mode 500s */
--success-dark: #4ADE80;
--warning-dark: #FBBF24;
--danger-dark: #F87171;
--info-dark: #38BDF8;
```

Each elevation level (§20) steps up in fill brightness rather than shadow depth — shadows barely read on dark backgrounds.

---

# 81. Internationalization

Design for future Indian-language support.

Do not assume:

- English-only labels
- Fixed-width text
- Short words
- Latin-only numerals

Layouts must survive longer translations.

Buttons should grow naturally rather than clipping.

---

# 82. Indian Context

The product should work well for:

- Low bandwidth
- Mid-range Android devices
- Touch-first interaction
- Outdoor brightness
- Intermittent connectivity
- Regional languages
- Users with varying digital literacy

Do not optimize exclusively for high-end desktop screens.

---

# 83. Device Testing

Minimum design QA:

```text
Mobile 360px
Mobile 390px
Tablet 768px
Laptop 1280px
Desktop 1440px
Wide desktop 1920px
```

Test:

- Navigation
- Forms
- Maps
- Tables
- Dialogs
- Sticky CTAs
- Keyboard
- Touch
- Reduced motion

---

# 84. Accessibility QA

Before release verify:

```text
Keyboard-only navigation
Screen-reader navigation
Focus visibility
Contrast
Text resizing
200% zoom
Reduced motion
Touch targets
Error messaging
Form labels
Dialog focus
```

Apple's current accessibility guidance similarly emphasizes adaptable interfaces, readable text, sufficient contrast, comfortable controls, and reduced-motion behavior.

---

# 85. Interaction QA

For every major flow test:

```text
Happy path
Slow network
Offline
API failure
Empty state
Invalid input
Permission denied
Expired session
Duplicate submission
Mobile viewport
Keyboard navigation
```

A beautiful happy path is not enough.

---

# 86. Visual QA

Before considering a screen finished:

### Check

- Alignment
- Spacing
- Typography
- Contrast
- Icon consistency
- Radius consistency
- Button hierarchy
- Empty states
- Loading states
- Error states
- Responsive behavior
- Focus states

---

# 87. Screenshot Review Standard

A screenshot should immediately communicate:

```text
What is this?
Who is it for?
What matters?
What should I do?
```

If these answers are not obvious within approximately three seconds, simplify the screen.

---

# 88. Final Design Checklist

Before shipping any page:

### Hierarchy

- [ ] One clear primary action
- [ ] Clear page title
- [ ] Clear section hierarchy
- [ ] Important information appears first

### Visual

- [ ] No unnecessary gradients
- [ ] No excessive glass
- [ ] No excessive shadows
- [ ] No random radii
- [ ] No decorative UI without purpose

### Interaction (canonical set — see §18)

- [ ] Hover state
- [ ] Focus state
- [ ] Pressed state
- [ ] Disabled state
- [ ] Loading state
- [ ] Success state
- [ ] Error state

### Accessibility

- [ ] Keyboard accessible
- [ ] Focus visible
- [ ] Labels present
- [ ] Contrast verified
- [ ] Touch targets comfortable
- [ ] Reduced motion supported
- [ ] Color is not the only status indicator

### Responsive

- [ ] 360px
- [ ] 390px
- [ ] 768px
- [ ] 1280px
- [ ] 1440px
- [ ] 1920px

### Operational

- [ ] Offline state
- [ ] Network error state
- [ ] Empty state
- [ ] Permission state
- [ ] Loading state
- [ ] Recovery path

---

# 89. Product Quality Bar

The interface is considered production-ready only when it achieves all five:

```text
CLARITY
Can users understand what is happening?

SPEED
Can users complete important actions quickly?

TRUST
Can users distinguish AI assessment from verified information?

ACCESSIBILITY
Can diverse users operate the interface?

CRAFT
Does every detail feel intentional?
```

---

# 90. Final Rule

> **Do not add visual complexity to make the product look advanced.**
>
> Make the product **simpler, faster, clearer, and more trustworthy**.
>
> That is what makes it look advanced.

---

# 91. Implementation Directive

When implementing this design system:

1. Preserve all existing routes.
2. Preserve all APIs.
3. Preserve database behavior.
4. Preserve authentication.
5. Preserve AI logic.
6. Preserve privacy processing.
7. Preserve GIS functionality.
8. Preserve business rules.
9. Refactor visual components incrementally.
10. Centralize design tokens.
11. Remove duplicated visual styles.
12. Do not introduce a new visual language per page.
13. Do not add components merely for decoration.
14. Validate every major workflow on mobile and desktop.
15. Run typecheck, lint, tests, and production build after major UI refactors.

The final platform should feel like a **serious, polished national-scale disaster-response product**, not a template dashboard.

---

# 92. Design References

The design direction is informed by current Apple Human Interface Guidelines principles around purpose, agency, familiarity, flexibility, simplicity, craft, and accessibility, while retaining an independent DRM04 visual identity.

Accessibility implementation should target WCAG 2.2 AA and specifically account for focus visibility, target sizing, keyboard operation, contrast, and responsive interaction.

---

**DRM04 Design System v2**  
*Apple-inspired operational UX — restrained, accessible, trustworthy, responsive, and human-centered.*