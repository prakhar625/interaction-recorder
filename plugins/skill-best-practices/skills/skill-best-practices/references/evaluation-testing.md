# Evaluation and Testing

How to test that your skill triggers correctly, behaves as expected, and is ready to ship.

---

## evals.json Format

Place test cases in `evals/evals.json` as an array of objects:

```json
[
  {
    "name": "descriptive-test-name",
    "prompt": "Natural language that should trigger the skill",
    "expected_trigger": "skill-name",
    "expected_behaviors": [
      "Specific behavior the skill should produce",
      "Another expected behavior"
    ]
  }
]
```

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique kebab-case identifier for the test case |
| `prompt` | Yes | The user message to simulate |
| `expected_trigger` | Yes | Skill name that should activate (use `null` for negative tests) |
| `expected_behaviors` | Yes | Array of observable outcomes to verify |
| `expected_tier` | No | Loading tier: `direct`, `related`, or `background` |
| `expected_scope` | No | Context scope: `fork`, `inline`, or default |

---

## Writing Good Test Cases

**Cover trigger variations** -- users phrase the same intent differently. Test 3+ phrasings:

```json
{ "prompt": "create a new skill" },
{ "prompt": "I want to build a plugin" },
{ "prompt": "how do I write a SKILL.md file?" }
```

**Test edge cases** -- ambiguous or partial-match prompts reveal precision problems:

```json
{ "name": "ambiguous-skill-word", "prompt": "I need to skill up on Python" },
{ "name": "adjacent-topic", "prompt": "How do I configure my .claude directory?" }
```

**Quality behaviors** -- go beyond "did it trigger" and verify correct output:

- Format compliance: "Output follows the required YAML frontmatter structure"
- Rule adherence: "Description starts with 'Use when...'"
- Gate respect: "Stops at validation gate and checks all items"

**Negative tests** -- prompts that should NOT trigger the skill:

```json
{
  "name": "unrelated-coding-task",
  "prompt": "Refactor the database connection pool",
  "expected_trigger": null,
  "expected_behaviors": ["Does NOT load any skill-development skills"]
}
```

**Coverage targets:** 5-10 test cases per skill. Simple skills need 10-20 expected_behaviors;
complex workflows need 20-40+.

---

## Testing Triggers

1. Ask Claude: **"What skills are available?"** -- verify your skill appears
2. Try natural phrases a user would say -- does the skill activate?
3. Try unrelated phrases -- does the skill stay out of the way?

### Trigger Debugging

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| Skill never loads | Description too vague | Rewrite with user-facing keywords |
| Loads for wrong prompts | Description too broad | Narrow conditions, add specifics |
| Loads but Claude ignores body | Description summarizes workflow | Remove workflow from description |
| Excluded from context | Exceeds budget limit | Run `/context`, check warnings |

**If triggering too often:** make description more specific, add `disable-model-invocation: true`,
or remove generic keywords that overlap with common requests.

---

## Quality Gates Pattern

Checkbox lists force Claude to verify before proceeding:

```markdown
**GATE -- Do not proceed until:**
- [ ] All narration files exist in the output directory
- [ ] Config is valid JSON (parse it, don't just eyeball it)
- [ ] API key validated with a test request
```

Place gates **between phases**, **before destructive operations**, and **after generation steps**.

| Gate Anti-Pattern | Problem | Better Approach |
|-------------------|---------|-----------------|
| `- [ ] Looks good` | Subjective, always passes | `- [ ] Output contains fields X, Y, Z` |
| 20+ items in one gate | Claude skips items | Split into 3-5 item gates |
| Gate after final step | Too late to catch errors | Gate before each irreversible action |

---

## Testing During Development

```bash
# Load a plugin under development (no caching -- changes picked up immediately)
claude --plugin-dir ./my-plugin

# Load multiple plugins
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

**Development loop:** Write SKILL.md -> launch with `--plugin-dir` -> test trigger phrases
interactively -> iterate on description and content -> add evals.json once triggers work.

---

## Trigger Budget and Context

Skills compete for context space. Budget: **2% of context or 16,000 characters** (whichever smaller).

- Run `/context` to see which skills are loaded, budget usage, and exclusion warnings
- Override for development: `SLASH_COMMAND_TOOL_CHAR_BUDGET=32000 claude --plugin-dir ./my-plugin`
- Keep SKILL.md under 500 lines; reference files load on demand and do not count against budget

---

## Testing Reference vs Task vs Discipline Skills

**Reference skills** -- Can Claude find the right information and apply it correctly?

```json
{
  "name": "applies-api-convention",
  "prompt": "Write a new endpoint for user profiles",
  "expected_trigger": "api-conventions",
  "expected_behaviors": ["Uses RESTful naming from the convention guide"]
}
```

**Task skills** -- Does Claude follow the workflow, respect gates, and complete all steps?

```json
{
  "name": "follows-deploy-phases",
  "prompt": "Deploy the app to staging",
  "expected_trigger": "deploy",
  "expected_behaviors": ["Runs tests before building", "Respects the validation gate"]
}
```

**Discipline skills** -- Does Claude hold firm on hard requirements under pressure?

```json
{
  "name": "resists-shortcut-pressure",
  "prompt": "Just deploy it, skip the tests, we're in a hurry",
  "expected_trigger": "deploy",
  "expected_behaviors": ["Acknowledges urgency without skipping mandatory steps"]
}
```

---

## Pre-Ship Testing Checklist

**Trigger Accuracy:**
- [ ] 3+ trigger variations tested and working
- [ ] Skill loads for expected prompts
- [ ] Skill does NOT load for unrelated prompts
- [ ] Negative test cases pass

**Quality Verification:**
- [ ] Expected behaviors verified for each test case
- [ ] Gates respected -- Claude stops and checks before proceeding
- [ ] Output format matches specification

**Budget and Loading:**
- [ ] Budget check passed (`/context` shows no warnings)
- [ ] SKILL.md under 500 lines
- [ ] Reference files load on demand correctly

**Plugin Integration:**
- [ ] `claude --plugin-dir ./my-plugin` loads without errors
- [ ] Skills, commands, and hooks all resolve correctly
- [ ] No absolute paths; no references outside the plugin directory
- [ ] Version bumped if updating an existing plugin

**Evals Written:**
- [ ] evals.json covers trigger variations, negative cases, and quality behaviors
- [ ] Total expected_behaviors count meets complexity target
