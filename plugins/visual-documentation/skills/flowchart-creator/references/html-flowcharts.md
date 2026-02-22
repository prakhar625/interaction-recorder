# HTML Flowcharts

**Goal**: A self-contained HTML file with an SVG-based flowchart that renders in any browser.

## Prerequisites

- [ ] Steps and decision points fully mapped
- [ ] Node types identified (start, process, decision, end)
- [ ] Swim lanes determined (if applicable)

---

## Approach: SVG Inline in HTML

Use inline SVG for maximum compatibility — no canvas API, no external libraries.
Lay out nodes on a coordinate grid with 120px vertical spacing and 200px horizontal spacing.

### Node Shapes as SVG Elements

```html
<!-- Start / End node (stadium shape via rect + rx) -->
<g transform="translate(X, Y)">
  <rect x="-70" y="-25" width="140" height="50" rx="25"
        fill="#48bb78" stroke="#276749" stroke-width="2"/>
  <text text-anchor="middle" dominant-baseline="middle"
        fill="white" font-family="system-ui" font-size="14" font-weight="600">Start</text>
</g>

<!-- Process node (rectangle) -->
<g transform="translate(X, Y)">
  <rect x="-80" y="-30" width="160" height="60" rx="6"
        fill="#4299e1" stroke="#2b6cb0" stroke-width="2"/>
  <text text-anchor="middle" dominant-baseline="middle"
        fill="white" font-family="system-ui" font-size="13">Process step</text>
</g>

<!-- Decision node (diamond via polygon) -->
<g transform="translate(X, Y)">
  <polygon points="0,-40 80,0 0,40 -80,0"
           fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
  <text text-anchor="middle" dominant-baseline="middle"
        fill="white" font-family="system-ui" font-size="12" font-weight="600">Decision?</text>
</g>

<!-- End node (red stadium) -->
<g transform="translate(X, Y)">
  <rect x="-70" y="-25" width="140" height="50" rx="25"
        fill="#e53e3e" stroke="#c53030" stroke-width="2"/>
  <text text-anchor="middle" dominant-baseline="middle"
        fill="white" font-family="system-ui" font-size="14" font-weight="600">End</text>
</g>
```

### Arrow Connector

```html
<defs>
  <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
    <path d="M0,0 L10,5 L0,10 Z" fill="#718096"/>
  </marker>
</defs>

<!-- Straight arrow -->
<line x1="X1" y1="Y1" x2="X2" y2="Y2"
      stroke="#718096" stroke-width="2" marker-end="url(#arrow)"/>

<!-- Edge label -->
<text x="MIDX" y="MIDY" text-anchor="middle"
      fill="#4a5568" font-family="system-ui" font-size="11"
      background="white">Yes</text>
```

### Elbow Connector (for branches)

```html
<!-- Right branch from decision: go right then down -->
<path d="M X1,Y1 H X2 V Y2" fill="none"
      stroke="#718096" stroke-width="2" marker-end="url(#arrow)"/>
```

---

## Full Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Process Name] Flowchart</title>
  <style>
    body { font-family: system-ui, sans-serif; background:#f7fafc; margin:0; padding:2rem; }
    h1   { color:#1a202c; font-size:1.8rem; margin-bottom:0.5rem; }
    p.subtitle { color:#718096; margin-bottom:2rem; }
    .chart-container {
      background:white; border-radius:12px; padding:2rem;
      box-shadow:0 1px 3px rgba(0,0,0,0.1); overflow-x:auto;
    }
    svg text { user-select:none; }
  </style>
</head>
<body>
  <h1>[Process Name] Flowchart</h1>
  <p class="subtitle">[Brief description of what this process shows]</p>

  <div class="chart-container">
    <svg width="[W]" height="[H]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M0,0 L10,5 L0,10 Z" fill="#718096"/>
        </marker>
      </defs>

      <!-- Connectors -->
      <!-- ... line/path elements ... -->

      <!-- Nodes (draw after connectors so nodes appear on top) -->
      <!-- ... g elements for each node ... -->

    </svg>
  </div>
</body>
</html>
```

---

## Swim Lane Variant

For swim lanes, add horizontal bands before drawing nodes:

```html
<!-- Background lanes (draw first) -->
<rect x="0"   y="0"   width="TOTAL_WIDTH" height="LANE_HEIGHT" fill="#ebf8ff" opacity="0.5"/>
<text x="10"  y="LANE_HEIGHT/2" dominant-baseline="middle" fill="#2b6cb0" font-weight="600">Actor 1</text>

<rect x="0"   y="LANE_HEIGHT" width="TOTAL_WIDTH" height="LANE_HEIGHT" fill="#fef3c7" opacity="0.5"/>
<text x="10"  y="LANE_HEIGHT*1.5" dominant-baseline="middle" fill="#92400e" font-weight="600">Actor 2</text>
```

Place node Y coordinates within the appropriate lane's vertical range.

---

## Layout Tips

- **Vertical flow (TB)**: Start at top center; each step increases Y by 120px
- **Decision branches**: Left exit = No (decrease X), Right exit = Yes (increase X); both exit at Y + 40 from diamond center
- **Merge paths**: Use a hidden join node (invisible circle) to reconnect branches before continuing
- **Spacing**: Minimum 100px between node centers horizontally, 120px vertically
- **SVG canvas**: Calculate total W and H from node positions + 80px padding on each side

---

## Validation Gate

Before saving:
- [ ] Every decision diamond has labeled Yes and No (or condition) exits
- [ ] Every path reaches a terminal (End) node
- [ ] Arrow markers render correctly (arrowhead visible at destination)
- [ ] SVG width/height large enough to contain all nodes without clipping
- [ ] File opens cleanly in browser with no horizontal overflow
