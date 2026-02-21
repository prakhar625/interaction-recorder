---
command: create-skill
description: Interactive wizard to scaffold a new Claude Code skill or plugin
disable-model-invocation: true
argument-hint: "[skill-name]"
---

# Create Skill Wizard

Scaffold a complete Claude Code skill or plugin with best practices baked in.

Read the `skill-best-practices` skill before using this command. It provides the reference
knowledge this wizard applies.

---

## Step 1: Gather Requirements

Ask the user these questions one at a time:

1. **What does this skill do?**
   Get a 1-2 sentence description of the skill's purpose.

2. **What triggers it?**
   Ask: "What would someone say that should activate this skill?"
   Collect 5-10 natural language phrases.

3. **What type of skill is it?**

   | Type | Description | Example |
   |------|------------|---------|
   | **Reference** | Knowledge Claude applies automatically | API conventions, code style |
   | **Task** | Step-by-step workflow, usually manual | Deploy, record video, create PR |
   | **Discipline** | Rules Claude must follow under pressure | TDD, code review process |

4. **Does it have side effects?**
   If yes: will need `disable-model-invocation: true`

5. **Standalone or plugin?**

   | Scope | When to use |
   |-------|------------|
   | **Standalone** (`.claude/skills/`) | Personal, project-specific, quick experiment |
   | **Plugin** (`plugins/`) | Distribution, versioning, marketplace |

If the user provided a skill name as `$ARGUMENTS`, use it. Otherwise ask for a name
(lowercase, hyphens, no spaces).

---

## Step 2: Determine Structure

Based on the answers, determine what files are needed:

**Always created:**
- `SKILL.md` with proper frontmatter

**Conditional:**
- `references/` — if skill has multiple phases or topics (task/discipline skills)
- `commands/` — if skill has slash commands with side effects
- `hooks/` — if skill needs event hooks (env loading, validation, etc.)
- `scripts/` — if skill uses shell/python utilities
- `assets/` — if skill has templates or static files
- `evals/evals.json` — always recommended, especially for task skills
- `.claude-plugin/plugin.json` — if plugin packaging chosen
- Marketplace entry — if plugin, update `marketplace.json`

---

## Step 3: Scaffold Directory Structure

Create all directories and files. Use the appropriate base path:

- **Standalone**: `.claude/skills/<skill-name>/`
- **Plugin**: `plugins/<skill-name>/`

```bash
# Example for a plugin
mkdir -p plugins/<skill-name>/.claude-plugin
mkdir -p plugins/<skill-name>/skills/<skill-name>/references
mkdir -p plugins/<skill-name>/commands
mkdir -p plugins/<skill-name>/evals
```

---

## Step 4: Generate SKILL.md

Write the SKILL.md following these rules from skill-best-practices:

### Frontmatter

```yaml
---
name: <skill-name>
description: >
  Use when [triggering conditions from Step 1].
  Triggers on: [comma-separated trigger phrases from Step 1].
---
```

**Checklist for description:**
- [ ] Starts with "Use when..."
- [ ] Describes triggering conditions, NOT the workflow
- [ ] Includes keywords users would naturally say
- [ ] Under 500 characters
- [ ] Third person voice

### Body

Generate the body based on skill type:

**Reference skills:**
```markdown
# Skill Name

## Overview
[Core principle in 1-2 sentences]

## [Main Content]
[Guidelines, conventions, patterns]

## Quick Reference
[Table or bullets for scanning]

## Common Mistakes
[What goes wrong + fixes]
```

**Task skills:**
```markdown
# Skill Name

## Overview
[What this does, 1-2 sentences]

## Commands
[List slash commands if any]

## Phase Workflow
[Phase list with references]

## Mandatory Rules
[Non-negotiable rules with STOP markers]

## Phase Details
[Phase-by-phase with gates]

## Error Recovery
[Fallback chains]
```

**Discipline skills:**
```markdown
# Skill Name

## Overview
[The discipline and why it matters]

## The Rule
[State the non-negotiable rule]

## Red Flags
[Table of rationalizations vs reality]

## Process
[Step-by-step compliance flow]

## Common Mistakes
[What goes wrong + fixes]
```

### Size Check

- [ ] SKILL.md is under 500 lines
- [ ] Detailed content is in `references/` files
- [ ] Each reference file is linked from SKILL.md

---

## Step 5: Generate Supporting Files

### Reference Docs (if needed)

For each major topic/phase, create a reference file:

```markdown
# [Topic Name]

## Goal
[What this reference covers]

## Prerequisites
- [ ] [What must be true before using this reference]

## [Main Content]
[Detailed instructions, examples, code blocks]

## Validation Gate
- [ ] [What must pass before proceeding]

## Common Issues
[Failure modes and fixes]
```

### Command Files (if needed)

```yaml
---
command: <command-name>
description: [One-line description]
disable-model-invocation: true
---

[Workflow instructions]
```

### Hooks (if needed)

Create `hooks/hooks.json`:

```json
{
  "hooks": {
    "<EventName>": [
      {
        "matcher": "<pattern>",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/<script>.sh",
            "timeout": 5,
            "statusMessage": "Running hook..."
          }
        ]
      }
    ]
  }
}
```

Make hook scripts executable: `chmod +x hooks/<script>.sh`

### Evals Template

Create `evals/evals.json`:

```json
[
  {
    "name": "basic-trigger",
    "prompt": "[Natural language that should trigger the skill]",
    "expected_trigger": "<skill-name>",
    "expected_behaviors": [
      "[Specific behavior to verify]"
    ]
  },
  {
    "name": "alternative-trigger",
    "prompt": "[Different phrasing that should also trigger]",
    "expected_trigger": "<skill-name>",
    "expected_behaviors": [
      "[Expected behavior]"
    ]
  }
]
```

---

## Step 6: Plugin Packaging (if applicable)

### plugin.json

Create `.claude-plugin/plugin.json`:

```json
{
  "name": "<skill-name>",
  "description": "[Brief plugin description]",
  "author": {
    "name": "[Author Name]",
    "url": "[Author URL]"
  }
}
```

### Marketplace Entry

Add to the repo's `.claude-plugin/marketplace.json` plugins array:

```json
{
  "name": "<skill-name>",
  "description": "[Plugin description]",
  "version": "2026.1.1.0001",
  "author": { "name": "[Author]", "url": "[URL]" },
  "source": "./plugins/<skill-name>",
  "category": "[category]",
  "tags": ["tag1", "tag2"]
}
```

---

## Step 7: Verify

Run through the quality checklist:

**Structure:**
- [ ] SKILL.md exists with proper frontmatter
- [ ] Under 500 lines, detail in references/
- [ ] All reference files mentioned in SKILL.md
- [ ] Scripts are executable

**Content:**
- [ ] Description starts with "Use when..." and describes triggers only
- [ ] Mandatory rules stated explicitly (if task/discipline skill)
- [ ] Validation gates between phases (if task skill)
- [ ] Common mistakes section included

**Testing:**
- [ ] Run `claude --plugin-dir ./plugins/<skill-name>` to test loading
- [ ] Try trigger phrases — does the skill activate?
- [ ] Check `/context` for budget warnings

**Packaging (if plugin):**
- [ ] plugin.json in `.claude-plugin/` only
- [ ] Components at plugin root, NOT inside `.claude-plugin/`
- [ ] No absolute paths
- [ ] Version set in marketplace.json

---

## Step 8: Commit

Stage and commit all new files:

```bash
git add plugins/<skill-name>/  # or .claude/skills/<skill-name>/
git commit -m "feat: add <skill-name> skill"
```

If plugin with marketplace entry:

```bash
git add .claude-plugin/marketplace.json
git commit -m "feat: add <skill-name> to marketplace catalog"
```

---

## Summary

Present the user with:
- List of all files created
- How to test: `claude --plugin-dir ./plugins/<skill-name>`
- How to invoke: `/<skill-name>` or natural language matching the description
- Next steps: test triggers, add more reference docs, iterate on description
