# Mermaid Architecture Diagrams

**Goal**: Produce valid Mermaid diagram syntax for embedding in Markdown files, GitHub READMEs,
wikis, or any renderer that supports Mermaid (Notion, Obsidian, GitLab, etc.).

## Prerequisites

- [ ] Diagram type selected (graph, sequence, C4Context, C4Container)
- [ ] Components/nodes identified
- [ ] Edges and data flow direction mapped
- [ ] Styling approach chosen (classDef or default)

---

## Diagram Type Selection

### `graph TD` / `graph LR` — Component & Data Flow

Use for: service maps, data pipelines, dependency graphs.

```mermaid
graph TD
    subgraph Sources["Data Sources"]
        DB[(PostgreSQL)]
        API[REST API]
        Q[[Message Queue]]
    end

    subgraph Processing["Processing Layer"]
        SVC[App Service]
        CACHE[(Redis Cache)]
    end

    subgraph Output["Outputs"]
        UI[Web Frontend]
        RPT[Reports]
    end

    DB -->|raw records| SVC
    API -->|JSON| SVC
    Q -->|events| SVC
    SVC <-->|read/write| CACHE
    SVC -->|rendered data| UI
    SVC -->|aggregated| RPT

    classDef source fill:#4299e1,stroke:#2b6cb0,color:#fff
    classDef proc   fill:#ed8936,stroke:#c05621,color:#fff
    classDef output fill:#48bb78,stroke:#276749,color:#fff

    class DB,API,Q source
    class SVC,CACHE proc
    class UI,RPT output
```

### `sequenceDiagram` — Service-to-Service Call Flows

Use for: API request/response chains, auth flows, event handling.

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend
    participant Auth as Auth Service
    participant API as Core API
    participant DB as Database

    User->>FE: Submit form
    FE->>Auth: POST /auth/token
    Auth-->>FE: JWT token
    FE->>API: GET /resource (Bearer token)
    API->>Auth: Validate token
    Auth-->>API: Claims
    API->>DB: SELECT ...
    DB-->>API: Rows
    API-->>FE: 200 JSON response
    FE-->>User: Rendered result
```

### `C4Context` — System Context Diagram

Use for: top-level view showing people, systems, and boundaries. Requires Mermaid v10.3+.

```mermaid
C4Context
    title System Context for [System Name]

    Person(user, "End User", "Uses the system via web browser")
    Person(admin, "Administrator", "Configures and monitors the system")

    System(sys, "[System Name]", "Provides [primary capability]")

    System_Ext(extAuth, "Identity Provider", "OAuth2 / SSO")
    System_Ext(extDB, "External Data Source", "Third-party data feed")

    Rel(user, sys, "Uses", "HTTPS")
    Rel(admin, sys, "Manages", "HTTPS")
    Rel(sys, extAuth, "Authenticates via", "OIDC")
    Rel(sys, extDB, "Fetches data from", "REST API")
```

### `C4Container` — Container-Level Diagram

Use for: services/databases/frontends within a single system.

```mermaid
C4Container
    title Container Diagram for [System Name]

    Person(user, "User", "Web browser")

    System_Boundary(sys, "[System Name]") {
        Container(web, "Web App", "React", "Single-page application")
        Container(api, "API Service", "Node.js / FastAPI", "Business logic")
        ContainerDb(db, "Primary Database", "PostgreSQL", "Persistent storage")
        Container(cache, "Cache", "Redis", "Session and query cache")
    }

    System_Ext(ext, "External Service", "Third-party integration")

    Rel(user, web, "Uses", "HTTPS")
    Rel(web, api, "Calls", "REST / GraphQL")
    Rel(api, db, "Reads/Writes", "SQL")
    Rel(api, cache, "Caches", "Redis protocol")
    Rel(api, ext, "Calls", "HTTPS")
```

---

## Node Shape Reference (`graph` diagrams)

| Shape | Syntax | Semantic Use |
|-------|--------|-------------|
| Rectangle | `A[Label]` | Service, application |
| Rounded rect | `A(Label)` | Process, step |
| Stadium | `A([Label])` | Start/end |
| Cylinder | `A[(Label)]` | Database, storage |
| Double bracket | `A[[Label]]` | Queue, buffer |
| Diamond | `A{Label}` | Decision, condition |
| Hexagon | `A{{Label}}` | Preparation |
| Parallelogram | `A[/Label/]` | Input/output |

---

## Styling with `classDef`

Always apply semantic color classes rather than per-node styles:

```
classDef source  fill:#4299e1,stroke:#2b6cb0,color:#fff,rx:6
classDef proc    fill:#ed8936,stroke:#c05621,color:#fff,rx:6
classDef ai      fill:#9f7aea,stroke:#6b46c1,color:#fff,rx:6
classDef output  fill:#48bb78,stroke:#276749,color:#fff,rx:6
classDef error   fill:#e53e3e,stroke:#c53030,color:#fff,rx:6
classDef neutral fill:#718096,stroke:#4a5568,color:#fff,rx:6
```

Then: `class NodeA,NodeB source` to apply.

---

## Output Format

Always output a fenced code block with the `mermaid` language tag:

````
```mermaid
graph TD
    ...
```
````

Do **not** save a file unless the user explicitly asks for a `.mmd` file.

---

## Validation Gate

Before outputting:
- [ ] Diagram renders without syntax errors (review for unclosed brackets, invalid arrows)
- [ ] All nodes use a semantic `classDef` class
- [ ] Subgraph labels are meaningful (not `subgraph A`)
- [ ] Edge labels describe what flows (not just unlabeled `-->`)
- [ ] Diagram type matches the request (component map ≠ sequence diagram)
- [ ] No placeholder text in node labels

## Common Issues

- **Mermaid version gate**: `C4Context`/`C4Container` require Mermaid v10.3+. If the user's renderer is older, fall back to `graph TD` with subgraphs.
- **Too many nodes**: Mermaid struggles above ~30 nodes — split into multiple diagrams.
- **Special characters in labels**: Wrap in `"quotes"` if the label contains parentheses, colons, or slashes.
- **Circular dependencies**: Mermaid renders cycles but they can look confusing — note them with a comment.
