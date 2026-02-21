# skill-best-practices Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a meta-skill plugin that teaches how to build great Claude Code skills and interactively scaffolds new ones.

**Architecture:** Self-contained plugin at `plugins/skill-best-practices/` with a SKILL.md reference guide, 5 reference documents, and a `/create-skill` interactive command. Also restructures the repo README to use per-plugin docs in `docs/`.

**Tech Stack:** Markdown, JSON (plugin.json, marketplace.json)

---

### Task 1: Create plugin directory structure

**Files:**
- Create: `plugins/skill-best-practices/.claude-plugin/plugin.json`

**Step 1: Create directories**

```bash
mkdir -p plugins/skill-best-practices/.claude-plugin
mkdir -p plugins/skill-best-practices/skills/skill-best-practices/references
mkdir -p plugins/skill-best-practices/commands
```

**Step 2: Write plugin.json**

Create `plugins/skill-best-practices/.claude-plugin/plugin.json`:

```json
{
  "name": "skill-best-practices",
  "description": "Comprehensive guide for building Claude Code skills and plugins. Teaches best practices and interactively scaffolds new skills.",
  "author": {
    "name": "Prakhar Bhardwaj",
    "url": "https://github.com/prakhar625"
  }
}
```

**Step 3: Commit**

```bash
git add plugins/skill-best-practices/.claude-plugin/plugin.json
git commit -m "feat: scaffold skill-best-practices plugin"
```

---

### Task 2: Write SKILL.md — Main best practices guide

**Files:**
- Create: `plugins/skill-best-practices/skills/skill-best-practices/SKILL.md`

**Step 1: Write SKILL.md**

This is the main guide (~400 lines). Content should cover:

**Frontmatter:**
```yaml
---
name: skill-best-practices
description: >
  Comprehensive guide for building Claude Code skills and plugins.
  Use when creating a new skill, building a plugin, writing SKILL.md files,
  setting up hooks, creating commands, or learning skill development best practices.
  Triggers on: create skill, new skill, build plugin, skill best practices,
  skill development, write SKILL.md, plugin structure, skill guide.
---
```

**Body structure (in this order):**

1. **Overview** — What this skill teaches, when to use it
2. **Quick Start Checklist** — 10-item checklist for every new skill
3. **Skill Types** — Reference vs Task skills, when to use each, invocation control matrix
4. **SKILL.md Anatomy** — Frontmatter fields (full table), body structure patterns, content guidelines
5. **Directory Structure** — Standalone vs plugin layouts, where files go, naming conventions
6. **Mandatory Rules** — 5 non-negotiable rules for quality skills:
   - Rule 1: Description is everything (Claude uses it to decide when to auto-load)
   - Rule 2: Keep SKILL.md under 500 lines (use references/ for detail)
   - Rule 3: One concern per reference doc (don't combine unrelated topics)
   - Rule 4: Gate expensive operations with `disable-model-invocation: true`
   - Rule 5: Test triggers before shipping (verify Claude loads your skill correctly)
7. **Supporting Files** — References pattern, scripts, assets, evals
8. **Commands** — How commands relate to skills, frontmatter, invocation patterns
9. **Hooks** — When and how to use hooks, lifecycle hooks in skills, security
10. **Plugin Packaging** — When to convert standalone → plugin, manifest, caching gotchas
11. **Quality Checklist** — Pre-ship checklist referencing each reference doc
12. **Common Mistakes** — Top 10 anti-patterns with fixes

Each section references its corresponding reference doc for detailed information.

**Step 2: Commit**

```bash
git add plugins/skill-best-practices/skills/skill-best-practices/SKILL.md
git commit -m "feat: write main SKILL.md best practices guide"
```

---

### Task 3: Write reference — skill-anatomy.md

**Files:**
- Create: `plugins/skill-best-practices/skills/skill-best-practices/references/skill-anatomy.md`

**Step 1: Write skill-anatomy.md**

Detailed reference covering:

- **SKILL.md format** — YAML frontmatter + markdown body
- **All frontmatter fields** — Complete table with required/optional, descriptions, examples:
  - `name`, `description`, `argument-hint`, `disable-model-invocation`, `user-invocable`, `allowed-tools`, `model`, `context`, `agent`, `hooks`
- **Invocation control matrix** — Table showing who can invoke based on frontmatter combination
- **Content types** — Reference content (guidelines, conventions) vs Task content (step-by-step workflows)
- **String substitution** — `$ARGUMENTS`, `$ARGUMENTS[N]`, `$N`, `${CLAUDE_SESSION_ID}`
- **Dynamic context injection** — `` !`command` `` syntax for running shell commands
- **Subagent execution** — `context: fork` and `agent` field usage
- **Extended thinking** — "ultrathink" keyword
- **Supporting files** — How to reference from SKILL.md, file organization patterns
- **Skill budget** — 2% of context window / 16,000 chars, `SLASH_COMMAND_TOOL_CHAR_BUDGET`
- **Good vs bad examples** — Side-by-side comparison of well-written vs poorly-written descriptions

**Step 2: Commit**

```bash
git add plugins/skill-best-practices/skills/skill-best-practices/references/skill-anatomy.md
git commit -m "feat: add skill-anatomy reference doc"
```

---

### Task 4: Write reference — plugin-packaging.md

**Files:**
- Create: `plugins/skill-best-practices/skills/skill-best-practices/references/plugin-packaging.md`

**Step 1: Write plugin-packaging.md**

Detailed reference covering:

- **When to use a plugin vs standalone** — Decision matrix
- **Plugin directory layout** — Standard structure with all component directories at root, `.claude-plugin/` for manifest only
- **plugin.json schema** — All fields, which are required, path behavior rules
- **marketplace.json format** — Structure for marketplace distribution
- **Plugin caching** — How `~/.claude/plugins/cache` works, version-based updates
- **Path limitations** — No path traversal outside plugin dir, symlink workaround
- **Environment variables** — `${CLAUDE_PLUGIN_ROOT}`, `$CLAUDE_PROJECT_DIR`
- **Installation scopes** — user, project, local, managed
- **Version management** — Semantic versioning, plugin.json vs marketplace.json priority
- **Testing during development** — `--plugin-dir` flag usage
- **Namespace conventions** — `plugin-name:skill-name` format

**Step 2: Commit**

```bash
git add plugins/skill-best-practices/skills/skill-best-practices/references/plugin-packaging.md
git commit -m "feat: add plugin-packaging reference doc"
```

---

### Task 5: Write reference — hooks-and-events.md

**Files:**
- Create: `plugins/skill-best-practices/skills/skill-best-practices/references/hooks-and-events.md`

**Step 1: Write hooks-and-events.md**

Detailed reference covering:

- **Hook event types** — Full table of all events, when they fire, whether they can block
- **Three hook types** — `command`, `prompt`, `agent` with examples of each
- **Configuration format** — hooks.json structure, matcher patterns, handler fields
- **Matcher patterns** — Regex patterns, what each event type matches on
- **Exit code semantics** — 0 (success), 2 (blocking error), other (non-blocking)
- **Hooks in skills** — Lifecycle hooks via frontmatter, scoped cleanup
- **Hooks in plugins** — hooks.json at plugin root, `${CLAUDE_PLUGIN_ROOT}` usage
- **Security considerations** — Full user permissions, snapshotted at startup, input validation
- **Common hook recipes** — SessionStart env loading, PreToolUse validation, PostToolUse formatting

**Step 2: Commit**

```bash
git add plugins/skill-best-practices/skills/skill-best-practices/references/hooks-and-events.md
git commit -m "feat: add hooks-and-events reference doc"
```

---

### Task 6: Write reference — evaluation-testing.md

**Files:**
- Create: `plugins/skill-best-practices/skills/skill-best-practices/references/evaluation-testing.md`

**Step 1: Write evaluation-testing.md**

Detailed reference covering:

- **evals.json format** — Array of test case objects, fields (name, prompt, expected_trigger, expected_behaviors)
- **Writing good test cases** — Cover trigger variations, edge cases, quality behaviors
- **Testing triggers** — How to verify Claude loads the right skill for a given prompt
- **Quality gates** — Checklist patterns for validation within skills
- **Testing during development** — `claude --plugin-dir ./my-plugin` workflow
- **Trigger debugging** — "What skills are available?", description optimization
- **Budget testing** — `/context` command, `SLASH_COMMAND_TOOL_CHAR_BUDGET`

**Step 2: Commit**

```bash
git add plugins/skill-best-practices/skills/skill-best-practices/references/evaluation-testing.md
git commit -m "feat: add evaluation-testing reference doc"
```

---

### Task 7: Write reference — common-mistakes.md

**Files:**
- Create: `plugins/skill-best-practices/skills/skill-best-practices/references/common-mistakes.md`

**Step 1: Write common-mistakes.md**

Anti-patterns and troubleshooting:

1. **Putting components inside .claude-plugin/** — Only plugin.json goes there
2. **Missing or vague description** — Claude can't auto-load without good description
3. **SKILL.md over 500 lines** — Use reference docs, Claude struggles with massive files
4. **Absolute paths in manifests** — All paths must be relative, starting with `./`
5. **Referencing files outside plugin directory** — Won't work after cache copy
6. **Forgetting to bump version** — Cached copies won't update
7. **Using `context: fork` on guidelines** — No task = no meaningful subagent output
8. **Non-executable hook scripts** — `chmod +x` is required
9. **Unquoted shell variables** — Always use `"$VAR"` in hook scripts
10. **Trusting `user-invocable` for security** — Use `disable-model-invocation: true` instead
11. **Not testing triggers** — Skill may never activate if description doesn't match user language
12. **Mixing command and skill with same name** — Skill takes precedence, command ignored

**Step 2: Commit**

```bash
git add plugins/skill-best-practices/skills/skill-best-practices/references/common-mistakes.md
git commit -m "feat: add common-mistakes reference doc"
```

---

### Task 8: Write /create-skill command

**Files:**
- Create: `plugins/skill-best-practices/commands/create-skill.md`

**Step 1: Write create-skill.md**

```yaml
---
command: create-skill
description: Interactive wizard to scaffold a new Claude Code skill or plugin
disable-model-invocation: true
---
```

Body content — interactive workflow:

1. **Gather requirements** — Ask: What does this skill do? What triggers it? Is it reference or task?
2. **Determine scope** — Standalone skill (`.claude/skills/`) or full plugin (`plugins/`)?
3. **Scaffold structure** — Create all directories and template files:
   - SKILL.md with proper frontmatter
   - Reference docs stubs if needed
   - Command files if the skill has commands
   - hooks.json if hooks are needed
   - plugin.json if plugin packaging
   - evals.json template
4. **Fill SKILL.md** — Generate the main skill content based on gathered requirements
5. **Add to marketplace** — If plugin, update marketplace.json with new entry
6. **Test triggers** — Verify the skill loads correctly by checking description matching
7. **Commit** — Stage and commit the new skill

Include quality gates and references back to the skill-best-practices guide.

**Step 2: Commit**

```bash
git add plugins/skill-best-practices/commands/create-skill.md
git commit -m "feat: add /create-skill interactive wizard command"
```

---

### Task 9: Update marketplace.json

**Files:**
- Modify: `.claude-plugin/marketplace.json`

**Step 1: Add skill-best-practices to marketplace**

Add a new entry to the `plugins` array:

```json
{
  "name": "skill-best-practices",
  "description": "Comprehensive guide for building Claude Code skills and plugins. Teaches best practices and interactively scaffolds new skills with /create-skill.",
  "version": "2026.2.21.0001",
  "author": {
    "name": "Prakhar Bhardwaj",
    "url": "https://github.com/prakhar625"
  },
  "source": "./plugins/skill-best-practices",
  "category": "developer-tools",
  "tags": ["skills", "plugins", "best-practices", "scaffolding", "developer-tools", "meta"]
}
```

**Step 2: Commit**

```bash
git add .claude-plugin/marketplace.json
git commit -m "feat: add skill-best-practices to marketplace catalog"
```

---

### Task 10: Create per-plugin documentation in docs/

**Files:**
- Create: `docs/interaction-recorder.md` (moved from README)
- Create: `docs/skill-best-practices.md`

**Step 1: Create docs/interaction-recorder.md**

Move the detailed documentation from the current README.md into `docs/interaction-recorder.md`. This includes: features, commands, pipeline phases, requirements, architecture decisions. Keep the same content but adjust links.

**Step 2: Create docs/skill-best-practices.md**

Write a user-facing README for the skill-best-practices plugin covering:
- What the plugin does
- Installation
- Available commands (`/create-skill`)
- What the skill teaches
- Quick start for creating your first skill

**Step 3: Commit**

```bash
git add docs/interaction-recorder.md docs/skill-best-practices.md
git commit -m "docs: add per-plugin documentation"
```

---

### Task 11: Restructure main README.md

**Files:**
- Modify: `README.md`

**Step 1: Rewrite README.md**

Replace current content with a concise marketplace overview:

- **Header** — Repo name + one-liner description
- **Plugin table** — Name, description, link to docs, version
- **Installation** — How to install plugins from this marketplace
- **Adding new plugins** — Brief guide for contributors
- **Repository structure** — Simplified tree showing plugins/ and docs/ layout
- **License**

The plugin table is the extensible pattern — adding a new plugin just means adding a row.

**Step 2: Commit**

```bash
git add README.md
git commit -m "docs: restructure README as marketplace overview with plugin table"
```

---

### Task 12: Final verification

**Step 1: Verify directory structure**

```bash
find plugins/ docs/ -type f | sort
```

Expected output should show both plugins and both docs.

**Step 2: Verify marketplace.json is valid JSON**

```bash
python3 -c "import json; json.load(open('.claude-plugin/marketplace.json')); print('Valid JSON')"
```

**Step 3: Verify plugin.json is valid JSON**

```bash
python3 -c "import json; json.load(open('plugins/skill-best-practices/.claude-plugin/plugin.json')); print('Valid JSON')"
```

**Step 4: Verify all files committed**

```bash
git status
git log --oneline -10
```

Expected: clean working tree, ~10 commits for this feature.
