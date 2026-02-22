# HTML Architecture Diagrams

**Goal**: Produce a self-contained HTML file with a rich, multi-section architecture visualization
suitable for browser viewing, stakeholder sharing, and offline documentation.

## Prerequisites

- [ ] System name known
- [ ] All six sections have content to fill (or user confirmed omissions)
- [ ] Semantic color table applied (see SKILL.md)

---

## Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[System Name] — Architecture</title>
  <style>
    /* Base */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; background: #f7fafc; color: #2d3748; }

    /* Layout */
    .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .section { background: white; border-radius: 12px; padding: 2rem; margin-bottom: 2rem;
                box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .section-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 1.5rem;
                     color: #1a202c; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.75rem; }

    /* Header */
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
               color: white; padding: 3rem 2rem; border-radius: 12px; margin-bottom: 2rem; text-align: center; }
    .header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .header p  { font-size: 1.1rem; opacity: 0.9; }

    /* Grid layouts */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }

    /* Cards */
    .card { background: #f7fafc; border-radius: 8px; padding: 1.25rem; border-left: 4px solid #4299e1; }
    .card h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.05em;
                color: #718096; margin-bottom: 0.5rem; }
    .card p  { font-size: 1rem; font-weight: 600; color: #2d3748; }

    /* Data flow pipeline */
    .pipeline { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; padding: 1rem 0; }
    .pipeline-node { padding: 0.75rem 1.25rem; border-radius: 8px; color: white;
                     font-weight: 600; font-size: 0.9rem; text-align: center; min-width: 120px; }
    .pipeline-arrow { font-size: 1.5rem; color: #a0aec0; flex-shrink: 0; }

    /* Architecture layers */
    .layer { border-radius: 8px; padding: 1rem 1.5rem; margin-bottom: 0.75rem; }
    .layer-title { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em;
                   font-weight: 700; margin-bottom: 0.75rem; opacity: 0.8; }
    .layer-components { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .component-badge { background: rgba(255,255,255,0.3); border-radius: 4px;
                       padding: 0.35rem 0.75rem; font-size: 0.85rem; font-weight: 500; }

    /* Feature grid */
    .feature-card { border-radius: 8px; padding: 1rem; background: #f7fafc;
                    border: 1px solid #e2e8f0; }
    .feature-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
    .feature-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 0.25rem; }
    .feature-desc { font-size: 0.85rem; color: #718096; }

    /* Tags */
    .tag { display: inline-block; background: #edf2f7; color: #4a5568;
           border-radius: 4px; padding: 0.2rem 0.6rem; font-size: 0.8rem; margin: 0.15rem; }

    /* Responsive */
    @media (max-width: 768px) {
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
      .pipeline { flex-direction: column; }
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- HEADER -->
    <div class="header">
      <h1>[System Name]</h1>
      <p>[One-line system description]</p>
    </div>

    <!-- SECTION 1: Business Context -->
    <div class="section">
      <h2 class="section-title">Business Context</h2>
      <div class="grid-3">
        <div class="card">
          <h3>Primary Objective</h3>
          <p>[Main goal]</p>
        </div>
        <div class="card">
          <h3>Target Users</h3>
          <p>[User types]</p>
        </div>
        <div class="card">
          <h3>Key Metric</h3>
          <p>[Success metric]</p>
        </div>
      </div>
    </div>

    <!-- SECTION 2: Data Flow -->
    <div class="section">
      <h2 class="section-title">Data Flow</h2>
      <div class="pipeline">
        <div class="pipeline-node" style="background:#4299e1">[Source]</div>
        <div class="pipeline-arrow">→</div>
        <div class="pipeline-node" style="background:#ed8936">[Process]</div>
        <div class="pipeline-arrow">→</div>
        <div class="pipeline-node" style="background:#9f7aea">[Transform]</div>
        <div class="pipeline-arrow">→</div>
        <div class="pipeline-node" style="background:#48bb78">[Output]</div>
      </div>
    </div>

    <!-- SECTION 3: Processing Pipeline -->
    <div class="section">
      <h2 class="section-title">Processing Pipeline</h2>
      <!-- Add stage cards using .grid-4 and .card with appropriate border-left colors -->
    </div>

    <!-- SECTION 4: System Architecture Layers -->
    <div class="section">
      <h2 class="section-title">System Architecture</h2>
      <div class="layer" style="background:#ebf8ff; color:#2b6cb0;">
        <div class="layer-title">Presentation Layer</div>
        <div class="layer-components">
          <span class="component-badge">[Component A]</span>
          <span class="component-badge">[Component B]</span>
        </div>
      </div>
      <div class="layer" style="background:#e9d8fd; color:#553c9a;">
        <div class="layer-title">Application Layer</div>
        <div class="layer-components">
          <span class="component-badge">[Service A]</span>
        </div>
      </div>
      <div class="layer" style="background:#fefcbf; color:#744210;">
        <div class="layer-title">Data Layer</div>
        <div class="layer-components">
          <span class="component-badge">[DB / Store]</span>
        </div>
      </div>
      <div class="layer" style="background:#f0fff4; color:#276749;">
        <div class="layer-title">Infrastructure Layer</div>
        <div class="layer-components">
          <span class="component-badge">[Cloud / Runtime]</span>
        </div>
      </div>
    </div>

    <!-- SECTION 5: Features -->
    <div class="section">
      <h2 class="section-title">Features</h2>
      <div class="grid-3">
        <!-- Repeat for each feature -->
        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <div class="feature-title">[Feature Name]</div>
          <div class="feature-desc">[Brief description]</div>
        </div>
      </div>
    </div>

    <!-- SECTION 6: Deployment -->
    <div class="section">
      <h2 class="section-title">Deployment</h2>
      <div class="grid-2">
        <div>
          <h3 style="margin-bottom:0.75rem">Prerequisites</h3>
          <!-- List prerequisites as .tag elements -->
        </div>
        <div>
          <h3 style="margin-bottom:0.75rem">Stack</h3>
          <!-- List stack components as .tag elements -->
        </div>
      </div>
    </div>

  </div>
</body>
</html>
```

---

## Styling Guidelines

- Use `system-ui` font stack — no external font CDN required for offline use
- Background: `#f7fafc` (light gray page), `white` card backgrounds
- Shadows: `0 1px 3px rgba(0,0,0,0.1)` — subtle depth, not heavy
- Border radius: 8px (cards/layers), 12px (sections), 4px (badges/tags)
- Semantic colors (from SKILL.md color table) for pipeline nodes and layer borders
- All CSS inline in `<style>` — single-file output, no external dependencies

## Validation Gate

Before saving the file:
- [ ] All six sections present (or deliberately omitted per user request)
- [ ] Semantic colors used correctly (data=blue, processing=orange, AI=purple, success=green)
- [ ] File opens correctly in a browser (no broken layout, no console errors)
- [ ] Filename follows `[system-name]-architecture.html` convention
- [ ] No placeholder text like `[System Name]` left in the output
