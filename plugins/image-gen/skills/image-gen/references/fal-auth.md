# FAL AI Authentication

## Goal

Set up and validate FAL AI API access for image generation, editing, and enhancement.

## Prerequisites

- A FAL AI account at [fal.ai](https://fal.ai)
- An API key with sufficient permissions

## API Key Setup

### Environment Variable (Recommended)

Set `FAL_KEY` in your environment:

```bash
export FAL_KEY="your-fal-api-key-here"
```

### .env File

Add to your project's `.env` or `.env.local`:

```
FAL_KEY=your-fal-api-key-here
```

The plugin's SessionStart hook will attempt to load this automatically.

### Key Scopes

| Scope | Permissions | When to Use |
|-------|------------|-------------|
| **Platform** | Run models, view usage | Default for image generation |
| **Admin** | + manage keys, billing, team | Only if managing account settings |

Platform-scoped keys are sufficient for all image generation operations.

## API Endpoints

All FAL AI models are accessed via the queue-based API:

- **Submit**: `POST https://queue.fal.run/{endpoint}`
- **Status**: `GET https://queue.fal.run/{endpoint}/requests/{request_id}/status`
- **Result**: `GET https://queue.fal.run/{endpoint}/requests/{request_id}`

### Authentication Header

```bash
curl -H "Authorization: Key ${FAL_KEY}" \
     -H "Content-Type: application/json" \
     https://queue.fal.run/fal-ai/flux-2-pro
```

### JavaScript Client

```javascript
import { fal } from "@fal-ai/client";
// FAL_KEY env var is read automatically
const result = await fal.subscribe("fal-ai/flux-2-pro", {
  input: { prompt: "..." }
});
```

## Troubleshooting

### Invalid Key (401 Unauthorized)

- Verify `FAL_KEY` is set: `echo ${FAL_KEY:0:8}...`
- Check for leading/trailing whitespace
- Regenerate key at [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)

### Rate Limits (429 Too Many Requests)

- FAL uses per-account rate limits
- Back off exponentially: 2s, 4s, 8s, 16s
- Check your plan limits at [fal.ai/dashboard](https://fal.ai/dashboard)

### Billing Issues (402 Payment Required)

- Check account balance at [fal.ai/dashboard/billing](https://fal.ai/dashboard/billing)
- Some models require a paid plan
- Pricing varies per model (see `model-catalog.md`)

### Model Not Found (404)

- Verify the endpoint ID matches exactly (case-sensitive)
- Some models are in preview and may have changed endpoints
- Check [fal.ai/models](https://fal.ai/models) for current endpoints

## Validation Gate

- [ ] `FAL_KEY` environment variable is set
- [ ] Key has at least Platform scope
- [ ] Test request succeeds (use cheapest model: FLUX.2 Flash)

## Quick Validation Script

```bash
# Test API connectivity with a minimal request
curl -s -o /dev/null -w "%{http_code}" \
  -X POST \
  -H "Authorization: Key ${FAL_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","image_size":"square"}' \
  https://queue.fal.run/fal-ai/flux-2/flash
```

Expected: `200` (request queued) or `201`. Any `4xx` indicates an auth issue.
