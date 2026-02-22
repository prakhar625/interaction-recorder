# Visual Documentation

**Create architecture diagrams, flowcharts, lo-fi wireframes, technical docs, and project timelines — directly from Claude Code.**

Five skills that turn system descriptions, codebases, and project plans into polished visual documentation. Supports HTML, Mermaid, and DOT/Graphviz output formats where applicable.

---

## What This Does

Describe your system, process, or UI and get a ready-to-use visual document. Each skill handles its domain end-to-end: reading the codebase, picking the right format, generating the output, and saving the file.

**Five skills:**

| Skill | What it creates | Formats |
|-------|----------------|---------|
| **architecture-diagram-creator** | System/component/C4 diagrams with data flow, layers, and deployment sections | HTML · Mermaid · DOT |
| **flowchart-creator** | Process flows, decision trees, swim lane diagrams, state machines | HTML · Mermaid · DOT |
| **mockup-creator** | Lo-fi wireframes — grayscale placeholder layouts for UI design communication | HTML · ASCII |
| **technical-doc-creator** | Developer reference docs with sidebar nav, API endpoints, param tables, syntax-highlighted code | HTML |
| **timeline-creator** | Gantt charts, milestone timelines, and quarter-based roadmaps | HTML |

---

## Installation

### Plugin (Recommended)

In Claude Code:

```
/plugin marketplace add prakhar625/my-plugins
/plugin install my-plugins@visual-documentation
```

Restart Claude Code after installing.

### Manual

```bash
git clone https://github.com/prakhar625/my-plugins.git
cp -r my-plugins/plugins/visual-documentation ~/.claude/plugins/
```

Then enable it in Claude Code with `/plugin`.

---

## Usage

### Architecture Diagrams

The skill auto-activates when you mention architecture, system design, or data flow. Use the command for explicit invocation.

```
Create an architecture diagram for this project
```

```
Generate a Mermaid C4 context diagram showing our service and its external dependencies
```

```
/create-architecture-diagram
```

**Three output formats:**

| Format | Best For |
|--------|----------|
| HTML | Standalone browser file with 6 sections: Business Context, Data Flow, Processing Pipeline, System Architecture, Features, Deployment |
| Mermaid | GitHub README, Markdown docs, wikis — outputs a fenced code block |
| DOT | Graphviz toolchains, PDF generation, complex graph rendering — saves `.dot` file |

---

### Flowcharts

```
Create a flowchart for our user registration process
```

```
Make a Mermaid decision tree for our pricing logic
```

```
Draw a sequence diagram for the OAuth2 login flow
```

```
/create-flowchart
```

**Mermaid diagram types supported:** `flowchart TD/LR`, `sequenceDiagram`, `stateDiagram-v2`

---

### Lo-Fi Mockups

```
Create a wireframe for our landing page
```

```
Sketch a lo-fi mockup of the settings screen on mobile
```

```
Give me a quick ASCII wireframe of a login page
```

```
/create-mockup
```

**Strictly lo-fi**: grayscale placeholder boxes only, no brand colors, no real content. Every region is labeled. Good for communicating layout and hierarchy before committing to visual design.

**Screen types:** Landing page, Dashboard, Form, Modal, List view, Profile/Settings

---

### Technical Documentation

```
Generate API documentation for our REST endpoints
```

```
Create developer docs for our TypeScript SDK
```

```
Write a getting started guide for developers onboarding to our service
```

```
/create-technical-doc
```

**What's included in every doc:**
- Left-nav sidebar with anchor links
- Overview with tech stack badges
- Getting Started with real installation commands + minimal working example
- API Reference: per-endpoint method badge (color-coded), path, parameters table, response JSON
- Code examples with syntax highlighting
- Optional architecture diagram section

---

### Timelines & Roadmaps

```
Create a Gantt chart for our Q1 project
```

```
Show our product milestones for this year on a timeline
```

```
Create a Q1-Q4 product roadmap for our mobile app
```

```
/create-timeline
```

**Three timeline types:**

| Type | Use When |
|------|----------|
| Gantt chart | Tasks have start/end dates; parallel workstreams need comparison |
| Milestone timeline | Key deliverables are point-in-time events |
| Quarter roadmap | Planning is at Q1/Q2/Q3/Q4 level, no day-level dates |

All Gantt charts include a "Today" marker and status-coded bars (completed=green, in-progress=blue, planned=gray, at-risk=orange).

---

## Commands

| Command | Description |
|---------|-------------|
| `/create-architecture-diagram` | Architecture diagram (prompts for format) |
| `/create-flowchart` | Process flowchart or decision tree |
| `/create-mockup` | Lo-fi wireframe for a screen or component |
| `/create-technical-doc` | HTML developer reference documentation |
| `/create-timeline` | Gantt chart, milestone timeline, or roadmap |

All skills also activate automatically from natural language — no slash command required.

---

## Output Files

| Skill | Output |
|-------|--------|
| architecture-diagram-creator | `[system]-architecture.html` or `.dot` |
| flowchart-creator | `[process]-flowchart.html` or `.dot` |
| mockup-creator | `[screen]-wireframe.html` or inline ASCII |
| technical-doc-creator | `[system]-docs.html` |
| timeline-creator | `[project]-timeline.html` |

Mermaid output is always a fenced code block in the conversation (no file saved unless requested).

---

## Requirements

No external API keys or dependencies required. Output is standalone HTML (no CDN, no JavaScript frameworks) or text-based (Mermaid/DOT/ASCII).

Graphviz rendering (for `.dot` files) requires a local install:

```bash
brew install graphviz       # macOS
apt install graphviz        # Ubuntu/Debian
```

Or use the [online renderer](https://dreampuf.github.io/GraphvizOnline/).

---

## What's Inside

```
plugins/visual-documentation/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   ├── create-architecture-diagram.md
│   ├── create-flowchart.md
│   ├── create-mockup.md
│   ├── create-technical-doc.md
│   └── create-timeline.md
└── skills/
    ├── architecture-diagram-creator/
    │   ├── SKILL.md
    │   ├── references/
    │   │   ├── html-diagrams.md          # 6-section HTML template + styling
    │   │   ├── mermaid-diagrams.md       # graph/C4/sequence syntax + classDef
    │   │   └── dot-diagrams.md           # digraph templates + rendering commands
    │   └── evals/evals.json
    ├── flowchart-creator/
    │   ├── SKILL.md
    │   ├── references/
    │   │   ├── html-flowcharts.md        # SVG node templates + coordinate layout
    │   │   ├── mermaid-flowcharts.md     # flowchart/sequence/state syntax
    │   │   └── dot-flowcharts.md         # digraph decision flow templates
    │   └── evals/evals.json
    ├── mockup-creator/
    │   ├── SKILL.md
    │   ├── references/
    │   │   └── lo-fi-mockups.md          # HTML wireframe base + screen-type compositions
    │   └── evals/evals.json
    ├── technical-doc-creator/
    │   ├── SKILL.md
    │   ├── references/
    │   │   └── technical-docs.md         # Full HTML template with sidebar + endpoint blocks
    │   └── evals/evals.json
    └── timeline-creator/
        ├── SKILL.md
        ├── references/
        │   └── timelines.md              # Gantt, milestone, and quarter-roadmap templates
        └── evals/evals.json
```

---

## License

MIT — See [LICENSE](../LICENSE)
