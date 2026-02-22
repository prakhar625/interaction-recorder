# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Claude Code plugin marketplace repository containing 4 plugins for creative and developer workflows. There is no build system, test runner, or package manager — plugins are structured as Markdown files with YAML frontmatter, shell scripts, and JSON configuration.

## Architecture

### Plugin Anatomy

Every plugin lives in `plugins/<name>/` and follows this structure:

- `.claude-plugin/plugin.json` — Minimal metadata (name, description, author). **Only** `plugin.json` goes in this directory.
- `skills/<skill-name>/SKILL.md` — Main skill entry point (required). Keep under 500 lines.
- `skills/<skill-name>/references/` — One markdown file per detailed topic, referenced from SKILL.md.
- `skills/<skill-name>/scripts/` — Executable shell scripts (`chmod +x`).
- `skills/<skill-name>/evals/evals.json` — Trigger test cases.
- `commands/` — Slash command definitions (at plugin root, NOT inside `.claude-plugin/`).
- `hooks/hooks.json` + `hooks/*.sh` — Event hooks (at plugin root).
- `agents/` — Specialized agent definitions (optional, at plugin root).

### Central Marketplace Registry

`.claude-plugin/marketplace.json` at the repo root registers all plugins with metadata, versions, and source paths. Version format is `YYYY.M.DD.HHMM`.

### The Four Plugins

| Plugin | Skills | Commands | External Dependencies |
|--------|--------|----------|-----------------------|
| **interaction-recorder** | 1 skill (9-phase video recording) | `/record-demo`, `/record-quick`, `/record-plan`, `/record-review` | Playwright, Remotion, ffmpeg, Node.js 18+, TTS |
| **skill-best-practices** | 1 skill (meta-guide) | `/create-skill` | None |
| **image-gen** | 3 skills (gen, edit, enhance) + 2 agents | `/generate`, `/edit-image`, `/enhance-image`, `/image-models` | FAL AI API (`FAL_KEY`) |
| **visual-documentation** | 5 skills (arch diagrams, flowcharts, mockups, docs, timelines) | None | Graphviz (optional) |

### Documentation Lives in Two Places

- `docs/<plugin-name>.md` — User-facing plugin documentation.
- `plugins/<name>/skills/<skill>/references/` — Detailed reference docs loaded by skills at runtime.

## Adding a New Plugin

1. Create `plugins/<plugin-name>/` following the standard layout above.
2. Add an entry to `.claude-plugin/marketplace.json` (bump version).
3. Add documentation at `docs/<plugin-name>.md`.
4. Add a row to the plugin table in `README.md`.
5. Use the `skill-best-practices` plugin's teachings as the authoritative guide — especially the 5 mandatory rules around descriptions, line limits, reference docs, invocation gating, and trigger testing.

## Key Conventions

- **SKILL.md description field** must start with "Use when..." and describe triggering conditions, not workflow summaries. This is how Claude decides whether to auto-load a skill.
- **`disable-model-invocation: true`** is required on any skill with side effects (API calls, file creation, shell commands).
- **All paths must be relative** within plugins. Use `${CLAUDE_PLUGIN_ROOT}` in hooks/scripts for plugin-relative references.
- **SessionStart hooks** handle environment setup — loading `.env` files and validating required API keys.
- **Shell scripts** use `#!/bin/bash` or `#!/usr/bin/env` shebangs, `set -euo pipefail`, and quoted variables throughout.
- **Evals** (`evals/evals.json`) define test cases as `{prompt, expected_trigger, expected_behaviors}` for verifying skill activation.
