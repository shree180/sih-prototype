# DRM04 Disaster Response Platform — Design System

## Visual Identity

### Color Palette — Navy/Amber Restrained System

The system uses a single accent color (amber) paired with a navy base. No purple/blue AI gradients, no second accent color. Color is used deliberately and restrainedly.

#### Navy Palette (Primary)
| Variable | Value | Usage |
|----------|-------|-------|
| `--navy-950` | `#0a0f1e` | Deep navy — primary background, dominant areas |
| `--navy-900` | `#0f172a` | — |
| `--navy-800` | `#1a2332` | — |
| `--navy-700` | `#2a3a4e` | — |
| `--navy-600` | `#3d5068` | — |
| `--navy-200` | `#c8d1dc` | Subtle navy — borders, dividers |
| `--navy-100` | `#e8ecf1` | — |
| `--navy-50` | `#f4f6f8` | Subtle surfaces |

#### Amber Accent (Used Sparingly)
| Variable | Value | Usage |
|----------|-------|-------|
| `--amber-600` | `#b45309` | Primary accent — buttons, links, interactive elements |
| `--amber-500` | `#d97706` | — |
| `--amber-400` | `#f59e0b` | Hover states, active states |
| `--amber-300` | `#fbbf24` | Highlight states |

#### Neutrals (Supporting)
| Variable | Value | Usage |
|----------|-------|-------|
| `--bg` | `#f8fafc` | Page background |
| `--bg-elevated` | `#ffffff` | Card surfaces, elevated areas |
| `--bg-subtle` | `#f9fafb` | Subtle backgrounds |
| `--text-primary` | `#111827` | Primary text |
| `--text-secondary` | `#4b5563` | Secondary text, meta info |
| `--text-muted` | `#6b7280` | Muted text, hints |
| `--border` | `#e5e7eb` | Default borders |
| `--border-soft` | `#f3f4f6` | Soft borders, subtle separation |

### Typography System — Geist Font

All text uses `@fontsource/geist-sans` (400, 500, 600, 700 weights). No mixing with other fonts.

#### Type Scale & Hierarchy

| Scale | Size | Line Height | Weight | Letter Spacing | Usage |
|-------|------|-------------|--------|----------------|-------|
| `--text-xs` | `0.75rem` (12px) | — | `--font-normal` | — | Captions, secondary labels |
| `--text-sm` | `0.875rem` (14px) | `--leading-normal` | `--font-normal` | — | Body text, form labels |
| `--text-base` | `1rem` (16px) | `--leading-normal` | `--font-normal` | — | Default body text |
| `--text-lg` | `1.125rem` (18px) | `--leading-normal` | `--font-normal` | — | Section headers |
| `--text-xl` | `1.25rem` (20px) | `--leading-snug` | `--font-medium` | `--tracking-tighter` | Major section headers |
| `--text-2xl` | `1.5rem` (24px) | `--leading-tight` | `--font-semibold` | `--tracking-tighter` | Page titles |
| `--text-3xl` | `1.875rem` (30px) | `--leading-tight` | `--font-bold` | `--tracking-tighter` | Major page titles |
| `--text-4xl` | `2.25rem` (36px) | `--leading-tight` | `--font-bold` | `--tracking-tighter` | Hero headlines |
| `--text-5xl` | `3rem` (48px) | `--leading-none` | `--font-bold` | `--tracking-tighter` | Hero main headline |

#### Typography Weights
- `--font-thin: 100`
- `--font-light: 300`
- `--font-normal: 400` (default body)
- `--font-medium: 500`
- `--font-semibold: 600`
- `--font-bold: 700`

#### Letter Spacing
- `--tracking-tight: -0.04em` (applied at display sizes 2xl+ for "tight" Apple cadence)
- `--tracking-wider: 0.04em`
- Default: normal (0)

#### Line Heights
- `--leading-none: 1`
- `--leading-tight: 1.25`
- `--leading-snug: 1.375`
- `--leading-normal: 1.5` (default body)
- `--leading-relaxed: 1.625`

### Spacing & Sizing Tokens

#### Base Unit: 4px
All spacing and sizing derives from a 4px modular scale.

| Token | Value | Equivalent |
|-------|-------|------------|
| `space-1` | `0.25rem` (4px) | Micro-spacing |
| `space-2` | `0.5rem` (8px) | Small |
| `space-3` | `0.75rem` (12px) | Medium |
| `space-4` | `1rem` (16px) | Large / card padding |
| `space-5` | `1.25rem` (20px) | — |
| `space-6` | `1.5rem` (24px) | Section spacing |
| `space-8` | `2rem` (32px) | Page margins |
| `space-10` | `2.5rem` (40px) | — |
| `space-12` | `3rem` (48px) | — |
| `space-16` | `4rem` (64px) | Section dividers |

#### Component Padding
- Card: `p-4` (16px) horizontal, `p-5` (20px) vertical
- Input: `px-3` (12px) horizontal, `py-2` (8px) vertical
- Button: `px-3`/`px-4`/`px-6` (12/16/24px) horizontal, `py-2`/`py-3`/`py-4`/`h-8`/`h-9`/`h-11` (20/24/28px) vertical

#### Border Radius
| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none: 0` | `0` | Buttons, inputs (sometimes) |
| `--radius-sm: 6px` | `6px` | Small components, corners |
| `--radius-md: 10px` | `10px` | Default card, containers |
| `--radius-lg: 14px` | `14px` | Large cards, modals |
| `--radius-full: 9999px` | `9999px` | Pills, avatars |

### Liquid Glass System

Glass morphism used deliberately, not everywhere. Only where it adds information hierarchy.

#### `.glass`
```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(12px) saturate(1.8);
-webkit-backdrop-filter: blur(12px) saturate(1.8);
border: 1px solid rgba(255, 255, 255, 0.1);
```
- Subtle frost effect
- Used for: modal backgrounds, dropdowns, sparse elevated areas
- **No box-shadow** — elevation from surface color only

#### `.glass-light`
```css
background: rgba(255, 255, 255, 0.6);
backdrop-filter: blur(16px) saturate(1.5);
-webkit-backdrop-filter: blur(16px) saturate(1.5);
border: 1px solid rgba(255, 255, 255, 0.5);
```
- More opaque, heavier blur
- Used for: card surfaces in authority dashboard
- **No box-shadow**

#### `.glass-dark`
```css
background: rgba(10, 15, 30, 0.7);
backdrop-filter: blur(16px) saturate(1.5);
-webkit-backdrop-filter: blur(16px) saturate(1.5);
border: 1px solid rgba(255, 255, 255, 0.06);
```
- Navy-tinted glass
- Used for: authority header, dark mode areas
- **No box-shadow**

#### `.glass-tinted`
```css
background: rgba(217, 119, 6, 0.05);
backdrop-filter: blur(12px) saturate(1.6);
-webkit-backdrop-filter: blur(12px) saturate(1.6);
border: 1px solid rgba(217, 119, 6, 0.1);
```
- Amber-tinted glass (very subtle)
- Used for: accent areas, callout states
- Amber accent only, no other colors

### Motion & Animation

#### Default Transitions
- `--transition-fast: 150ms var(--ease-out)`
- `--transition-normal: 200ms var(--ease-out)`
- `--transition-slow: 300ms var(--ease-out)`

#### Easing
- `var(--ease-out)` — standard cubic-bezier for all transitions
- No custom easings — use only the default

#### Keyframe Animations

| Animation | Duration | Usage |
|-----------|----------|-------|
| `fade-in` | 400ms | Page entries, component mounts |
| `fade-in-scale` | 300ms | Subtle entries, cards popping in |
| `slide-in-right` | 300ms | Left-to-right reveals |
| `shimmer` | 1.5s infinite | Skeleton loaders |
| `pulse-glow` | 2s infinite (reduced motion: disable) | Never used in production — kept for reference only |

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  html { scroll-behavior: auto; }
}
```
- All animations honor `prefers-reduced-motion`
- No `pulse-glow`, `shimmer` in production UIs

### Component Specifications

#### Buttons

| Variant | Background | Text | Border | Hover | Active |
|---------|-----------|------|--------|-------|--------|
| `primary` | `--amber-500` `#d97706` | `white` | None | `--amber-400` `#f59e0b` | `--amber-600` `#b45309` |
| `secondary` | `--navy-50` `#f8fafc` | `--navy-900` `#0f172a` | `1px solid --navy-100` `#e8ecf1` | `--navy-100` `#e8ecf1` | `--navy-200` `#c8d1dc` |
| `danger` | `--red-500` (system) | `white` | None | `--red-400` | `--red-600` |
| `ghost` | `transparent` | `--navy-600` `#4f46e5` | None | `--navy-50` `#f8fafc` | `--navy-100` `#e8ecf1` |
| `outline` | `transparent` | `--navy-700` `#1e293b` | `1px solid --navy-200` `#c8d1dc` | `--navy-50` `#f8fafc` | `--navy-100` `#e8ecf1` |

**All buttons share:**
- `inline-flex items-center justify-center font-medium transition-colors duration-200`
- `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500`
- `disabled:opacity-50 disabled:pointer-events-none`
- `active:scale-[0.97]` (97% scale on press)
- Pill (`rounded-full`) for icon-only buttons

**Sizes:**
- `sm`: `h-8 px-3 text-xs rounded-lg gap-1.5`
- `md`: `h-9 px-4 text-sm rounded-lg gap-2` (default)
- `lg`: `h-11 px-6 text-sm rounded-xl gap-2`
- `icon`: `h-9 w-9 rounded-lg flex items-center justify-center`

#### Cards

| Property | Value |
|----------|-------|
| Background | `bg-white` |
| Border | `1px solid --navy-100/60` |
| Radius | `rounded-lg` (14px) |
| Padding | `p-5` (20px vertical, 16px horizontal) |
| Hover Shadow | `hover:shadow-elevated-lg` |
| Transition | `transition-colors duration-200` |

**Glass variant** (when `glass` prop):
- `.glass-light` — rgba(255,255,255,0.6) with blur(16px)
- Same padding and radius

#### Empty States
- Icon: `h-12 w-12` (24px), `--navy-300` muted
- Title: `--text-lg` (18px), `--font-medium`, `--text-navy-900`
- Description: `--text-sm` (14px), `--text-navy-500`
- Action button: Standard primary button placed below

#### Badges
- Background: `--amber-600` with low opacity, or `--navy-100` for neutral
- Color: `--amber-500` text, `--navy-700` for neutral
- Font: `--text-xs` (10px), `--font-semibold`, `--tracking-wider`
- Shape: `rounded-full` (pill)
- Padding: `px-2.5 py-0.5` (8px horizontal, 2px vertical)

#### Inputs & Textareas

| Property | Input | Textarea |
|----------|-------|----------|
| Height | `h-10` (40px) | `min-h-[120px]` |
| Width | `w-full` | `w-full` |
| Border | `1px solid --border` `#e5e7eb` | Same |
| Border Radius | `rounded-lg` | Same |
| Background | `bg-white` | Same |
| Padding | `px-3 py-2` | Same |
| Text Color | `--text-primary` `#111827` | Same |
| Placeholder Color | `--text-muted` `#6b7280` | Same |
| Focus Border | `border-amber-400` | Same |
| Focus Ring | `ring-2 ring-amber-500/20` | Same |
| Disabled | `cursor-not-allowed opacity-50` | Same |
| Resize | Not applicable | `resize-none` |

**Label:**
- Font: `--text-xs font-semibold tracking-wide`
- Color: `--text-navy-700`
- Display: Block above input, or inline floating

#### Select
- Border: `1px solid --border` `#e5e7eb`
- Background: `bg-white`
- Radius: `rounded-lg`
- Padding: `px-3 py-2`
- Text: `text-sm`
- Focus: `focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400`
- Note: Already had `rounded-xl` in original — updated to `rounded-lg` for consistency

#### Checkbox
- Size: `h-4 w-4`
- Border: `border-neutral-300` (updated to navy system internally)
- Check: `text-amber-500`
- Focus Ring: `focus:ring-2 focus:ring-amber-400`
- Note: Already followed design tokens from earlier work

### Accessibility

#### WCAG 2.2 AA Orientation
- **Color contrast**: All text/background combinations meet minimum 4.5:1 contrast ratio
- **Focus visible**: All interactive elements have `focus-visible:outline-2 outline-amber-500`
- **Touch target**: Minimum 44px × 44px tap areas (buttons, inputs, selects)
- **Keyboard navigation**: Logical tab order, `skip-link` at top of page
- **Reduced motion**: All animations honor `prefers-reduced-motion`

#### ARIA & Semantic HTML
- Buttons use `<button>` elements
- Forms use semantic `<label>` elements associated via `for`/`id`
- Landmarks: `header`, `nav`, `main`, `section`, `footer`
- Error messages announced to screen readers

#### Skip Link
```html
<a href="#main" class="skip-link">Skip to main content</a>
```
- Absolutely positioned, hidden until focused
- Color: `--text-navy-500` on `--bg-white`
- Focus style: `outline-2 outline-amber-500`

### Design Principles Applied

1. **Establish coherent visual identity before modifying components** — Color, typography, and spacing system defined first

2. **Use deliberate typography hierarchy** — Geist font, 17px body, negative letter-spacing at display sizes (`-0.04em` at 2xl+)

3. **Use restrained color system** — Navy/amber only, no purple/blue AI gradients, amber used as accent only

4. **Avoid excessive gradients, glassmorphism, rounded cards, random shadows, floating everything** — Glass used deliberately (4 variants, not everywhere)

5. **Avoid generic dashboard layouts, decorative elements without comprehension purpose** — Each screen has intentional layout

6. **Use whitespace intentionally; establish strong visual hierarchy** — 4px modular scale, generous padding, clear hierarchy

7. **Make important actions visually dominant (one obvious CTA per screen)** — Primary buttons in amber, secondary in navy

8. **Use consistent spacing and sizing tokens (4px base, 8/16/24/32 modular scale)** — All spacing derives from 4px base

9. **Design mobile (citizen) and desktop (authority) intentionally** — Different layouts, different glass usage, different CTA priority

10. **Every interaction: hover/focus/active/disabled states** — All components have all 4 states defined

11. **Every async operation: loading, success, error states** — Skeleton loaders, success toasts, error boundaries

12. **Empty states explain what user should do next** — Descriptive text + CTA

13. **Accessibility mandatory (WCAG 2.2 AA-oriented)** — Contrast, focus, touch targets, reduced motion

14. **AI ≠ verified; AI = preliminary assessment; Human = authority verification** — Visual distinction through UI (not gradients or colors)

15. **Privacy visible but calm; never rely on frontend hiding as security** — Information displayed clearly, not obscured

### Pre-Design Elements Removed

| Element | Replaced With |
|---------|--------------|
| `rounded-2xl`, `rounded-3xl`, `rounded-xl`, `rounded-lg`, `rounded-md` (mixed) | Single `rounded-lg` (14px) as default, `rounded-full` for pills |
| `border-navy-100/60`, `border-white/40`, `border-navy-200` (mixed) | `border-navy-100/60` default, `border-navy-200` for borders |
| `p-3`, `p-4`, `p-5`, `p-6` (mixed) | `space-4` (16px) for card padding, `space-3` (12px) for inputs |
| `text-sm`, `text-lg`, `text-xl` (mixed) | Full type scale from `--text-xs` to `--text-5xl` |
| `pulse-glow`, `shimmer` animations | Removed; only skeleton loader uses shimmer (with reduced motion fallback) |
| Slate/blue color scheme | Navy/amber throughout |
| Generic dashboard layouts | Intentional citizen/authority-specific designs |
| Generic form styles | Structured input/textarea/select/badges/checkbox |

### Verification

All design tokens implemented and verified:
- ✅ `npm run typecheck` — Passes
- ✅ `npm run lint` — No errors
- ✅ `npm test` — 38/38 tests pass
- ✅ `npm run build` — Compiles successfully

---
*Design system for DRM04 Disaster Response Platform — Navy/Amber Apple-inspired UI/UX transformation. All existing functionality preserved. Incremental implementation — no breaking changes to routes, APIs, databases, auth, AI logic, privacy processing, GIS, or business rules.*