# MASTER UI/UX DESIGN IMPLEMENTATION PROMPT

You are a world-class product designer and senior frontend engineer working on the Smart India Hackathon DRM04 product:

**Crowdsourced Disaster Damage Assessment System**

The product is already substantially built. Your job is NOT to redesign the product concept, add unnecessary features, or rebuild the architecture.

Your job is to perform a **premium UI/UX transformation** of the existing application while preserving all existing functionality, routes, APIs, database behavior, authentication, authorization, AI logic, privacy processing, GIS functionality, and business rules.

## PRODUCT NORTH STAR

Make a complex disaster-assessment workflow feel obvious.

The product should feel:

- calm
- trustworthy
- fast
- intelligent
- human
- operational
- exceptionally polished

The visual benchmark is the intersection of:

- Apple's restraint and hierarchy
- Figma's interaction quality and tooling clarity
- Airbnb's human-centered forms and UX

Do NOT copy their branding, layouts, colors, or proprietary visual identity.

The final result must look like an independently designed, mature civic technology product.

---

# 1. ABSOLUTE DESIGN RULE

Do not create "AI-generated UI slop."

NEVER use:

- purple/blue AI gradients
- excessive glassmorphism
- glowing borders
- neon dashboards
- giant decorative icons
- animated blobs
- excessive rounded cards
- random gradients
- meaningless statistics
- 3D illustrations
- excessive dark command-center aesthetics
- emoji as UI icons
- "AI magic" language
- unnecessary charts
- decorative radar charts
- excessive animations
- giant hero mockups
- fake real-time counters

Prefer:

- typography
- whitespace
- hierarchy
- restrained color
- real data
- meaningful interaction
- excellent spacing
- subtle motion
- consistent components
- clear states

If removing all gradients, illustrations and animations makes the interface look worse, the design is not good enough.

---

# 2. DO NOT BREAK EXISTING FUNCTIONALITY

Before modifying UI:

1. Inspect the current repository.
2. Understand existing routes.
3. Identify reusable components.
4. Understand current data flow.
5. Identify existing API/server actions.
6. Understand authentication and RBAC.
7. Preserve existing Supabase behavior.
8. Preserve MapLibre behavior.
9. Preserve AI assessment behavior.
10. Preserve privacy-processing behavior.

Do not replace working functionality simply because another implementation looks cleaner.

Improve the interface around the existing product.

---

# 3. PRODUCT EXPERIENCES

There are two intentionally different experiences.

## CITIZEN

Primary objective:

> Report damage quickly with minimum cognitive load.

Navigation:

- Home
- My Reports
- Profile

Primary CTA:

**Report Damage**

Citizen experience must be mobile-first.

---

## AUTHORITY

Primary objective:

> Identify what needs attention, inspect evidence, verify assessments and understand the geographic situation.

Navigation:

- Overview
- Live Map
- Incidents
- Verification
- Analytics
- Exports
- Settings

Authority experience should be desktop-first but fully responsive.

---

# 4. CORE DESIGN PRINCIPLES

## One obvious action

Every screen must have one dominant action.

Examples:

Report page:
**Continue**

Location:
**Confirm location**

Review:
**Submit Report**

Incident:
**Verify assessment**

Export:
**Export**

Never create multiple visually competing primary CTAs.

---

## Progressive disclosure

Do not expose every piece of information simultaneously.

Show:

important information → supporting information → advanced information

Example:

Incident card:

Severity
Confidence
Status
Location
Review

Incident detail:

Evidence
AI assessment
Indicators
Explanation
Verification
Audit history
Metadata

---

## Evidence before decoration

Every UI element must help answer:

1. What happened?
2. Where?
3. How severe?
4. How confident?
5. Verified?
6. What needs attention?

Remove anything that does not contribute to these questions.

---

# 5. VISUAL SYSTEM

## Background

Use a soft near-white:

#F8F9FB

Primary surface:

#FFFFFF

Subtle surface:

#F3F4F6

Borders:

#E5E7EB

Primary text:

#111827

Secondary text:

#4B5563

Tertiary text:

#6B7280

---

## Primary accent

Use restrained blue:

#2563EB

Hover:

#1D4ED8

Soft:

#EFF6FF

Blue should communicate:

- primary actions
- navigation
- links
- trusted interaction

Do NOT turn the entire interface blue.

---

# 6. SEVERITY COLORS

Use semantic color + icon + text.

Unknown:

#6B7280

Minor:

#15803D

Moderate:

#A16207

Severe:

#C2410C

Critical:

#B91C1C

Never communicate severity through color alone.

Example:

**CRITICAL**
not merely a red dot.

---

# 7. TYPOGRAPHY

Use:

**Geist**

Fallback:

**Inter**

Use a restrained hierarchy.

Display:
48px / 52px

H1:
36px / 42px

H2:
28px / 34px

H3:
22px / 28px

H4:
18px / 24px

Body:
15px / 24px

Small:
13px / 20px

Caption:
12px / 18px

Use weight rather than size inflation to create hierarchy.

Avoid giant text inside operational dashboards.

---

# 8. GOLDEN RATIO

Use the golden ratio (~1.618) as a compositional guideline, NOT as a rigid spacing system.

Examples:

- primary dashboard content : secondary panel ≈ 1.6 : 1
- map : priority queue ≈ 1.6 : 1
- hero heading : supporting copy ≈ 1.6 visual emphasis
- evidence image : metadata column ≈ 1.6 : 1

Spacing remains based on a 4px system.

Do not distort layouts simply to satisfy 1.618 mathematically.

---

# 9. SPACING

Use:

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
128

Most UI spacing should use:

8 / 16 / 24 / 32

Large values are reserved for sections.

Avoid arbitrary spacing values.

---

# 10. BORDER RADIUS

Inputs:
10–12px

Buttons:
10–12px

Cards:
16px

Large feature panels:
20–24px

Pills:
9999px

Do not make every object excessively rounded.

---

# 11. ICON SYSTEM

Use:

**Lucide React**

Do not mix icon libraries.

Do not use emojis as interface icons.

Recommended icons:

MapPin
Camera
Upload
ShieldCheck
ScanFace
CircleAlert
BadgeCheck
Clock
Filter
Download
Search
SlidersHorizontal
ChevronRight
X
Check
Info
RefreshCw
FileText
Layers
Navigation

Default icon size:

18–20px

Dense dashboard:

16–18px

Large empty states:

24–32px

Icon-only buttons must have accessible labels and tooltips.

---

# 12. MOTION

Motion must feel intentional.

Default transition:

150–250ms

Use primarily:

- opacity
- transform
- subtle shadow changes

Do NOT animate every component.

## Hover

Cards:

translateY(-2px)

Buttons:

translateY(-1px) only for major primary actions.

## Scroll

Marketing pages may use:

fade-in + 8–16px upward movement

Authority pages should use minimal scroll animation.

## Map

Selected marker:

subtle ring / size increase

No permanent aggressive pulsing.

## Reduced motion

Respect:

prefers-reduced-motion: reduce

Disable:

- parallax
- large transforms
- pulsing
- decorative motion
- excessive stagger

---

# 13. CITIZEN HOME

Keep it extremely simple.

Hero:

**Report disaster damage**

Supporting text:

**Help authorities understand what happened.**

Primary:

**Report Damage**

Below:

Recent reports
Status
Privacy reassurance

Do NOT put authority analytics here.

---

# 14. CITIZEN REPORT FLOW

Use a five-step flow:

1. Photo
2. Location
3. Details
4. Privacy
5. Review

Progress indicator:

Step 2 of 5

or:

●────○────○────○────○

Avoid complicated wizard UI.

---

# 15. PHOTO SCREEN

Hero upload area:

**Add a photo**

Actions:

**Take photo**

**Choose photo**

After upload:

- thumbnail
- filename if useful
- upload progress
- replace
- remove

Do not show technical file metadata to normal citizens.

---

# 16. LOCATION SCREEN

Title:

**Where did this happen?**

Primary:

**Use my location**

Secondary:

**Select on map**

Fallback:

**Search address**

If available:

Location accuracy
Approx. 18 m

The citizen must explicitly confirm the final location.

---

# 17. DETAILS SCREEN

Show required fields first.

Required:

Disaster type
Description

Then:

**Add more details**

Optional:

- asset type
- observed severity
- blockage
- affected people
- utility interruption

Do not expose all optional fields immediately.

---

# 18. PRIVACY SCREEN

This is a major trust moment.

Use a subtle shield/face icon.

Title:

**Your photo is being protected**

Copy:

**We detected faces and created a redacted version for normal operational viewing.**

Action:

**View redacted preview**

Supporting text:

**Your original image remains restricted.**

Never claim:

- 100% privacy
- perfect face detection
- complete anonymity

Clearly distinguish:

Original
Restricted

Redacted
Normal operational view

---

# 19. REVIEW SCREEN

Use a clean checklist:

Photo ✓
Location ✓
Disaster type ✓
Description ✓
Privacy processing ✓

Primary:

**Submit Report**

Secondary:

**Save draft**

If incomplete:

**2 items need attention**

Explain what they are.

Never disable actions without explaining why.

---

# 20. PROCESSING EXPERIENCE

Never show an unexplained spinner.

Use stages:

Uploading
✓

Protecting privacy
✓

Assessing evidence
…

Preparing result

Then:

**Assessment ready**

Preliminary AI assessment

**Severe · 82% confidence**

**Needs authority review**

Use actual system output.

Never fabricate AI values.

---

# 21. MY REPORTS

Use compact cards.

Example:

Flood damage

Near [location]

Submitted 18 min ago

**Severe**

Needs review

**View report**

Show a timeline:

Submitted
↓
Privacy processed
↓
AI assessed
↓
Needs review
↓
Verified

Citizens should only see information they are authorized to see.

---

# 22. AUTHORITY APP SHELL

Desktop:

Sidebar:
240–260px

Main content:

flexible

Header:
search
context/jurisdiction
user

Sidebar:

Overview
Live Map
Incidents
Verification
Analytics
Exports

────────

Settings
Help

Active item:

subtle filled background

Do not overuse separators.

---

# 23. AUTHORITY DASHBOARD

The dashboard must answer immediately:

Where?
What?
How severe?
How confident?
Verified?
What needs attention?

First row:

Total reports
Critical
Needs review
Verified

Maximum 4–5 KPI cards.

Example:

**Needs review**
117
12 added today

Do not create 15 KPI cards.

---

# 24. MAP + PRIORITY LAYOUT

Desktop:

Map:
approximately 8 columns

Priority:
approximately 4 columns

This follows the desired golden-ratio-inspired composition.

Map is the operational centerpiece.

Priority queue is the primary action surface.

Charts come after operational work.

---

# 25. LIVE MAP

Modes:

Incidents
Heatmap
Jurisdiction

Controls:

Disaster
Severity
Confidence
Verification
Status
Date
Asset
Priority
Jurisdiction

Use clustered markers.

Cluster should communicate:

**42 incidents**

not just:

42

Selected marker:
- larger
- subtle ring
- connected to list item

Map and list MUST remain synchronized.

---

# 26. PRIORITY QUEUE

Cards should be compact.

Example:

**CRITICAL**

Structural damage

Priority 91

AI confidence 86%

Needs verification

Recent · 14 min

**Review**

Include a short explanation when possible:

**High priority due to severe visible damage, high model confidence, recent submission, and infrastructure blockage.**

Do not call this a scientifically validated emergency-risk prediction.

---

# 27. INCIDENT DETAIL

Desktop:

Evidence / main content
+
Operational sidebar

Header:

CRITICAL

Structural Damage

Report #A7F3...

Submitted 14 min ago

Needs verification

Primary:

**Verify assessment**

Secondary:
Escalate
Reject
More

---

# 28. EVIDENCE

Show the redacted image by default.

Include:

- image
- thumbnails
- zoom
- privacy status
- number of images

Original evidence is restricted.

If authorized original access exists:

- clearly explain why;
- require deliberate interaction;
- log access;
- never silently show original media.

---

# 29. AI ASSESSMENT PANEL

Title:

**Preliminary AI assessment**

Display:

Severity
Severe

Confidence
82%

Indicators
✓ Debris
✓ Water intrusion
✓ Roof damage

Explanation
Visible debris and water intrusion indicate substantial impact.

Status
Needs human review

Footer:

**AI output is preliminary and does not replace human verification.**

---

# 30. HUMAN VERIFICATION PANEL

This must look distinctly different from the AI panel.

Title:

**Authority verification**

Fields:

Final severity
Category
Reason
Notes

Actions:

**Confirm**

**Change assessment**

**Escalate**

**Reject**

If changed:

AI assessment:
Severe

Authority assessment:
Moderate

Reason:
[recorded reason]

This visually reinforces accountability.

---

# 31. INCIDENT TABLE

Columns:

Priority
Severity
Type
Location
Confidence
Verification
Status
Submitted
Action

Desktop can be dense.

Mobile should convert to cards or hide secondary columns.

Do not create unusable horizontal scrolling.

---

# 32. FILTER SYSTEM

Primary filters:

Disaster
Severity
Verification
Status
Date

Secondary:

Confidence
Asset
Priority
Jurisdiction

Show:

**Filters · 3**

Provide:

**Clear all**

Use chips, popovers and date ranges.

Do not bury common filters.

---

# 33. ANALYTICS

Analytics should answer operational questions.

Use:

Bar charts
→ comparisons

Line charts
→ trends

Stacked bars
→ composition

Maps
→ geography

Avoid:

- 3D charts
- gauges
- excessive donut charts
- decorative radial charts
- chart-heavy layouts

Required:

Total reports
Severity distribution
Disaster distribution
Verified/unverified
Human override rate
Processing time
AI latency
Confidence distribution
Geographic clusters

---

# 34. EXPORT

Export should use a modal/dialog.

Title:

**Export incidents**

Format:

○ CSV
○ PDF

Date range

Filters

Data included

✓ Report metadata
✓ Severity
✓ Confidence
✓ Verification
✓ Priority
✓ Operational status

Actions:

Cancel
Export

Supporting copy:

**Export uses your current filters and permissions.**

---

# 35. EMPTY STATES

Never use generic empty illustrations.

Example:

**No incidents match these filters.**

Try widening the date range or clearing a filter.

**Clear filters**

Citizen:

**You haven't submitted a report yet.**

**Report Damage**

---

# 36. ERROR STATES

Always explain:

1. what happened;
2. whether data was saved;
3. what the user can do.

Example:

**We couldn't complete the assessment.**

Your report was saved successfully.

The AI service is temporarily unavailable.

**Try again**

**Continue to review**

Do not expose raw 500 errors to normal users.

---

# 37. LOADING

Use skeletons matching the final layout.

Do not use giant full-screen spinners.

AI processing should show meaningful stages.

Upload should show real progress.

---

# 38. ACCESSIBILITY

Target WCAG 2.2 AA-oriented implementation.

Required:

- semantic HTML
- keyboard navigation
- visible focus
- accessible labels
- adequate contrast
- screen-reader labels
- severity text + icons
- reduced motion
- meaningful errors

Touch targets:

minimum practical 44 × 44px.

Focus:

2px visible ring
2px offset

Never remove focus indicators.

---

# 39. CONTENT STYLE

Use short, human language.

Good:

**Where did this happen?**

**Review assessment**

**Needs human review**

**Your photo is being protected**

**No incidents match these filters.**

Bad:

**AI Intelligence Command Center**

**Activate emergency intelligence**

**Harness next-generation AI**

**AI magic**

**100% secure**

---

# 40. COMPONENT STATES

Every reusable component must account for:

default
hover
focus
active
disabled
loading
success
error

Build states into components rather than styling screenshots individually.

---

# 41. PREMIUM MICROINTERACTIONS

Prioritize these:

1. Upload thumbnail appears immediately.
2. Button loading preserves width.
3. Location confirmation changes state smoothly.
4. Filter chips animate subtly.
5. Map selection highlights matching incident.
6. Incident drawer opens smoothly.
7. Verification updates without page reload.
8. KPI values transition only when meaningful.
9. Toasts use consistent motion.
10. Draft recovery is obvious.
11. Privacy state is explicit.
12. AI processing stages are understandable.

These matter more than decorative animation.

---

# 42. PERFORMANCE

Do not sacrifice performance for aesthetics.

Use:

- optimized images
- lazy loading
- CSS transforms
- opacity animations
- server-side filtering
- map viewport queries
- clustering
- pagination

Do not load the entire incident database into the browser.

---

# 43. RESPONSIVE DESIGN

Citizen:
mobile-first.

Authority:
desktop-first but responsive.

Mobile authority:

sidebar → drawer

KPI row → stacked/horizontal scroll

map/list → tabs or stacked

verification → full-screen/bottom sheet

table → cards

Do not merely shrink desktop UI.

---

# 44. DESIGN SYSTEM ARCHITECTURE

Use existing:

Next.js
React
TypeScript
Tailwind
shadcn/ui
Lucide
MapLibre

Recommended component families:

```text
ui/
  button
  input
  select
  dialog
  drawer
  badge
  tooltip
  skeleton

layout/
  app-shell
  sidebar
  topbar
  mobile-nav

disaster/
  severity-badge
  confidence-badge
  status-badge
  report-card
  incident-card
  incident-detail
  verification-panel
  privacy-preview

map/
  incident-map
  incident-marker
  cluster-marker
  map-controls

analytics/
  kpi-card
  severity-chart
  trend-chart
  distribution-chart
```

Do not create a separate component for every visual variation.

---

# 45. CRITICAL PRODUCT RULES

Never visually imply:

AI = verified

AI = certified

AI = final decision

Instead:

AI:
**Preliminary AI assessment**

Human:
**Authority verification**

This distinction is central to the product.

---

# 46. SECURITY UI

Security should be visible but calm.

Examples:

**Private evidence**
Original images are restricted.

**Verified authority**
This action requires authorized access.

**Access denied**
You don't have permission to view this area.

Never rely on frontend hiding as security.

---

# 47. PUBLIC LANDING PAGE

Hero:

**From scattered reports to a clearer disaster picture.**

Supporting:

**Capture evidence. Protect privacy. Assess damage. Help authorities prioritize.**

Actions:

**Report Damage**

**See how it works**

Then show the product loop:

PHOTO
↓
LOCATION
↓
PRIVACY
↓
AI TRIAGE
↓
HUMAN VERIFICATION
↓
MAP + PRIORITY
↓
EXPORT

Then five differentiators:

1. Crowdsourced evidence
2. Privacy-first handling
3. AI-assisted triage
4. Geospatial prioritization
5. Human verification

Do not turn the landing page into a feature catalog.

---

# 48. SCROLL ANIMATIONS

Use scroll animation only where it improves storytelling.

Good:

fade + translateY(12px)

Subtle stagger:

40–80ms

Do not:
- pin everything;
- parallax everything;
- animate operational data continuously;
- create cinematic transitions between every section.

---

# 49. ANTI-SLOP FINAL CHECK

Before shipping, ask:

Would this look good without gradients?

Would this look good without animations?

Would this look good without illustrations?

Would a real government operator use this comfortably for hours?

Would a citizen understand the first action immediately?

Would a judge understand the product in 30 seconds?

If any answer is no, simplify.

---

# 50. FINAL QUALITY BAR

The finished product should feel like:

**Apple restraint**
+
**Figma interaction quality**
+
**Airbnb usability**
+
**professional civic technology**

The result must not resemble:
- a generic Tailwind dashboard;
- an AI-generated landing page;
- a hackathon template;
- a futuristic command center.

It should feel quiet, confident and intentional.

---

# 51. IMPLEMENTATION PRIORITY

Do not polish randomly.

## P0

Citizen report flow
Photo
Location
Privacy
AI result
Authority incident
Human verification

## P1

Dashboard
Map
Priority
Filters
Analytics
Export

## P2

Loading
Empty
Error
Responsive
Accessibility
Microinteractions
Typography audit
Spacing audit

## P3

Advanced heatmap
PWA polish
Multilingual
Email
Additional animation

Do not sacrifice security, privacy, authorization or human verification for visual polish.

---

# 52. FINAL INSTRUCTION TO THE CODING AGENT

Do not simply "make it prettier."

Perform a complete product-level UX refinement.

For every existing screen:

1. inspect the current implementation;
2. preserve functionality;
3. simplify hierarchy;
4. remove visual noise;
5. establish consistent spacing;
6. establish consistent typography;
7. establish consistent iconography;
8. establish consistent component states;
9. add subtle purposeful hover interactions;
10. add restrained scroll animation only where appropriate;
11. add loading/empty/error states;
12. verify responsive behavior;
13. verify accessibility;
14. verify AI/human distinction;
15. verify privacy messaging;
16. verify that the final screen still feels fast.

Prefer deleting UI over adding UI.

Prefer one excellent interaction over five flashy interactions.

Prefer clarity over novelty.

The goal is not to impress users with the interface.

The goal is to make them forget the interface exists.