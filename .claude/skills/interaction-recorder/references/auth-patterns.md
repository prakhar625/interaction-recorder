# Auth Patterns for Protected Apps

Many real-world apps require authentication. This reference covers common patterns
for making Playwright work with auth-protected UIs during recording.

## Detecting Auth Requirements (Phase 3)

During the limitations check, identify what kind of auth the app uses:

```bash
# Check for auth-related code
grep -rh "auth\|login\|session\|token\|cookie\|jwt\|oauth" \
  --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" \
  --include="*.py" --include="*.rb" \
  src/ app/ pages/ | head -30

# Check for auth middleware
grep -rh "middleware\|protect\|guard\|isAuthenticated\|requireAuth" \
  --include="*.ts" --include="*.js" --include="*.py" \
  src/ app/ | head -20

# Check for login pages
grep -rh "login\|signin\|sign-in" --include="*.tsx" --include="*.jsx" \
  src/ app/ pages/ | head -10
```

## Pattern 1: Cookie Injection (Session-Based Auth)

For apps that use session cookies (most web apps):

```javascript
// During Phase 7 recording, inject cookies before navigating
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: RECORDINGS_DIR, size: { width: 1920, height: 1080 } },
});

// Inject session cookie
await context.addCookies([{
  name: 'session_id',
  value: 'YOUR_SESSION_VALUE',
  domain: 'localhost',
  path: '/',
  httpOnly: true,
  secure: false,
}]);

const page = await context.newPage();
await page.goto('http://localhost:3000/dashboard');
```

**How to get the session cookie:**
1. Ask the Asker to log in manually in their browser
2. Extract the cookie: `document.cookie` in DevTools console
3. Or ask the Asker to provide it directly

## Pattern 2: localStorage Token (JWT/SPA Auth)

For SPAs that store JWT tokens in localStorage:

```javascript
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: RECORDINGS_DIR, size: { width: 1920, height: 1080 } },
});
const page = await context.newPage();

// Navigate to the app first (needed to set localStorage on the correct origin)
await page.goto('http://localhost:3000');

// Inject the token
await page.evaluate((token) => {
  localStorage.setItem('auth_token', token);
  // Some apps use different keys
  localStorage.setItem('access_token', token);
}, 'YOUR_JWT_TOKEN');

// Reload to pick up the token
await page.reload({ waitUntil: 'networkidle' });
```

## Pattern 3: Login Flow (Automated Login)

For apps with a simple username/password form:

```javascript
const page = await context.newPage();
await page.goto('http://localhost:3000/login');

// Fill in credentials
await page.fill('input[name="email"]', 'demo@example.com');
await page.fill('input[name="password"]', 'demo-password');
await page.click('button[type="submit"]');

// Wait for redirect to dashboard
await page.waitForURL('**/dashboard', { timeout: 10000 });
```

**Important**: Ask the Asker for demo credentials. Do NOT use real credentials.
If the app has a seed/demo user, use that.

## Pattern 4: Basic Auth (HTTP Basic)

For apps behind HTTP Basic Auth:

```javascript
const context = await browser.newContext({
  httpCredentials: {
    username: 'demo',
    password: 'demo-password',
  },
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: RECORDINGS_DIR, size: { width: 1920, height: 1080 } },
});
```

## Pattern 5: OAuth / SSO (Manual Pre-Auth)

For apps that use OAuth (Google, GitHub, etc.):

OAuth flows involve third-party redirects that Playwright can't easily automate.
Use the **storage state** approach:

1. Ask the Asker to log in manually using `npx playwright open http://localhost:3000`
2. After logging in, save the storage state:
   ```bash
   # The Asker completes login in the opened browser
   # Then save state from the Playwright console
   ```
3. Or: Ask the Asker to provide the auth state file:
   ```javascript
   const context = await browser.newContext({
     storageState: 'auth-state.json',
     viewport: { width: 1920, height: 1080 },
     recordVideo: { dir: RECORDINGS_DIR, size: { width: 1920, height: 1080 } },
   });
   ```

## Pattern 6: API Key Header (Internal Tools)

For apps that check API keys in headers:

```javascript
const context = await browser.newContext({
  extraHTTPHeaders: {
    'X-API-Key': 'your-api-key',
    'Authorization': 'Bearer your-token',
  },
  viewport: { width: 1920, height: 1080 },
  recordVideo: { dir: RECORDINGS_DIR, size: { width: 1920, height: 1080 } },
});
```

## Auth Decision Flow

```
App requires auth?
  ├── No → proceed normally
  └── Yes → what kind?
      ├── Session cookie → Pattern 1 (ask Asker for cookie value)
      ├── JWT in localStorage → Pattern 2 (ask Asker for token)
      ├── Login form → Pattern 3 (ask for demo credentials)
      ├── HTTP Basic → Pattern 4 (ask for credentials)
      ├── OAuth/SSO → Pattern 5 (manual pre-auth with storage state)
      └── API key header → Pattern 6 (ask for key)
```

## Important Rules

1. **NEVER hardcode real credentials** in scripts — always use variables
2. **Ask the Asker** for auth details during Phase 3
3. **Prefer demo/seed accounts** over real user accounts
4. **Document the auth pattern** in the storyboard (Phase 4) so re-recording is straightforward
5. **Save the auth pattern** (not credentials) in preferences.json for future recordings
6. **Re-inject auth** in every new browser context (per-segment recording creates new contexts)
