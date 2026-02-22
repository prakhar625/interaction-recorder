# prakhar625 Plugin Marketplace

A collection of Claude Code plugins for creative and developer workflows.

---

## Plugins

| Plugin | Description | Docs |
|--------|-------------|------|
| **[interaction-recorder](plugins/interaction-recorder/)** | Record polished demo videos of any codebase's UI — narration, sound design, motion graphics, and transitions | [docs/interaction-recorder.md](docs/interaction-recorder.md) |
| **[skill-best-practices](plugins/skill-best-practices/)** | Comprehensive guide for building Claude Code skills and plugins, with an interactive `/create-skill` wizard | [docs/skill-best-practices.md](docs/skill-best-practices.md) |
| **[image-gen](plugins/image-gen/)** | Generate, edit, and enhance images using FAL AI — 13 models including Imagen 4, FLUX.2, Grok Imagine, and Seedream | [docs/image-gen.md](docs/image-gen.md) |
| **[visual-documentation](plugins/visual-documentation/)** | Create architecture diagrams, flowcharts, lo-fi wireframes, technical docs, and project timelines — HTML, Mermaid, and DOT formats | [docs/visual-documentation.md](docs/visual-documentation.md) |

---

## Installation

### From Marketplace

```
/plugin marketplace add prakhar625/interaction-recorder
/plugin install interaction-recorder@<plugin-name>
```

### Manual

```bash
git clone https://github.com/prakhar625/interaction-recorder.git
cp -r interaction-recorder/plugins/<plugin-name> ~/.claude/plugins/
```

Then enable in Claude Code with `/plugin`. Restart after installing.

---

## Repository Structure

```
.
├── .claude-plugin/
│   └── marketplace.json              # Marketplace catalog (all plugins listed here)
├── plugins/
│   ├── interaction-recorder/         # Video recording plugin
│   │   ├── .claude-plugin/plugin.json
│   │   ├── commands/
│   │   ├── skills/interaction-recorder/
│   │   └── hooks/
│   ├── skill-best-practices/         # Skill development guide plugin
│   │   ├── .claude-plugin/plugin.json
│   │   ├── commands/
│   │   └── skills/skill-best-practices/
│   ├── image-gen/                    # FAL AI image generation plugin
│   │   ├── .claude-plugin/plugin.json
│   │   ├── commands/
│   │   ├── skills/image-gen/
│   │   └── hooks/
│   └── visual-documentation/         # Visual documentation plugin
│       ├── .claude-plugin/plugin.json
│       ├── commands/
│       └── skills/
│           ├── architecture-diagram-creator/
│           ├── flowchart-creator/
│           ├── mockup-creator/
│           ├── technical-doc-creator/
│           └── timeline-creator/
├── docs/                             # Per-plugin documentation
│   ├── interaction-recorder.md
│   ├── skill-best-practices.md
│   ├── image-gen.md
│   └── visual-documentation.md
├── README.md
└── LICENSE
```

Each plugin is fully self-contained in its `plugins/` subdirectory. The marketplace catalog at `.claude-plugin/marketplace.json` registers all available plugins.

---

## Adding a New Plugin

1. Create `plugins/<plugin-name>/` with standard layout (`.claude-plugin/plugin.json`, `skills/`, `commands/`, etc.)
2. Add an entry to `.claude-plugin/marketplace.json`
3. Add documentation at `docs/<plugin-name>.md`
4. Add a row to the plugin table above

Use the `skill-best-practices` plugin's `/create-skill` command to scaffold new plugins with best practices built in.

---

## License

MIT — See [LICENSE](LICENSE)
