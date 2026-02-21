# Skill Best Practices

**Comprehensive guide for building great Claude Code skills and plugins.**

Learn the patterns, avoid the pitfalls, and scaffold new skills interactively.

---

## What This Does

This plugin provides two things:

1. **Reference knowledge** — Claude automatically loads skill development best practices when you're building skills or plugins. Ask about SKILL.md format, frontmatter fields, plugin packaging, hooks, or testing and Claude will apply the guide.

2. **Interactive wizard** — Run `/create-skill` to scaffold a complete new skill or plugin through a guided workflow.

---

## Installation

### Plugin (Recommended)

In Claude Code:

```
/plugin marketplace add prakhar625/interaction-recorder
/plugin install interaction-recorder@skill-best-practices
```

Restart Claude Code after installing.

### Manual

```bash
git clone https://github.com/prakhar625/interaction-recorder.git
cp -r interaction-recorder/plugins/skill-best-practices ~/.claude/plugins/
```

Then enable it in Claude Code with `/plugin`.

---

## Commands

| Command | Description |
|---------|-------------|
| `/create-skill` | Interactive wizard to scaffold a new skill or plugin |

The skill also triggers automatically when you say things like "create a new skill", "build a plugin", "how do I write SKILL.md", etc.

---

## What You'll Learn

### Quick Start Checklist

Every new skill needs 10 things — the guide provides a copy-paste checklist covering directory structure, frontmatter, description quality, line count, references, invocation control, testing, and versioning.

### Skill Types

- **Reference** — Knowledge Claude applies automatically (conventions, patterns)
- **Task** — Step-by-step workflows with commands (deploy, record, create)
- **Discipline** — Rules Claude must follow under pressure (TDD, code review)

### SKILL.md Anatomy

Complete frontmatter reference with all 10 fields, content type patterns (reference vs task), invocation control matrix, and writing great descriptions.

### Five Mandatory Rules

1. Description is everything — Claude uses it to decide when to load your skill
2. Keep SKILL.md under 500 lines — use references/ for detail
3. One concern per reference doc
4. Gate expensive operations with `disable-model-invocation: true`
5. Test triggers before shipping

### Plugin Packaging

When to convert standalone to plugin, directory layout, manifest schema, caching gotchas, version management, and marketplace distribution.

### Hooks & Events

All 17 event types, three hook types (command/prompt/agent), matcher patterns, exit codes, lifecycle hooks in skills, and copy-paste recipes.

### Testing & Evaluation

evals.json format, trigger testing, quality gates, budget management, and pre-ship checklist.

### Common Mistakes

12 anti-patterns with fixes: vague descriptions, workflow summaries in descriptions, oversized SKILL.md, components in wrong directory, path issues, version management, and more.

---

## What's Inside

```
plugins/skill-best-practices/
├── .claude-plugin/
│   └── plugin.json                      # Plugin manifest
├── skills/skill-best-practices/
│   ├── SKILL.md                         # Main best practices guide
│   └── references/
│       ├── skill-anatomy.md             # SKILL.md format & frontmatter
│       ├── plugin-packaging.md          # Plugin structure & distribution
│       ├── hooks-and-events.md          # Hook types, events & recipes
│       ├── evaluation-testing.md        # Testing & quality gates
│       └── common-mistakes.md           # 12 anti-patterns with fixes
└── commands/
    └── create-skill.md                  # /create-skill wizard
```

---

## License

MIT — See [LICENSE](../LICENSE)
