---
name: skill-best-practices
description: >
  Use when creating a new skill, building a plugin, writing SKILL.md files,
  setting up hooks, creating commands, or learning skill development best practices.
  Triggers on: create skill, new skill, build plugin, skill best practices,
  skill development, write SKILL.md, plugin structure, skill guide, scaffold skill,
  new plugin, plugin development, skill template, how to write a skill.
---

# Skill Best Practices

Comprehensive guide for building great Claude Code skills and plugins.

Use this as a reference when building any skill — from a simple convention guide to a full
multi-phase production workflow. For an interactive creation wizard, run `/create-skill`.

---

## Quick Start Checklist

Every new skill needs these 10 things. Check them off before shipping:

- [ ] **Directory**: `skills/<skill-name>/SKILL.md` (required entry point)
- [ ] **Frontmatter**: `name` + `description` (description starts with "Use when...")
- [ ] **Description quality**: Describes *triggering conditions*, NOT what the skill does
- [ ] **Under 500 lines**: Move detail to `references/` files
- [ ] **References linked**: Each reference file mentioned in SKILL.md so Claude knows it exists
- [ ] **Invocation control**: `disable-model-invocation: true` if skill has side effects
- [ ] **Supporting files**: Scripts executable (`chmod +x`), assets accessible
- [ ] **Tested triggers**: Verified Claude loads the skill for expected prompts
- [ ] **No absolute paths**: All paths relative, starting with `./`
- [ ] **Version bumped**: If distributing as plugin, version updated in marketplace entry

---

## Skill Types

### Reference Skills

Knowledge Claude applies to current work — conventions, patterns, style guides.
Runs inline with conversation context. No `disable-model-invocation`.

```yaml
---
name: api-conventions
description: Use when writing API endpoints or designing REST interfaces for this codebase
---
When writing API endpoints:
- Use RESTful naming conventions
- Return consistent error formats
```

### Task Skills

Step-by-step instructions for specific actions — deployments, commits, code generation.
Often invoked manually. Use `disable-model-invocation: true` for side effects.

```yaml
---
name: deploy
description: Use when deploying the application to production or staging environments
context: fork
disable-model-invocation: true
---
Deploy the application:
1. Run the test suite
2. Build the application
3. Push to the deployment target
```

### Invocation Control Matrix

| Frontmatter | User invokes | Claude invokes | When loaded |
|-------------|-------------|---------------|-------------|
| (default) | Yes | Yes | Description always in context |
| `disable-model-invocation: true` | Yes | No | Description NOT in context |
| `user-invocable: false` | No | Yes | Description always in context |

---

## SKILL.md Anatomy

### Frontmatter

Two fields supported: `name` and `description` (max 1024 chars total).

```yaml
---
name: my-skill-name
description: >
  Use when [specific triggering conditions]. Triggers on: keyword1, keyword2, keyword3.
---
```

**Name**: Lowercase letters, numbers, hyphens only. Max 64 chars.

**Description**: The single most important field. Claude uses this to decide when to auto-load
your skill. Write it poorly and your skill never activates. Rules:
- Start with "Use when..." — focus on *triggering conditions*
- NEVER summarize the skill's workflow (Claude may follow the summary instead of reading the skill)
- Include keywords users would naturally say
- Third person voice
- Under 500 characters

See [skill-anatomy.md](references/skill-anatomy.md) for the full frontmatter reference including
`argument-hint`, `allowed-tools`, `model`, `context`, `agent`, and `hooks` fields.

### Body Structure

```markdown
# Skill Name

## Overview
Core principle in 1-2 sentences.

## [Core Content]
The main instructions, patterns, or workflow.
Scale sections to their complexity.

## Phase/Step Details (if task skill)
Phase-by-phase breakdown with clear gates.
Reference external docs for each phase.

## Error Recovery (if applicable)
Fallback chains, common failure modes.

## Common Mistakes
What goes wrong + fixes.
```

**Key patterns from well-built skills:**

1. **Define terminology** early if any terms are ambiguous
2. **State mandatory rules** explicitly with STOP/WARNING markers
3. **Use validation gates** (checkbox lists) before moving between phases
4. **Reference docs** for each major section: `Read references/topic.md before starting.`
5. **Include error recovery** with fallback chains

---

## Directory Structure

### Standalone Skill (in a project)

```
.claude/skills/
  my-skill/
    SKILL.md              # Main instructions (required)
    references/           # Detailed docs per topic
    scripts/              # Utility scripts
    assets/               # Templates, images
```

### Plugin (for distribution)

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json       # Only plugin.json goes here
├── skills/
│   └── my-skill/
│       ├── SKILL.md
│       └── references/
├── commands/             # At plugin root, NOT inside .claude-plugin/
│   └── my-command.md
├── hooks/                # At plugin root
│   ├── hooks.json
│   └── my-hook.sh
└── agents/               # At plugin root (optional)
    └── my-agent.md
```

See [plugin-packaging.md](references/plugin-packaging.md) for the full plugin structure,
manifest schema, caching behavior, and distribution guide.

---

## Five Mandatory Rules

### Rule 1: Description Is Everything

Claude decides whether to load your skill based on the `description` field. A vague or missing
description means your skill never activates. A description that summarizes the workflow causes
Claude to shortcut — following the summary instead of reading the full skill.

```yaml
# BAD: Summarizes workflow — Claude follows this instead of reading skill body
description: Dispatches subagent per task with code review between tasks

# BAD: Too vague — won't match user prompts
description: For async testing

# GOOD: Triggering conditions only, no workflow
description: Use when executing implementation plans with independent tasks in the current session
```

### Rule 2: Keep SKILL.md Under 500 Lines

Move detailed content to `references/` files. Reference them from SKILL.md so Claude
knows they exist and when to load them:

```markdown
## Phase 5 — Workspace Setup
Read `references/tool-setup.md` before starting.
```

### Rule 3: One Concern Per Reference Doc

Each reference document covers one topic. Don't combine "hooks configuration" with
"plugin packaging" in the same file. This keeps documents focused and lets Claude load
only what's relevant.

### Rule 4: Gate Expensive Operations

Use `disable-model-invocation: true` for any skill that:
- Runs shell commands or scripts
- Makes API calls
- Creates/modifies files
- Deploys anything
- Sends messages

This prevents Claude from auto-triggering expensive or destructive workflows.

### Rule 5: Test Triggers Before Shipping

Verify Claude loads your skill for expected prompts. Check:
- "What skills are available?" — is your skill listed?
- Try natural phrases users would say — does your skill activate?
- If skill is excluded, check the budget: run `/context` for warnings

See [evaluation-testing.md](references/evaluation-testing.md) for testing methodology.

---

## Supporting Files

### References

One markdown file per major topic. Structure each as:
1. Title and goal
2. Prerequisites checklist
3. Step-by-step content with code examples
4. Validation gates (checkbox lists)
5. Common failure modes

### Scripts

Executable shell/python scripts in `scripts/`. Always:
- Use `#!/bin/bash` or `#!/usr/bin/env python3` shebang
- Make executable: `chmod +x scripts/my-script.sh`
- Use `${CLAUDE_PLUGIN_ROOT}` for paths in plugin context
- Quote all variables: `"$VAR"`

### Assets

Templates, images, config files in `assets/`. Include a README.md
explaining what each file is for.

### Evals

Test cases in `evals/evals.json`. Format:

```json
[
  {
    "name": "descriptive-test-name",
    "prompt": "Natural language that should trigger the skill",
    "expected_trigger": "skill-name",
    "expected_behaviors": [
      "Specific behavior the skill should produce",
      "Another expected behavior"
    ]
  }
]
```

---

## Commands

Commands are `.md` files with YAML frontmatter. They create `/command-name` slash commands.

```yaml
---
command: my-command
description: One-line description of what this command does
disable-model-invocation: true
---

[Markdown instructions for the command workflow]
```

Commands and skills with the same name conflict — the skill takes precedence.
Use commands for action-oriented workflows (e.g., `/deploy`, `/record-demo`, `/create-skill`).

---

## Hooks

Hooks run shell commands, prompts, or agents in response to events. Define them in:
- `hooks/hooks.json` — global to the plugin
- Skill frontmatter `hooks:` field — scoped to skill lifecycle

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/load-env.sh",
            "timeout": 5,
            "statusMessage": "Loading environment..."
          }
        ]
      }
    ]
  }
}
```

See [hooks-and-events.md](references/hooks-and-events.md) for all event types, matchers,
hook types, and exit code semantics.

---

## Plugin Packaging

Convert standalone skills to plugins when you want to:
- Share with others via marketplace
- Version and distribute updates
- Bundle multiple skills, commands, hooks together
- Namespace to avoid conflicts (`plugin-name:skill-name`)

**Critical caching gotcha**: Plugins are copied to `~/.claude/plugins/cache`. Files outside
the plugin directory are NOT copied. Use `${CLAUDE_PLUGIN_ROOT}` for all paths.

**Version management**: Bump the version in marketplace.json before distributing changes.
Cached copies only update when the version changes.

See [plugin-packaging.md](references/plugin-packaging.md) for full details.

---

## Quality Checklist

Before shipping any skill, verify:

**Structure:**
- [ ] SKILL.md exists with proper frontmatter
- [ ] Under 500 lines, detail in references/
- [ ] All reference files mentioned in SKILL.md
- [ ] Scripts are executable

**Content:**
- [ ] Description starts with "Use when..." and describes triggers only
- [ ] Mandatory rules stated explicitly
- [ ] Validation gates between phases (if task skill)
- [ ] Error recovery documented (if applicable)
- [ ] Common mistakes section included

**Testing:**
- [ ] Triggers verified — skill loads for expected prompts
- [ ] Budget check — skill fits within 2% context budget
- [ ] Plugin test — `claude --plugin-dir ./my-plugin` works

**Packaging (if plugin):**
- [ ] plugin.json in `.claude-plugin/` only
- [ ] Components at plugin root, NOT inside `.claude-plugin/`
- [ ] No absolute paths
- [ ] No references outside plugin directory
- [ ] Version bumped

---

## Common Mistakes

See [common-mistakes.md](references/common-mistakes.md) for the full list. Top 5:

1. **Vague description** → Claude never auto-loads the skill
2. **Description summarizes workflow** → Claude follows summary, skips skill body
3. **SKILL.md over 500 lines** → Claude struggles with massive context
4. **Components inside `.claude-plugin/`** → Only plugin.json goes there
5. **Forgot to bump version** → Users don't get updates (cached copy stale)
