---
command: create-timeline
description: Create a project timeline, Gantt chart, milestone plan, or quarter roadmap
disable-model-invocation: true
---

# Create Timeline

Generate a visual project timeline — Gantt chart, milestone timeline, or quarter-based roadmap.

## Step 1 — Gather timeline data

Ask the user (or extract from project docs):
- Project or initiative name
- Date range (start and end)
- Phases / workstreams (e.g., Design, Development, QA, Launch)
- Tasks with: name, start date, end date, owner (optional), status
- Milestones: name and target date
- Current date (for the "Today" marker)

If dates are vague (e.g., "Q1"), convert to approximate calendar dates and confirm.

## Step 2 — Choose the timeline type

Select based on the data and user intent:

| Type | Choose When |
|------|-------------|
| **Gantt chart** | Tasks have start/end dates, parallel workstreams need comparison |
| **Milestone timeline** | Key deliverables are point-in-time events, not date ranges |
| **Quarter roadmap** | Planning is at Q1/Q2/Q3/Q4 level without day-level dates |

## Step 3 — Generate using the skill

Apply the `timeline-creator` skill:

**Gantt chart:**
- Calculate bar positions: `left% = (taskStart - rangeStart) / totalDays * 100`
- Include a red "Today" vertical line at the correct position
- Group all tasks into named phases
- Apply status colors: completed=green, in-progress=blue, planned=gray, at-risk=orange
- Include a legend

**Milestone timeline:**
- Place markers on a horizontal axis proportional to date position
- Alternate labels above/below to prevent overlap
- Highlight passed milestones vs. upcoming

**Quarter roadmap:**
- Columns = quarters (or months), rows = workstreams
- Feature cards in cells with status color-coding

Read `references/timelines.md` in the skill for HTML templates.

## Step 4 — Deliver

- Save as `[project-name]-timeline.html`
- Report file path
- Offer to: add tasks, adjust the date range, or switch timeline type
