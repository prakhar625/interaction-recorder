---
name: architecture-diagram-creator
description: >
  Use when someone asks to create an architecture diagram, system overview, component diagram,
  high-level design, data flow diagram, infrastructure diagram, or wants to visualize a system's
  structure, services, or data pipeline.
  Triggers on: architecture diagram, system architecture, component diagram, high-level overview,
  data flow, system design, infrastructure diagram, C4 diagram, service map, technical overview.
---

# Architecture Diagram Creator

Creates system architecture diagrams in **HTML**, **Mermaid**, or **DOT (Graphviz)** format.
Choose the format that fits the target audience and rendering environment.

---

## Format Selection

| Format | Best For | Output |
|--------|----------|--------|
| **HTML** | Standalone browser files, rich multi-section docs, stakeholder sharing | `[name]-architecture.html` |
| **Mermaid** | GitHub README, Markdown docs, wikis that render Mermaid | Fenced code block |
| **DOT** | Graphviz toolchains, PDF generation, programmatic graph rendering | `[name]-architecture.dot` |

**When the user does not specify a format:**
Ask: *"Which format do you prefer — HTML (standalone file), Mermaid (for Markdown/GitHub), or DOT (Graphviz)?"*
Default to **HTML** if they have no preference.

---

## Workflow

### Phase 1 — Analyze

Read the codebase, docs, or user description. Extract:

- [ ] System name and primary purpose
- [ ] Key components / services / layers
- [ ] Data sources, sinks, and flow direction
- [ ] External integrations and dependencies
- [ ] Deployment context (cloud provider, on-prem, hybrid)
- [ ] Format confirmed with user

Do not generate until all items above are checked.

### Phase 2 — Generate

Read the reference for the chosen format before writing any code:

- HTML → read `references/html-diagrams.md`
- Mermaid → read `references/mermaid-diagrams.md`
- DOT → read `references/dot-diagrams.md`

Apply semantic color coding consistently throughout:

| Color | Meaning |
|-------|---------|
| `#4299e1` | Data / inputs |
| `#ed8936` | Processing / transformation |
| `#9f7aea` | AI / ML components |
| `#48bb78` | Output / success states |
| `#e53e3e` | Errors / alerts |
| `#718096` | Neutral / infrastructure |

### Phase 3 — Deliver

- For HTML and DOT: save the file, report the path to the user
- For Mermaid: output a fenced code block (` ```mermaid ` ... ` ``` `)
- Confirm file path and offer to iterate, split into sub-diagrams, or add sections

---

## ⛔ STOP — Non-Negotiable Rules

1. **FORMAT FIRST**: Confirm output format before generating. Never produce HTML when Mermaid was expected, or vice versa.
2. **ANALYZE BEFORE DRAWING**: Complete Phase 1 checklist. A diagram of a misunderstood system is worse than no diagram.
3. **SEMANTIC COLORS**: Use the color table above consistently. Do not pick colors arbitrarily.
4. **NO PLACEHOLDER DATA**: Every component in the diagram must correspond to something real in the system being documented.

---

## HTML Diagram — Six Sections

When generating HTML output, include all six sections unless the user asks to omit one:

1. **Business Context** — objectives, target users, value propositions, success metrics
2. **Data Flow** — visual pipeline from source → processing → output, with arrows and labels
3. **Processing Pipeline** — multi-stage breakdown of how data transforms through the system
4. **System Architecture** — layered component view (presentation, application, data, infrastructure)
5. **Features Grid** — functional requirements and non-functional properties (scale, latency, SLA)
6. **Deployment** — environment details, prerequisites, CI/CD workflow

See `references/html-diagrams.md` for the full HTML template and styling reference.

## Mermaid Diagram — Supported Types

Choose the Mermaid diagram type that best fits the request:

| Type | Use When |
|------|----------|
| `graph TD` / `graph LR` | Component relationships, data flow, service maps |
| `sequenceDiagram` | Request/response flows, service-to-service calls |
| `C4Context` | High-level system context (people → systems) |
| `C4Container` | Container-level breakdown within a system |

See `references/mermaid-diagrams.md` for syntax, styling, and examples.

## DOT Diagram — Structure

Use a `digraph` with:
- `subgraph cluster_*` blocks for logical groupings (layers, zones, services)
- Edge labels (`label="data type"`) to describe what flows between nodes
- Node shapes by semantic meaning: `box` (service), `cylinder` (database), `ellipse` (external), `diamond` (decision)

See `references/dot-diagrams.md` for DOT syntax, templates, and rendering commands.

---

## Common Mistakes

- **Format mismatch**: Generating HTML when user wanted a Mermaid block for their README → always confirm
- **Missing arrows**: Components without connections don't show data flow → every component needs at least one edge
- **Too much in one diagram**: Hundreds of nodes become unreadable → split into overview + detail diagrams
- **Inconsistent colors**: Each color used for different things across sections → follow the color table strictly
- **Made-up components**: Adding generic "Database" or "API" nodes that don't exist → only draw what exists
