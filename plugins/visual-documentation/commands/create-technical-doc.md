---
command: create-technical-doc
description: Generate HTML technical documentation for an API, library, SDK, or developer service
disable-model-invocation: true
---

# Create Technical Documentation

Generate a structured, single-file HTML developer reference for an API, library, or system.

## Step 1 — Extract documentation data

Read from the codebase, existing docs, or user description:
- System/library name and one-line description
- Language, runtime, and framework
- Installation command (`npm install`, `pip install`, etc.)
- All public endpoints (REST) OR public functions/methods (library)
- Request/response shapes or parameter signatures
- At least one working code example
- Whether an architecture diagram is needed

Do not document endpoints that don't exist — read the source.

## Step 2 — Structure the document

Apply the `technical-doc-creator` skill with five sections:

1. **Overview** — purpose, capabilities, tech stack badges
2. **Getting Started** — real installation command + minimal working code example
3. **API Reference** — every endpoint or function, fully documented
4. **Code Examples** — copy-pasteable snippets in relevant language(s)
5. **Architecture** (optional) — SVG diagram if system has multiple components

## Step 3 — Apply documentation standards

- HTTP method badges: GET=green, POST=blue, PUT/PATCH=orange, DELETE=red
- Every parameter: name, type, required/optional badge, description
- Every endpoint: method, path, description, params table, response JSON example
- Every code block: syntax-highlighted with language tag, syntactically correct
- Left-nav sidebar with anchor links to each section

Read `references/technical-docs.md` in the skill for the full HTML template.

## Step 4 — Deliver

- Save as `[system-name]-docs.html`
- Report file path
- Offer to: add an error code reference, changelog, or additional endpoints
