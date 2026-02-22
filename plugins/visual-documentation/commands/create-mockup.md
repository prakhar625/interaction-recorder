---
command: create-mockup
description: Create a lo-fi wireframe or UI sketch for a screen or component
disable-model-invocation: true
---

# Create Lo-Fi Mockup

Generate a low-fidelity wireframe — grayscale layout sketch — for a UI screen or component.

⚠️ **Lo-fi only**: This command produces placeholder wireframes, not styled UIs.
No real colors, no real images, no production components.

## Step 1 — Understand the screen

Ask the user:
- Which screen or component? (e.g., "Login page", "Product card", "Admin sidebar")
- Target device? (desktop / tablet / mobile)
- Key sections needed? (nav, hero, form, table, sidebar, etc.)
- Format? HTML wireframe (browser preview) or ASCII sketch (inline text)?

## Step 2 — Apply lo-fi constraints

Apply the `mockup-creator` skill with strict lo-fi rules:

**Use only:**
- Gray placeholder boxes (`#d1d5db` background, `#9ca3af` dashed border)
- Text: "Lorem ipsum", "[User Name]", "[Email]", "[ Label ]"
- Colors: `#f5f5f5` background, `#e5e7eb` nav, `#374151` primary button (dark gray only)
- Annotations labeling every region

**Never use:**
- Brand colors, images, real user data, or styled components

## Step 3 — Generate using the skill

Apply `mockup-creator` with the appropriate screen type:
- Landing page: Navbar → Hero → Feature Grid → Footer
- Dashboard: Sidebar nav + KPI row + Charts + Table
- Form: Centered card with labeled input fields and action buttons
- Modal: Overlay + dialog with title + content + button row
- List view: Toolbar + repeating item rows + pagination

Read `references/lo-fi-mockups.md` in the skill for HTML templates and ASCII patterns.

## Step 4 — Deliver

- Save as `[screen-name]-wireframe.html` (HTML) or output inline (ASCII)
- Report the file path
- Offer to: sketch another screen, add a component variant, or export to ASCII
