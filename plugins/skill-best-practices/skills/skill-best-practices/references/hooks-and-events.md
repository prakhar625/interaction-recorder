# Hooks and Events Reference

Hooks let you run shell commands, prompt evaluations, or subagents in response to
lifecycle events inside Claude Code. They are the primary extension mechanism for
adding custom behavior without modifying core logic.

---

## Hook Event Types

Every hook is bound to exactly one event. Some events can block the action that
triggered them (the hook returns a rejection and the action is cancelled); others
are fire-and-forget notifications.

| Event | When it fires | Can block? |
|---|---|---|
| `SessionStart` | Session begins, resumes, or context is cleared/compacted | No |
| `UserPromptSubmit` | User submits a prompt, before Claude processes it | Yes |
| `PreToolUse` | Before a tool call executes | Yes |
| `PermissionRequest` | When a permission dialog is about to appear | Yes |
| `PostToolUse` | After a tool call succeeds | No |
| `PostToolUseFailure` | After a tool call fails | No |
| `Notification` | When a notification is sent to the user | No |
| `SubagentStart` | A subagent is spawned | No |
| `SubagentStop` | A subagent finishes | Yes |
| `Stop` | Claude finishes its response turn | Yes |
| `TeammateIdle` | A team teammate is about to go idle | Yes |
| `TaskCompleted` | A task is being marked complete | Yes |
| `ConfigChange` | A config file changes during the session | Yes |
| `WorktreeCreate` | A git worktree is being created | Yes |
| `WorktreeRemove` | A git worktree is being removed | No |
| `PreCompact` | Before context compaction runs | No |
| `SessionEnd` | Session terminates | No |

**Blocking behavior**: When a blocking hook returns exit code 2 (or `"ok": false`
from a prompt/agent hook), the triggering action is cancelled and the error
reason is fed back to Claude as context.

---

## Hook Types

Each hook entry has a `type` field that determines how it runs.

### `command` — Shell Command

Runs a shell command. Receives a JSON payload on stdin describing the event.
Returns results via exit codes and stdout/stderr.

```json
{
  "type": "command",
  "command": "./hooks/validate-bash.sh",
  "timeout": 10,
  "statusMessage": "Validating command..."
}
```

Available for all events.

### `prompt` — Single-Turn Claude Evaluation

Sends a prompt to Claude for a one-shot evaluation. The model returns a JSON
object: `{"ok": true}` or `{"ok": false, "reason": "explanation"}`.

```json
{
  "type": "prompt",
  "prompt": "Does this Bash command look safe? Reject anything that deletes files outside the project. Command: {{tool_input.command}}",
  "model": "sonnet"
}
```

Not available for `SessionStart`, `SessionEnd`, `PreCompact`, or `Notification`.

### `agent` — Multi-Turn Subagent

Spawns a subagent that can use a limited set of tools (`Read`, `Grep`, `Glob`)
to investigate and make a decision. Returns the same `{"ok": true/false}` shape.

```json
{
  "type": "agent",
  "prompt": "Review the file that was just edited. Check for security issues and report any problems.",
  "model": "sonnet"
}
```

Same event restrictions as `prompt` hooks.

---

## Configuration Format

Hooks are defined in a JSON structure keyed by event name. Each event maps to an
array of matcher+hooks pairs.

```json
{
  "hooks": {
    "EventName": [
      {
        "matcher": "regex-pattern",
        "hooks": [
          {
            "type": "command",
            "command": "./my-hook.sh",
            "timeout": 10,
            "statusMessage": "Running hook..."
          }
        ]
      }
    ]
  }
}
```

Multiple matchers can exist per event. Multiple hooks can exist per matcher.
Hooks within a matcher run in order; all matching matchers run.

---

## Matcher Patterns

The `matcher` field is a regex string. What it matches against depends on the event.

| Event | Matches against | Example matchers |
|---|---|---|
| `PreToolUse` / `PostToolUse` / `PostToolUseFailure` | Tool name | `"Bash"`, `"Edit\|Write"`, `"mcp__.*"` |
| `PermissionRequest` | Tool name | `"Bash"`, `"Edit"` |
| `SessionStart` | Start reason | `"startup"`, `"resume"`, `"clear"`, `"compact"` |
| `SubagentStart` / `SubagentStop` | Agent type | `"task"`, `"research"` |
| `ConfigChange` | Config file path | `"settings\\.json"`, `"hooks\\.json"` |
| `WorktreeCreate` / `WorktreeRemove` | Worktree path | `"feature-.*"` |
| `UserPromptSubmit` | Prompt text | `"deploy"`, `"delete"` |
| `Stop` | Stop reason | `"end_turn"`, `"max_tokens"` |
| `Notification` | Notification type | `"error"`, `"warning"` |
| `TaskCompleted` | Task description | `".*"` |
| `TeammateIdle` | Teammate name | `".*"` |
| `PreCompact` | _(always matches)_ | `".*"` |
| `SessionEnd` | _(always matches)_ | `".*"` |

Omitting `matcher` or setting it to `".*"` matches all instances of that event.

---

## Exit Code Semantics (Command Hooks)

| Exit code | Meaning | Behavior |
|---|---|---|
| `0` | Success | Stdout is parsed as JSON. If the event is blocking and stdout contains `{"blocked": true, "reason": "..."}`, the action is cancelled. |
| `2` | Blocking error | The action is cancelled. Stderr content is fed to Claude as the reason. |
| Any other | Non-blocking error | Logged as a warning. The action proceeds normally. |

For `prompt` and `agent` hooks, the equivalent of exit code 2 is returning
`{"ok": false, "reason": "explanation"}`.

---

## Handler Fields

### Common fields (all types)

| Field | Required | Description |
|---|---|---|
| `type` | Yes | `"command"`, `"prompt"`, or `"agent"` |
| `timeout` | No | Max seconds to wait. Default varies by type (10 for command, 30 for prompt, 120 for agent). |
| `statusMessage` | No | Message shown to the user while the hook runs. |
| `once` | No | If `true`, the hook runs only once per session, even if the event fires multiple times. |

### Command-specific fields

| Field | Description |
|---|---|
| `command` | Shell command to execute. Receives JSON on stdin. |
| `async` | If `true`, the hook runs in the background. The event does not wait for it to finish. Cannot block. |

### Prompt / Agent-specific fields

| Field | Description |
|---|---|
| `prompt` | The prompt text sent to Claude. Can include `{{variable}}` interpolation from the event payload. |
| `model` | Model to use: `"opus"`, `"sonnet"`, `"haiku"`. Defaults to `"haiku"` for prompt, `"sonnet"` for agent. |

---

## Hooks in Skills

Skills can define hooks in their YAML frontmatter. These hooks are scoped to the
skill's lifecycle: they activate when the skill loads and are cleaned up when the
skill finishes.

```yaml
---
name: safe-deploy
description: Use when deploying the application to production or staging
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: prompt
          prompt: "Is this Bash command safe for a deploy context? Reject destructive operations. Command: {{tool_input.command}}"
          model: haiku
  Stop:
    - matcher: ".*"
      hooks:
        - type: command
          command: "./scripts/post-deploy-check.sh"
          timeout: 30
---
```

Skill-scoped hooks are ideal for:
- Guardrails that only apply during a specific workflow
- Post-step validation that should not run globally
- Temporary environment setup/teardown

---

## Hooks in Plugins

Plugins define hooks in a `hooks/hooks.json` file at the plugin root. These hooks
are active whenever the plugin is installed.

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── hooks/
│   ├── hooks.json
│   ├── validate-bash.sh
│   └── auto-format.sh
└── skills/
    └── ...
```

Use `${CLAUDE_PLUGIN_ROOT}` to reference files within the plugin directory. This
variable resolves to the cached plugin location at runtime.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/auto-format.sh",
            "timeout": 15,
            "statusMessage": "Auto-formatting..."
          }
        ]
      }
    ]
  }
}
```

**Caching reminder**: Plugins are copied to `~/.claude/plugins/cache`. All paths
must use `${CLAUDE_PLUGIN_ROOT}` or be relative to the plugin root. Absolute
paths to the original source directory will break after caching.

---

## Security Considerations

Hooks run with full user permissions. They are not sandboxed.

- **Snapshotted at startup**: Hook definitions are read once when the session
  starts. Modifying hooks.json mid-session does not change running hooks (the
  `ConfigChange` event fires but hooks themselves are already loaded).
- **Quote all variables**: In shell scripts, always quote `"$VAR"` to prevent
  word splitting and glob expansion.
- **Validate inputs**: The JSON payload on stdin comes from Claude's tool calls.
  Treat it as untrusted input — validate and sanitize before using in shell
  commands.
- **Avoid secrets in prompts**: Prompt and agent hook text is sent to Claude.
  Do not embed API keys or tokens in prompt strings.
- **Timeout protection**: Always set reasonable timeouts. A hung hook blocks
  the event pipeline.

---

## Common Hook Recipes

### Load environment variables on session start

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "cat .env | jq -Rs '{env: split(\"\\n\") | map(select(length > 0 and startswith(\"#\") | not))}'",
            "timeout": 5,
            "statusMessage": "Loading .env..."
          }
        ]
      }
    ]
  }
}
```

### Validate Bash commands before execution

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Review this Bash command. Block it if it: deletes files outside the project, modifies system files, or uses sudo. Command: {{tool_input.command}}",
            "model": "haiku"
          }
        ]
      }
    ]
  }
}
```

### Auto-format after file writes

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write \"$TOOL_OUTPUT_PATH\" 2>/dev/null || true",
            "timeout": 15,
            "statusMessage": "Formatting...",
            "async": true
          }
        ]
      }
    ]
  }
}
```

### Run linter after Claude finishes responding

```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": "end_turn",
        "hooks": [
          {
            "type": "command",
            "command": "npm run lint -- --quiet 2>&1 | head -20",
            "timeout": 30,
            "statusMessage": "Running linter..."
          }
        ]
      }
    ]
  }
}
```

### Block tool use for specific MCP servers

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__untrusted_server__.*",
        "hooks": [
          {
            "type": "command",
            "command": "echo '{\"blocked\": true, \"reason\": \"Calls to untrusted MCP server are not allowed\"}' && exit 0"
          }
        ]
      }
    ]
  }
}
```
