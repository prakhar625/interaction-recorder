# Phase 5: Workspace Setup

Prepare the local environment for recording and assembly. Everything must be verified
and ready before any asset generation or recording begins.

## Workspace Directory

```bash
WORKSPACE="$(pwd)/interaction-recorder-workspace"
WORKSPACE="$(cd "$(dirname "$WORKSPACE")" && pwd)/$(basename "$WORKSPACE")"
mkdir -p "$WORKSPACE"/{recordings,assets/{narration,cards,graphics,sounds,music},output/chunks,remotion/{src/components,public}}
echo "Workspace: $WORKSPACE"
```

⚠️ **All subsequent paths must be absolute, derived from $WORKSPACE.**

## Environment and API Keys

**CRITICAL**: API keys must be exported before running any scripts.

### Method 1: Source .env (for bash scripts)

```bash
# Find and source the .env file
for candidate in "$(pwd)/.env" "$(pwd)/../.env" "${WORKSPACE}/.env"; do
  if [ -f "$candidate" ]; then
    set -a
    source "$candidate"
    set +a
    echo "✅ Loaded env from $(realpath "$candidate")"
    break
  fi
done

# Verify keys (never log full values)
[ -n "$FAL_KEY" ] && echo "  FAL_KEY: ${FAL_KEY:0:8}..." || echo "  ⚠️ FAL_KEY: NOT SET"
[ -n "$ELEVENLABS_API_KEY" ] && echo "  ELEVENLABS_API_KEY: ${ELEVENLABS_API_KEY:0:8}..." || echo "  ⚠️ ELEVENLABS_API_KEY: NOT SET"
```

### Method 2: dotenv (for Node.js scripts)

Every generated Node.js script should load .env at the top. Resolve the path
to the target repo's `.env` file (discovered during Phase 1):
```javascript
// Use the repo root discovered in Phase 1 — replace REPO_ROOT with the actual absolute path
require('dotenv').config({ path: 'REPO_ROOT/.env' });
```

## Dependency Checks

### ffmpeg (required)

```bash
command -v ffmpeg >/dev/null 2>&1 && echo "✅ ffmpeg: $(ffmpeg -version 2>&1 | head -1)" || echo "❌ ffmpeg NOT FOUND"
command -v ffprobe >/dev/null 2>&1 && echo "✅ ffprobe: available" || echo "❌ ffprobe NOT FOUND"
```

### Node.js (required, v18+)

```bash
NODE_VER=$(node --version 2>/dev/null)
NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v//' | cut -d. -f1)
if [ "$NODE_MAJOR" -ge 18 ] 2>/dev/null; then
  echo "✅ Node.js: $NODE_VER"
else
  echo "❌ Node.js v18+ required (found: $NODE_VER)"
fi
```

### Playwright + Chromium

```bash
cd "$WORKSPACE"
npm init -y 2>/dev/null
npm install playwright dotenv 2>&1 | tail -3
npx playwright install chromium 2>&1 | tail -3
echo "✅ Playwright + Chromium installed"
```

### Remotion — DETERMINISTIC SETUP

⛔ **NEVER use `npx create-video@latest`** — it's interactive and hangs in CI/automated contexts.
Write all project files directly:

```bash
cd "$WORKSPACE/remotion"

# package.json
cat > package.json << 'PKGEOF'
{
  "name": "interaction-recorder-remotion",
  "private": true,
  "scripts": {
    "preview": "remotion preview src/index.ts",
    "render": "remotion render src/index.ts"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "remotion": "4.0.242",
    "@remotion/cli": "4.0.242",
    "@remotion/media": "4.0.242",
    "@remotion/transitions": "4.0.242"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0"
  }
}
PKGEOF

# tsconfig.json
cat > tsconfig.json << 'TSEOF'
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
TSEOF

# Entry file
cat > src/index.ts << 'ENTRYEOF'
import { registerRoot } from 'remotion';
import { Root } from './Root';
registerRoot(Root);
ENTRYEOF

# Install dependencies
npm install 2>&1 | tail -5

# Verify Remotion works
npx remotion --version 2>&1
echo "✅ Remotion project ready"
```

### Copy Starter Components

Copy the skill's starter Remotion templates into the project.

The templates live inside the skill's `assets/remotion-templates/` directory. Resolve the
skill root using `${CLAUDE_PLUGIN_ROOT}` (set automatically by the plugin system) or by
locating the skill directory relative to the workspace:

```bash
# Resolve the skill's template directory
# Option 1: Plugin system variable (available when installed as a plugin)
SKILL_TEMPLATES="${CLAUDE_PLUGIN_ROOT}/.claude/skills/interaction-recorder/assets/remotion-templates"

# Option 2: Fallback — search common locations
if [ ! -d "$SKILL_TEMPLATES" ]; then
  for candidate in \
    "$(dirname "$WORKSPACE")/.claude/skills/interaction-recorder/assets/remotion-templates" \
    "$HOME/.claude/skills/interaction-recorder/assets/remotion-templates" \
    "$HOME/.claude/plugins/cache/interaction-recorder/"*"/.claude/skills/interaction-recorder/assets/remotion-templates"; do
    if [ -d "$candidate" ]; then
      SKILL_TEMPLATES="$candidate"
      break
    fi
  done
fi

if [ ! -d "$SKILL_TEMPLATES" ]; then
  echo "❌ Could not find skill template directory. Remotion components will be written inline."
else
  cp "$SKILL_TEMPLATES"/BrowserFrame.tsx "$WORKSPACE/remotion/src/components/"
  cp "$SKILL_TEMPLATES"/ClickZoomOverlay.tsx "$WORKSPACE/remotion/src/components/"
  cp "$SKILL_TEMPLATES"/GradientBackground.tsx "$WORKSPACE/remotion/src/components/"
  cp "$SKILL_TEMPLATES"/AnnotationOverlay.tsx "$WORKSPACE/remotion/src/components/"
  cp "$SKILL_TEMPLATES"/FadeTransition.tsx "$WORKSPACE/remotion/src/components/"
  echo "✅ Starter components copied from $SKILL_TEMPLATES"
fi
```

### Create Asset Symlinks for Remotion

Remotion's `staticFile()` serves from `public/`. Create symlinks:

```bash
cd "$WORKSPACE/remotion"
ln -sf "$WORKSPACE/recordings" public/recordings
ln -sf "$WORKSPACE/assets" public/assets
echo "✅ Symlinks: public/recordings → recordings, public/assets → assets"
```

## Start the Target Application

**CRITICAL**: Check if the app is already running BEFORE trying to start it.

```bash
APP_URL="http://localhost:${PORT:-3000}"

# Check if already running
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" != "000" ]; then
  echo "✅ App already running at $APP_URL (HTTP $HTTP_CODE)"
else
  echo "Starting app..."
  cd "$REPO_ROOT"   # REPO_ROOT = the target repo's absolute path from Phase 1

  # Try the start command discovered in Phase 1 (e.g., npm run dev, python manage.py runserver)
  $START_COMMAND &
  APP_PID=$!

  # Wait up to 30 seconds for startup
  for i in $(seq 1 30); do
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null || echo "000")
    if [ "$HTTP_CODE" != "000" ]; then
      echo "✅ App started (HTTP $HTTP_CODE) after ${i}s"
      break
    fi
    sleep 1
  done

  if [ "$HTTP_CODE" = "000" ]; then
    echo "❌ App failed to start after 30 seconds"
    echo "Try starting it manually and re-running the skill."
    echo "Common issues:"
    echo "  - Wrong start command"
    echo "  - Missing dependencies (npm install / pip install)"
    echo "  - Port conflict"
    echo "  - Missing .env variables"
  fi
fi
```

## Pre-flight Gate

**DO NOT proceed to Phase 6 until ALL checks pass.**

Use the validate-workspace script for a comprehensive check:

```bash
# Run the pre-flight validation script
bash "${CLAUDE_PLUGIN_ROOT}/.claude/skills/interaction-recorder/scripts/validate-workspace.sh" \
  "$WORKSPACE" "$APP_URL"
```

If the script is not available, run these checks manually:

```bash
echo "═══ Pre-flight Check ═══"
PASS=true

# ffmpeg
command -v ffmpeg >/dev/null 2>&1 && echo "✅ ffmpeg" || { echo "❌ ffmpeg"; PASS=false; }

# Node 18+
NODE_MAJOR=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1)
[ "$NODE_MAJOR" -ge 18 ] 2>/dev/null && echo "✅ Node.js v$(node --version)" || { echo "❌ Node.js 18+"; PASS=false; }

# Playwright
[ -d "$WORKSPACE/node_modules/playwright" ] && echo "✅ Playwright" || { echo "❌ Playwright"; PASS=false; }

# Remotion
npx remotion --version >/dev/null 2>&1 && echo "✅ Remotion $(npx remotion --version 2>/dev/null)" || { echo "❌ Remotion"; PASS=false; }

# Starter components
[ -f "$WORKSPACE/remotion/src/components/BrowserFrame.tsx" ] && echo "✅ Components" || { echo "❌ Components"; PASS=false; }

# Symlinks
[ -L "$WORKSPACE/remotion/public/recordings" ] && echo "✅ Symlinks" || { echo "❌ Symlinks"; PASS=false; }

# API keys
[ -n "$FAL_KEY" ] || [ -n "$ELEVENLABS_API_KEY" ] && echo "✅ API key(s)" || { echo "⚠️ No TTS API key (will use local fallback)"; }

# App running
APP_URL="http://localhost:${PORT:-3000}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$APP_URL" 2>/dev/null || echo "000")
[ "$HTTP_CODE" != "000" ] && echo "✅ App at $APP_URL (HTTP $HTTP_CODE)" || { echo "❌ App not reachable"; PASS=false; }

echo ""
if $PASS; then
  echo "✅ All pre-flight checks passed. Ready for Phase 6."
else
  echo "❌ Some checks failed. Fix issues before proceeding."
fi
```
