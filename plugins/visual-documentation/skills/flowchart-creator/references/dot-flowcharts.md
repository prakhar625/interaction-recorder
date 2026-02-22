# DOT (Graphviz) Flowcharts

**Goal**: A valid `.dot` file representing a flowchart or process diagram, renderable by Graphviz
tools and compatible with DOT-supporting editors (VS Code extensions, online renderers).

## Prerequisites

- [ ] Process steps and decision points mapped
- [ ] Branch labels (Yes/No or conditions) identified
- [ ] Swim lanes / actor groups determined (if applicable)

---

## File Naming

Save as `[process-name]-flowchart.dot`. Report the path and include rendering commands at the top.

---

## Full Template

```dot
// [Process Name] — Flowchart
// Render: dot -Tsvg [process]-flowchart.dot -o [process]-flowchart.svg
//         dot -Tpng -Gdpi=150 [process]-flowchart.dot -o [process]-flowchart.png

digraph [ProcessName]Flowchart {
    // Graph defaults
    graph [
        rankdir=TB
        fontname="Helvetica,Arial,sans-serif"
        fontsize=13
        bgcolor="#f7fafc"
        splines=ortho
        pad=0.4
        nodesep=0.5
        ranksep=0.7
    ]
    node [
        fontname="Helvetica,Arial,sans-serif"
        fontsize=12
        style=filled
        margin="0.3,0.2"
    ]
    edge [
        fontname="Helvetica,Arial,sans-serif"
        fontsize=10
        fontcolor="#4a5568"
        color="#718096"
        arrowhead=vee
        arrowsize=0.8
    ]

    // ── Nodes ─────────────────────────────────────────────────────

    start  [label="Start"         shape=stadium  fillcolor="#48bb78" fontcolor=white]
    step1  [label="Step 1"        shape=box      fillcolor="#4299e1" fontcolor=white]
    dec1   [label="Condition?"    shape=diamond  fillcolor="#f59e0b" fontcolor=white]
    step2a [label="Handle Yes"    shape=box      fillcolor="#4299e1" fontcolor=white]
    step2b [label="Handle No"     shape=box      fillcolor="#e53e3e" fontcolor=white]
    step3  [label="Final Step"    shape=box      fillcolor="#4299e1" fontcolor=white]
    end_ok [label="End (Success)" shape=stadium  fillcolor="#48bb78" fontcolor=white]
    end_err[label="End (Error)"   shape=stadium  fillcolor="#e53e3e" fontcolor=white]

    // ── Edges ─────────────────────────────────────────────────────

    start  -> step1
    step1  -> dec1
    dec1   -> step2a [label="Yes"]
    dec1   -> step2b [label="No"]
    step2a -> step3
    step3  -> end_ok
    step2b -> end_err
}
```

---

## Node Shapes Reference

| Shape | Attr | Use |
|-------|------|-----|
| Pill / Stadium | `shape=stadium` | Start / End |
| Rectangle | `shape=box` | Process step |
| Diamond | `shape=diamond` | Decision |
| Rounded rect | `shape=box, style="rounded,filled"` | Subprocess |
| Parallelogram | `shape=parallelogram` | Input/Output |
| Circle | `shape=circle` | Connector / join point |
| Double circle | `shape=doublecircle` | Accepting state |

---

## Semantic Colors

| Color | Usage |
|-------|-------|
| `#48bb78` (green) | Start node, success terminal |
| `#e53e3e` (red) | Error terminal, failure |
| `#4299e1` (blue) | Process / action step |
| `#f59e0b` (amber) | Decision / condition |
| `#9f7aea` (purple) | External system call |
| `#718096` (gray) | Annotation, note |

---

## Swim Lane Pattern

Graphviz doesn't have native swim lanes, but rank-based subgraphs simulate them:

```dot
// Fix nodes to the same rank to create horizontal lanes
{ rank=same; step_user_A; step_user_B; }
{ rank=same; step_system_A; step_system_B; }

// Invisible lane separator
sep1 [label="" shape=none width=0 height=0]
sep2 [label="" shape=none width=0 height=0]
sep1 -> sep2 [style=invis]
```

For true swim lanes, prefer the HTML or Mermaid format which has better native support.

---

## Parallel Branches

```dot
// Fork node
fork [label="" shape=box width=1.5 height=0.1 fillcolor="#4299e1" style=filled]

// Join node
join [label="" shape=box width=1.5 height=0.1 fillcolor="#4299e1" style=filled]

prev  -> fork
fork  -> branchA
fork  -> branchB
branchA -> join
branchB -> join
join  -> next
```

---

## Decision Labels

Every decision diamond must have labeled edges:

```dot
// Correct
dec -> stepA [label="Yes"]
dec -> stepB [label="No"]

// Also acceptable for multi-branch conditions
dec -> stepA [label="type=A"]
dec -> stepB [label="type=B"]
dec -> stepC [label="default"]
```

---

## Rendering Commands

```bash
# SVG (best quality, scalable)
dot -Tsvg [process]-flowchart.dot -o [process]-flowchart.svg

# PNG (documents/presentations)
dot -Tpng -Gdpi=150 [process]-flowchart.dot -o [process]-flowchart.png

# PDF
dot -Tpdf [process]-flowchart.dot -o [process]-flowchart.pdf
```

---

## Validation Gate

Before saving:
- [ ] Every decision diamond has at least two labeled outgoing edges
- [ ] Every path terminates at a `shape=stadium` end node
- [ ] `rankdir=TB` or `LR` chosen deliberately (TB for tall flows, LR for wide flows)
- [ ] Rendering commands in the file header
- [ ] No placeholder node labels in output

## Common Issues

- **Overlapping decision text**: Diamond nodes need `margin="0.4,0.2"` if label is long — or shorten the label
- **Edge labels overlapping**: Add `labeldistance=2` to spread labels away from node centers
- **Long flows extend off-page**: Switch to `rankdir=LR` and split into sub-digraphs
- **Graphviz not installed**: `brew install graphviz` / `apt install graphviz` / https://dreampuf.github.io/GraphvizOnline/
