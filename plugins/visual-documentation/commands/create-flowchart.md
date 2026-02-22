---
command: create-flowchart
description: Create a process flowchart, decision tree, or workflow diagram (HTML, Mermaid, or DOT format)
disable-model-invocation: true
---

# Create Flowchart

Generate a flowchart, decision tree, swim lane diagram, or workflow visualization.

## Step 1 — Identify the process

Ask the user to describe the process or read it from the codebase:
- What triggers the flow? (start event)
- What are the sequential steps?
- Where are the decision points? (yes/no branches)
- What are the possible end states? (success, error, cancel)
- Are there multiple actors / swim lanes?

## Step 2 — Choose format

Ask (or infer):
> "Which format would you like?
> - **HTML** — browser-viewable SVG-based flowchart
> - **Mermaid** — code block for Markdown/GitHub (supports flowchart, sequenceDiagram, stateDiagram-v2)
> - **DOT** — Graphviz .dot file for toolchains and PDFs"

Default to **HTML** if no preference.

## Step 3 — Generate using the skill

Apply the `flowchart-creator` skill:

- Map every decision point to a diamond with labeled exits (Yes/No or condition text)
- Ensure every branch reaches a terminal node
- Apply semantic colors: Start=green, Process=blue, Decision=amber, End=red
- For HTML: build SVG nodes on a coordinate grid (120px vertical, 200px horizontal spacing)
- For Mermaid: choose `flowchart TD/LR`, `sequenceDiagram`, or `stateDiagram-v2`
- For DOT: use `digraph` with `shape=diamond` for decisions, edge labels on all branches

Include error/failure paths — happy path only is incomplete.

## Step 4 — Deliver

- Save as `[process-name]-flowchart.html` or `.dot` (or output the Mermaid code block)
- Report file path
- Offer to: add swim lanes, split into sub-flows, or switch format
