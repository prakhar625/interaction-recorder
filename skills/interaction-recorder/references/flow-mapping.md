# Phase 2: Flow Mapping

Map every user journey, view, state, tab, and sub-section the UI supports.

## Step 1: Identify All Routes/Views

```bash
# For React Router / Next.js
grep -rh "path=" --include="*.tsx" --include="*.jsx" --include="*.ts" src/ app/ | head -30
grep -rh "Route " --include="*.tsx" --include="*.jsx" src/ app/ | head -30

# For file-based routing (Next.js, Nuxt, etc.)
find app/ pages/ -name "*.tsx" -o -name "*.vue" -o -name "*.svelte" 2>/dev/null

# For template-based (Django, Flask, Rails)
grep -rh "urlpatterns\|@app.route\|get '" --include="*.py" --include="*.rb" . | head -30

# For server-rendered templates
find . -name "*.html" -path "*/templates/*" 2>/dev/null
```

## Step 2: Map the Primary User Journey

Document the main flow from entry to completion:

```markdown
1. Landing/Dashboard → shows overview/list
2. Click into item → detail view
3. Interact with detail → tabs, forms, actions
4. See results → confirmation, data, next steps
```

## Step 3: Catalog ALL Sub-Views (CRITICAL)

**Don't just map top-level pages.** Many apps have significant content hidden in:

### Tabs within views
```bash
# Search for tab-related components
grep -rh "tab\|Tab" --include="*.tsx" --include="*.jsx" --include="*.html" \
  src/ app/ templates/ | grep -i "tab-btn\|tab-panel\|TabList\|role=\"tab\"" | head -20
```

### Expandable/collapsible sections
```bash
grep -rh "expand\|collapse\|accordion\|toggle\|detail" \
  --include="*.tsx" --include="*.jsx" --include="*.html" \
  src/ app/ templates/ | head -20
```

### Modal dialogs
```bash
grep -rh "modal\|dialog\|overlay\|drawer" \
  --include="*.tsx" --include="*.jsx" --include="*.html" \
  src/ app/ templates/ | head -20
```

### Scrollable sections
Long pages with multiple distinct sections need scroll-through segments.

### Sub-routes / nested views
```bash
# Nested routing
grep -rh "children\|outlet\|nested" --include="*.tsx" --include="*.ts" src/ app/ | head -20
```

For each view, document:
- How many tabs does it have? What does each show?
- Are there expandable rows or detail panels?
- Is there a sidebar with navigation?
- How much scrolling is needed to see all content?
- Are there sub-pages or detail views accessible from this view?

## Step 4: Mine Tests for Flow Info

E2E tests are gold — they describe exact user journeys:
```bash
find . -path "*/e2e/*" -o -path "*/cypress/*" -o -path "*/__tests__/*" \
  -o -path "*/test/*" | grep -v node_modules | head -20

# Look at test descriptions
grep -rh "it(\|test(\|describe(" --include="*.test.*" --include="*.spec.*" \
  --include="*.cy.*" . | head -30
```

## Step 5: Document Component States

For key views, note:
- **Default state**: normal, populated view
- **Empty state**: no data, first-use experience
- **Loading state**: spinners, skeletons
- **Error state**: API failures, validation errors
- **Success state**: confirmations, completion

Only the default/populated state is typically recorded unless the Asker specifically
wants to showcase other states.

## Output Format

Present as a structured flow map:

```markdown
# Flow Map: [App Name]

## Primary Journey

### 1. Dashboard (`/dashboard`)
- Shows: list of items, summary stats
- Interactions: click item → detail view

### 2. Item Detail (`/items/:id`)
- Shows: item metadata, main content
- **Tabs**:
  - Tab 1: Overview — summary, key metrics
  - Tab 2: Details — full data table, expandable rows
  - Tab 3: Analysis — charts, insights
  - Tab 4: Settings — configuration options
- Interactions: switch tabs, expand rows, scroll

### 3. Item Detail > Expanded Row
- Shows: nested detail panel within the table
- Interactions: collapse row, navigate to related items

## Secondary Flows

### Settings (`/settings`)
- Shows: configuration forms
- Interactions: toggle switches, save
```

**Key principle**: Every tab, expandable section, and sub-view should appear as its
own entry in the flow map. This ensures the storyboard in Phase 4 covers all content.
