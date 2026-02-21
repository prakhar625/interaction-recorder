# Design: skill-best-practices Plugin

**Date**: 2026-02-21
**Status**: Approved

## Goal

Create a meta-skill that serves as a comprehensive guide for building Claude Code skills and plugins. It should both teach best practices (auto-loaded reference) and interactively scaffold new skills (/create-skill command).

## Plugin Structure

```
plugins/skill-best-practices/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── skill-best-practices/
│       ├── SKILL.md                    # Main guide (~400 lines)
│       └── references/
│           ├── skill-anatomy.md        # SKILL.md format, frontmatter, content patterns
│           ├── plugin-packaging.md     # Plugin directory, manifest, caching gotchas
│           ├── hooks-and-events.md     # Hook types, events, matchers, exit codes
│           ├── evaluation-testing.md   # Evals format, quality gates, testing
│           └── common-mistakes.md      # Anti-patterns, gotchas, troubleshooting
└── commands/
    └── create-skill.md                 # Interactive skill creation wizard
```

## Components

### SKILL.md — Main Best Practices Guide

- Frontmatter triggers on skill creation / plugin development keywords
- Distilled checklist approach: what every good skill needs
- Mandatory rules for quality
- References to detailed docs per topic
- Covers: structure, frontmatter, content patterns, testing, packaging

### /create-skill — Interactive Creation Wizard

- `disable-model-invocation: true` (manual invocation only)
- Walks through: purpose → type → structure → scaffold → test
- Generates complete directory structure with templates
- Handles both standalone skills and full plugin packaging

### Reference Documents

1. **skill-anatomy.md** — SKILL.md format, all frontmatter fields, content types (reference vs task), string substitution, dynamic context injection, supporting files patterns
2. **plugin-packaging.md** — Plugin directory layout, plugin.json schema, marketplace.json format, caching implications, version management, distribution
3. **hooks-and-events.md** — All hook event types, matcher patterns, exit codes, hook types (command/prompt/agent), lifecycle hooks in skills
4. **evaluation-testing.md** — evals.json format, testing with --plugin-dir, quality gates, trigger testing
5. **common-mistakes.md** — Anti-patterns, caching gotchas, path issues, versioning mistakes, trigger problems

## README Restructure

```
docs/
├── interaction-recorder.md     # Full docs for interaction-recorder plugin
└── skill-best-practices.md     # Full docs for skill-best-practices plugin

README.md → concise marketplace overview + plugin table linking to docs/
```

## Key Sources

- Anthropic official docs (skills, plugins, hooks)
- obra/superpowers skill patterns
- NeoLabHQ context-engineering-kit patterns
- Existing interaction-recorder skill patterns
