# Timeline & Roadmap HTML Templates

**Goal**: Produce a self-contained HTML file visualizing tasks, milestones, or phases over time.

## Prerequisites

- [ ] Project name and date range known
- [ ] Tasks with start/end dates (or quarters) collected
- [ ] Timeline type selected (Gantt, Milestone, or Roadmap)
- [ ] Current date available for "today" marker

---

## Type 1: Gantt Chart

Calculate each task's bar position as a percentage of the total date range:

```
left%  = (taskStart - rangeStart) / totalDays * 100
width% = (taskEnd - taskStart) / totalDays * 100
```

### Full Gantt Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Project] — Gantt Chart</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f7fafc; padding: 2rem; color: #2d3748; }

    h1  { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .subtitle { color: #718096; margin-bottom: 2rem; font-size: 0.9rem; }

    .gantt-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    /* Header: date labels */
    .gantt-header { display: flex; background: #edf2f7; }
    .gantt-label-col { width: 220px; flex-shrink: 0; padding: 0.75rem 1rem;
                       font-size: 0.8rem; font-weight: 600; color: #4a5568;
                       border-right: 1px solid #e2e8f0; }
    .gantt-timeline { flex: 1; display: flex; position: relative; }
    .date-marker { flex: 1; padding: 0.75rem 0.5rem; font-size: 0.7rem;
                   color: #718096; border-right: 1px solid #e2e8f0; text-align: center; }

    /* Phase group */
    .phase-header { background: #1a202c; color: white; padding: 0.6rem 1rem;
                    font-size: 0.85rem; font-weight: 600; letter-spacing: 0.03em;
                    display: flex; }
    .phase-header .label-col { width: 220px; flex-shrink: 0; border-right: 1px solid #2d3748; }
    .phase-header .timeline-col { flex: 1; }

    /* Task rows */
    .task-row { display: flex; align-items: center; border-bottom: 1px solid #e2e8f0; height: 48px; }
    .task-row:hover { background: #f7fafc; }
    .task-label { width: 220px; flex-shrink: 0; padding: 0 1rem;
                  font-size: 0.85rem; color: #2d3748; border-right: 1px solid #e2e8f0;
                  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .task-owner { font-size: 0.75rem; color: #718096; margin-top: 2px; }
    .task-chart { flex: 1; position: relative; height: 100%; }

    /* Task bar */
    .task-bar {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      height: 24px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 0 8px;
      font-size: 0.75rem;
      color: white;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      min-width: 4px;
    }
    .bar-completed  { background: #48bb78; }
    .bar-inprogress { background: #4299e1; }
    .bar-planned    { background: #a0aec0; }
    .bar-atrisk     { background: #ed8936; }

    /* Progress fill (for partial completion) */
    .bar-progress {
      position: absolute;
      left: 0; top: 0; bottom: 0;
      background: rgba(255,255,255,0.3);
      border-radius: 4px 0 0 4px;
    }

    /* Milestone marker */
    .milestone {
      position: absolute;
      top: 50%;
      transform: translateY(-50%) rotate(45deg);
      width: 14px;
      height: 14px;
      background: #9f7aea;
      border: 2px solid #6b46c1;
      z-index: 10;
    }
    .milestone-label {
      position: absolute;
      top: 4px;
      font-size: 0.7rem;
      color: #6b46c1;
      white-space: nowrap;
      font-weight: 600;
    }

    /* Today marker */
    .today-line {
      position: absolute;
      top: 0; bottom: 0;
      width: 2px;
      background: #e53e3e;
      z-index: 5;
    }
    .today-label {
      position: absolute;
      top: -22px;
      font-size: 0.7rem;
      color: #e53e3e;
      font-weight: 700;
      white-space: nowrap;
      transform: translateX(-50%);
    }

    /* Legend */
    .legend { display: flex; gap: 1.5rem; padding: 1rem 1.5rem; background: #f7fafc;
              border-top: 1px solid #e2e8f0; flex-wrap: wrap; }
    .legend-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; color: #4a5568; }
    .legend-dot  { width: 12px; height: 12px; border-radius: 2px; flex-shrink: 0; }
  </style>
</head>
<body>
  <h1>[Project Name] — Gantt Chart</h1>
  <p class="subtitle">[Start Date] → [End Date] &nbsp;|&nbsp; [Total days] days &nbsp;|&nbsp; [N] tasks</p>

  <div class="gantt-container">

    <!-- Date header -->
    <div class="gantt-header">
      <div class="gantt-label-col">Task</div>
      <div class="gantt-timeline">
        <!-- Generate one .date-marker per month/week in the range -->
        <div class="date-marker">Jan</div>
        <div class="date-marker">Feb</div>
        <div class="date-marker">Mar</div>
        <!-- ... -->
      </div>
    </div>

    <!-- Phase 1 -->
    <div class="phase-header">
      <div class="label-col">Phase 1: [Name]</div>
      <div class="timeline-col"></div>
    </div>

    <div class="task-row">
      <div class="task-label">
        [Task Name]
        <div class="task-owner">[Owner]</div>
      </div>
      <div class="task-chart">
        <!-- today line (calculate left% from JS or hardcode) -->
        <div class="today-line" style="left: [X]%">
          <span class="today-label">Today</span>
        </div>
        <!-- Task bar: left and width are percentages of total range -->
        <div class="task-bar bar-inprogress" style="left:[L]%; width:[W]%">
          <!-- Optional: progress fill -->
          <div class="bar-progress" style="width:60%"></div>
          [Task Name]
        </div>
      </div>
    </div>

    <!-- Repeat .task-row for each task. Add .phase-header between phases. -->

    <!-- Legend -->
    <div class="legend">
      <div class="legend-item"><div class="legend-dot" style="background:#48bb78"></div> Completed</div>
      <div class="legend-item"><div class="legend-dot" style="background:#4299e1"></div> In Progress</div>
      <div class="legend-item"><div class="legend-dot" style="background:#a0aec0"></div> Planned</div>
      <div class="legend-item"><div class="legend-dot" style="background:#ed8936"></div> At Risk</div>
      <div class="legend-item"><div class="legend-dot" style="background:#9f7aea"></div> Milestone</div>
    </div>

  </div>
</body>
</html>
```

### Bar Position Math

```
totalDays = (rangeEnd - rangeStart) in days

For each task:
  leftDays  = taskStart - rangeStart
  widthDays = taskEnd   - taskStart

  left%  = leftDays  / totalDays * 100
  width% = widthDays / totalDays * 100
```

Round to 1 decimal place. Clamp: `left% >= 0`, `left% + width% <= 100`.

---

## Type 2: Milestone Timeline

For point-in-time deliverables without task durations.

```html
<div class="milestone-container">
  <!-- Horizontal time axis -->
  <div class="axis"></div>

  <!-- Position milestones along the axis -->
  <!-- left% = (milestoneDate - rangeStart) / totalDays * 100 -->

  <div class="milestone-point" style="left:[L]%">
    <div class="milestone-dot"></div>
    <div class="milestone-label above">[Name]<br><small>[Date]</small></div>
  </div>
  <!-- Alternate labels above/below the axis to avoid overlap -->
</div>
```

CSS:

```css
.milestone-container { position: relative; height: 140px; margin: 2rem 0; }
.axis { position: absolute; top: 50%; left: 0; right: 0; height: 3px;
        background: #e2e8f0; border-radius: 2px; }
.milestone-point { position: absolute; top: 50%; transform: translate(-50%, -50%); }
.milestone-dot { width: 16px; height: 16px; background: #9f7aea; border: 3px solid #6b46c1;
                 border-radius: 50%; margin: 0 auto; }
.milestone-label { position: absolute; left: 50%; transform: translateX(-50%);
                   font-size: 0.78rem; font-weight: 600; color: #4a5568; text-align: center;
                   white-space: nowrap; }
.milestone-label.above { bottom: calc(100% + 8px); }
.milestone-label.below { top: calc(100% + 8px); }
```

---

## Type 3: Quarter-Based Roadmap

For feature/initiative-level planning without day-level dates.

```html
<div class="roadmap-grid">
  <!-- Headers: Q1, Q2, Q3, Q4 (or months) -->
  <div class="roadmap-header">
    <div class="stream-col">Workstream</div>
    <div class="quarter-col">Q1 2025</div>
    <div class="quarter-col">Q2 2025</div>
    <div class="quarter-col">Q3 2025</div>
    <div class="quarter-col">Q4 2025</div>
  </div>

  <!-- One row per workstream -->
  <div class="roadmap-row">
    <div class="stream-label">Backend</div>
    <!-- One .item per initiative; span multiple quarters with colspan-equivalent width -->
    <div class="quarter-cell">
      <div class="roadmap-item status-inprogress">Auth Service</div>
      <div class="roadmap-item status-planned">Rate Limiting</div>
    </div>
    <div class="quarter-cell">
      <div class="roadmap-item status-planned">Webhooks</div>
    </div>
    <div class="quarter-cell"></div>
    <div class="quarter-cell"></div>
  </div>
</div>
```

CSS:

```css
.roadmap-grid { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.roadmap-header { display: flex; background: #edf2f7; font-weight: 600; font-size: 0.85rem; }
.stream-col  { width: 160px; flex-shrink: 0; padding: 0.75rem 1rem; border-right: 1px solid #e2e8f0; }
.quarter-col { flex: 1; padding: 0.75rem 0.5rem; text-align: center; border-right: 1px solid #e2e8f0; }
.roadmap-row { display: flex; border-top: 1px solid #e2e8f0; }
.stream-label { width: 160px; flex-shrink: 0; padding: 0.75rem 1rem;
                border-right: 1px solid #e2e8f0; font-weight: 600; font-size: 0.85rem; }
.quarter-cell { flex: 1; padding: 0.5rem; border-right: 1px solid #e2e8f0; }
.roadmap-item { border-radius: 4px; padding: 0.4rem 0.6rem; font-size: 0.8rem;
                margin-bottom: 0.35rem; font-weight: 500; }
.status-completed  { background: #f0fff4; color: #276749; border-left: 3px solid #48bb78; }
.status-inprogress { background: #ebf8ff; color: #2b6cb0; border-left: 3px solid #4299e1; }
.status-planned    { background: #f7fafc; color: #4a5568; border-left: 3px solid #a0aec0; }
.status-atrisk     { background: #fffbeb; color: #92400e; border-left: 3px solid #ed8936; }
```

---

## Validation Gate

Before saving:
- [ ] Bar positions are mathematically correct (spot-check 2-3 tasks)
- [ ] Today marker is present and positioned correctly
- [ ] All tasks are grouped in a named phase
- [ ] Status colors applied consistently (completed=green, in-progress=blue, planned=gray)
- [ ] Legend matches colors used in the chart
- [ ] File saved as `[project-name]-timeline.html`
- [ ] No placeholder text remaining

## Common Issues

- **Bars overflowing the chart**: Clamp `left% + width%` to a max of 100% and warn user about date range
- **Today marker outside range**: If today is before rangeStart or after rangeEnd, hide the marker and note it
- **Overlapping milestone labels**: Alternate above/below placement for adjacent milestones
- **Date parsing**: Be careful with month-day ordering (ISO 8601 `YYYY-MM-DD` is unambiguous)
