# Plugin Packaging and Distribution

Complete reference for packaging Claude Code skills as distributable plugins,
including directory layout, manifest schema, caching behavior, and marketplace publishing.

---

## When to Use a Plugin vs Standalone

| Factor | Standalone Skill | Plugin |
|--------|-----------------|--------|
| **Audience** | Just you or your team | Anyone, publicly or privately shared |
| **Scope** | Single project or repo | Reusable across multiple repos |
| **Versioning** | Git history is enough | Semantic versions, controlled rollout |
| **Bundling** | One skill, maybe a script | Multiple skills, commands, hooks, agents |
| **Namespace** | Lives in `.claude/skills/` | Namespaced as `plugin-name:skill-name` |
| **Updates** | Edit files directly | Version bump triggers cache update |

**Use standalone** for personal workflows, project-specific conventions, quick experiments,
or skills that only make sense inside one codebase.

**Use a plugin** when sharing via marketplace, distributing versioned releases, bundling
related components, or reusing skills across repositories.

---

## Plugin Directory Layout

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json           # Manifest — ONLY plugin.json goes here
├── skills/                   # At plugin root
│   └── my-skill/
│       ├── SKILL.md
│       └── references/
├── commands/                 # At plugin root
│   └── my-command.md
├── hooks/                    # At plugin root
│   ├── hooks.json
│   └── my-hook.sh
├── agents/                   # At plugin root (optional)
│   └── my-agent.md
├── scripts/
├── settings.json             # Default settings (only `agent` key supported)
├── .mcp.json                 # MCP server definitions
└── .lsp.json                 # LSP configurations
```

**CRITICAL**: Components go at the plugin root, NOT inside `.claude-plugin/`.
The `.claude-plugin/` directory contains only `plugin.json`.

```
# WRONG
my-plugin/.claude-plugin/skills/my-skill/SKILL.md

# RIGHT
my-plugin/skills/my-skill/SKILL.md
```

---

## plugin.json Schema

The manifest at `.claude-plugin/plugin.json` describes your plugin to Claude Code.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Plugin identifier. Lowercase, hyphens, no spaces. Required if manifest is included. |

### Optional Metadata Fields

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | Semantic version (e.g., `"1.2.0"`). Takes priority over marketplace version. |
| `description` | string | What the plugin does. Shown during install and in listings. |
| `author` | object | `{ "name": "...", "email": "...", "url": "..." }` — all sub-fields optional |
| `homepage` | string | URL to plugin documentation or landing page |
| `repository` | string | URL to source repository |
| `license` | string | SPDX identifier (e.g., `"MIT"`, `"Apache-2.0"`) |
| `keywords` | array | String tags for discoverability |

### Path Fields

| Field | Default Location |
|-------|-----------------|
| `commands` | `"./commands"` |
| `agents` | `"./agents"` |
| `skills` | `"./skills"` |
| `hooks` | `"./hooks"` |
| `mcpServers` | `"./.mcp.json"` |
| `outputStyles` | `"./output-styles"` |
| `lspServers` | `"./.lsp.json"` |

**Path behavior**: All paths relative to plugin root, must start with `./`. Custom paths
**supplement** defaults (they do not replace them). Specifying `"skills": "./custom-skills"`
means Claude looks in both `./skills` and `./custom-skills`.

### Example

```json
{
  "name": "my-plugin",
  "version": "1.3.0",
  "description": "Comprehensive tooling for widget management.",
  "author": {
    "name": "Your Name",
    "email": "you@example.com",
    "url": "https://github.com/yourname"
  },
  "homepage": "https://github.com/yourname/my-plugin",
  "repository": "https://github.com/yourname/my-plugin",
  "license": "MIT",
  "keywords": ["widgets", "management", "automation"],
  "skills": "./skills",
  "commands": "./commands",
  "hooks": "./hooks"
}
```

---

## Marketplace.json Format

For marketplace distribution, create `marketplace.json` at the repository root
(inside `.claude-plugin/`).

```json
{
  "name": "your-marketplace-name",
  "owner": {
    "name": "Your Name or Org",
    "url": "https://github.com/yourname"
  },
  "plugins": [
    {
      "name": "my-plugin",
      "description": "What this plugin does, shown in marketplace listings.",
      "version": "2026.2.20.1200",
      "author": {
        "name": "Your Name",
        "url": "https://github.com/yourname"
      },
      "source": "./plugins/my-plugin",
      "category": "development",
      "tags": ["automation", "testing", "ci"]
    }
  ]
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Marketplace identifier |
| `owner.name` | Yes | Marketplace owner name |
| `owner.url` | No | Owner homepage |
| `plugins[].name` | Yes | Must match plugin.json `name` |
| `plugins[].description` | Yes | Marketplace listing description |
| `plugins[].version` | Yes | Current version. Bump to push updates. |
| `plugins[].source` | Yes | Relative path from repo root to plugin directory |
| `plugins[].category` | No | Category for filtering |
| `plugins[].tags` | No | String array for search |
| `plugins[].author` | No | Plugin-level author override |

---

## Plugin Caching

Plugins are cached at `~/.claude/plugins/cache`.

### How It Works

1. On install, Claude **copies** the entire plugin directory into the cache
2. The plugin runs from the cached copy, not from the original source
3. Files **outside** the plugin directory are NOT copied
4. The cached copy only updates when the **version changes**

### Consequences

| Situation | Behavior |
|-----------|----------|
| Edit source without bumping version | Users see stale cached copy |
| Reference file outside plugin directory | File missing at runtime |
| Symlink to file outside plugin tree | Symlink target not in cache |
| Bump version in marketplace.json | Users get fresh copy on next session |

**Shared files**: Duplicate into each plugin (recommended), or symlink where both
link and target are within the plugin tree.

**Cache invalidation**: No version bump = no update. Users can manually clear
`~/.claude/plugins/cache` to force refresh. Always bump version before distributing.

---

## Environment Variables

| Variable | Expands To | Use For |
|----------|-----------|---------|
| `${CLAUDE_PLUGIN_ROOT}` | Absolute path to plugin root directory | Plugin files in scripts and hooks |
| `$CLAUDE_PROJECT_DIR` | Absolute path to user's project root | Project files from plugin code |

### Usage in Hooks

```json
{
  "type": "command",
  "command": "${CLAUDE_PLUGIN_ROOT}/hooks/load-env.sh",
  "timeout": 5
}
```

### Usage in Scripts

```bash
#!/bin/bash
source "${CLAUDE_PLUGIN_ROOT}/scripts/helpers.sh"
config_file="${CLAUDE_PROJECT_DIR}/.config/settings.json"
```

Always use `${CLAUDE_PLUGIN_ROOT}` instead of relative paths in scripts. The working
directory at runtime is the user's project, not your plugin directory.

---

## Installation Scopes

| Scope | Location | Applies To |
|-------|----------|-----------|
| **User** | `~/.claude/settings.json` | All projects for this user |
| **Project** | `.claude/settings.json` | Everyone on this project (committed to git) |
| **Local** | `.claude/settings.local.json` | Only you, only this project (gitignored) |
| **Managed** | Managed settings | Organization-controlled, cannot be overridden |

### settings.json Entry

```json
{
  "plugins": [
    "https://github.com/user/repo"
  ]
}
```

**Guidelines**: User scope for personal utilities across all projects. Project scope
for team-shared plugins. Local scope for personal plugins on one project. Managed
scope for organizational mandates.

---

## Version Management

### Semantic Versioning

Use `MAJOR.MINOR.PATCH` or calendar versioning (`YYYY.M.D.HHMM`):

- **MAJOR**: Breaking changes or removed features
- **MINOR**: New skills, commands, or features
- **PATCH**: Bug fixes, documentation updates

### Version Priority

Version can be specified in both `plugin.json` and `marketplace.json`. If both are set,
**plugin.json takes priority silently** -- the marketplace version is ignored without
warning. Set the version in one place only, or keep them in sync.

### Version Bump Checklist

1. Make changes to plugin files
2. Update version in `marketplace.json` (or `plugin.json`)
3. Verify version is higher than previous release
4. Test with `claude --plugin-dir ./my-plugin`
5. Commit and push

---

## Testing During Development

Load a plugin directly from disk, bypassing the cache:

```bash
claude --plugin-dir ./my-plugin
```

Changes take effect immediately on the next session.

### Testing Checklist

- [ ] Skills load -- check with `/skills` or "What skills are available?"
- [ ] Each skill triggers on expected natural language prompts
- [ ] Each command works via `/command-name`
- [ ] Hooks fire correctly (session start, matchers)
- [ ] No broken paths -- scripts run, references load
- [ ] Works from a different project directory (catches hardcoded paths)

---

## Namespace Conventions

Plugins namespace components as `plugin-name:component-name` to prevent conflicts.

```
Plugin:  "video-tools"
Skill:   "video-tools:record-demo"
Command: "video-tools:record-quick"
```

Users invoke with `/video-tools:record-quick` or, if unambiguous, just `/record-quick`.

**Avoiding conflicts**: Choose descriptive plugin names. Avoid generic skill names like
`deploy` or `test`. If two plugins define the same name, the namespace disambiguates.
Commands and skills with the same name conflict -- the skill takes precedence.

---

## Common Packaging Mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Skills inside `.claude-plugin/` | Skills not found | Move to plugin root `skills/` |
| Absolute paths in scripts | Works locally, breaks for others | Use `${CLAUDE_PLUGIN_ROOT}` |
| Files outside plugin directory | Missing in cache at runtime | Move files inside plugin tree |
| Forgot version bump | Users don't get updates | Bump version before distributing |
| Version mismatch (plugin.json vs marketplace.json) | plugin.json wins silently | Keep in sync or set in one place |
| Missing shebang in scripts | Wrong interpreter or permission denied | Add `#!/bin/bash` |
| Scripts not executable | Hook commands fail | Run `chmod +x scripts/*.sh` |
