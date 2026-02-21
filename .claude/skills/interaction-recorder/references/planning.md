# Phase 4: Planning & Storyboard

Create a detailed recording plan, get Asker approval before execution.

## Auto-Plan Generation (for /record-quick)

When the planning phase is skipped (/record-quick), generate a plan automatically:

1. Read the flow map from Phase 2
2. For each view/route, create a segment
3. **Include ALL sub-views**: tabs, expandable sections, modals, detail views
4. Generate narration key points by describing each step conversationally
5. Apply walkthrough defaults from `references/presets.md`
6. **Start card**: title from repo name, subtitle from description. Generation: "html"
7. **End card**: "Thanks for watching" (or relevant CTA). Generation: "html"
8. **Background music**: ambient, volume 0.08, duck under narration
9. **Sound effects**: click + transition sounds (subtle style)
10. Save the auto-plan as `storyboard.md` in the workspace

**Do not skip cards, music, or sounds** — they are part of walkthrough defaults.

Auto-plan narration style: Describe what the viewer is seeing as if you're a colleague
walking them through the app. Keep it natural and conversational.

## Interactive Planning (for /record-demo)

Present a segment-by-segment storyboard to the Asker:

### Storyboard Format

For each segment, define:

```markdown
## Segment N: [Title]

**Route/Action**: /path/to/view or "Click [element]"
**What we show**: Description of visible content, interactions, scrolling
**Narration**: Full narration script for this segment
**Duration estimate**: Based on narration length + action time
**Annotations**: Callout text and position (if enabled)
```

### Planning Checklist

1. **Segment list** — every view, tab, sub-section, detail panel
2. **Narration script** — full text per segment (not just key points for production tier)
3. **Start card** — title, subtitle, visual style
4. **End card** — closing text, CTA if applicable
5. **Visual theme** — matched to the app's design tokens (from Phase 1)
6. **Transition style** — fade, cut, slide
7. **API validation** — test TTS provider with a short sentence before committing
8. **Background music** — style preference (ambient/upbeat/minimal/none)
9. **Total estimated duration** — sum of all segment narration times + cards + transitions

### TTS Provider Validation

Before finalizing the plan, validate the TTS provider works:

```javascript
// Make a tiny test request to verify the provider is accessible
async function validateTTSProvider(provider, config) {
  const testText = "Testing audio generation.";
  try {
    if (provider === 'fal-minimax') {
      const resp = await fetch('https://fal.run/fal-ai/minimax/speech-2.8-hd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Key ${process.env.FAL_KEY}`,
        },
        body: JSON.stringify({ text: testText }),
      });
      if (!resp.ok) throw new Error(`FAL returned ${resp.status}`);
      console.log('✅ FAL MiniMax TTS validated');
    } else if (provider === 'elevenlabs') {
      // Similar test for ElevenLabs
    }
    return true;
  } catch (error) {
    console.error(`❌ TTS provider "${provider}" failed: ${error.message}`);
    return false;
  }
}
```

If validation fails, suggest alternatives before the Asker approves the plan.

### Available TTS Providers

Know these BEFORE proposing a plan:

| Provider | Env var needed | Quality | Notes |
|----------|---------------|---------|-------|
| **FAL MiniMax Speech-2.8 HD** | `FAL_KEY` | High | Recommended. Best FAL TTS option. |
| **FAL MiniMax Speech-02 HD** | `FAL_KEY` | High | Alternative FAL model |
| **FAL Chatterbox** | `FAL_KEY` | Medium | Another FAL option |
| **ElevenLabs** | `ELEVENLABS_API_KEY` | Very high | Direct API, not via FAL |
| **Local (macOS say)** | None | Low | Fallback only |
| **Local (espeak-ng)** | None | Very low | Linux fallback only |

**IMPORTANT**: FAL does NOT route ElevenLabs. If the Asker asks for "ElevenLabs via FAL",
clarify that ElevenLabs requires its own API key and direct API access, not through FAL.
FAL's TTS options are MiniMax and Chatterbox only.

## CHECKPOINT

After presenting the plan:

> "Here's the plan. Ready to execute, or want to change anything?"

Do NOT proceed without explicit approval. The Asker might want to:
- Add/remove segments
- Change narration wording
- Adjust the visual theme
- Switch TTS provider
- Change start/end card content

Iterate until approved.
