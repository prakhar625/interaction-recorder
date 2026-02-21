# Common Mistakes When Building Skills and Plugins

Twelve anti-patterns that cause skills to fail silently, behave unpredictably, or break
after distribution. Each entry describes what goes wrong, why, and how to fix it.

---

## 1. Putting components inside .claude-plugin/

**What goes wrong:** Commands, skills, hooks, or agents placed inside `.claude-plugin/`
are not discovered by Claude. The plugin installs but those components never load.

**Why it happens:** The `.claude-plugin/` directory looks like the plugin root.

**Fix:** Only `plugin.json` goes inside `.claude-plugin/`. Move everything else to the
plugin root.

```
# WRONG                          # RIGHT
my-plugin/                       my-plugin/
  .claude-plugin/                  .claude-plugin/
    plugin.json                      plugin.json
    commands/   # not found        commands/       # at root
    skills/     # not found        skills/         # at root
    hooks/      # not found        hooks/          # at root
```

---

## 2. Missing or vague description

**What goes wrong:** Claude never auto-loads the skill. Users type prompts that should
trigger it, but nothing happens.

**Why it happens:** The `description` field is omitted or written as a generic label
that does not match any real user prompt.

**Fix:** Write a description starting with "Use when..." that lists specific triggering
conditions and keywords.

```yaml
# WRONG
description: For testing

# RIGHT
description: >
  Use when running tests, checking test coverage, or debugging failing test suites.
  Triggers on: run tests, test coverage, failing tests, jest, pytest, vitest.
```

---

## 3. Description summarizes the workflow

**What goes wrong:** Claude treats the description as the full instruction set and
follows the summary instead of reading the skill body. Steps get skipped or simplified.

**Why it happens:** Authors write the description as a pitch explaining what the skill
does rather than when it should activate.

**Fix:** Describe triggering conditions ONLY. Never mention internal steps, phases,
subagents, or implementation details.

```yaml
# WRONG — Claude follows this instead of reading the skill body
description: Dispatches subagent per task, runs code review between tasks

# RIGHT — triggering conditions only
description: >
  Use when executing implementation plans with independent tasks.
  Triggers on: execute plan, run plan, implement tasks.
```

---

## 4. SKILL.md over 500 lines

**What goes wrong:** Claude struggles to follow instructions reliably. Key rules get
lost in the middle of the file, and behavior becomes inconsistent.

**Why it happens:** Authors consolidate all documentation into a single file instead of
splitting by topic.

**Fix:** Move detailed content to `references/` files. Keep SKILL.md under 500 lines.

```markdown
## Phase 3 — API Integration
Read `references/api-integration.md` before starting this phase.
```

---

## 5. Absolute paths in manifests

**What goes wrong:** The plugin works on the author's machine but fails for everyone
else. Paths resolve to nonexistent locations after installation.

**Why it happens:** Authors copy-paste paths from their terminal or use auto-completion
that produces absolute paths.

**Fix:** All paths in `plugin.json` must be relative, starting with `./`.

```json
// WRONG                                    // RIGHT
{ "commands": "/Users/alice/commands/" }     { "commands": "./commands/" }
```

---

## 6. Referencing files outside the plugin directory

**What goes wrong:** The skill works locally but breaks after installation. Scripts or
templates return "file not found" errors.

**Why it happens:** Plugins are copied to `~/.claude/plugins/cache`. Only files inside
the plugin directory are copied. External references point to files that do not exist.

**Fix:** Keep all files inside the plugin directory. Use symlinks if needed.

```bash
# WRONG — outside the plugin
cat /Users/alice/shared-templates/api-template.md

# RIGHT — inside the plugin
cat "${CLAUDE_PLUGIN_ROOT}/assets/api-template.md"
```

---

## 7. Forgetting to bump the version

**What goes wrong:** You publish a fix, but users still see old behavior. Their cached
copy is stale and never updates.

**Why it happens:** The cache checks the version field to decide whether to re-copy.
Same version = no update.

**Fix:** Always bump the version in `marketplace.json` before distributing changes.

---

## 8. Using context: fork on guideline skills

**What goes wrong:** A skill with `context: fork` launches a subagent that has
guidelines but no concrete task. The subagent produces no meaningful output.

**Why it happens:** Authors set `context: fork` for isolation without considering that
forked subagents need an explicit task to execute.

**Fix:** Only use `context: fork` for skills with explicit step-by-step tasks.
Guideline skills should run inline (omit `context` or use `context: inline`).

```yaml
# WRONG — guideline skill with fork produces empty output
---
name: code-style
context: fork
---
Follow these conventions...

# RIGHT — runs inline, applied to current context
---
name: code-style
---
Follow these conventions...
```

---

## 9. Non-executable hook scripts

**What goes wrong:** Hooks fail silently or produce "permission denied" errors. The
hook event fires but the script never runs.

**Why it happens:** Authors create scripts but forget to set the executable bit. Git
does not always preserve file permissions across clones.

**Fix:** Run `chmod +x` on every hook script. Verify after cloning.

```bash
chmod +x hooks/load-env.sh
chmod +x scripts/my-hook.sh
```

---

## 10. Unquoted shell variables in hooks

**What goes wrong:** Hook scripts break when paths contain spaces, producing cryptic
"No such file or directory" errors on paths that visibly exist.

**Why it happens:** Bash word-splits unquoted variables. `/Users/Alice B/project`
becomes two arguments: `/Users/Alice` and `B/project`.

**Fix:** Always double-quote variable expansions in hook scripts.

```bash
# WRONG                              # RIGHT
cd $CLAUDE_PLUGIN_ROOT               cd "$CLAUDE_PLUGIN_ROOT"
cp $SOURCE_FILE $DEST_DIR/           cp "$SOURCE_FILE" "$DEST_DIR/"
```

---

## 11. Trusting user-invocable for security

**What goes wrong:** A skill with `user-invocable: false` is hidden from the slash
command menu, but Claude can still invoke it programmatically.

**Why it happens:** Authors assume `user-invocable: false` is a security gate, but it
only controls menu visibility, not actual invocation.

**Fix:** Use `disable-model-invocation: true` to actually prevent Claude from invoking
the skill on its own.

```yaml
# WRONG — hidden from menu, but Claude can still auto-invoke
user-invocable: false

# RIGHT — Claude cannot auto-invoke; only explicit /skill-name works
disable-model-invocation: true
```

---

## 12. Skill and command name collision

**What goes wrong:** A skill and command share a name. The command is silently ignored
because the skill takes precedence.

**Why it happens:** Authors create a skill for auto-triggering and a command for manual
invocation, using the same name for consistency.

**Fix:** Use unique names. Or convert the command to a skill (skills respond to
`/skill-name` too).

```
# WRONG — both named "deploy", command is silently ignored
skills/deploy/SKILL.md       # name: deploy
commands/deploy.md           # command: deploy  <-- never runs

# RIGHT — unique names
skills/deploy/SKILL.md       # name: deploy (auto-triggers)
commands/force-deploy.md     # command: force-deploy (manual only)
```
