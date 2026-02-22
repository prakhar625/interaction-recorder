---
name: timeline-creator
description: >
  Use when someone asks to create a timeline, project roadmap, Gantt chart, milestone plan,
  release schedule, sprint plan, or wants to visualize tasks and dates over time.
  Triggers on: timeline, roadmap, Gantt chart, milestone, project schedule, release plan,
  sprint timeline, quarter roadmap, project phases, delivery schedule, launch timeline.
---

# Timeline Creator

Generates visual timelines, Gantt charts, and project roadmaps as standalone HTML files.
Visualizes tasks, milestones, and phases over a date range.

---

## Workflow

### Phase 1 — Extract Timeline Data

Before generating:

- [ ] Project or initiative name
- [ ] Start date and end date (or duration)
- [ ] Phases / workstreams (logical groupings of tasks)
- [ ] Tasks with: name, start date, end date, owner (optional), status
- [ ] Milestones: name and date
- [ ] Current date (to calculate "today" marker)

If dates are vague (e.g., "Q1 to Q3"), convert to approximate calendar dates and confirm.

### Phase 2 — Generate

Read `references/timelines.md` before writing HTML.

Apply semantic colors for task status:

| Status | Color | Meaning |
|--------|-------|---------|
| Completed | `#48bb78` | Done |
| In Progress | `#4299e1` | Active / current |
| Planned | `#a0aec0` | Not yet started |
| At Risk | `#ed8936` | Delayed or blocked |
| Milestone | `#9f7aea` | Key delivery point |

### Phase 3 — Deliver

- Save as `[project-name]-timeline.html`
- Report the file path
- Offer to add a "today" marker, add new tasks, or adjust the date range

---

## ⛔ STOP — Non-Negotiable Rules

1. **REAL DATES**: Do not use placeholder dates. If the user gives vague timing, ask or estimate and confirm.
2. **TODAY MARKER**: Always include a vertical "Today" line on Gantt charts (use `new Date()` in JS or the current date from context).
3. **ALL TASKS IN A PHASE**: Every task must belong to a named phase/workstream. No orphan tasks.
4. **COMPLETION PERCENTAGE**: If tasks have progress info, show it in the bar (filled portion).

---

## Timeline Types

### Gantt Chart
Use when: tasks have start/end dates and need to show parallel workstreams.
Structure: Y-axis = tasks/phases, X-axis = time. Bars represent duration.

### Milestone Timeline
Use when: the key deliverables are points in time, not ranges.
Structure: Horizontal time axis with milestone markers and labels above/below the line.

### Roadmap (Quarter-Based)
Use when: planning is at a quarterly/monthly level without specific day-level dates.
Structure: Columns = Q1/Q2/Q3/Q4. Rows = features/workstreams. Cards per cell.

See `references/timelines.md` for HTML templates for each type.

---

## Common Mistakes

- **Overlapping task bars**: Ensure start/end date math is correct — check that bar widths match durations
- **Missing today marker**: Without a "today" line, Gantt charts have no time anchor for the viewer
- **Vague milestone names**: "Phase 2 Complete" is better than "Milestone" — include what the milestone represents
- **Too many tasks**: Over 25 tasks makes the chart unreadable — group into sub-phases or summarize
- **No status colors**: A monochrome timeline doesn't communicate what's done vs. planned
