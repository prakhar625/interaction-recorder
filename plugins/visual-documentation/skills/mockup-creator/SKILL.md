---
name: mockup-creator
description: >
  Use when someone asks to create a wireframe, mockup, lo-fi design, UI sketch, prototype layout,
  screen layout, or wants to visualize a user interface before building it. For low-fidelity
  design exploration only — not for dashboards with real data or polished UI components.
  Triggers on: wireframe, mockup, lo-fi, low fidelity, UI sketch, screen layout, prototype,
  UI layout, page layout, component layout, rough design, interface sketch.
---

# Mockup Creator

Creates **lo-fi (low-fidelity) wireframes** — simple, placeholder-first representations of UI
layouts. These are design communication tools, not finished UIs.

**Scope**: Lo-fi wireframes only. This skill does NOT create:
- Dashboards with real data or live metrics
- Polished UI components or production-ready HTML/CSS
- High-fidelity prototypes with real colors and typography

---

## Lo-Fi Principles

Lo-fi mockups communicate **layout and hierarchy**, not visual polish.

| Lo-Fi Does | Lo-Fi Does Not |
|-----------|----------------|
| Gray placeholder boxes | Real images or colors |
| "Lorem ipsum" / placeholder text | Actual content |
| Labeled regions ("Hero Image", "Nav") | Styled components |
| Simple borders and spacing | Shadows, gradients, animations |
| Grayscale palette | Brand colors |

---

## Format Options

| Format | Best For |
|--------|----------|
| **HTML** | Browser preview of the wireframe layout with labeled placeholders |
| **ASCII** | Terminal output, Markdown embedding, quick communication |

**When the user doesn't specify**: Default to **HTML** for richer layout preview.
Ask if the context is unclear: *"Should I produce an HTML wireframe or an ASCII sketch?"*

---

## Workflow

### Phase 1 — Understand the Screen

Before drawing:

- [ ] Screen or component name identified (e.g., "Login page", "Product card", "Settings sidebar")
- [ ] Key sections identified (e.g., header, hero, sidebar, form, footer)
- [ ] Navigation context understood (where does this screen fit in the app?)
- [ ] Device target noted (desktop, mobile, tablet — affects layout)
- [ ] Format confirmed (HTML or ASCII)

### Phase 2 — Generate

Read `references/lo-fi-mockups.md` before generating.

Apply the lo-fi palette consistently:

| Element | Color |
|---------|-------|
| Page background | `#f5f5f5` |
| Placeholder boxes | `#d1d5db` fill, `#9ca3af` border |
| Navigation/header | `#e5e7eb` |
| Primary action (button) | `#374151` (dark gray) |
| Text placeholders | `#9ca3af` |
| Labels/annotations | `#6b7280` italic |

### Phase 3 — Deliver

- Save as `[screen-name]-wireframe.html` (for HTML format)
- For ASCII: output inline in the conversation
- Add annotation labels identifying each region
- Offer to iterate: add another screen, adjust layout, sketch a component variant

---

## ⛔ STOP — Non-Negotiable Rules

1. **GRAYSCALE ONLY**: No brand colors, no gradients, no real images. Lo-fi = gray placeholders.
2. **LABELS EVERYWHERE**: Every placeholder box must be labeled with its purpose ("Profile Image", "Search Bar", "CTA Button").
3. **NO REAL DATA**: Use "Lorem ipsum", "[User Name]", "Item Title", "99" — never real names, dates, or numbers.
4. **LAYOUT ONLY**: The goal is to communicate structure and hierarchy, not to build a UI.

---

## Screen Types & Patterns

### Landing Page
Sections: Navbar → Hero (image + headline + CTA) → Feature Grid → Testimonials → Footer

### Dashboard (lo-fi layout only)
Sections: Sidebar nav → Top bar (breadcrumb + user) → KPI row → Charts row → Table

### Form Screen
Sections: Header → Form fields (label + input box) → Help text → Submit button → Cancel link

### Modal / Dialog
Structure: Overlay (dimmed background) → Dialog box (title + content + actions row)

### List View
Structure: Toolbar (search + filter + sort) → Item rows (icon + text + actions) → Pagination

### Profile / Settings
Structure: Sidebar (section links) → Main content (section title + form fields)

See `references/lo-fi-mockups.md` for HTML templates and ASCII patterns for each type.

---

## Common Mistakes

- **Using real colors**: Even "just a blue button" breaks lo-fi — use dark gray for primary actions
- **Skipping labels**: An unlabeled gray box communicates nothing — every region needs a text label
- **Over-detailing**: Adding dropdown options, hover states, and micro-interactions defeats the purpose
- **Wrong device layout**: A 3-column grid wireframe described as "mobile" — confirm device target first
- **Real content**: Using an actual user's name or a real product title instead of placeholders
