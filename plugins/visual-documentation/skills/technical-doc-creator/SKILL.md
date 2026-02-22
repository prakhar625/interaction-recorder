---
name: technical-doc-creator
description: >
  Use when someone asks to create technical documentation, API docs, developer docs, a README,
  getting started guide, SDK reference, endpoint documentation, or wants to document a library,
  service, or system for developers.
  Triggers on: technical documentation, API docs, developer guide, getting started, SDK docs,
  endpoint reference, REST API documentation, library docs, technical reference, generate docs.
---

# Technical Doc Creator

Generates HTML technical documentation for APIs, libraries, services, and developer tools.
Output is a standalone HTML file with syntax-highlighted code examples, structured sections,
and an optional architecture diagram.

---

## Workflow

### Phase 1 — Extract

Before writing docs, gather from the codebase, user description, or existing docs:

- [ ] System/library name and one-line description
- [ ] Tech stack (language, runtime, framework)
- [ ] Installation / setup steps
- [ ] API endpoints OR public functions / methods
- [ ] Request/response shapes (for APIs) or parameter types (for libraries)
- [ ] Code examples (at least one "quick start")
- [ ] Architecture or component diagram needed? (yes/no)

### Phase 2 — Structure

Every technical doc includes these five sections:

1. **Overview** — purpose, key capabilities, tech stack badges
2. **Getting Started** — installation commands, configuration, minimal working example
3. **API Reference** — endpoints (REST) or functions (library) with params and return types
4. **Code Examples** — copy-paste snippets in relevant languages with syntax highlighting
5. **Architecture** (optional) — SVG system diagram when the system has multiple components

Read `references/technical-docs.md` for the HTML template and styling guide.

### Phase 3 — Deliver

- Save as `[system-name]-docs.html`
- Report file path
- Offer to add more endpoints, a changelog section, or an error code reference

---

## ⛔ STOP — Non-Negotiable Rules

1. **REAL CODE ONLY**: Every code example must be syntactically correct and copy-pasteable. No pseudo-code in code blocks.
2. **ACCURATE HTTP METHODS**: GET endpoints are GET. Never guess — read the actual code or ask.
3. **PARAMETERS DOCUMENTED**: Every parameter needs: name, type, required/optional, description.
4. **NO INVENTED ENDPOINTS**: Only document what exists. If unsure, ask the user.

---

## HTTP Method Color Coding

Apply these badge colors for REST API docs:

| Method | Color | Usage |
|--------|-------|-------|
| GET | `#48bb78` (green) | Read / list |
| POST | `#4299e1` (blue) | Create |
| PUT / PATCH | `#ed8936` (orange) | Update |
| DELETE | `#e53e3e` (red) | Remove |
| WS / SSE | `#9f7aea` (purple) | Streaming |

---

## Syntax Highlighting

Use a lightweight token-based approach with `<span class="token-*">` wrappers:

```html
<span class="token-keyword">const</span> result = <span class="token-fn">fetchUser</span>(<span class="token-string">'user_123'</span>);
```

CSS classes: `.token-keyword`, `.token-fn`, `.token-string`, `.token-number`,
`.token-comment`, `.token-operator`, `.token-type`

See `references/technical-docs.md` for the full CSS and code block template.

---

## Common Mistakes

- **Pseudo-code in code blocks**: `// do your thing here` is not a code example — write real code
- **Missing parameter types**: Documenting `userId` without saying it's a `string` is incomplete
- **Undocumented error responses**: If an endpoint can return `401` or `422`, document it
- **No quick start**: Every doc needs a "works in under 5 minutes" example at the top
- **Stale docs**: Read the actual source before documenting — don't rely on memory or assumptions
