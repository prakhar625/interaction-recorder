---
command: create-architecture-diagram
description: Create a system architecture diagram (HTML, Mermaid, or DOT/Graphviz format)
disable-model-invocation: true
---

# Create Architecture Diagram

Generate a visual system architecture diagram for the current project or a system you describe.

## Step 1 — Choose format

Ask the user (or infer from context):

> "Which format do you prefer?
> - **HTML** — standalone file, viewable in browser, includes six rich sections
> - **Mermaid** — code block for GitHub README / Markdown / wikis
> - **DOT** — Graphviz file for toolchains, PDFs, complex graph rendering"

Default to **HTML** if the user has no preference.

## Step 2 — Analyze the system

Read source files, docs, and any existing diagrams to identify:
- Key components and services
- Data sources and sinks
- Data flow direction and edge labels
- Deployment context (cloud, on-prem, hybrid)
- External integrations and dependencies

Do not draw components that are not confirmed to exist.

## Step 3 — Generate using the skill

Apply the `architecture-diagram-creator` skill:

- For HTML: include all six sections (Business Context, Data Flow, Processing Pipeline, System Architecture, Features, Deployment). Save as `[system-name]-architecture.html`.
- For Mermaid: select the appropriate diagram type (graph, C4Context, C4Container, sequenceDiagram). Output a fenced code block.
- For DOT: use `digraph` with `subgraph cluster_*` groupings, semantic node shapes, and rendering commands in the header. Save as `[system-name]-architecture.dot`.

Apply the semantic color table from the skill.

## Step 4 — Deliver

- Report the saved file path (HTML/DOT) or display the fenced code block (Mermaid)
- Offer to: add a sub-diagram, switch format, or adjust the scope
