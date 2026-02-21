# Phase 1: Repo Analysis

Understand the codebase, how to run it, where the UI lives, and extract design tokens.

## Step 1: Scan Repo Structure

Explore the project layout:
```bash
# Top-level overview
ls -la
cat README.md 2>/dev/null || echo "No README"
cat package.json 2>/dev/null | head -20

# Identify framework and tech stack
ls src/ app/ pages/ components/ templates/ views/ public/ static/ 2>/dev/null
```

Key things to identify:
- **Framework**: React, Vue, Svelte, Next.js, Django, Flask, Rails, etc.
- **Build tool**: Vite, Webpack, esbuild, etc.
- **Package manager**: npm, yarn, pnpm, pip, etc.
- **Styling**: CSS modules, Tailwind, styled-components, SCSS, etc.

## Step 2: Find the Start Command

Check these in order:
1. `package.json` scripts: `dev`, `start`, `serve`
2. `Makefile`: `make dev`, `make run`
3. `docker-compose.yml`: `docker-compose up`
4. Python: `python -m module.web` or `flask run` or `uvicorn`
5. Ruby: `rails server` or `bin/dev`
6. README instructions

**IMPORTANT**: Before trying to start the app later (Phase 5), always check if it's
already running first. Multiple start strategies may be needed:

```bash
# Check if already running
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT 2>/dev/null || echo "000")
if [ "$HTTP_CODE" != "000" ]; then
  echo "App already running (HTTP $HTTP_CODE) — don't restart it"
fi
```

If the app is NOT running, note the start command for Phase 5.
If the start command fails in Phase 5, try these in order:
1. Check if it's actually running (the start command may have failed but a prior instance is still up)
2. Try alternative start commands from package.json scripts
3. Check for missing dependencies (npm install, pip install, etc.)
4. Check for missing .env variables
5. Report the exact error to the Asker

## Step 3: Locate the UI Entry Point

Find the URL, port, and initial route:
- Check `package.json` for port configs
- Check `.env` or config files for PORT settings
- Look for `localhost:XXXX` references in the code
- Common defaults: 3000, 5173 (Vite), 8000, 8080

## Step 4: Extract Design Tokens

Extract the app's visual identity for theme matching in the video.
This ensures the browser frame, annotations, gradients, and cards
complement the app's actual design.

```bash
# Search for CSS custom properties / design tokens
grep -rh "^\s*--" src/ app/ --include="*.css" --include="*.scss" | head -30

# Look for Tailwind config
cat tailwind.config.js tailwind.config.ts 2>/dev/null | head -40

# Look for theme files
find . -maxdepth 3 -name "*theme*" -o -name "*colors*" -o -name "*tokens*" \
  -not -path "*/node_modules/*" 2>/dev/null

# Search for primary/accent colors in stylesheets
grep -rh "primary\|accent\|brand" --include="*.css" --include="*.scss" \
  --include="*.ts" --include="*.tsx" src/ app/ 2>/dev/null | head -20
```

Capture:
- **Background color** (light or dark theme?)
- **Primary/accent color** (for annotations, highlights)
- **Font family** (for cards and titles)
- **Border radius style** (sharp, rounded, pill)

Store as part of the config for Phase 4/5:
```json
{
  "design_tokens": {
    "bg_color": "#0c0e12",
    "accent_color": "#3ee8b5",
    "secondary_color": "#f0a830",
    "font_family": "system-ui, sans-serif",
    "is_dark_theme": true,
    "border_radius": "8px"
  }
}
```

## Step 5: Read Existing Documentation

If docs exist (README, docs/, wiki), mine them for:
- Feature descriptions (useful for narration scripts)
- User journey descriptions
- Architecture diagrams
- Screenshot locations (useful to know what the UI looks like)

## Output

After this phase, you should have:
- **Tech stack** identified
- **Start command** known
- **UI entry point** URL + port
- **Design tokens** extracted
- **Docs summary** (if docs exist)

Summarize findings and proceed to Phase 2 (Flow Mapping).
