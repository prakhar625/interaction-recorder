# Phase 3: Limitations Check

Identify anything that could block automated recording and validate external service access.

## Blocking Issues Checklist

### Application Access
- [ ] Is the app already running? Check BEFORE trying to start it.
  ```bash
  curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT 2>/dev/null
  ```
  If it returns any HTTP code (200, 302, etc.), it's already running. Don't restart it.
- [ ] Does the app require auth? What kind? (session, OAuth, API key, basic auth)
- [ ] Does the app need specific data/state to show interesting content?
- [ ] Are there database seeds, fixtures, or demo modes?

### External Dependencies
- [ ] Does the UI depend on external APIs that need keys?
- [ ] Are there rate limits that could trigger during recording?
- [ ] Do any flows require real payment or irreversible actions?

### Bot Detection
- [ ] CAPTCHAs or human verification steps?
- [ ] Bot detection headers or fingerprinting?
- [ ] Rate limiting on page loads?

### Recording Constraints
- [ ] Are there flows that depend on real-time events (WebSocket, SSE)?
- [ ] Are there animations that require specific timing?
- [ ] Are there file uploads or camera/mic access prompts?

## TTS Provider Validation

**CRITICAL**: Before finalizing scope, validate that the requested TTS provider actually works.

```javascript
async function validateTTSAccess(config) {
  const provider = config.narration?.provider;
  const issues = [];

  if (provider === 'fal-minimax') {
    if (!process.env.FAL_KEY) {
      issues.push('FAL_KEY not found in environment or .env file');
    } else {
      // Quick test: make a tiny TTS request
      try {
        const resp = await fetch('https://fal.run/fal-ai/minimax/speech-2.8-hd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Key ${process.env.FAL_KEY}`,
          },
          body: JSON.stringify({ text: 'Test.' }),
        });
        if (!resp.ok) {
          issues.push(`FAL TTS test failed: HTTP ${resp.status}`);
        }
      } catch (e) {
        issues.push(`FAL TTS unreachable: ${e.message}`);
      }
    }
  }

  if (provider === 'elevenlabs') {
    if (!process.env.ELEVENLABS_API_KEY) {
      issues.push('ELEVENLABS_API_KEY not found');
    }
    // NOTE: FAL does NOT route ElevenLabs. If user asks for
    // "ElevenLabs via FAL", correct this misconception.
  }

  return issues;
}
```

### API Key Discovery

Check multiple locations for API keys:
1. Environment variables (already exported)
2. `.env` file in repo root
3. `.env.local` or `.env.development` files
4. Ask the Asker if not found

```bash
# Search for .env files
find /path/to/repo -maxdepth 2 -name ".env*" -not -path "*/node_modules/*" 2>/dev/null

# Check for relevant keys (never log full values)
for key in FAL_KEY ELEVENLABS_API_KEY OPENAI_API_KEY; do
  val="${!key}"
  if [ -n "$val" ]; then
    echo "$key: ${val:0:8}... (set)"
  else
    echo "$key: NOT SET"
  fi
done
```

## Output Format

Present blockers as a ranked list:

```markdown
### Blockers

1. **[BLOCKER]** App requires auth — need to seed a session cookie
   - Workaround: Add auth cookie to Playwright context before recording

2. **[WARNING]** ElevenLabs API key not found
   - Workaround: Use FAL MiniMax instead (FAL_KEY is available)

3. **[INFO]** App has loading spinners on data fetch
   - Handled: Playwright waitForSelector will wait for content to appear
```

If any blockers are unresolvable, propose scope adjustments to the Asker.
