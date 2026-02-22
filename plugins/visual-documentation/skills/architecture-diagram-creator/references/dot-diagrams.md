# DOT (Graphviz) Architecture Diagrams

**Goal**: Produce a valid `.dot` file that can be rendered by Graphviz (`dot`, `neato`, `fdp`)
or embedded in tools that support DOT syntax (Mermaid DOT extension, VS Code extensions, etc.).

## Prerequisites

- [ ] System components and edges identified
- [ ] Logical groupings / subgraphs determined
- [ ] Rendering target known (CLI `dot`, VS Code extension, online renderer)

---

## File Naming & Saving

Save output as `[system-name]-architecture.dot`. Report the full path to the user and include
rendering commands.

---

## Full Template

```dot
// [System Name] — Architecture Diagram
// Generated: [date]
// Render: dot -Tsvg [system]-architecture.dot -o [system]-architecture.svg
//         dot -Tpng [system]-architecture.dot -o [system]-architecture.png

digraph [SystemName] {
    // Graph-wide settings
    graph [
        rankdir=TB          // TB=top-to-bottom, LR=left-to-right
        fontname="Helvetica,Arial,sans-serif"
        fontsize=14
        bgcolor="#f7fafc"
        pad=0.5
        splines=ortho       // straight lines with right angles; use curved for complex graphs
        compound=true       // allows edges to subgraphs
    ]
    node [
        fontname="Helvetica,Arial,sans-serif"
        fontsize=12
        style=filled
        fillcolor="#edf2f7"
        color="#4a5568"
    ]
    edge [
        fontname="Helvetica,Arial,sans-serif"
        fontsize=10
        color="#718096"
        fontcolor="#4a5568"
        arrowhead=vee
        arrowsize=0.8
    ]

    // ── Data Sources ──────────────────────────────────────────────
    subgraph cluster_sources {
        label="Data Sources"
        style=filled
        fillcolor="#ebf8ff"
        color="#4299e1"
        fontcolor="#2b6cb0"
        fontsize=12
        fontname="Helvetica,Arial,sans-serif"

        db [label="PostgreSQL\nDatabase" shape=cylinder fillcolor="#4299e1" fontcolor=white]
        api [label="REST API\nEndpoint"  shape=box     fillcolor="#4299e1" fontcolor=white]
        queue [label="Message\nQueue"   shape=box3d    fillcolor="#4299e1" fontcolor=white]
    }

    // ── Processing Layer ──────────────────────────────────────────
    subgraph cluster_processing {
        label="Processing"
        style=filled
        fillcolor="#fffaf0"
        color="#ed8936"
        fontcolor="#c05621"

        svc [label="App Service" shape=box     fillcolor="#ed8936" fontcolor=white]
        cache [label="Redis\nCache"  shape=cylinder fillcolor="#ed8936" fontcolor=white]
    }

    // ── Outputs ───────────────────────────────────────────────────
    subgraph cluster_outputs {
        label="Outputs"
        style=filled
        fillcolor="#f0fff4"
        color="#48bb78"
        fontcolor="#276749"

        ui  [label="Web UI"   shape=box fillcolor="#48bb78" fontcolor=white]
        rpt [label="Reports"  shape=box fillcolor="#48bb78" fontcolor=white]
    }

    // ── Edges ─────────────────────────────────────────────────────
    db    -> svc   [label="raw records"]
    api   -> svc   [label="JSON payload"]
    queue -> svc   [label="events"]
    svc   -> cache [label="read/write" dir=both]
    svc   -> ui    [label="rendered data"]
    svc   -> rpt   [label="aggregated"]
}
```

---

## Node Shape Reference

| Shape | Graphviz Attr | Semantic Use |
|-------|--------------|-------------|
| Rectangle | `shape=box` | Service, application |
| Rounded rect | `shape=box, style="rounded,filled"` | Microservice |
| Cylinder | `shape=cylinder` | Database, storage |
| Diamond | `shape=diamond` | Decision, router |
| Ellipse | `shape=ellipse` | External system, actor |
| Box 3D | `shape=box3d` | Queue, message broker |
| Parallelogram | `shape=parallelogram` | Input/output |
| House | `shape=house` | Entry point |
| Tab | `shape=tab` | Document, file |

---

## Semantic Color Reference

Match colors to the color table in SKILL.md:

```dot
// Data/Input nodes
node [fillcolor="#4299e1" fontcolor=white]

// Processing nodes
node [fillcolor="#ed8936" fontcolor=white]

// AI/ML nodes
node [fillcolor="#9f7aea" fontcolor=white]

// Output/Success nodes
node [fillcolor="#48bb78" fontcolor=white]

// Error/Alert nodes
node [fillcolor="#e53e3e" fontcolor=white]

// Neutral/Infrastructure
node [fillcolor="#718096" fontcolor=white]
```

Apply per-node by setting `fillcolor` inline on each node definition.

---

## Subgraph Naming Convention

Graphviz only renders subgraphs as clusters when the name starts with `cluster_`:

```dot
subgraph cluster_ingestion  { ... }  // ✓ rendered as box
subgraph ingestion          { ... }  // ✗ just logical grouping, no visual box
```

---

## Edge Patterns

```dot
// Unidirectional (default)
A -> B [label="data"]

// Bidirectional
A -> B [label="sync" dir=both]

// Dashed (optional / async)
A -> B [label="events" style=dashed]

// Thick (high-bandwidth / critical path)
A -> B [label="bulk transfer" penwidth=2.5]

// Constraint-free (does not affect rank — useful for lateral edges)
A -> B [constraint=false]
```

---

## Rendering Commands

Include these as a comment at the top of every `.dot` file:

```bash
# SVG (recommended — scalable, embeds in HTML)
dot -Tsvg [system]-architecture.dot -o [system]-architecture.svg

# PNG (raster, for documents)
dot -Tpng -Gdpi=150 [system]-architecture.dot -o [system]-architecture.png

# PDF
dot -Tpdf [system]-architecture.dot -o [system]-architecture.pdf

# Interactive (xdot viewer)
xdot [system]-architecture.dot
```

---

## Validation Gate

Before saving:
- [ ] File opens without Graphviz errors (`dot -Tsvg file.dot > /dev/null`)
- [ ] Subgraph names start with `cluster_` (if visual boxes intended)
- [ ] Semantic fill colors applied to all nodes
- [ ] All edges have descriptive `label=` attributes
- [ ] Rendering commands included in file header comment
- [ ] No placeholder text in node labels

## Common Issues

- **Overlapping nodes**: Switch `rankdir=LR` to `rankdir=TB` or use `splines=curved`
- **Edge crossing clusters**: Set `lhead=cluster_X` and `ltail=cluster_Y` with `compound=true`
- **Font not found**: Use `fontname="Helvetica,Arial,sans-serif"` as a safe fallback stack
- **Long label text**: Use `\n` for line breaks within labels: `label="Service\nLayer"`
- **Graphviz not installed**: Suggest `brew install graphviz`, `apt install graphviz`, or online: https://dreampuf.github.io/GraphvizOnline/
