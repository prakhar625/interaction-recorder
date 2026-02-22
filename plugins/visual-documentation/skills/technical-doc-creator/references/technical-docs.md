# Technical Documentation HTML Template

**Goal**: A single-file HTML developer reference with syntax-highlighted code, structured API
sections, and a left-nav sidebar for navigation.

## Prerequisites

- [ ] System name and description available
- [ ] All endpoints/functions extracted from codebase
- [ ] At least one working code example ready
- [ ] HTTP method color coding from SKILL.md known

---

## Full Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[System Name] — Developer Docs</title>
  <style>
    /* ── Base ── */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f7fafc;
      color: #2d3748;
      display: flex;
      min-height: 100vh;
    }

    /* ── Sidebar Navigation ── */
    .sidebar {
      width: 260px;
      flex-shrink: 0;
      background: #1a202c;
      padding: 2rem 1.5rem;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }
    .sidebar h2 { color: #a0aec0; font-size: 0.7rem; text-transform: uppercase;
                  letter-spacing: 0.1em; margin-bottom: 0.75rem; }
    .sidebar a  { display: block; color: #e2e8f0; text-decoration: none;
                  padding: 0.35rem 0; font-size: 0.9rem; }
    .sidebar a:hover { color: #90cdf4; }
    .sidebar .logo { color: white; font-size: 1.2rem; font-weight: 700;
                     margin-bottom: 2rem; display: block; }
    .sidebar .section-link { margin-bottom: 0.5rem; }
    .sidebar hr { border-color: #2d3748; margin: 1rem 0; }

    /* ── Main Content ── */
    .main {
      flex: 1;
      padding: 3rem 4rem;
      max-width: 900px;
    }

    /* ── Header ── */
    .page-header { margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid #e2e8f0; }
    .page-header h1 { font-size: 2.5rem; font-weight: 700; color: #1a202c; margin-bottom: 0.75rem; }
    .page-header p  { font-size: 1.1rem; color: #718096; line-height: 1.6; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px;
             font-size: 0.75rem; font-weight: 600; margin: 0.25rem 0.1rem; }
    .badge-lang { background: #ebf8ff; color: #2b6cb0; }
    .badge-ver  { background: #f0fff4; color: #276749; }

    /* ── Section Headings ── */
    .section { margin-bottom: 3rem; scroll-margin-top: 2rem; }
    .section h2 { font-size: 1.6rem; color: #1a202c; margin-bottom: 1.5rem;
                  padding-bottom: 0.5rem; border-bottom: 2px solid #e2e8f0; }
    .section h3 { font-size: 1.15rem; color: #2d3748; margin: 1.5rem 0 0.75rem; font-weight: 600; }
    .section p  { color: #4a5568; line-height: 1.7; margin-bottom: 1rem; }

    /* ── Code Blocks ── */
    .code-block {
      background: #1a202c;
      border-radius: 8px;
      padding: 1.25rem 1.5rem;
      margin: 1rem 0;
      overflow-x: auto;
      position: relative;
    }
    .code-block .lang-tag {
      position: absolute;
      top: 0.5rem;
      right: 0.75rem;
      font-size: 0.7rem;
      color: #4a5568;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .code-block pre { margin: 0; }
    .code-block code {
      font-family: 'SF Mono', 'Fira Code', 'Cascadia Code', monospace;
      font-size: 0.875rem;
      line-height: 1.6;
      color: #e2e8f0;
    }

    /* Syntax tokens */
    .token-keyword  { color: #f687b3; }  /* pink */
    .token-fn       { color: #90cdf4; }  /* light blue */
    .token-string   { color: #68d391; }  /* green */
    .token-number   { color: #fbd38d; }  /* orange */
    .token-comment  { color: #718096; font-style: italic; }
    .token-operator { color: #fc8181; }  /* red */
    .token-type     { color: #b794f4; }  /* purple */
    .token-const    { color: #fbd38d; }  /* orange */

    /* Inline code */
    code:not(.code-block code) {
      background: #edf2f7;
      color: #e53e3e;
      padding: 0.1rem 0.4rem;
      border-radius: 3px;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.875em;
    }

    /* ── API Endpoint ── */
    .endpoint {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      margin-bottom: 1.5rem;
      overflow: hidden;
    }
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: #f7fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .method {
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.8rem;
      font-family: monospace;
      letter-spacing: 0.05em;
    }
    /* Method colors */
    .method-GET    { background: #f0fff4; color: #276749; border: 1px solid #9ae6b4; }
    .method-POST   { background: #ebf8ff; color: #2b6cb0; border: 1px solid #90cdf4; }
    .method-PUT    { background: #fffaf0; color: #c05621; border: 1px solid #fbd38d; }
    .method-PATCH  { background: #fffaf0; color: #c05621; border: 1px solid #fbd38d; }
    .method-DELETE { background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; }
    .method-WS     { background: #faf5ff; color: #6b46c1; border: 1px solid #d6bcfa; }
    .endpoint-path {
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 1rem;
      color: #2d3748;
    }
    .endpoint-desc { padding: 1rem 1.5rem; color: #4a5568; line-height: 1.6; }
    .endpoint-body { padding: 0 1.5rem 1.5rem; }

    /* ── Parameters Table ── */
    .params-table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.875rem; }
    .params-table th {
      text-align: left;
      padding: 0.5rem 0.75rem;
      background: #edf2f7;
      color: #4a5568;
      font-weight: 600;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .params-table td {
      padding: 0.6rem 0.75rem;
      border-bottom: 1px solid #e2e8f0;
      color: #4a5568;
      vertical-align: top;
    }
    .params-table td:first-child { font-family: monospace; color: #e53e3e; }
    .badge-required { background: #fff5f5; color: #c53030; padding: 0.1rem 0.35rem;
                      border-radius: 3px; font-size: 0.75rem; font-weight: 600; }
    .badge-optional { background: #f7fafc; color: #718096; padding: 0.1rem 0.35rem;
                      border-radius: 3px; font-size: 0.75rem; }

    /* ── Notes / Callouts ── */
    .callout {
      padding: 1rem 1.25rem;
      border-radius: 6px;
      margin: 1rem 0;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .callout-info    { background: #ebf8ff; border-left: 4px solid #4299e1; color: #2b6cb0; }
    .callout-warning { background: #fffbeb; border-left: 4px solid #f59e0b; color: #92400e; }
    .callout-danger  { background: #fff5f5; border-left: 4px solid #e53e3e; color: #c53030; }

    /* ── Responsive ── */
    @media (max-width: 900px) {
      body { flex-direction: column; }
      .sidebar { width: 100%; height: auto; position: static; }
      .main { padding: 2rem 1.5rem; }
    }
  </style>
</head>
<body>

<!-- ── SIDEBAR ── -->
<nav class="sidebar">
  <a class="logo" href="#top">[System Name]</a>
  <h2>Documentation</h2>
  <a class="section-link" href="#overview">Overview</a>
  <a class="section-link" href="#getting-started">Getting Started</a>
  <hr>
  <h2>API Reference</h2>
  <a class="section-link" href="#endpoints">[Resource Name]</a>
  <!-- Add more resource groups here -->
  <hr>
  <h2>Guides</h2>
  <a class="section-link" href="#examples">Code Examples</a>
  <a class="section-link" href="#architecture">Architecture</a>
</nav>

<!-- ── MAIN CONTENT ── -->
<main class="main" id="top">

  <!-- Header -->
  <div class="page-header">
    <h1>[System Name]</h1>
    <p>[One-paragraph description of the system, its purpose, and key capabilities.]</p>
    <span class="badge badge-lang">[Language]</span>
    <span class="badge badge-lang">[Framework]</span>
    <span class="badge badge-ver">v[Version]</span>
  </div>

  <!-- Section 1: Overview -->
  <section class="section" id="overview">
    <h2>Overview</h2>
    <p>[Describe what the system does and why a developer would use it.]</p>
    <h3>Key Capabilities</h3>
    <ul style="color:#4a5568; line-height:2; padding-left:1.5rem">
      <li>[Capability 1]</li>
      <li>[Capability 2]</li>
      <li>[Capability 3]</li>
    </ul>
  </section>

  <!-- Section 2: Getting Started -->
  <section class="section" id="getting-started">
    <h2>Getting Started</h2>
    <h3>Installation</h3>
    <div class="code-block">
      <span class="lang-tag">bash</span>
      <pre><code>[npm install / pip install / go get / etc.]</code></pre>
    </div>
    <h3>Quick Start</h3>
    <div class="code-block">
      <span class="lang-tag">[lang]</span>
      <pre><code><span class="token-comment">// Minimal working example</span>
<span class="token-keyword">import</span> { Client } <span class="token-keyword">from</span> <span class="token-string">'[package-name]'</span>;

<span class="token-keyword">const</span> client = <span class="token-keyword">new</span> <span class="token-fn">Client</span>({ apiKey: <span class="token-string">'your-api-key'</span> });
<span class="token-keyword">const</span> result = <span class="token-keyword">await</span> client.<span class="token-fn">doSomething</span>();
console.<span class="token-fn">log</span>(result);</code></pre>
    </div>
  </section>

  <!-- Section 3: API Reference -->
  <section class="section" id="endpoints">
    <h2>API Reference</h2>

    <!-- Endpoint block -->
    <div class="endpoint">
      <div class="endpoint-header">
        <span class="method method-GET">GET</span>
        <span class="endpoint-path">/api/v1/[resource]</span>
      </div>
      <div class="endpoint-desc">List all [resources]. Supports pagination and filtering.</div>
      <div class="endpoint-body">
        <h3>Query Parameters</h3>
        <table class="params-table">
          <thead>
            <tr><th>Parameter</th><th>Type</th><th>Required</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>limit</td>
              <td>integer</td>
              <td><span class="badge-optional">optional</span></td>
              <td>Number of results per page. Default: 20. Max: 100.</td>
            </tr>
            <tr>
              <td>offset</td>
              <td>integer</td>
              <td><span class="badge-optional">optional</span></td>
              <td>Number of results to skip. Default: 0.</td>
            </tr>
          </tbody>
        </table>
        <h3>Response</h3>
        <div class="code-block">
          <span class="lang-tag">json</span>
          <pre><code>{
  <span class="token-string">"data"</span>: [ <span class="token-comment">// array of resource objects</span> ],
  <span class="token-string">"total"</span>: <span class="token-number">42</span>,
  <span class="token-string">"limit"</span>: <span class="token-number">20</span>,
  <span class="token-string">"offset"</span>: <span class="token-number">0</span>
}</code></pre>
        </div>
      </div>
    </div>

    <!-- Repeat .endpoint blocks for each endpoint -->

  </section>

  <!-- Section 4: Code Examples -->
  <section class="section" id="examples">
    <h2>Code Examples</h2>
    <!-- Add language-specific examples here -->
  </section>

  <!-- Section 5: Architecture (optional) -->
  <section class="section" id="architecture">
    <h2>Architecture</h2>
    <p>[Brief description of the system's components and how they interact.]</p>
    <!-- Insert SVG architecture diagram here if applicable -->
  </section>

</main>
</body>
</html>
```

---

## Validation Gate

Before saving:
- [ ] All five sections present (Overview, Getting Started, API Ref, Examples, Architecture)
- [ ] Every code block has a `lang-tag` label
- [ ] Every endpoint has: method badge, path, description, parameter table, response example
- [ ] Every parameter row has: name, type, required/optional badge, description
- [ ] Sidebar links match section IDs
- [ ] No placeholder text like `[System Name]` remaining in the final output
- [ ] File saved as `[system-name]-docs.html`

## Common Issues

- **Missing anchor IDs**: Section `id` attributes must match sidebar `href` values exactly
- **Monospace font fallback**: If `SF Mono` not installed, `Fira Code` or `Cascadia Code` renders fine
- **Very long parameter tables**: Wrap in a scrollable container: `overflow-x: auto`
- **Nested code in endpoints**: Ensure JSON strings are properly HTML-escaped (`&quot;` or use safe characters)
