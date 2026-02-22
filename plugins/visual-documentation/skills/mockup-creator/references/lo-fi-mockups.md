# Lo-Fi Mockup Templates

**Goal**: Produce grayscale HTML wireframes or ASCII sketches that communicate UI layout
without any visual polish, real content, or brand styling.

## Prerequisites

- [ ] Screen type identified
- [ ] Key sections listed
- [ ] Device target confirmed (desktop / tablet / mobile)
- [ ] Format selected (HTML or ASCII)

---

## HTML Wireframe Base

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Screen Name] — Wireframe</title>
  <style>
    /* ── Reset & Base ── */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, sans-serif;
      background: #f5f5f5;
      color: #374151;
      min-height: 100vh;
    }

    /* ── Lo-Fi Palette ── */
    /* Background: #f5f5f5 | Placeholder: #d1d5db | Border: #9ca3af */
    /* Nav/Header: #e5e7eb | Primary action: #374151 | Labels: #6b7280 */

    /* ── Layout ── */
    .page     { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
    .row      { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .col      { flex: 1; }
    .col-2    { flex: 2; }
    .col-3    { flex: 3; }
    .grid-2   { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .grid-3   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem; }
    .grid-4   { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem; }

    /* ── Placeholder Blocks ── */
    .placeholder {
      background: #d1d5db;
      border: 2px dashed #9ca3af;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      font-size: 0.8rem;
      font-style: italic;
      text-align: center;
      padding: 0.5rem;
    }
    .placeholder.h-sm  { height: 60px; }
    .placeholder.h-md  { height: 120px; }
    .placeholder.h-lg  { height: 200px; }
    .placeholder.h-xl  { height: 320px; }
    .placeholder.h-xxl { height: 480px; }

    /* ── Common Components ── */
    .navbar {
      background: #e5e7eb;
      border: 1px solid #9ca3af;
      border-radius: 4px;
      padding: 0.75rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .navbar .logo   { width: 100px; height: 28px; background: #9ca3af; border-radius: 3px; }
    .navbar .nav-links { display: flex; gap: 0.75rem; }
    .navbar .nav-link  { width: 60px; height: 20px; background: #9ca3af; border-radius: 3px; }
    .navbar .btn-nav   { width: 80px; height: 28px; background: #374151; border-radius: 3px; }

    .sidebar {
      width: 220px;
      flex-shrink: 0;
      background: #e5e7eb;
      border: 1px solid #9ca3af;
      border-radius: 4px;
      padding: 1rem;
    }
    .sidebar .nav-item {
      height: 32px;
      background: #d1d5db;
      border-radius: 3px;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      padding-left: 0.75rem;
      font-size: 0.8rem;
      color: #6b7280;
      font-style: italic;
    }
    .sidebar .nav-item.active { background: #9ca3af; }

    .card {
      background: #e5e7eb;
      border: 1px solid #9ca3af;
      border-radius: 6px;
      padding: 1rem;
    }

    .input-field {
      width: 100%;
      height: 36px;
      background: white;
      border: 1px solid #9ca3af;
      border-radius: 4px;
      margin-bottom: 0.75rem;
    }
    .input-label {
      display: block;
      height: 14px;
      width: 80px;
      background: #9ca3af;
      border-radius: 2px;
      margin-bottom: 0.35rem;
    }

    .btn {
      display: inline-block;
      height: 36px;
      border-radius: 4px;
      background: #374151;
      margin-right: 0.5rem;
    }
    .btn.primary { width: 120px; }
    .btn.secondary { width: 100px; background: #9ca3af; }
    .btn.ghost     { width: 80px; background: transparent; border: 1px solid #9ca3af; }

    .table-row {
      height: 44px;
      background: #e5e7eb;
      border-bottom: 1px solid #9ca3af;
      display: flex;
      align-items: center;
      padding: 0 1rem;
    }
    .table-row:nth-child(even) { background: #d1d5db; }
    .table-header { background: #9ca3af; font-weight: 600; }

    /* ── Annotation Labels ── */
    .label {
      font-size: 0.7rem;
      font-style: italic;
      color: #6b7280;
      margin-bottom: 0.25rem;
      display: block;
    }

    /* ── Responsive ── */
    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
      .sidebar { width: 100%; }
    }
  </style>
</head>
<body>
  <div class="page">
    <span class="label">📐 Wireframe: [Screen Name] — [Device Target]</span>

    <!-- ── NAVBAR ── -->
    <nav class="navbar">
      <div class="logo"></div>
      <div class="nav-links">
        <div class="nav-link"></div>
        <div class="nav-link"></div>
        <div class="nav-link"></div>
      </div>
      <div class="btn-nav"></div>
    </nav>

    <!-- ── CONTENT AREA (customize per screen type) ── -->

    <!-- Hero example -->
    <div class="card" style="margin-bottom:1rem">
      <span class="label">Hero Section</span>
      <div class="placeholder h-xl">[ Hero Image / Illustration ]</div>
      <div style="margin-top:1rem">
        <div class="placeholder h-sm" style="width:60%;margin-bottom:0.75rem">[ Headline Text ]</div>
        <div class="placeholder h-sm" style="width:80%;margin-bottom:1rem">[ Sub-headline / Value Proposition ]</div>
        <div class="btn primary"></div>
        <div class="btn secondary"></div>
      </div>
    </div>

    <!-- Feature grid example -->
    <span class="label">Feature Grid</span>
    <div class="grid-3">
      <div class="card">
        <div class="placeholder h-md" style="margin-bottom:0.75rem">[ Icon / Illustration ]</div>
        <div class="placeholder h-sm">[ Feature Title + Description ]</div>
      </div>
      <div class="card">
        <div class="placeholder h-md" style="margin-bottom:0.75rem">[ Icon / Illustration ]</div>
        <div class="placeholder h-sm">[ Feature Title + Description ]</div>
      </div>
      <div class="card">
        <div class="placeholder h-md" style="margin-bottom:0.75rem">[ Icon / Illustration ]</div>
        <div class="placeholder h-sm">[ Feature Title + Description ]</div>
      </div>
    </div>

  </div>
</body>
</html>
```

---

## Screen-Type Compositions

### Dashboard Layout

```html
<!-- Main layout: sidebar + content -->
<div class="row" style="align-items:flex-start">
  <nav class="sidebar">
    <div class="nav-item active">Dashboard</div>
    <div class="nav-item">Analytics</div>
    <div class="nav-item">Settings</div>
    <div class="nav-item">Users</div>
  </nav>
  <main class="col">
    <!-- KPI row -->
    <span class="label">KPI Summary</span>
    <div class="grid-4" style="margin-bottom:1rem">
      <div class="card"><div class="placeholder h-sm">[ Metric 1 ]</div></div>
      <div class="card"><div class="placeholder h-sm">[ Metric 2 ]</div></div>
      <div class="card"><div class="placeholder h-sm">[ Metric 3 ]</div></div>
      <div class="card"><div class="placeholder h-sm">[ Metric 4 ]</div></div>
    </div>
    <!-- Charts row -->
    <span class="label">Charts</span>
    <div class="grid-2" style="margin-bottom:1rem">
      <div class="card"><div class="placeholder h-lg">[ Bar Chart ]</div></div>
      <div class="card"><div class="placeholder h-lg">[ Line Chart ]</div></div>
    </div>
    <!-- Table -->
    <span class="label">Data Table</span>
    <div class="card">
      <div class="table-row table-header">
        <div class="placeholder h-sm" style="width:100%">[ Column Headers ]</div>
      </div>
      <div class="table-row"><div class="placeholder h-sm" style="width:100%">[ Row 1 ]</div></div>
      <div class="table-row"><div class="placeholder h-sm" style="width:100%">[ Row 2 ]</div></div>
      <div class="table-row"><div class="placeholder h-sm" style="width:100%">[ Row 3 ]</div></div>
    </div>
  </main>
</div>
```

### Form Screen

```html
<div class="card" style="max-width:480px; margin:2rem auto">
  <span class="label">Form: [Form Name]</span>
  <div class="placeholder h-sm" style="width:60%;margin-bottom:1.5rem">[ Form Title ]</div>

  <span class="input-label"></span>
  <div class="input-field"></div>

  <span class="input-label"></span>
  <div class="input-field"></div>

  <span class="input-label"></span>
  <div class="input-field"></div>

  <div style="margin-top:1.25rem">
    <div class="btn primary"></div>
    <div class="btn ghost"></div>
  </div>
</div>
```

---

## ASCII Wireframe Patterns

Use for quick communication in Markdown or terminal output:

```
┌─────────────────────────────────────────────────────────────┐
│  [LOGO]          [Nav Link]  [Nav Link]  [Nav Link]  [CTA]  │  ← Navbar
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────┐              │
│   │                                         │  ← Hero      │
│   │        [ HERO IMAGE PLACEHOLDER ]       │              │
│   │                                         │              │
│   └─────────────────────────────────────────┘              │
│   [ Headline Text ████████████████████ ]                   │
│   [ Sub-headline ████████████████████████████ ]            │
│   [ CTA Button ]  [ Secondary ]                            │
│                                                             │
├──────────────┬──────────────┬──────────────────────────────│
│ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐                 │  ← Feature Grid
│ │  [Icon]  │ │ │  [Icon]  │ │ │  [Icon]  │                 │
│ │ Feature 1│ │ │ Feature 2│ │ │ Feature 3│                 │
│ └──────────┘ │ └──────────┘ │ └──────────┘                 │
├─────────────────────────────────────────────────────────────┤
│  Footer: [Link]  [Link]  [Link]                [Copyright]  │
└─────────────────────────────────────────────────────────────┘
```

---

## Validation Gate

Before delivering:
- [ ] No real colors used (no brand colors, no images beyond placeholder boxes)
- [ ] Every placeholder box has a descriptive label in `[ brackets ]`
- [ ] No real content — all text is placeholder ("Lorem ipsum", "[User Name]", etc.)
- [ ] Device target reflected in layout (single-column for mobile, multi-column for desktop)
- [ ] Annotations present to identify regions for the viewer
