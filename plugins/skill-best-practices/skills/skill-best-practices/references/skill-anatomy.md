# SKILL.md Anatomy — Full Reference

Complete reference for the SKILL.md file format, all frontmatter fields, content patterns,
string substitution, dynamic context, subagent execution, and budget constraints.

---

## File Format

A SKILL.md file has two parts: YAML frontmatter between `---` markers, followed by a markdown body.

```markdown
---
name: my-skill
description: >
  Use when [triggering conditions].
  Triggers on: keyword1, keyword2.
---

# My Skill

Markdown body with instructions, guidelines, or workflows.
```

The frontmatter is optional but strongly recommended. If omitted, the skill name defaults to
the directory name and the description falls back to the first paragraph of the body.

---

## Frontmatter Fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `name` | No | Directory name | Skill identifier. Lowercase letters, numbers, hyphens only. Max 64 characters. |
| `description` | Recommended | First paragraph of body | What the skill does and when to use it. Max ~500 chars recommended. Claude uses this to decide when to auto-load. |
| `argument-hint` | No | *(none)* | Hint shown in autocomplete after `/skill-name`. Example: `[issue-number]` |
| `disable-model-invocation` | No | `false` | When `true`, only the user can invoke via `/skill-name`. Claude will never auto-load. |
| `user-invocable` | No | `true` | When `false`, the skill is hidden from the `/` menu. Claude can still auto-invoke based on description. |
| `allowed-tools` | No | *(none)* | List of tools Claude can use without asking permission while this skill is active. |
| `model` | No | *(session default)* | Override the model used when this skill is active. |
| `context` | No | *(inline)* | Set to `fork` to run in an isolated subagent. See Subagent Execution below. |
| `agent` | No | *(none)* | Subagent type: `Explore`, `Plan`, `general-purpose`, or a custom agent from `.claude/agents/`. |
| `hooks` | No | *(none)* | Lifecycle hooks scoped to this skill. Same format as `hooks.json` entries. |

### Field Details

**`name`** — Must match the pattern `[a-z0-9-]+`. If not provided, the parent directory name
is used. The name determines the `/slash-command` users type to invoke the skill.

```yaml
name: deploy-staging    # invoked as /deploy-staging
```

**`description`** — The single most important field. Claude reads every skill description to
decide which skills to load for a given prompt. Write it as triggering conditions, not a
workflow summary.

```yaml
# Falls back to first paragraph when omitted:
---
---

# My Skill

This paragraph becomes the description if no frontmatter description is set.
```

**`argument-hint`** — Appears in the autocomplete UI after the skill name.

```yaml
argument-hint: "[branch-name]"
# User sees: /deploy [branch-name]
```

**`disable-model-invocation`** — Controls whether Claude can auto-invoke. When `true`, the
skill's description is NOT included in Claude's context at all, so Claude cannot decide to
load it. Only the user typing `/skill-name` triggers it.

**`user-invocable`** — The inverse guard. When `false`, users cannot see or type the skill
in the `/` menu. Claude can still auto-invoke it based on the description match.

| `disable-model-invocation` | `user-invocable` | User invokes | Claude invokes | Description in context |
|-----------------------------|-------------------|-------------|---------------|----------------------|
| `false` (default) | `true` (default) | Yes | Yes | Yes |
| `true` | `true` (default) | Yes | No | No |
| `false` (default) | `false` | No | Yes | Yes |

**`allowed-tools`** — A list of tool names Claude can use without prompting while the skill
is active. Useful for skills that need file operations, shell commands, or web access.

```yaml
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
```

**`model`** — Override the model for this skill's execution. Useful when a skill needs a
specific model's capabilities.

```yaml
model: claude-sonnet-4-20250514
```

**`agent`** — Specifies the subagent type. Built-in options are `Explore` (read-only
research), `Plan` (planning without execution), and `general-purpose`. You can also
reference a custom agent defined in `.claude/agents/`:

```yaml
agent: my-custom-agent    # loads .claude/agents/my-custom-agent.md
```

**`hooks`** — Lifecycle hooks that run only when this skill is active. Same structure as
entries in `hooks.json` but scoped to the skill.

```yaml
hooks:
  PreToolUse:
    - matcher: Bash
      hooks:
        - type: command
          command: "./scripts/validate-command.sh"
          timeout: 5
```

---

## Content Types

Skills fall into two categories based on their body content.

### Reference Content

Guidelines, conventions, patterns, and standards that Claude applies to its current work.
Reference skills run inline with the conversation. Claude loads them when the description
matches and weaves the guidance into its responses.

```yaml
---
name: api-conventions
description: Use when writing API endpoints, designing REST interfaces, or adding routes
---

# API Conventions

- Use plural nouns for resource endpoints: `/users`, `/orders`
- Return `{ data, error, meta }` envelope on all responses
- Use HTTP status codes correctly: 201 for creation, 204 for deletion
```

Reference skills typically do NOT use `disable-model-invocation` because you want Claude
to auto-load them whenever the topic is relevant.

### Task Content

Step-by-step workflows with explicit phases, validation gates, and concrete actions.
Task skills are often invoked manually and frequently use `context: fork` for isolation.

```yaml
---
name: release
description: Use when cutting a release, publishing a new version, or preparing a changelog
disable-model-invocation: true
context: fork
---

# Release Workflow

## Phase 1 — Pre-flight Checks
1. Run the full test suite: `npm test`
2. Verify no uncommitted changes: `git status`

## Phase 2 — Version Bump
1. Update version in package.json
2. Generate changelog from commits since last tag
```

Task skills should use `disable-model-invocation: true` whenever they have side effects
(running commands, creating files, deploying, sending messages).

---

## String Substitution Variables

When a skill is invoked, these variables are replaced in the body before Claude sees it.

| Variable | Description | Example |
|----------|-------------|---------|
| `$ARGUMENTS` | All arguments passed after the skill name | `/deploy staging --force` sets `$ARGUMENTS` to `staging --force` |
| `$ARGUMENTS[N]` | Specific argument by 0-based index | `$ARGUMENTS[0]` = `staging`, `$ARGUMENTS[1]` = `--force` |
| `$N` | Shorthand for `$ARGUMENTS[N]` | `$0` = `staging`, `$1` = `--force` |
| `${CLAUDE_SESSION_ID}` | Unique ID for the current Claude session | `sess_abc123def456` |

### Usage in SKILL.md

```markdown
---
name: fix-issue
argument-hint: "[issue-number]"
---

# Fix Issue $0

Look up issue #$0 in the issue tracker and implement a fix.
Use session ${CLAUDE_SESSION_ID} as a reference in commit messages.

All arguments received: $ARGUMENTS
```

When invoked as `/fix-issue 42`, Claude sees:

```markdown
# Fix Issue 42

Look up issue #42 in the issue tracker and implement a fix.
Use session sess_abc123def456 as a reference in commit messages.

All arguments received: 42
```

---

## Dynamic Context Injection

Use the `` !`command` `` syntax to run shell commands before the skill content is sent to
Claude. The command output replaces the backtick expression inline.

```markdown
# Current Branch Status

The current git branch is: !`git branch --show-current`

Recent commits:
!`git log --oneline -5`

## Instructions
Based on the branch and recent commits above, suggest the next steps.
```

When Claude loads this skill, the shell commands execute first and their stdout replaces the
`` !`...` `` expressions. Claude then sees the resolved content with actual values.

This is powerful for injecting runtime context — git state, environment variables, file
contents, API responses — directly into the skill prompt.

**Caveats:**
- Commands run in the project root directory
- Commands must complete quickly (they block skill loading)
- Stderr is not captured; only stdout is injected
- Failed commands inject empty strings

---

## Subagent Execution

Setting `context: fork` runs the skill in an isolated subagent. The skill content becomes
the subagent's system prompt. The subagent has no access to the parent conversation history.

```yaml
---
name: research
description: Use when deep-diving into a codebase question that needs focused exploration
context: fork
agent: Explore
---

Research the following question: $ARGUMENTS

Examine all relevant source files, tests, and documentation. Return a structured
summary with file paths and key findings.
```

### When to Use Subagents

- The skill performs a self-contained task with clear inputs and outputs
- You want to prevent the skill from being influenced by prior conversation
- The task benefits from a clean context (no prior assumptions)
- You are dispatching multiple independent tasks

### When NOT to Use Subagents

- Reference skills that provide guidelines (they need conversation context)
- Skills that build on prior conversation (user preferences, earlier decisions)
- Simple skills where forking overhead is not justified

The subagent returns its results to the parent conversation when it completes.

---

## Extended Thinking

Include the word `ultrathink` anywhere in the skill content to enable extended thinking
mode. This gives Claude more reasoning capacity for complex problems.

```markdown
---
name: architect
description: Use when designing system architecture or making major structural decisions
---

# Architecture Review

ultrathink

Analyze the proposed architecture change and evaluate:
1. Performance implications
2. Scalability concerns
3. Migration complexity
```

The word can appear in any position — a heading, a paragraph, a comment. Its presence
anywhere in the resolved content activates extended thinking.

---

## Supporting Files Best Practices

Keep SKILL.md under 500 lines. Move detailed content into separate files under `references/`,
`scripts/`, or `assets/`. Reference them from SKILL.md so Claude knows they exist.

### File Organization

```
skills/my-skill/
  SKILL.md                        # Under 500 lines — overview + phase outlines
  references/
    setup-guide.md                # Detailed setup instructions
    error-catalog.md              # All known error codes and fixes
    api-reference.md              # Endpoint specifications
  scripts/
    validate.sh                   # Pre-flight validation script
    deploy.sh                     # Deployment automation
  assets/
    template.json                 # Template files
```

### Referencing Files from SKILL.md

Tell Claude explicitly when to read each file:

```markdown
## Phase 1 — Environment Setup
Read `references/setup-guide.md` before starting this phase.

## Phase 3 — Error Handling
If any step fails, consult `references/error-catalog.md` for recovery steps.
```

Do NOT dump all reference content into SKILL.md. Claude loads reference files on demand,
which is more efficient than front-loading everything into the main skill.

### One Concern Per File

Each reference document should cover exactly one topic. This lets Claude load only what is
relevant to the current phase or question.

| Good | Bad |
|------|-----|
| `references/auth-patterns.md` | `references/auth-and-deployment-and-hooks.md` |
| `references/error-catalog.md` | `references/everything-else.md` |
| `references/testing-guide.md` | `references/misc-notes.md` |

---

## Skill Budget

Each skill consumes context window space. Claude enforces a budget to prevent skills from
crowding out conversation context.

| Constraint | Value |
|------------|-------|
| Default budget per skill | 2% of context window |
| Fallback budget | 16,000 characters |
| Override environment variable | `SLASH_COMMAND_TOOL_CHAR_BUDGET` |

### Checking Budget Usage

Run `/context` in Claude Code to see how much budget each loaded skill is consuming and
whether any skills are being excluded due to budget pressure.

### Staying Within Budget

- Keep SKILL.md concise (under 500 lines, under 16,000 characters)
- Move detail to reference files that Claude loads on demand
- Use short, direct language — avoid verbose explanations
- Remove redundant content between SKILL.md and reference files

If a skill exceeds its budget, Claude may truncate or skip it entirely. The `/context`
command will show warnings when this happens.

### Overriding the Budget

Set the `SLASH_COMMAND_TOOL_CHAR_BUDGET` environment variable to change the per-skill
character limit:

```bash
export SLASH_COMMAND_TOOL_CHAR_BUDGET=32000
```

This affects all skills in the session.

---

## Writing Great Descriptions

The description field determines whether Claude auto-loads your skill. It must describe
**when** to use the skill, not **what** the skill does.

### Side-by-Side Comparison

| Quality | Description | Problem |
|---------|-------------|---------|
| BAD | `For async testing` | Too vague. Matches nothing specific. |
| BAD | `Dispatches subagent per task with code review` | Summarizes the workflow. Claude may follow this instead of reading the skill body. |
| BAD | `Helps with deployment` | Vague. Does not describe triggering conditions. |
| BAD | `A skill for managing database migrations` | Describes identity, not when to invoke. |
| GOOD | `Use when tests have race conditions, timing dependencies, or pass/fail inconsistently` | Specific triggering conditions that match real user problems. |
| GOOD | `Use when creating a new skill, building a plugin, or writing SKILL.md files` | Lists concrete activities that should trigger loading. |
| GOOD | `Use when deploying to production, staging, or preview environments` | Clear scope of when the skill applies. |
| GOOD | `Use when debugging memory leaks, analyzing heap snapshots, or profiling Node.js applications` | Enumerates the exact scenarios. |

### Description Formula

```
Use when [condition 1], [condition 2], or [condition 3].
Triggers on: keyword1, keyword2, keyword3.
```

The "Triggers on" suffix adds keyword-based matching for phrases users commonly say.

---

## Skill Priority Order

When multiple skills have the same name, Claude resolves conflicts using this priority:

| Priority | Source | Location |
|----------|--------|----------|
| 1 (highest) | Enterprise managed | Managed by organization admin |
| 2 | Personal | `~/.claude/skills/` |
| 3 (lowest) | Project | `.claude/skills/` in the repo |

Plugin skills are namespaced as `plugin-name:skill-name`, so they never conflict with
project or personal skills. A plugin skill named `deploy` in a plugin called `my-tools`
is invoked as `/my-tools:deploy`.

---

## Complete Example

Putting it all together — a well-structured task skill:

```yaml
---
name: code-review
description: >
  Use when reviewing pull requests, checking code quality, or preparing
  merge feedback. Triggers on: review PR, code review, check PR, review changes.
argument-hint: "[pr-number]"
disable-model-invocation: true
context: fork
agent: Explore
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
---

# Code Review for PR #$0

ultrathink

## Phase 1 — Gather Context
Read `references/review-checklist.md` for the full review criteria.

1. Fetch the PR diff: !`gh pr diff $0`
2. Identify changed files and their purpose
3. Check CI status: !`gh pr checks $0`

## Phase 2 — Analysis
For each changed file:
- [ ] Logic correctness
- [ ] Error handling coverage
- [ ] Test coverage for new code
- [ ] No security anti-patterns (see `references/security-patterns.md`)

## Phase 3 — Report
Produce a structured review with:
- Summary of changes
- Issues found (critical / minor / nit)
- Suggested improvements
- Approval recommendation
```

This example demonstrates frontmatter fields, string substitution, dynamic context
injection, subagent execution, extended thinking, reference file usage, and validation
gates — all in a single, well-structured skill.
