---
name: flowchart-creator
description: >
  Use when someone asks to create a flowchart, process diagram, decision tree, workflow diagram,
  sequence of steps, state machine, or wants to visualize a process, algorithm, or user journey.
  Triggers on: flowchart, process flow, workflow diagram, decision tree, process diagram,
  step-by-step flow, user journey, state machine, swim lane, sequence of steps, algorithm diagram.
---

# Flowchart Creator

Creates process flowcharts and workflow diagrams in **HTML**, **Mermaid**, or **DOT (Graphviz)** format.
Pick the format that fits the rendering environment.

---

## Format Selection

| Format | Best For | Output |
|--------|----------|--------|
| **HTML** | Browser viewing, standalone shareable files, color-rich SVG flows | `[name]-flowchart.html` |
| **Mermaid** | GitHub README, Markdown docs, wikis, Notion, Obsidian | Fenced code block |
| **DOT** | Graphviz toolchains, complex decision graphs, PDF generation | `[name]-flowchart.dot` |

**When the user does not specify a format:**
Ask: *"Which format do you prefer — HTML (standalone file), Mermaid (for Markdown/GitHub), or DOT (Graphviz)?"*
Default to **HTML** if they have no preference.

---

## Workflow

### Phase 1 — Analyze the Process

Before writing any diagram code:

- [ ] Identify the start event / trigger
- [ ] Map each step in sequence (ask clarifying questions if steps are unclear)
- [ ] Identify all decision points (yes/no branches)
- [ ] Identify termination points (success, error, cancel)
- [ ] Identify any parallel tracks or swim lanes
- [ ] Format confirmed with user

Do not generate until all items above are checked.

### Phase 2 — Generate

Read the reference for the chosen format before writing code:

- HTML → read `references/html-flowcharts.md`
- Mermaid → read `references/mermaid-flowcharts.md`
- DOT → read `references/dot-flowcharts.md`

Apply semantic node colors consistently:

| Color | Meaning |
|-------|---------|
| `#48bb78` | Start node |
| `#e53e3e` | End / terminal node |
| `#4299e1` | Process / action step |
| `#f59e0b` | Decision / condition |
| `#9f7aea` | External system / integration |
| `#718096` | Annotation / note |

### Phase 3 — Deliver

- For HTML and DOT: save the file, report path to user
- For Mermaid: output a fenced code block
- Offer to add swim lanes, color-code actors, or split into sub-flows

---

## ⛔ STOP — Non-Negotiable Rules

1. **FORMAT FIRST**: Confirm format before generating. Mermaid syntax ≠ HTML SVG ≠ DOT.
2. **ALL PATHS TERMINATE**: Every branch in a decision must lead to a node — no dangling arrows.
3. **LABEL EVERY DECISION BRANCH**: Decision diamonds must have labeled Yes/No (or condition) exits.
4. **NO INVENTED STEPS**: Only document steps that actually exist in the process being described.

---

## Node Types by Diagram Kind

### Process Flowchart
Nodes: Start (rounded/green) → Process (rectangle/blue) → Decision (diamond/orange) → End (rounded/red)

### Decision Tree
Root → branches at each decision → leaf outcomes. All leaves must be labeled with outcomes.

### Swim Lane Diagram
Group steps by actor/system. Each lane = one actor/system. Edges cross lanes for handoffs.

### State Machine
States as nodes, transitions as labeled edges. Include initial state (filled circle) and terminal state.

See the format-specific reference file for syntax details.

---

## Common Mistakes

- **Unlabeled decision branches**: Every diamond must have labeled exits (Yes/No, True/False, or condition text)
- **Dead-end paths**: A step with no outgoing edge leaves users confused — every step connects to something
- **Too many nodes in one diagram**: Over 20 nodes gets unreadable — split into sub-processes with reference links
- **Swim lanes without actors**: If using swimlanes, every lane must be named (not left blank)
- **Missing error paths**: Happy-path-only flows mislead — include error handling and edge cases
