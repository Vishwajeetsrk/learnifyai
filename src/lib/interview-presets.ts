export interface Question {
  question: string;
  type: string;
  tips: string[];
  expectedPoints: string[];
  followUp: string;
}

export const PRESET_QUESTIONS: Record<string, Question[]> = {
  "frontend": [
    {
      "question": "Explain the virtual DOM reconciliation process in React, and how Fiber architecture improves UI responsiveness.",
      "type": "technical",
      "tips": [
        "Mention the diffing algorithm complexity O(n)",
        "Explain key properties for list reconciliation",
        "Discuss task prioritization and interruptible rendering in Fiber"
      ],
      "expectedPoints": [
        "Diffing heuristic reduces tree comparison from O(n^3) to O(n) assuming components of different types generate different trees",
        "Fiber creates a linked-list work-in-progress tree with fibers as incremental units of work",
        "Enables cooperative scheduling, pause/resume, and aborting stale rendering work",
        "Prioritizes high-priority user interaction updates over low-priority background renders"
      ],
      "followUp": "How does concurrent rendering differ from traditional synchronous rendering in React 18?"
    },
    {
      "question": "How do you optimize Core Web Vitals—specifically LCP (Largest Contentful Paint), INP (Interaction to Next Paint), and CLS (Cumulative Layout Shift)—on high-traffic production web applications?",
      "type": "technical",
      "tips": [
        "Break down each metric separately",
        "Mention fetchpriority, image optimization, and CDN edge caching",
        "Explain long tasks breakdown and layout dimensions"
      ],
      "expectedPoints": [
        "LCP: Preload hero images, apply fetchpriority='high', use WebP/AVIF, eliminate render-blocking CSS/JS, and implement edge SSR",
        "INP: Break up long JavaScript tasks (>50ms) using requestIdleCallback or scheduler.yield, debounce handlers, and reduce hydration cost",
        "CLS: Set explicit width/height or aspect-ratio on all images and ad slots, avoid inserting DOM above viewport without user gesture",
        "Observability: Real-user monitoring (RUM) using web-vitals library to detect regional and device degradation"
      ],
      "followUp": "How would you identify whether high LCP is caused by TTFB or client-side asset download time?"
    },
    {
      "question": "What are the trade-offs between Client-Side Rendering (CSR), Server-Side Rendering (SSR), Static Site Generation (SSG), and React Server Components (RSC)?",
      "type": "technical",
      "tips": [
        "Compare TTFB, SEO, interactivity (TTI), and hosting cost",
        "Explain the hydration overhead of SSR vs zero-bundle RSC"
      ],
      "expectedPoints": [
        "CSR: Fast route transitions after load, but slow initial paint and heavy JS bundle",
        "SSR: Fast FCP and strong SEO, but higher server compute load and hydration mismatch risks",
        "SSG: Near-instant edge CDN delivery, but rebuild required for content updates",
        "RSC: Server-only execution with zero client bundle impact, streaming HTML, and direct database access from components"
      ],
      "followUp": "When should you NOT use Server Components in a Next.js or React 19 app?"
    },
    {
      "question": "Explain modern state management architectures in React: when do you use local state, context, server-cache libraries (TanStack Query), and global stores (Zustand/Redux)?",
      "type": "technical",
      "tips": [
        "Distinguish server state from client UI state",
        "Mention re-render implications of Context API",
        "Discuss caching, deduplication, and stale-while-revalidate"
      ],
      "expectedPoints": [
        "Server state belongs in cache tools like TanStack Query/SWR (handles caching, polling, deduplication, optimistic updates)",
        "React Context is best for low-frequency changes (theming, user locale) due to re-rendering all consumers",
        "Global stores like Zustand/Redux for complex, multi-component interactive workflows (checkout, canvas, draft editors)",
        "Local state (useState, useReducer) should always be preferred unless state needs to cross component boundaries"
      ],
      "followUp": "How do you handle optimistic UI updates with automatic rollback on network failure in TanStack Query?"
    },
    {
      "question": "How does the JavaScript Event Loop work in modern browsers, and how do microtasks differ from macrotasks and animation frames?",
      "type": "technical",
      "tips": [
        "Walk through Call Stack, Web APIs, Task Queue, Microtask Queue",
        "Explain execution order for Promise.resolve vs setTimeout vs requestAnimationFrame"
      ],
      "expectedPoints": [
        "Call stack executes synchronous execution contexts until empty",
        "Microtask queue (Promise callbacks, queueMicrotask, MutationObserver) is processed completely after every task before rendering",
        "Macrotask queue (setTimeout, setInterval, postMessage, I/O) yields one task per tick",
        "requestAnimationFrame executes right before browser recalculates styles and repaints"
      ],
      "followUp": "What happens if a microtask recursively enqueues another microtask without yielding?"
    },
    {
      "question": "What security threats target modern single-page applications, and how do you protect against XSS, CSRF, and supply chain vulnerabilities?",
      "type": "technical",
      "tips": [
        "Discuss Content Security Policy (CSP)",
        "Compare localStorage vs HttpOnly cookies for JWT tokens",
        "Explain input sanitization and npm audit"
      ],
      "expectedPoints": [
        "XSS: Sanitize raw HTML (DOMPurify), avoid dangerouslySetInnerHTML, implement strict Content-Security-Policy (CSP) headers",
        "CSRF: Store session tokens in HttpOnly, Secure, SameSite=Strict/Lax cookies with anti-CSRF token verification on state-changing requests",
        "Supply chain: Pin package dependencies, automate lockfile audits, and use integrity subresource verification",
        "Clickjacking: Use X-Frame-Options: DENY and CSP frame-ancestors 'none'"
      ],
      "followUp": "Why is storing sensitive authentication tokens in localStorage considered dangerous?"
    },
    {
      "question": "How do you architect a scalable CSS and design token system across an enterprise frontend application?",
      "type": "technical",
      "tips": [
        "Mention Tailwind v4, CSS Custom Properties, and utility classes",
        "Explain container queries and semantic token layers",
        "Discuss dark mode implementation"
      ],
      "expectedPoints": [
        "Define 3-tier design token hierarchy: primitive tokens (raw colors) -> semantic tokens (bg-primary, text-muted) -> component tokens",
        "Leverage CSS variables for instant theme switching (dark/light mode) without stylesheet swaps",
        "Use container queries (@container) for component-level responsiveness independent of viewport size",
        "Maintain utility boundaries to avoid CSS specificity wars and bundle bloating"
      ],
      "followUp": "How do container queries solve problems that media queries cannot?"
    },
    {
      "question": "What techniques do you apply to minimize initial JavaScript bundle size and optimize code splitting in modern web apps?",
      "type": "technical",
      "tips": [
        "Explain route-based vs component-based dynamic imports",
        "Discuss tree-shaking, bundle analyzers, and vendor chunking"
      ],
      "expectedPoints": [
        "Route-level dynamic importing with React.lazy and Suspense boundaries",
        "Lazy loading heavy third-party libraries (charts, rich-text editors, video players) only on user intent",
        "Tree-shaking: Use ES modules (ESM) and avoid wildcard imports from monolithic packages (e.g. lodash vs lodash-es)",
        "Analyze bundle chunks with visualizers to identify unexpected transitive duplicate dependencies"
      ],
      "followUp": "How does module federation differ from traditional npm package sharing across micro-frontends?"
    },
    {
      "question": "How do you design frontend applications to meet WCAG 2.1 AA accessibility standards, and how do you test for it?",
      "type": "technical",
      "tips": [
        "Discuss semantic HTML, ARIA roles, color contrast, and keyboard traps",
        "Mention automated linters (axe-core) vs manual keyboard navigation testing"
      ],
      "expectedPoints": [
        "Semantic HTML elements (<button>, <nav>, <main>, <dialog>) provide built-in screen reader support and focus management",
        "Ensure 4.5:1 contrast ratio for normal text and 3:1 for large text / UI controls",
        "Full keyboard accessibility: visible focus rings, logical tab order, and trap management in modals/popovers",
        "ARIA: Use aria-live for dynamic updates, aria-expanded for accordions, and avoid redundant ARIA on native elements"
      ],
      "followUp": "How do you handle focus trapping and restoration when opening and closing a modal dialog?"
    },
    {
      "question": "Describe your approach to building a resilient offline-first Progressive Web App (PWA) with background sync.",
      "type": "technical",
      "tips": [
        "Explain Service Worker lifecycle",
        "Compare cache strategies (Cache-First, Network-First, Stale-While-Revalidate)",
        "Discuss IndexedDB storage"
      ],
      "expectedPoints": [
        "Service Worker lifecycle: registration, installation (pre-caching core shell), activation (cleaning legacy caches), and fetch interception",
        "Strategy selection: Cache-First for static assets, Stale-While-Revalidate for non-critical content, Network-First for user transactions",
        "IndexedDB for offline client data storage and mutation queues",
        "Background Sync API to replay queued outgoing mutations when connectivity is restored"
      ],
      "followUp": "How do you handle cache invalidation when a new version of the application is deployed?"
    }
  ],
  "backend": [
    {
      "question": "How do you design robust, idempotent REST and gRPC APIs that safely handle network retries, duplicate requests, and transient failures?",
      "type": "technical",
      "tips": [
        "Explain idempotency keys with distributed storage",
        "Discuss HTTP methods idempotency (GET/PUT vs POST)",
        "Explain exponential backoff with jitter"
      ],
      "expectedPoints": [
        "Implement Idempotency-Key headers stored in Redis with TTL to detect duplicate submission within a time window",
        "Atomic check-and-set or distributed locks prevent concurrent duplicate execution",
        "Safe retry policy: exponential backoff with randomized jitter to prevent thundering herd problem",
        "Return cached original response payload for repeat idempotent requests without reprocessing side effects"
      ],
      "followUp": "How do you ensure idempotency when an API communicates with third-party payment gateways?"
    },
    {
      "question": "Compare Relational (PostgreSQL) vs Document (MongoDB) vs Key-Value (Redis) databases: how do you choose the right storage engine for specific application requirements?",
      "type": "technical",
      "tips": [
        "Discuss ACID guarantees, schema evolution, query patterns, and horizontal scalability",
        "Mention indexing structures (B-Tree vs LSM trees)"
      ],
      "expectedPoints": [
        "Relational (PostgreSQL): Strong ACID compliance, complex relational queries, foreign keys, and financial/transactional integrity",
        "Document (MongoDB): Flexible schemas, polymorphic data models, natural hierarchy embedding, and rapid prototyping",
        "Key-Value / In-Memory (Redis): Sub-millisecond latency for session caches, rate-limiting counters, and pub/sub messaging",
        "Polyglot persistence: Combine primary relational datastore with Redis cache layer and Elasticsearch for full-text search"
      ],
      "followUp": "When would you choose database read replicas over an in-memory caching layer?"
    },
    {
      "question": "How do you design a distributed caching layer with Redis, and how do you mitigate cache penetration, cache breakdown (stampede), and cache avalanche?",
      "type": "technical",
      "tips": [
        "Explain Cache-Aside pattern",
        "Break down each of the 3 failure modes",
        "Discuss randomized TTLs and mutex locks"
      ],
      "expectedPoints": [
        "Cache Penetration (querying non-existent keys): Use Bloom filters or cache null values with short TTL",
        "Cache Breakdown / Stampede (hot key expires under heavy traffic): Use distributed mutex locking (single-flight) to allow only one thread to rebuild cache",
        "Cache Avalanche (mass keys expiring simultaneously): Add randomized jitter/deviation to TTL expirations",
        "Cache Invalidation: Dual write or CDC (Change Data Capture) via Debezium to invalidate cache on database updates"
      ],
      "followUp": "What are the trade-offs between Write-Through and Cache-Aside caching strategies?"
    },
    {
      "question": "Explain database concurrency control: how do optimistic and pessimistic locking work, and what are SQL isolation levels?",
      "type": "technical",
      "tips": [
        "Compare row-level locking (SELECT FOR UPDATE) with version numbers",
        "Explain Read Committed, Repeatable Read, and Serializable",
        "Discuss phantom reads and dirty reads"
      ],
      "expectedPoints": [
        "Optimistic Locking: Checks version column or timestamp at commit time; ideal for low-contention environments with retry loops",
        "Pessimistic Locking: Acquires exclusive row lock (SELECT FOR UPDATE); prevents conflicting updates but introduces contention and deadlock risk",
        "Isolation Levels: Read Uncommitted (dirty reads) -> Read Committed (non-repeatable reads) -> Repeatable Read (phantom reads) -> Serializable",
        "PostgreSQL uses MVCC (Multi-Version Concurrency Control) so readers never block writers and writers never block readers"
      ],
      "followUp": "How do you detect and resolve deadlocks in a distributed transactional system?"
    },
    {
      "question": "How do you architect asynchronous event-driven systems using message brokers like Apache Kafka or RabbitMQ, and how do you guarantee message delivery?",
      "type": "technical",
      "tips": [
        "Contrast Kafka's log-centric partition model with RabbitMQ's exchange/queue model",
        "Explain at-least-once vs exactly-once semantics",
        "Discuss the Outbox Pattern"
      ],
      "expectedPoints": [
        "Kafka uses distributed partitioned append-only commit logs for high-throughput stream processing and replayability",
        "RabbitMQ excels at complex routing, AMQP protocols, and lightweight job queues with dead-letter exchanges (DLX)",
        "Transactional Outbox Pattern: Save business entity and event message in the same local database transaction, relaying via CDC to eliminate dual-write inconsistency",
        "Consumer idempotency is required because networks can duplicate messages under at-least-once delivery"
      ],
      "followUp": "Why does the Outbox Pattern solve the distributed dual-write problem?"
    },
    {
      "question": "How do you design a secure authentication and authorization system using JWT, refresh token rotation, and Role-Based Access Control (RBAC)?",
      "type": "technical",
      "tips": [
        "Explain short-lived access tokens vs long-lived refresh tokens",
        "Discuss token theft detection via rotation",
        "Explain PBKDF2/Argon2id password hashing"
      ],
      "expectedPoints": [
        "Access tokens: Short-lived (15 mins), signed with RS256/EdDSA, containing user claims and roles",
        "Refresh tokens: Long-lived, stored in secure HTTP-only cookies and recorded in database with family ID",
        "Refresh Token Rotation: Issuing a new refresh token on use and invalidating the entire family if an already-used token is replayed (theft detection)",
        "Password storage: Hash using Argon2id or bcrypt with appropriate work factor / cost parameters"
      ],
      "followUp": "How do you immediately revoke an access token before its standard expiry without introducing a centralized database bottleneck on every request?"
    },
    {
      "question": "What rate limiting algorithms do you use in backend services, and how do you implement distributed rate limiting across a cluster?",
      "type": "technical",
      "tips": [
        "Compare Token Bucket, Leaky Bucket, and Sliding Window Counter",
        "Explain Redis Lua scripts for atomic increments",
        "Discuss HTTP 429 response headers"
      ],
      "expectedPoints": [
        "Token Bucket: Allows bursts up to capacity while refilling at a steady rate; excellent for public API endpoints",
        "Sliding Window Counter: Precise request counting over rolling time window without edge spikes",
        "Distributed implementation: Redis Lua scripts ensure atomic rate-limit checks across multiple API gateway nodes without race conditions",
        "Standard headers: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, and Retry-After"
      ],
      "followUp": "How do you protect your rate limiter from becoming a single point of failure if Redis goes down?"
    },
    {
      "question": "How do you execute zero-downtime database schema migrations for tables with hundreds of millions of rows in production?",
      "type": "technical",
      "tips": [
        "Explain expand-and-contract (parallel run) pattern",
        "Discuss column additions, renames, and type alterations without table locks",
        "Explain shadow tables and pg_repack"
      ],
      "expectedPoints": [
        "Expand and Contract Pattern: Phase 1: Add new nullable column/table; Phase 2: Dual write to both old and new schemas; Phase 3: Backfill historical data in batches; Phase 4: Switch read queries; Phase 5: Drop legacy column",
        "Never perform table-locking operations: Add columns with default values cautiously in older databases, avoid synchronous index builds (use CREATE INDEX CONCURRENTLY in PostgreSQL)",
        "Batch backfilling: Process historical rows in small indexed chunks with pauses to avoid replication lag and I/O starvation",
        "Schema migration tools: Liquibase, Flyway, or Atlas with rollback validation in CI/CD"
      ],
      "followUp": "Why does running an unindexed ALTER TABLE ADD COLUMN with non-null default lock a large PostgreSQL table in older versions?"
    },
    {
      "question": "What is your approach to backend observability: distributed tracing, structured logging, and metrics alerting using OpenTelemetry?",
      "type": "technical",
      "tips": [
        "Differentiate logs, metrics, and traces (the three pillars)",
        "Explain trace context propagation (W3C traceparent)",
        "Discuss RED and USE monitoring methods"
      ],
      "expectedPoints": [
        "Distributed Tracing: Propagate trace ID and span ID across HTTP/gRPC boundaries using W3C TraceContext headers to visualize latency across microservices",
        "Structured Logging: Output JSON logs with correlated trace_id, user_id, level, and timestamp to centralized aggregators (ELK, Loki)",
        "Metrics: Prometheus RED method (Rate, Errors, Duration) for service health, and USE (Utilization, Saturation, Errors) for infrastructure",
        "Alerting: Set alert thresholds based on burning SLO error budgets rather than noisy raw threshold spikes"
      ],
      "followUp": "How do you sample traces in high-volume systems to minimize storage costs without losing critical error traces?"
    },
    {
      "question": "How do you design a resilient microservices architecture with service discovery, circuit breakers, and fault tolerance?",
      "type": "technical",
      "tips": [
        "Explain Circuit Breaker states: Closed, Open, Half-Open",
        "Discuss bulkhead isolation and graceful degradation",
        "Explain API Gateway pattern"
      ],
      "expectedPoints": [
        "Circuit Breaker Pattern (Netflix Hystrix, Resilience4j): Trips from Closed to Open when error thresholds exceed tolerance, failing fast without draining upstream thread pools",
        "Bulkhead Pattern: Isolate resource pools (thread pools, connection limits) so that failure in one dependency does not cascade to the entire service",
        "Graceful degradation: Return cached data, default fallbacks, or queued background fulfillment during dependency outages",
        "API Gateway: Centralized ingress handling TLS termination, authentication, rate limiting, and request routing"
      ],
      "followUp": "What is the difference between a service mesh (Istio/Linkerd) and an API Gateway?"
    }
  ],
  "fullstack": [
    {
      "question": "Walk through the complete lifecycle of a web request: from the user typing a URL in the browser, through DNS, CDN, load balancer, application server, database, and back.",
      "type": "technical",
      "tips": [
        "Detail each hop in the networking stack",
        "Mention TLS 1.3 handshake, reverse proxy routing, and SQL execution",
        "Explain client rendering and DOMContentLoaded"
      ],
      "expectedPoints": [
        "Browser checks cache -> DNS resolution (browser, OS, recursive resolver, authoritative name servers)",
        "TCP 3-way handshake -> TLS 1.3 cryptographic negotiation -> HTTP GET request sent",
        "Edge CDN serves cached static assets or forwards dynamic requests to origin Load Balancer (ALB / Nginx)",
        "Application server executes business logic, queries database via connection pool with parameterized SQL",
        "Response streaming with appropriate cache-control headers, client parsing HTML, building DOM/CSSOM, and executing JS"
      ],
      "followUp": "How does HTTP/3 with QUIC improve request latency over traditional HTTP/2 over TCP?"
    },
    {
      "question": "How do you architect end-to-end type safety between your database schema, backend APIs, and frontend client application in TypeScript?",
      "type": "technical",
      "tips": [
        "Discuss tools like tRPC, Prisma, Drizzle, Zod, and OpenAPI generator",
        "Explain runtime validation vs compile-time types"
      ],
      "expectedPoints": [
        "Single source of truth: Generate database schema models using Prisma or Drizzle ORM",
        "API contract validation: Use Zod or Valibot for runtime input parsing and auto-inferred static types",
        "Client-Server bridge: Use tRPC, TanStack Start server functions, or OpenAPI codegen to ensure client calls have compile-time autocomplete and type verification",
        "Prevents regression bugs where backend payload shape changes break client UI components silently"
      ],
      "followUp": "What are the trade-offs of using tRPC vs a traditional OpenAPI / REST specification in a team setting?"
    },
    {
      "question": "How do you build real-time collaborative applications using WebSockets, Server-Sent Events (SSE), and conflict-free replicated data types (CRDTs)?",
      "type": "technical",
      "tips": [
        "Compare unidirectional SSE with bidirectional WebSockets",
        "Explain operational transformation vs CRDTs (Yjs, Automerge)",
        "Discuss connection recovery and Redis pub/sub scaling"
      ],
      "expectedPoints": [
        "SSE: Lightweight HTTP-based unidirectional streaming from server to client; ideal for notifications, AI LLM token streaming, and dashboards",
        "WebSockets: Full-duplex persistent TCP connections for chat, collaborative drawing, and real-time multiplayer gaming",
        "Scaling: Use Redis Pub/Sub or WebSocket gateway clusters to broadcast messages across multiple backend server instances",
        "Conflict Resolution: CRDTs (Yjs, Automerge) enable peer-to-peer eventual consistency without complex central lock servers"
      ],
      "followUp": "Why is Server-Sent Events (SSE) often preferred over WebSockets for streaming AI responses like ChatGPT?"
    },
    {
      "question": "What is your architecture for handling high-volume file uploads (video, images, PDFs) securely and scalably in a full-stack application?",
      "type": "technical",
      "tips": [
        "Explain direct-to-cloud signed upload URLs (S3 / Supabase)",
        "Discuss file type & size validation, virus scanning, and async transcoding",
        "Explain why uploading files directly through the app server is an anti-pattern"
      ],
      "expectedPoints": [
        "Client requests pre-signed upload URL from backend with validated file metadata (name, size, MIME type)",
        "Client uploads directly to cloud storage (S3 / Supabase / GCS) via HTTP PUT, bypassing backend compute and RAM constraints",
        "Storage triggers async webhook or event (S3 Event Notifications / Cloud Functions) to perform malware scan, image optimization, or video transcoding",
        "Database updates asset record status to 'processed' once background workers finalize deliverables"
      ],
      "followUp": "How do you protect a pre-signed URL upload endpoint from malicious file uploads pretending to be images (e.g. polyglot files)?"
    },
    {
      "question": "How do you solve the N+1 query problem across both ORM queries and GraphQL APIs in a production full-stack application?",
      "type": "technical",
      "tips": [
        "Explain eager loading (JOIN vs WHERE IN)",
        "Discuss DataLoader batching and caching in GraphQL",
        "Explain database query logging and APM detection"
      ],
      "expectedPoints": [
        "N+1 occurs when fetching a list of parent records executes 1 query, and accessing child relations triggers N separate database roundtrips",
        "ORM solution: Use eager loading with JOINs or batching (e.g., Prisma include, ActiveRecord includes)",
        "GraphQL solution: DataLoader aggregates individual resolver lookups across a single event-loop tick into a single SQL 'WHERE id IN (...)' query with per-request memoization",
        "Detection: Continuous APM tracing and query log monitoring with tools like PgHero or Prisma query metrics"
      ],
      "followUp": "How does DataLoader handle cache invalidation across different user requests?"
    },
    {
      "question": "How do you architect a multi-tenant SaaS application: compare Database-per-tenant, Schema-per-tenant, and Shared-database with tenant_id.",
      "type": "technical",
      "tips": [
        "Discuss data isolation, compliance (HIPAA, GDPR), cost, and migration complexity",
        "Explain Supabase / PostgreSQL Row-Level Security (RLS)"
      ],
      "expectedPoints": [
        "Database-per-tenant: Maximum isolation and compliance; high infrastructure cost and complex migration management",
        "Schema-per-tenant: Good isolation in PostgreSQL, but scalability degrades as schema count exceeds thousands",
        "Shared Database with tenant_id: Maximum cost efficiency and simple pooling; requires strict Row-Level Security (RLS) policies to prevent cross-tenant data leaks",
        "Enforce tenant context via authenticated session claims passed down to database connection context (e.g., current_setting('app.tenant_id'))"
      ],
      "followUp": "How do you write a PostgreSQL RLS policy that ensures a user can only query rows matching their tenant_id?"
    },
    {
      "question": "How do you implement optimistic UI updates with resilient rollback handling for mission-critical interactions like comments, likes, and carts?",
      "type": "technical",
      "tips": [
        "Walk through TanStack Query / RTK Query onMutate, onError, onSettled lifecycle",
        "Discuss temporary client-generated IDs",
        "Explain server reconciliation"
      ],
      "expectedPoints": [
        "Capture current cache snapshot in onMutate before dispatching network request",
        "Immediately update local cache state with speculative data using temporary UUID or optimistic flag",
        "If mutation succeeds, update cache with canonical server response (true ID, server timestamps)",
        "If mutation fails, revert cache to snapshot in onError and display non-blocking error toast with retry action"
      ],
      "followUp": "How do you handle an optimistic update if subsequent dependent mutations occur before the first mutation resolves?"
    },
    {
      "question": "What is your automated testing pyramid strategy across unit, integration, and end-to-end (E2E) tests in a modern full-stack application?",
      "type": "technical",
      "tips": [
        "Discuss Jest/Vitest for unit tests, Supertest / Testcontainers for integration tests, Playwright for E2E",
        "Explain mocking boundaries"
      ],
      "expectedPoints": [
        "Unit Tests (Vitest): Pure business logic, utilities, validation schemas, and critical math calculations; ultra-fast with zero external I/O",
        "Integration Tests: Server endpoints, database queries, and repository layers tested against real containerized test databases (Testcontainers / Docker)",
        "E2E Tests (Playwright): Critical user journeys (authentication, checkout, core editor workflows) running against realistic staging environments",
        "Mock only external third-party APIs (Stripe, Twilio, SendGrid), never internal database queries in integration tests"
      ],
      "followUp": "Why is testing against real test databases with Testcontainers preferred over in-memory SQLite mocks for PostgreSQL applications?"
    },
    {
      "question": "How do you implement secure payment processing with webhook signature verification, transaction reconciliation, and idempotent fulfillment?",
      "type": "technical",
      "tips": [
        "Discuss Cashfree / Stripe checkout session lifecycle",
        "Explain HMAC-SHA256 signature verification on raw request body",
        "Explain double-entry bookkeeping and ledger models"
      ],
      "expectedPoints": [
        "Never trust client-side checkout completion callbacks; always fulfill orders via verified server-to-server webhooks",
        "Verify webhook signature using gateway secret and unparsed raw request buffer before processing payload",
        "Implement webhook idempotency by logging event ID in a processed_events table with unique constraint",
        "Reconcile pending transactions via scheduled cron job querying payment gateway status APIs to handle dropped webhooks"
      ],
      "followUp": "Why must webhook signature verification be executed on the raw byte buffer rather than JSON-parsed request body?"
    },
    {
      "question": "How do you architect CI/CD deployment pipelines, automated database migrations, preview environments, and rollbacks for a high-velocity full-stack team?",
      "type": "technical",
      "tips": [
        "Walk through GitHub Actions workflow",
        "Explain Docker container builds and image tagging",
        "Discuss blue-green / preview deployment strategies"
      ],
      "expectedPoints": [
        "Automated CI checks: Linting, type checks (tsc --noEmit), unit/integration test suites, and security dependency scanning on every pull request",
        "Ephemeral preview environments with isolated test database branches for PR review and QA sign-off",
        "Continuous Deployment: Automated backward-compatible database migrations before container rollout",
        "Rollback strategy: Decouple code deployment from feature release using feature flags (LaunchDarkly, Unleash)"
      ],
      "followUp": "How do feature flags enable trunk-based development without long-lived feature branches?"
    }
  ],
  "dataScience": [
    {
      "question": "How do you address severe class imbalance in machine learning classification problems, and what evaluation metrics do you prioritize?",
      "type": "technical",
      "tips": [
        "Discuss resampling (SMOTE, under-sampling), class weights, focal loss",
        "Explain why Accuracy is misleading",
        "Highlight PR-AUC vs ROC-AUC"
      ],
      "expectedPoints": [
        "Accuracy is deceptive on imbalanced data (e.g. 99% accuracy by predicting only majority class on 1% fraud dataset)",
        "Techniques: Class-weighted loss functions (e.g. scale_pos_weight in XGBoost), SMOTE/ADASYN synthetic oversampling, or threshold calibration",
        "Evaluation metrics: Precision-Recall AUC (PR-AUC), F1-Score (or F-beta when recall is more critical), and Matthews Correlation Coefficient (MCC)",
        "Cost-sensitive learning: Assign different financial costs to false positives vs false negatives in business risk models"
      ],
      "followUp": "When should you use PR-AUC instead of ROC-AUC when evaluating a model on imbalanced data?"
    },
    {
      "question": "Explain the Bias-Variance Tradeoff, how it relates to underfitting and overfitting, and the mathematical and architectural techniques you use to achieve optimal generalization.",
      "type": "technical",
      "tips": [
        "Decompose expected generalization error into bias^2 + variance + irreducible error",
        "Discuss regularization (L1, L2, ElasticNet, Dropout, Early Stopping)"
      ],
      "expectedPoints": [
        "Total Error = Bias^2 + Variance + Irreducible Error; high bias causes underfitting (oversimplified), high variance causes overfitting (memorizing noise)",
        "Mitigate High Variance: Regularization (L1 Lasso for sparsity, L2 Ridge for weight shrinking), tree depth limits, Dropout in neural nets, more training data, and data augmentation",
        "Mitigate High Bias: Increase model capacity, add non-linear features, reduce regularization penalties, and engineer domain-specific features",
        "Validation: K-Fold Cross-Validation ensures evaluation metrics reflect generalizability across diverse data slices"
      ],
      "followUp": "How does L1 regularization mathematically induce feature sparsity compared to L2 regularization?"
    },
    {
      "question": "What is your systematic process for feature engineering, handling missing data, and preventing data leakage in production ML pipelines?",
      "type": "technical",
      "tips": [
        "Explain why preprocessing transformations must be fitted ONLY on the training split",
        "Discuss imputation strategies, target encoding, and out-of-fold calculation"
      ],
      "expectedPoints": [
        "Data leakage occurs when information from test/validation set (or future temporal periods) is inadvertently used during model training",
        "All scalers (StandardScaler), encoders (TargetEncoder), and imputers must be fitted strictly on the training partition and transformed on test/val partitions",
        "Missing data: Distinguish MCAR, MAR, and MNAR; use KNN/IterativeImputer for continuous variables or domain-specific missingness indicator flags",
        "Time-series: Always use temporal walk-forward splits (TimeSeriesSplit) rather than random shuffling to prevent future-to-past data leakage"
      ],
      "followUp": "What is target leakage, and how does Out-of-Fold (OOF) target encoding prevent it?"
    },
    {
      "question": "Compare Random Forests, XGBoost/LightGBM, and Deep Neural Networks: how do you choose the right model family for tabular vs unstructured data?",
      "type": "technical",
      "tips": [
        "Discuss boosting vs bagging",
        "Explain gradient boosting on decision trees (GBDT) efficiency on tabular data",
        "Discuss representation learning in deep learning"
      ],
      "expectedPoints": [
        "Tabular data: Gradient Boosted Decision Trees (XGBoost, LightGBM, CatBoost) consistently outperform deep learning due to inductive biases, handling mixed data types, and robustness to outliers",
        "Random Forest (Bagging): Reduces variance by averaging uncorrelated deep trees; highly parallelizable and resistant to overfitting",
        "Deep Learning: Superior for unstructured data (images, text, audio) where hierarchical representation learning extracts latent feature representations",
        "Inference constraints: Tree models offer ultra-low latency CPU inference (<5ms) compared to GPU requirements for deep neural networks"
      ],
      "followUp": "What architectural innovations allow LightGBM to train significantly faster than standard XGBoost?"
    },
    {
      "question": "How do transformer architectures and self-attention mechanisms work, and how do you fine-tune Pre-trained Foundation Models (LLMs) using PEFT and LoRA?",
      "type": "technical",
      "tips": [
        "Explain Query, Key, Value computation in Scaled Dot-Product Attention",
        "Discuss why full fine-tuning is computationally prohibitive",
        "Explain Low-Rank Adaptation (LoRA)"
      ],
      "expectedPoints": [
        "Self-Attention computes Softmax(QK^T / sqrt(d_k)) * V, dynamically weighting relationships between all tokens regardless of distance",
        "Full fine-tuning updates all billions of model parameters, requiring massive VRAM and compute infrastructure",
        "LoRA (Low-Rank Adaptation) freezes original pre-trained weights W_0 and injects trainable rank-decomposition matrices A and B (delta W = B * A) where rank r << d",
        "Drastically reduces trainable parameters by 99% while achieving near-identical domain adaptation performance with minimal memory overhead"
      ],
      "followUp": "How does QLoRA achieve 4-bit quantization while maintaining model performance during fine-tuning?"
    },
    {
      "question": "What is your approach to Model Explainability and Interpretability in production machine learning using SHAP (Shapley Additive Explanations) and LIME?",
      "type": "technical",
      "tips": [
        "Explain game-theoretic foundation of Shapley values",
        "Distinguish global feature importance from local prediction attribution",
        "Discuss regulatory compliance (fair lending, healthcare)"
      ],
      "expectedPoints": [
        "TreeSHAP computes exact Shapley values from cooperative game theory, attributing fair marginal contribution of each feature to the difference between base prediction and final output",
        "Global explainability: Summary plots, feature interaction values, and dependence plots reveal macroeconomic model behavior",
        "Local explainability: Force plots and waterfall charts show why a specific applicant was approved or rejected",
        "LIME fits an interpretable linear surrogate model locally around a specific prediction instance"
      ],
      "followUp": "Why do standard Gini feature importances in Random Forests often bias toward high-cardinality continuous features?"
    },
    {
      "question": "How do you design, execute, and analyze an online A/B testing experiment, and how do you handle statistical significance, sample size, and variance reduction?",
      "type": "technical",
      "tips": [
        "Discuss null hypothesis (H0), p-values, Type I and Type II errors",
        "Explain minimum detectable effect (MDE) and power analysis",
        "Mention CUPED variance reduction"
      ],
      "expectedPoints": [
        "Power Analysis: Calculate sample size beforehand using significance level alpha (0.05), statistical power (1 - beta = 0.8), baseline conversion, and Minimum Detectable Effect (MDE)",
        "Avoid peeking problem: Repeatedly checking p-values inflates false positive rate (Type I error); use fixed-horizon testing or Sequential Testing frameworks",
        "Variance Reduction (CUPED): Leverage pre-experiment user data as a covariate to dramatically reduce metric variance and shorten experiment duration",
        "Guardrail metrics: Track latency, churn, or error rates alongside primary conversion metrics to ensure business stability"
      ],
      "followUp": "What is Simpson's Paradox, and how can it cause an A/B test to show positive lift overall while losing in every sub-segment?"
    },
    {
      "question": "How do you build and maintain a production MLOps pipeline for continuous training, automated testing, model registry, and monitoring data/concept drift?",
      "type": "technical",
      "tips": [
        "Differentiate Data Drift (P(X) changes) from Concept Drift (P(Y|X) changes)",
        "Mention Kolmogorov-Smirnov test and Population Stability Index (PSI)",
        "Discuss model registry (MLflow) and shadow deployments"
      ],
      "expectedPoints": [
        "Data Drift: Input feature distributions shift over time; detected via Population Stability Index (PSI) or Kolmogorov-Smirnov statistical tests",
        "Concept Drift: The underlying statistical relationship between features and target changes; detected via degradation in ground-truth performance metrics",
        "Model Registry: MLflow or Vertex AI manages versioned artifacts, metadata, evaluation benchmark logs, and staging/production transition gates",
        "Deployment strategies: Shadow deployments (replicate live traffic to new model without serving predictions) and canary rollouts"
      ],
      "followUp": "How do you monitor and measure model degradation in production when ground-truth labels take 30 days to arrive?"
    },
    {
      "question": "How do you architect a Retrieval-Augmented Generation (RAG) system with vector databases, semantic search, hybrid retrieval, and re-ranking?",
      "type": "technical",
      "tips": [
        "Explain document chunking strategies",
        "Contrast dense vector embeddings with sparse BM25 keyword search",
        "Discuss cross-encoder re-ranking and hallucination mitigation"
      ],
      "expectedPoints": [
        "Chunking: Semantic, token-aware, or markdown-aware chunking with sliding window overlap preserves context boundaries",
        "Hybrid Search: Combine dense semantic vector embeddings (HNSW index, cosine similarity) with sparse keyword matching (BM25) using Reciprocal Rank Fusion (RRF)",
        "Re-ranking: Pass top-N candidates through a cross-encoder model (e.g. Cohere Rerank, BGE-Reranker) to evaluate precise query-document relevance",
        "Context synthesis: Constrain LLM prompt with strict grounded system instructions and source citation requirements to eliminate hallucinations"
      ],
      "followUp": "What is the difference between bi-encoders and cross-encoders in retrieval systems, and why do we use both?"
    },
    {
      "question": "How do you frame, explore, and solve an unstructured business problem using data science, from initial discovery to production ROI measurement?",
      "type": "technical",
      "tips": [
        "Use structured problem decomposition",
        "Translate vague business goals ('reduce churn') into concrete predictive targets",
        "Highlight communication with non-technical stakeholders"
      ],
      "expectedPoints": [
        "Problem Translation: Deconstruct vague goals into measurable objectives (e.g., predict 30-day user churn probability with >80% precision at top decile)",
        "Exploratory Data Analysis: Identify data quality issues, survivorship bias, and business process artifacts in raw logs",
        "Iterative Baseline: Start with simple heuristic and linear baselines before deploying complex models to quantify incremental ROI",
        "Operationalization & Feedback: Integrate model scores into CRM actions (automated outreach) and measure incremental lift via randomized holdout groups"
      ],
      "followUp": "How do you prove that a machine learning model generated incremental business revenue rather than just predicting users who would have purchased anyway?"
    }
  ],
  "devops": [
    {
      "question": "How do you design modular, production-grade Infrastructure as Code (IaC) using Terraform, and how do you manage remote state, drift, and secrets securely?",
      "type": "technical",
      "tips": [
        "Discuss S3/GCS remote backends with state locking",
        "Explain Terraform modules hierarchy",
        "Discuss state file security and drift detection automation"
      ],
      "expectedPoints": [
        "Remote Backend: Store state in versioned, encrypted object storage (S3 / GCS) with distributed locking (DynamoDB) to prevent concurrent modifications",
        "Modularity: Structure reusable modules with clear input variables, output contracts, and pinned provider versions",
        "State Security: State files contain unencrypted sensitive values; restrict IAM access, use KMS customer-managed keys, and pass secrets from Vault/AWS Secrets Manager",
        "Drift Detection: Run automated periodic 'terraform plan -detailed-exitcode' in CI to alert on unmanaged manual cloud changes"
      ],
      "followUp": "How do you import existing unmanaged cloud resources into a Terraform state file safely?"
    },
    {
      "question": "Explain the core architecture of Kubernetes: how do the Control Plane and Worker Nodes interact, and how does a Pod transition from scheduling to running?",
      "type": "technical",
      "tips": [
        "Cover API Server, etcd, Kube-Scheduler, Kube-Controller-Manager",
        "Explain Kubelet, Container Runtime (CRI), and Kube-Proxy on worker nodes"
      ],
      "expectedPoints": [
        "Control Plane: API Server (central entry point), etcd (distributed consensus key-value store), Scheduler (assigns pods to nodes), Controller Manager (reconciles desired state)",
        "Worker Nodes: Kubelet (node agent reporting to API server), Container Runtime (containerd/CRI-O executing containers), Kube-Proxy (manages iptables/IPVS networking)",
        "Pod Lifecycle: Deployment created in API server -> etcd writes record -> Scheduler assigns node -> Kubelet detects binding -> pulls image -> starts container -> readiness probe passes -> endpoint registered in Service"
      ],
      "followUp": "What happens to the cluster and running workloads if the entire Kubernetes Control Plane goes down temporarily?"
    },
    {
      "question": "Compare deployment strategies in Kubernetes: Rolling Updates, Blue/Green, and Canary deployments. How do you implement automated canary analysis with progressive delivery?",
      "type": "technical",
      "tips": [
        "Discuss traffic routing with Service Mesh / Ingress",
        "Explain Argo Rollouts or Flagger",
        "Mention automated rollback on error budget burn"
      ],
      "expectedPoints": [
        "Rolling Update: Incremental replacement of old pods with new pods; zero downtime, but multiple versions run simultaneously",
        "Blue/Green: Two identical environments running side-by-side; switch traffic instantaneously at router/DNS; high infrastructure cost",
        "Canary Deployment: Shift small percentage (e.g. 5% -> 25% -> 100%) of real user traffic to new version while monitoring metrics",
        "Progressive Delivery (Argo Rollouts): Automates canary steps, querying Prometheus for error rates and latency, triggering instant rollback if SLOs degrade"
      ],
      "followUp": "How does a service mesh like Istio route 10% of HTTP traffic to a canary deployment when both share the same Kubernetes service?"
    },
    {
      "question": "How do you optimize Docker container builds for production security, minimal layer size, and rapid CI/CD caching?",
      "type": "technical",
      "tips": [
        "Explain multi-stage builds",
        "Discuss distroless and alpine base images",
        "Explain non-root user execution and layer order caching"
      ],
      "expectedPoints": [
        "Multi-stage builds: Separate build environment (compilers, devDependencies, SDKs) from lean runtime production stage",
        "Base Images: Use minimal distroless or alpine base images to minimize attack surface and reduce CVE vulnerability count",
        "Layer Ordering: Place least frequently changed instructions (package.json, dependency install) before application code to maximize cache hits",
        "Security: Never run as root (USER nonroot), mount root filesystem as read-only where possible, and scan images with Trivy or Grype in CI"
      ],
      "followUp": "Why does running containers as the root user present a severe container breakout vulnerability?"
    },
    {
      "question": "How do you design secure Cloud Networking architecture: VPCs, subnets, NAT Gateways, Security Groups, and Transit Gateways?",
      "type": "technical",
      "tips": [
        "Distinguish public vs private subnets",
        "Explain egress vs ingress routing",
        "Discuss VPC peering vs Transit Gateway"
      ],
      "expectedPoints": [
        "Public vs Private Subnets: Only internet-facing load balancers reside in public subnets with Internet Gateways; application servers and databases live in isolated private subnets",
        "NAT Gateways: Allow private instances to initiate outbound internet connections (for updates, external APIs) without exposing inbound access",
        "Security Groups (Stateful) vs Network ACLs (Stateless): Security groups operate at ENI instance level; NACLs act as subnet-level packet filters",
        "Private Connectivity: Use VPC Endpoints / PrivateLink to access cloud services (S3, Secrets Manager) over internal cloud backbone without traversing public internet"
      ],
      "followUp": "What is the difference between a stateful Security Group and a stateless Network ACL in AWS/GCP?"
    },
    {
      "question": "What is the Site Reliability Engineering (SRE) framework: how do you define SLIs, SLOs, and SLAs, and how do you manage error budgets in practice?",
      "type": "technical",
      "tips": [
        "Define Service Level Indicator (SLI), Service Level Objective (SLO), Service Level Agreement (SLA)",
        "Explain error budget policy and burn rate alerting"
      ],
      "expectedPoints": [
        "SLI: Quantifiable metric measuring service performance (e.g. % of successful HTTP requests with latency < 200ms over 30 days)",
        "SLO: Target goal agreed upon by engineering and product (e.g. 99.9% availability)",
        "SLA: Contractual commitment to external clients with financial penalties if breached (e.g. 99.5%)",
        "Error Budget: Remaining allowable downtime/failure (0.1% for 99.9% SLO); when exhausted, feature deployments halt and team prioritizes reliability engineering"
      ],
      "followUp": "How does multi-window multi-burn-rate alerting improve on traditional static threshold alerts?"
    },
    {
      "question": "How do you build a secure, automated CI/CD pipeline using GitHub Actions or GitLab CI, and how do you protect against pipeline supply-chain attacks?",
      "type": "technical",
      "tips": [
        "Discuss OIDC (OpenID Connect) vs static cloud access keys",
        "Explain pinned action hashes, secret masking, and branch protection rules"
      ],
      "expectedPoints": [
        "OIDC Authentication: Eliminate long-lived cloud credentials (AWS_SECRET_ACCESS_KEY) by using short-lived cryptographic OIDC tokens exchanged with cloud IAM roles",
        "Action Pinning: Pin third-party GitHub Actions to immutable full commit SHAs rather than mutable branch/tag references",
        "Isolated Runner Environments: Run builds in clean ephemeral container runners without persistent access to other build contexts",
        "Branch Protection: Require signed commits, mandatory peer review approvals, and passing automated CI status checks before merge"
      ],
      "followUp": "How does OpenID Connect (OIDC) allow GitHub Actions to authenticate with AWS or GCP without storing credentials in repository secrets?"
    },
    {
      "question": "How do you architect a centralized observability stack using Prometheus, Grafana, Loki/Fluentd, and Jaeger/Tempo?",
      "type": "technical",
      "tips": [
        "Explain pull vs push metrics architecture",
        "Discuss label cardinality risks in Prometheus",
        "Explain log aggregation without high index overhead in Loki"
      ],
      "expectedPoints": [
        "Metrics: Prometheus scrapes pull-based metrics endpoints (/metrics) in OpenMetrics format, storing time-series data with PromQL querying",
        "High Cardinality Warning: Avoid storing unbounded dynamic identifiers (user_ids, IP addresses) in Prometheus metric labels to prevent OOM crash",
        "Logs: Loki indexes only log metadata/labels rather than full text, dramatically lowering storage costs while streaming raw logs into Grafana",
        "Traces: Correlate metrics alerts directly with trace IDs in Grafana dashboards to pinpoint exact failing distributed spans"
      ],
      "followUp": "Why does high label cardinality cause Prometheus memory consumption to explode?"
    },
    {
      "question": "What is your Disaster Recovery (DR) and Business Continuity strategy: compare Backup & Restore, Pilot Light, Warm Standby, and Multi-Region Active-Active.",
      "type": "technical",
      "tips": [
        "Define RTO (Recovery Time Objective) and RPO (Recovery Point Objective)",
        "Explain data replication challenges across geographical regions",
        "Discuss Chaos Engineering"
      ],
      "expectedPoints": [
        "RPO (Recovery Point Objective): Maximum acceptable data loss duration; RTO (Recovery Time Objective): Maximum acceptable downtime duration",
        "Backup & Restore: Lowest cost, highest RTO/RPO (hours/days); Pilot Light: Core database replicated, minimal compute scaled up on failure",
        "Warm Standby: Scaled-down version of full stack running in secondary region; fast failover (minutes)",
        "Active-Active Multi-Region: Traffic distributed globally via Route53 / Cloudflare; near-zero RTO/RPO, but complex distributed database synchronization and consistency challenges"
      ],
      "followUp": "How do you handle split-brain scenarios when a network partition separates two active data centers?"
    },
    {
      "question": "How do you manage secrets, certificates, and identity federation in cloud-native applications using HashiCorp Vault or Cloud Secret Managers?",
      "type": "technical",
      "tips": [
        "Discuss dynamic secrets vs static credentials",
        "Explain automatic secret rotation",
        "Mention Kubernetes Secrets Store CSI driver and cert-manager"
      ],
      "expectedPoints": [
        "Dynamic Secrets: Vault generates just-in-time, short-lived database credentials that automatically expire and self-revoke after lease termination",
        "Kubernetes Secrets Store CSI Driver: Mounts cloud secrets (AWS Secrets Manager, Azure Key Vault) directly into Pod volumes as ephemeral in-memory files without persisting in etcd",
        "Automated Certificate Management: cert-manager automates Let's Encrypt TLS certificate provisioning, ACME HTTP-01 / DNS-01 challenges, and 60-day renewals",
        "Zero Trust: Service-to-service communication authenticated using mutual TLS (mTLS) with SPIFFE/SPIRE cryptographically verifiable workload identities"
      ],
      "followUp": "What are the security risks of storing native Kubernetes Secret resources without etcd encryption at rest?"
    }
  ],
  "mobile": [
    {
      "question": "What are the architectural and performance trade-offs between Native (Swift/Kotlin) and Cross-Platform (Flutter/React Native) mobile development?",
      "type": "technical",
      "tips": [
        "Discuss bridge/JNI overhead vs Skia/Impeller direct rendering",
        "Explain time-to-market, platform-specific APIs, and maintenance",
        "Mention startup time and app binary size"
      ],
      "expectedPoints": [
        "Native (Swift/Kotlin): Direct hardware access, immediate day-1 support for new OS features, maximum 120 FPS performance, and smallest binary size",
        "Flutter: Compiles to native ARM machine code with custom rendering engine (Impeller/Skia); completely custom UI consistency, but larger APK/IPA base size",
        "React Native (New Architecture): Replaced legacy asynchronous JSON bridge with JSI (JavaScript Interface), TurboModules, and Fabric renderer for synchronous native C++ invocation",
        "Decision framework: Choose native for hardware-intensive apps (AR, audio processing, background GPS); cross-platform for standard data-driven consumer apps with shared business logic"
      ],
      "followUp": "How does React Native's JSI (JavaScript Interface) improve communication compared to the old asynchronous JSON bridge?"
    },
    {
      "question": "Explain the lifecycle of an Android Activity/Fragment vs an iOS UIViewController/SwiftUI View, and how you prevent memory leaks during configuration changes.",
      "type": "technical",
      "tips": [
        "Walk through Android onCreate -> onResume -> onDestroy",
        "Walk through iOS viewDidLoad -> viewDidAppear -> viewDidDisappear",
        "Discuss configuration changes (screen rotation) and ViewModel persistence"
      ],
      "expectedPoints": [
        "Android Activity: Created -> Started -> Resumed (foreground/interactive) -> Paused -> Stopped -> Destroyed",
        "Android Configuration Changes (e.g. rotation): Destroys and recreates Activity by default; state preserved via ViewModel (survives recreation) and SavedStateHandle",
        "iOS UIViewController: loadView -> viewDidLoad -> viewWillAppear -> viewDidAppear -> viewWillDisappear -> viewDidDisappear -> deinit",
        "SwiftUI: Declarative struct views recomputed frequently based on state changes (@State, @StateObject, @Observable); state retained by framework lifecycle"
      ],
      "followUp": "How does Android's ViewModel survive Activity recreation while the Activity context is destroyed?"
    },
    {
      "question": "How does memory management work on mobile platforms: compare Automatic Reference Counting (ARC) in Swift with Garbage Collection in Kotlin/Java, and how do you diagnose retain cycles?",
      "type": "technical",
      "tips": [
        "Explain strong, weak, and unowned references in Swift",
        "Explain GC generational heap in Android",
        "Mention Xcode Memory Graph and LeakCanary"
      ],
      "expectedPoints": [
        "iOS (ARC): Compile-time deterministic reference counting; memory freed immediately when reference count reaches zero; susceptible to retain cycles in closures and delegates",
        "Retain Cycle Solution (iOS): Use [weak self] or [unowned self] in closures to break cyclic strong references",
        "Android (JVM GC): Runtime generational garbage collector (Young/Old generation); traces object reachability from GC roots; immune to simple cyclic reference leaks",
        "Diagnosis: Xcode Instruments (Leaks, Allocations, Memory Graph Debugger) on iOS; LeakCanary and Android Studio Memory Profiler on Android"
      ],
      "followUp": "What is the difference between 'weak' and 'unowned' references in Swift, and when would using 'unowned' cause a runtime crash?"
    },
    {
      "question": "How do you architect a resilient, offline-first mobile application with local database caching, background sync, and conflict resolution?",
      "type": "technical",
      "tips": [
        "Discuss local databases (Room / CoreData / SwiftData / SQLite)",
        "Explain sync engines and optimistic UI",
        "Discuss Android WorkManager and iOS BackgroundTasks"
      ],
      "expectedPoints": [
        "Single Source of Truth: UI always observes local database (Room on Android, CoreData/SwiftData on iOS) via reactive streams (Flow / Combine / AsyncSequence)",
        "Repository Pattern: Dispatches network fetch in background, writes response to local DB; UI updates automatically via database observation",
        "Offline Mutations: Append actions to an encrypted pending_operations queue and trigger background synchronization workers when network becomes available",
        "Conflict Resolution: Client-wins, Server-wins, or timestamp-based last-write-wins (LWW), with manual user intervention for conflicting collaborative edits"
      ],
      "followUp": "How does Android WorkManager ensure background tasks run even if the app process is killed or the device reboots?"
    },
    {
      "question": "What techniques do you employ to achieve smooth 60/120 FPS scrolling performance in complex, media-heavy list views on mobile?",
      "type": "technical",
      "tips": [
        "Discuss view recycling (RecyclerView, UICollectionView)",
        "Explain asynchronous image decoding and caching",
        "Discuss avoiding layout thrashing and heavy operations on the main thread"
      ],
      "expectedPoints": [
        "View Recycling: Reuse view holders and item cells rather than instantiating new view hierarchies during scrolling",
        "Main Thread Hygiene: Keep main UI thread strictly for layout and rendering; offload JSON parsing, disk I/O, and cryptographic operations to background threads (Coroutines / Grand Central Dispatch)",
        "Image Optimization: Downsample images to target display dimensions before decoding; use LRU memory and disk caches (Glide/Coil on Android, Kingfisher/Nuke on iOS)",
        "Flatten View Hierarchy: Avoid nested layouts; leverage ConstraintLayout on Android or simplified view hierarchies in Compose/SwiftUI"
      ],
      "followUp": "Why does decoding a large 4K image file into a small 100x100 avatar view cause severe jank and out-of-memory (OOM) crashes on mobile?"
    },
    {
      "question": "How do you secure mobile applications: sensitive data storage, SSL certificate pinning, biometric authentication, and reverse engineering protection?",
      "type": "technical",
      "tips": [
        "Compare iOS Keychain vs Android EncryptedSharedPreferences / Keystore",
        "Explain Certificate Pinning and MITM mitigation",
        "Discuss ProGuard/R8 and jailbreak/root detection"
      ],
      "expectedPoints": [
        "Secure Storage: Never store tokens or PII in UserDefaults or SharedPreferences; use iOS Keychain (hardware Secure Enclave) and Android Keystore with EncryptedSharedPreferences",
        "Network Security: Implement SSL/TLS certificate or public key pinning (TrustKit / Network Security Config) to block Man-in-the-Middle (MITM) proxy inspection",
        "Biometrics: LocalAuthentication (iOS) and BiometricPrompt (Android) backed by cryptographic challenge verification rather than simple boolean checks",
        "Code Hardening: Obfuscate code with ProGuard/R8, strip symbols, and integrate root/jailbreak detection libraries"
      ],
      "followUp": "What happens if a pinned SSL certificate expires on the server and your app does not have a dynamic fallback mechanism?"
    },
    {
      "question": "How do you implement reliable remote push notifications and deep linking architectures on iOS (APNs) and Android (FCM)?",
      "type": "technical",
      "tips": [
        "Explain APNs and FCM token registration lifecycle",
        "Discuss notification payload limits and background silent pushes",
        "Explain Universal Links (iOS) and App Links (Android)"
      ],
      "expectedPoints": [
        "Token Registration: App registers with APNs/FCM at startup, transmits device push token to backend server, updating on token invalidation",
        "Payloads: Standard display notifications vs background silent pushes (content-available: 1 / high priority) to trigger background sync within execution time limits",
        "Universal Links (iOS) & App Links (Android): Use domain-associated entitlement files (apple-app-site-association / assetlinks.json) for cryptographically verified deep links directly into specific app screens",
        "Deep Link Routing: Centralized coordinator/navigator parses incoming URI, verifies authentication state, and routes to appropriate backstack destination"
      ],
      "followUp": "Why are Universal Links more secure and reliable than custom URL schemes (e.g. myapp://)?"
    },
    {
      "question": "Explain modern state management patterns in mobile development: MVI (Model-View-Intent) and MVVM with Jetpack Compose and SwiftUI.",
      "type": "technical",
      "tips": [
        "Discuss Uni-directional Data Flow (UDF)",
        "Explain State vs Events/Intents vs Side-Effects",
        "Discuss immutable state rendering"
      ],
      "expectedPoints": [
        "Uni-directional Data Flow (UDF): View emits User Intents -> ViewModel processes intent with business logic -> emits single immutable UI State -> View renders state",
        "State Hoisting: Keep composables stateless by passing state down and bubbling events up, making UI components testable and reusable",
        "Side-Effect Management: Encapsulate asynchronous operations in LaunchedEffect / task modifiers that cancel automatically when composables leave the screen",
        "Testability: Pure ViewModel functions can be tested in isolation with mock state assertions without running emulator or UI instrumentation"
      ],
      "followUp": "How do you handle one-time UI events (like showing a Toast or navigating) in a strictly immutable MVI architecture?"
    },
    {
      "question": "How do you automate mobile CI/CD pipelines, code signing, and distribution using Fastlane, GitHub Actions, TestFlight, and Google Play Internal Track?",
      "type": "technical",
      "tips": [
        "Discuss Fastlane Match for iOS certificates and provisioning profiles",
        "Explain Android Keystore signing and Gradle automation",
        "Discuss automated screenshot generation and beta releases"
      ],
      "expectedPoints": [
        "iOS Code Signing: Use Fastlane Match to encrypt and synchronize provisioning profiles and distribution certificates in a secure Git repository",
        "Android Signing: Securely store release keystores in CI environment secrets and inject credentials into Gradle build tasks during automated assembly",
        "Automated Lanes: Fastlane lanes trigger linting, unit tests, build compilation (ipa/aab), and automatic upload to Apple TestFlight and Google Play Internal Testing",
        "Versioning: Automatically increment semantic build numbers using Git commit count or CI run numbers to avoid collision"
      ],
      "followUp": "Why does the Google Play Store require Android App Bundles (AAB) instead of standard APK files for new app releases?"
    },
    {
      "question": "How do you minimize battery consumption, thermal throttling, and background execution restrictions on modern Android and iOS devices?",
      "type": "technical",
      "tips": [
        "Discuss iOS background execution modes and BackgroundTasks framework",
        "Discuss Android Doze mode and App Standby Buckets",
        "Explain location tracking batching and network bundling"
      ],
      "expectedPoints": [
        "Location Batching: Use FusedLocationProvider / CLLocationManager with deferred updates, significant location changes, and geofencing rather than continuous GPS polling",
        "Network Optimization: Coalesce network requests into single bursts so radio chips can return to low-power idle state quickly",
        "OS Restrictions: iOS strictly terminates background tasks exceeding background time allowances; Android Doze mode restricts network and alarms during inactivity",
        "Diagnostic profiling: Use Android Battery Historian and Xcode Energy Gauge to identify wake-lock leaks and CPU consumption spikes"
      ],
      "followUp": "What is a wake-lock leak in Android, and how does it cause severe battery drain even when the device screen is off?"
    }
  ],
  "pm": [
    {
      "question": "How do you prioritize a product backlog when engineering, sales, and executive leadership have conflicting feature requests and deadlines?",
      "type": "behavioral",
      "tips": [
        "Use prioritization frameworks (RICE, Kano Model, MoSCoW)",
        "Focus on company strategic objectives and customer value",
        "Explain stakeholder management and saying 'no' constructively"
      ],
      "expectedPoints": [
        "Framework Application: Evaluate competing opportunities using RICE (Reach, Impact, Confidence, Effort) to establish objective comparative scoring",
        "Strategic Alignment: Map feature proposals directly to current quarterly company OKRs and North Star business goals",
        "Constructive Alignment: Say 'not now' with clear data-driven reasoning rather than subjective dismissal; communicate trade-offs explicitly ('If we build X, we delay Y')",
        "Balanced Portfolio: Reserve explicit team capacity allocations for feature innovation (60%), technical debt/infrastructure (20%), and tactical sales requests (20%)"
      ],
      "followUp": "How do you handle a scenario where an enterprise client threatens to churn unless a custom bespoke feature is built immediately?"
    },
    {
      "question": "How do you define the North Star Metric (NSM) for a tech product, and how do you establish supporting input metrics and counter-metrics?",
      "type": "technical",
      "tips": [
        "Explain what makes an effective North Star Metric",
        "Distinguish leading vs lagging indicators",
        "Explain why counter-metrics are critical to prevent unintended harm"
      ],
      "expectedPoints": [
        "North Star Metric captures core customer value delivery and serves as the leading indicator of long-term sustainable business revenue (e.g. Spotify: Time spent listening)",
        "Input Metrics: Actionable, high-leverage levers that product squads can influence day-to-day (Breadth, Depth, Frequency, Quality)",
        "Counter-Metrics: Protect against optimizing one metric at the expense of another (e.g. optimizing click-through rate with clickbait degrades retention and customer trust)",
        "Avoid Vanity Metrics: Registered users or page views measure activity rather than sustained customer value"
      ],
      "followUp": "What would be the ideal North Star Metric, input metrics, and counter-metric for Learnify AI?"
    },
    {
      "question": "Walk through your methodology for conducting customer discovery interviews, synthesizing user feedback, and identifying the true root problem.",
      "type": "behavioral",
      "tips": [
        "Follow 'The Mom Test' principles (ask about past behavior, not hypothetical futures)",
        "Explain Jobs-to-be-Done (JTBD) framework",
        "Discuss qualitative vs quantitative triangulation"
      ],
      "expectedPoints": [
        "Interview Technique: Ask open-ended questions about concrete past behaviors ('Tell me about the last time you tried to...') rather than opinions or hypothetical commitments ('Would you buy...')",
        "Jobs-to-be-Done (JTBD): Identify the functional, emotional, and social job the user is 'hiring' the product to accomplish",
        "Root Cause Analysis: Apply 5 Whys to dig past surface-level feature requests to uncover the fundamental operational blocker",
        "Synthesis: Categorize findings into pain points, workarounds, and unstated needs; validate qualitative interview signals with quantitative product analytics"
      ],
      "followUp": "How do you avoid building 'faster horses' when customers ask for specific feature implementations?"
    },
    {
      "question": "How do you design, execute, and evaluate an A/B test, and what decisions do you make when the results are statistically inconclusive or mixed?",
      "type": "technical",
      "tips": [
        "Formulate clear hypothesis",
        "Define primary success metric and guardrail metrics",
        "Explain segmentation analysis and qualitative follow-up"
      ],
      "expectedPoints": [
        "Hypothesis Formulation: 'If we [implement change] for [user segment], we will see [metric increase] because [user psychology rationale]'",
        "Pre-Experiment Alignment: Agree in advance on minimum sample size, experiment duration (accounting for day-of-week seasonality), and target confidence level",
        "Analyzing Inconclusive Results: Segment by user cohort (new vs returning, mobile vs desktop, geography); an aggregate neutral result often hides positive gains in one group and negative drag in another",
        "Decision Matrix: If metrics are neutral but the new variant simplifies codebase or brand alignment, ship it; if complexity increases with zero measurable lift, roll it back"
      ],
      "followUp": "How do you distinguish between a novel novelty effect and true long-term conversion lift in an A/B test?"
    },
    {
      "question": "Describe your end-to-end Go-To-Market (GTM) launch strategy for a major new product capability, including cross-functional coordination.",
      "type": "technical",
      "tips": [
        "Break into Pre-Launch, Launch, Post-Launch",
        "Coordinate Engineering, Marketing, Sales, Customer Support, Legal",
        "Explain phased rollout tiers"
      ],
      "expectedPoints": [
        "Phased Rollout: Internal alpha dogfooding -> Closed beta with key advisory customers -> Open beta -> Phased GA percentage rollout (10% -> 50% -> 100%)",
        "Enablement: Train customer support on common troubleshooting scenarios, provide sales with battlecards and demo scripts, and update documentation",
        "Marketing Coordination: Align product storytelling with demand-gen campaigns, email announcements, changelogs, and product hunt / social launches",
        "Post-Launch Review: Monitor adoption metrics, error logs, support ticket volume, and run a 30-day post-mortem to evaluate whether success targets were met"
      ],
      "followUp": "What is your immediate escalation protocol if a newly launched flagship feature causes widespread customer complaints on social media?"
    },
    {
      "question": "How do you manage an unexpected critical production outage or major security vulnerability from a product management perspective?",
      "type": "behavioral",
      "tips": [
        "Focus on communication, prioritization, and customer transparency",
        "Shield engineering from external noise",
        "Lead blameless post-mortem"
      ],
      "expectedPoints": [
        "Triage & Shielding: Form incident command; shield engineers from external stakeholder interruptions so they can focus on mitigation",
        "Transparent Communication: Maintain clear status updates on customer status pages and draft immediate proactive customer advisories with realistic ETAs",
        "Impact Assessment: Quantify affected users, potential data exposure, and revenue loss to inform executive leadership and legal teams",
        "Blameless Post-Mortem: Document timeline, root causes, contributing factors, and establish P0 corrective action items with designated owners"
      ],
      "followUp": "How do you balance fixing preventive technical debt after an outage against planned roadmap deliverables?"
    },
    {
      "question": "How do you assess engineering feasibility and collaborate effectively with technical architects when scoping complex initiatives?",
      "type": "behavioral",
      "tips": [
        "Bring problems, not predetermined technical solutions",
        "Understand architectural trade-offs",
        "Negotiate MVP scope without compromising product vision"
      ],
      "expectedPoints": [
        "Problem-First Collaboration: Bring engineers into discovery early; frame discussions around customer problems and constraints rather than prescribing implementation details",
        "Trade-off Literacy: Understand the cost difference between 99% and 99.99% availability, synchronous vs asynchronous architectures, and tech debt implications",
        "Scope Negotiation: Break complex epics into vertical slices that deliver end-to-end user value quickly while deferring non-essential automation",
        "Respect Estimation Nuance: Treat engineering estimates as ranges under uncertainty rather than immutable binding commitments"
      ],
      "followUp": "How do you handle an engineering estimate that comes back 4x higher than expected for a high-priority feature?"
    },
    {
      "question": "How do you develop a dynamic 6-to-12 month product roadmap that balances executive vision, customer feedback, and technical maintenance?",
      "type": "technical",
      "tips": [
        "Avoid fixed-date Gantt charts",
        "Use outcome-based roadmaps (Now / Next / Later)",
        "Tie every theme to measurable business outcomes"
      ],
      "expectedPoints": [
        "Outcome-Driven Structure: Organize roadmaps around user outcomes and strategic business themes rather than rigid feature checklists with arbitrary dates",
        "Now / Next / Later: Now (high certainty, active sprint execution), Next (scoped problem spaces in validation), Later (broad directional research aligned with vision)",
        "Capacity Allocation: Allocate explicit capacity for core growth bets, customer delights, and foundational platform health / security",
        "Continuous Cadence: Review and refresh roadmap quarterly with cross-functional leadership, communicating pivots transparently"
      ],
      "followUp": "How do you communicate a major roadmap pivot to executive stakeholders who were committed to the previous direction?"
    },
    {
      "question": "How do you evaluate pricing and packaging strategies for a SaaS product (e.g. Freemium vs Free Trial vs Usage-Based vs Tiered Subscriptions)?",
      "type": "technical",
      "tips": [
        "Analyze customer willingness to pay and value metrics",
        "Discuss CAC, LTV, churn, and expansion revenue",
        "Explain cannibalization risks"
      ],
      "expectedPoints": [
        "Value Metric: Price according to how customers consume and extract value (e.g. per seat, per gigabyte, per AI token, per transaction)",
        "Freemium vs Free Trial: Freemium drives viral bottom-up acquisition when product has high network effects and low marginal serving cost; Free Trial works best for complex enterprise workflows",
        "Packaging Tiers: Group features by target persona (Starter for individuals, Pro for growing teams, Enterprise for security/compliance SSO and SLAs)",
        "Unit Economics: Continuously monitor LTV:CAC ratio (target > 3:1) and net revenue retention (NRR) driven by expansion tiers"
      ],
      "followUp": "When should a SaaS company transition from flat-rate subscription pricing to usage-based pricing?"
    },
    {
      "question": "How do you make the difficult decision to sunset a legacy feature or product line, and how do you execute the deprecation smoothly?",
      "type": "behavioral",
      "tips": [
        "Evaluate maintenance cost vs usage data",
        "Communicate migration timelines with empathy",
        "Provide automated migration paths or data exports"
      ],
      "expectedPoints": [
        "Data-Driven Decision: Compare usage metrics, support ticket overhead, and maintenance tax against the strategic cost of maintaining legacy code",
        "Stakeholder Communication: Announce deprecation with extensive advance notice (3 to 6 months minimum) and detailed migration documentation",
        "Migration Assistance: Provide automated migration tools, CSV data export capabilities, or equivalent feature parity in the modern replacement",
        "Phased Deprecation: Restrict new user signups first, deprecate API access with deprecation headers, and execute final shutdown with clear customer support channels"
      ],
      "followUp": "What do you do if your largest enterprise customer refuses to migrate away from a feature scheduled for deprecation?"
    }
  ],
  "designer": [
    {
      "question": "How do you architect and scale an enterprise design system in Figma, and how do you bridge design tokens seamlessly into developer code?",
      "type": "technical",
      "tips": [
        "Explain design token hierarchy (Global -> Semantic -> Component)",
        "Discuss Figma variables, auto-layout, and component variants",
        "Mention translation to CSS variables and Tailwind tokens"
      ],
      "expectedPoints": [
        "Token Architecture: Primitive tokens (raw hex values, base spacing) -> Semantic tokens (surface-primary, text-muted, border-focus) -> Component-level tokens",
        "Figma Structure: Utilize Variables, Auto-Layout 5.0, Component Properties, and Variants to ensure components match flexbox/grid layout realities",
        "Design-to-Code Pipeline: Export tokens automatically using Style Dictionary or Tokens Studio into platform-agnostic JSON, generating Tailwind CSS variables and iOS/Android constants in CI",
        "Governance: Establish contribution guidelines, deprecation lifecycles, and a cross-functional design review board to prevent fragmented component sprawl"
      ],
      "followUp": "How do you enforce accessibility contrast checks automatically inside your design token pipeline?"
    },
    {
      "question": "How do you design responsive web and mobile interfaces that adapt fluidly across mobile, tablet, desktop, and ultra-wide displays without sacrificing usability?",
      "type": "technical",
      "tips": [
        "Discuss mobile-first philosophy",
        "Explain fluid typography (clamp()) vs fixed breakpoints",
        "Discuss ergonomic touch targets vs mouse precision"
      ],
      "expectedPoints": [
        "Mobile-First Mindset: Design the most constrained viewport first to prioritize essential content and actions before expanding layout across wider screens",
        "Fluid Layouts & Typography: Use CSS clamp(), min(), and max() functions for harmonious typography scaling alongside container-aware components",
        "Ergonomics: Touch targets must meet minimum 44x44px (iOS) or 48x48dp (Android) hit areas with thumb-zone optimization; desktop interfaces leverage hover states and keyboard shortcuts",
        "Navigation Adaptation: Collapse primary desktop navigation into bottom navigation bars or drawer sheets on mobile to preserve vertical reading space"
      ],
      "followUp": "How do container queries change how you think about designing reusable responsive components?"
    },
    {
      "question": "How do you embed WCAG 2.1 AA accessibility into your UX design workflow from initial wireframes to high-fidelity prototypes?",
      "type": "technical",
      "tips": [
        "Discuss color contrast ratios (4.5:1 text, 3:1 UI elements)",
        "Explain non-color dependent state indicators",
        "Discuss focus visible states and screen reader ordering"
      ],
      "expectedPoints": [
        "Contrast Compliance: Ensure 4.5:1 minimum contrast for body text and 3:1 for large headers and graphical UI elements against their background",
        "Multi-Modal Feedback: Never rely exclusively on color to convey state (e.g. error inputs need an icon and descriptive helper text alongside red border)",
        "Focus States & Hierarchy: Design prominent focus rings for keyboard navigators and define logical reading order for screen readers",
        "Accessible Forms: Provide persistent visible labels, clear error states with aria-describedby guidance, and explicit helper instructions"
      ],
      "followUp": "How do you design an accessible data visualization or complex chart for color-blind users?"
    },
    {
      "question": "What qualitative and quantitative user research methodologies do you conduct throughout the double diamond design process?",
      "type": "technical",
      "tips": [
        "Distinguish generative research from evaluative usability testing",
        "Discuss tree testing, card sorting, heuristic evaluation, and click heatmaps"
      ],
      "expectedPoints": [
        "Discover (Generative): Contextual inquiries, user interviews, and diary studies to uncover unmet needs and user mental models",
        "Define (Synthesis): Affinity diagramming, empathy maps, user journey mapping, and persona development based on empirical observations",
        "Develop (Ideation): Low-fidelity sketching, card sorting, and prototype wireframing to explore divergent concepts",
        "Deliver (Evaluative): Moderated and unmoderated usability testing, tree testing for information architecture, and telemetry heatmap analysis post-launch"
      ],
      "followUp": "How do you conduct usability testing on a prototype when you only have access to 5 participants?"
    },
    {
      "question": "How do you leverage motion design, micro-interactions, and animations to enhance usability rather than create superficial visual clutter?",
      "type": "technical",
      "tips": [
        "Explain animation principles (easing curves, duration, spatial continuity)",
        "Discuss reducing cognitive load and providing feedback",
        "Mention prefers-reduced-motion accessibility"
      ],
      "expectedPoints": [
        "Purposeful Motion: Animations must provide spatial orientation (e.g. modals expanding from click source), visual confirmation of actions, and progressive disclosure",
        "Timing & Curves: UI micro-interactions should complete within 150ms-300ms using natural easing curves (cubic-bezier ease-out) to feel crisp and responsive",
        "State Feedback: Button loading spinners, subtle shake on validation errors, and checkmark morphs provide instant acknowledgment without modal interruption",
        "Accessibility: Respect user OS preferences by providing simplified instant transitions under @media (prefers-reduced-motion: reduce)"
      ],
      "followUp": "Why do linear animations feel unnatural to users in digital user interfaces?"
    },
    {
      "question": "How do you design complex, data-heavy dashboard interfaces (like analytics or financial platforms) that prevent cognitive overload?",
      "type": "technical",
      "tips": [
        "Discuss information hierarchy and progressive disclosure",
        "Explain table ergonomics (fixed headers, column customization, pagination vs infinite scroll)",
        "Discuss empty and loading states"
      ],
      "expectedPoints": [
        "Progressive Disclosure: Show high-level summary KPIs upfront; provide drill-down capabilities into deeper granular data on demand",
        "Table Ergonomics: Sticky column and header rows, right-aligned numeric data, monospace numbers for vertical scanning, and clear filtering facets",
        "Empty States: Design actionable empty states that guide user toward first-time setup rather than displaying vacant gray grids",
        "Loading Skeletons: Use layout-matched skeleton shimmer loaders to preserve visual structure and minimize perceived latency"
      ],
      "followUp": "When is server-paginated data navigation superior to infinite scroll in enterprise data applications?"
    },
    {
      "question": "How do you collaborate seamlessly with frontend engineers during design handoff, QA inspection, and design system implementation?",
      "type": "behavioral",
      "tips": [
        "Document edge cases, loading, error, empty, truncated states",
        "Maintain shared vocabulary via design tokens",
        "Participate in visual QA and sprint reviews"
      ],
      "expectedPoints": [
        "Comprehensive State Specs: Always document all component states in Figma: default, hover, focused, active, disabled, loading, empty, error, and extreme text overflow",
        "Shared Vocabulary: Use identical naming conventions between Figma component variants and React/TypeScript props",
        "Design QA: Conduct visual and interaction audits on staging builds before features are approved for production release",
        "Empathy for Code Constraints: Understand CSS flexbox/grid mechanics to design layouts that map cleanly to semantic HTML"
      ],
      "followUp": "How do you resolve a disagreement with an engineer who claims a key design interaction is too difficult to implement?"
    },
    {
      "question": "How do you structure Information Architecture (IA), intuitive navigation models, and wayfinding across a large multi-product web application?",
      "type": "technical",
      "tips": [
        "Discuss top-level vs sidebar navigation",
        "Explain breadcrumbs, global search, and mental models",
        "Discuss card sorting validation"
      ],
      "expectedPoints": [
        "Mental Model Alignment: Group concepts according to user task workflows rather than internal company organizational chart silos",
        "Navigation Hierarchy: Global persistent navigation for macro contexts, breadcrumb trails for hierarchical wayfinding, and localized tabs for in-page views",
        "Command Palettes & Global Search: Provide keyboard-first command bars (Cmd+K) for power users navigating deep application trees",
        "Validation: Use open and closed card sorting to test category grouping and tree testing to measure task success rates without visual bias"
      ],
      "followUp": "What are the UX trade-offs between a persistent left sidebar navigation and a horizontal top navigation bar?"
    },
    {
      "question": "How do you balance aesthetic delight with Conversion Rate Optimization (CRO) in onboarding, checkout, and landing page funnels?",
      "type": "technical",
      "tips": [
        "Discuss reducing friction and cognitive load",
        "Explain visual hierarchy, contrast for CTAs, and trust signals",
        "Mention psychological principles (Hick's Law, Fitts's Law, Social Proof)"
      ],
      "expectedPoints": [
        "Friction Reduction: Minimize form input fields (one piece of information at a time in multi-step wizards) to reduce drop-off according to Hick's Law",
        "Visual Anchor: The primary call-to-action (CTA) must have the highest visual contrast on the screen with clear value-driven copy ('Start Free Trial' vs 'Submit')",
        "Trust Architecture: Position testimonials, security badges, social proof, and transparent billing assurances directly adjacent to commitment conversion moments",
        "Fitts's Law: Make primary conversion actions prominent and easy to acquire with minimal cursor travel or thumb stretch"
      ],
      "followUp": "Why do multi-step onboarding forms often have higher completion rates than single long-page forms?"
    },
    {
      "question": "How do you facilitate productive design critiques, defend user-centric design decisions, and incorporate feedback from non-design executives?",
      "type": "behavioral",
      "tips": [
        "Ground feedback in user research and business goals, not personal taste",
        "Frame critique around problems to solve",
        "Separate exploratory feedback from execution polish"
      ],
      "expectedPoints": [
        "Objective Framing: Anchor design critiques around user goals, target metrics, and constraints rather than subjective aesthetic preferences",
        "Evidence-Based Defense: Back design decisions with user research recordings, usability testing data, and accessibility compliance rules",
        "Active Listening: Uncover the underlying business concern behind prescriptive stakeholder feedback ('Make the logo bigger' often means 'Increase brand visibility')",
        "Iterative Next Steps: Document agreed actionable trade-offs and clearly communicate what will be explored in the next iteration"
      ],
      "followUp": "How do you respond when an executive says 'I personally don't like this color or layout' during a design review?"
    }
  ]
};

export function getRoleKey(roleInput: string): string {
  const lower = (roleInput || "").toLowerCase().trim();
  if (lower === "frontend" || lower.includes("front")) return "frontend";
  if (lower === "backend" || lower.includes("back")) return "backend";
  if (lower === "fullstack" || lower.includes("full") || lower.includes("stack")) return "fullstack";
  if (lower === "datascience" || lower.includes("data") || lower.includes("scientist") || lower.includes("machine learning") || lower.includes("ai ")) return "dataScience";
  if (lower.includes("devops") || lower.includes("sre") || lower.includes("cloud") || lower.includes("infra") || lower.includes("platform")) return "devops";
  if (lower.includes("mobile") || lower.includes("android") || lower.includes("ios") || lower.includes("flutter") || lower.includes("react native") || lower.includes("swift") || lower.includes("kotlin")) return "mobile";
  if (lower === "pm" || lower.includes("product")) return "pm";
  if (lower === "designer" || lower.includes("design") || lower.includes("ui") || lower.includes("ux")) return "designer";
  return "custom";
}

export function getDefaultQuestionForRole(roleTitle: string, idx: number): Question {
  const key = getRoleKey(roleTitle);
  if (key !== "custom" && PRESET_QUESTIONS[key]?.length) {
    const list = PRESET_QUESTIONS[key];
    return list[idx % list.length];
  }

  const cleanTitle = (roleTitle || "").trim() || "Software Engineer";
  const customFallbacks: Question[] = [
    {
      question: `As a ${cleanTitle}, walk me through your end-to-end process for designing robust, scalable solutions and handling critical production edge cases.`,
      type: "technical",
      tips: ["Highlight requirements discovery and architecture", "Discuss testing and trade-offs", "Provide a concrete past project example"],
      expectedPoints: [
        `Core architecture and requirements definition for ${cleanTitle}`,
        "Modular design, decoupling, and maintainability",
        "Failure modes, error handling, and reliability",
        "Post-deployment observability and continuous improvement",
      ],
      followUp: "How do you measure whether this solution was successful in production?",
    },
    {
      question: `Describe a high-stakes technical or organizational challenge you faced as a ${cleanTitle}. How did you resolve conflicting priorities?`,
      type: "behavioral",
      tips: ["Use the STAR framework (Situation, Task, Action, Result)", "Explain stakeholder communication", "Quantify the outcome achieved"],
      expectedPoints: [
        "Identified the core technical root cause and business trade-offs",
        "Facilitated cross-functional alignment across team members",
        "Delivered an incremental, low-risk phased resolution",
        "Extracted long-term systemic preventive measures",
      ],
      followUp: "What would you do differently if you faced this exact scenario today?",
    },
    {
      question: `What key metrics, tooling, and operational practices do you rely on to maintain high quality and velocity in your role as a ${cleanTitle}?`,
      type: "technical",
      tips: ["Discuss automated testing and CI/CD", "Explain monitoring and telemetry", "Mention code reviews and standards"],
      expectedPoints: [
        "Continuous integration, automated linting, and comprehensive test suites",
        "Real-time observability, alerting thresholds, and logs",
        "Technical documentation and shared team knowledge bases",
        "Performance benchmarks and security hygiene standards",
      ],
      followUp: "How do you balance rapid delivery against accumulating technical debt?",
    },
  ];

  return customFallbacks[idx % customFallbacks.length];
}
