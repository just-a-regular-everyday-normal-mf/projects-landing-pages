const fs = require('fs');
const path = require('path');

const projects = [
    {
        id: "saas-boilerplate", title: "Multi-Tenant SaaS Boilerplate Project",
        tagline: "Production-ready SaaS starter with schema-level multi-tenancy, subscription billing, team management, and white-labelling.",
        desc: "A capstone project that integrates every service in the ecosystem into one deployable SaaS product. Tenants get isolated PostgreSQL schemas, configurable feature flags per subscription tier, team invite flows, usage metering, and custom domain support.",
        howItWorks: "Tenant contexts are intercepted via HTTP headers and propagated using ThreadLocals. Hibernate filters and an AbstractRoutingDataSource dynamically switch PostgreSQL schemas per request before any database transaction begins.",
        whoIsItFor: "B2B SaaS founders and enterprise engineering teams who need strict data isolation for their corporate clients without managing separate database instances.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot 3.3, Spring Data JPA (AbstractRoutingDataSource)" },
            { label: "Frontend", value: "Next.js 14 (App Router), Tailwind CSS, shadcn/ui" },
            { label: "Database", value: "PostgreSQL (schema-per-tenant), Redis, RabbitMQ" }
        ]
    },
    {
        id: "banking-ledger", title: "Event Sourcing Banking Ledger Project",
        tagline: "A bank account simulation built on Event Sourcing and CQRS — every transaction is an immutable event.",
        desc: "Demonstrates Event Sourcing and CQRS at their most natural domain — banking. Every deposit, withdrawal, and transfer is stored as an immutable event. Transfers between accounts are implemented as sagas with compensation on failure.",
        howItWorks: "State is never mutated directly. Transactions are published to RabbitMQ as domain events. The read-model listens to these events to update a materialized view, while the write-model derives the exact balance by replaying historical events from the immutable store.",
        whoIsItFor: "FinTech engineers and financial institutions that require 100% auditable, immutable ledgers where historical state reconstruction is mandatory.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot 3.3, RabbitMQ" },
            { label: "Frontend", value: "Angular 17, RxJS" },
            { label: "Patterns", value: "Event Sourcing, CQRS, Saga, Snapshot optimisation" }
        ]
    },
    {
        id: "rate-limiter", title: "Distributed Rate Limiter Project",
        tagline: "Standalone rate limiting service with pluggable algorithms, tiered quotas, and a Spring Boot starter SDK.",
        desc: "A generalised rate limiting platform any application plugs into. Implements sliding window, token bucket, fixed window, and leaky bucket algorithms — configurable per rule. Real-time analytics dashboard with live request metrics.",
        howItWorks: "The custom SDK intercepts incoming API requests and executes highly optimized Lua scripts directly inside a Redis cluster. This ensures that checking and decrementing quotas happens atomically, preventing race conditions under high concurrency.",
        whoIsItFor: "API developers and platform teams who need to protect downstream microservices from DDoS attacks or implement tiered pricing plans based on API usage.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot 3.3, Redis Lua scripts" },
            { label: "Delivery", value: "Spring Boot Starter SDK" },
            { label: "Database", value: "Oracle Autonomous DB, Redis (counters)" }
        ]
    },
    {
        id: "payment-gateway", title: "Payment Gateway Service Project",
        tagline: "Provider-agnostic payment abstraction with idempotency, webhook verification, and an append-only ledger.",
        desc: "Single API for payments across Razorpay and PayPal using the Strategy pattern. Every payment request is idempotent. Webhooks are signature-verified and exactly-once processed.",
        howItWorks: "The Gateway utilizes the Strategy pattern to route requests dynamically to different provider SDKs. Idempotency keys are cached in Redis to prevent duplicate charges, and Spring Batch runs nightly jobs to reconcile gateway logs against the internal ledger.",
        whoIsItFor: "E-commerce platforms and SaaS businesses that need to seamlessly swap or support multiple payment gateways without rewriting checkout logic.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot 3.3, Spring Batch" },
            { label: "Frontend", value: "Next.js 14, Tailwind CSS" },
            { label: "Patterns", value: "Strategy pattern, Idempotency, Append-only ledger" }
        ]
    },
    {
        id: "collab-editor", title: "Real-Time Collaborative Document Editor Project",
        tagline: "Google Docs lite — multiple users edit simultaneously with conflict-free real-time sync via CRDTs.",
        desc: "A high-performance collaborative text editor allowing multiple users to edit the same document simultaneously without race conditions.",
        howItWorks: "Keystrokes are converted into mathematical operations using Yjs (a CRDT implementation) and broadcasted via WebSockets. The backend acts as a dumb relay, while the client-side CRDT engine deterministically resolves concurrent edits to guarantee eventual consistency.",
        whoIsItFor: "Remote teams, content creators, and enterprise internal tools looking for Google Docs-level real-time multiplayer collaboration.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot 3.3, WebSockets" },
            { label: "Frontend", value: "React 18, Yjs (CRDT implementation)" },
            { label: "Infrastructure", value: "Docker, Oracle Cloud ARM" }
        ]
    },
    {
        id: "tracing-platform", title: "Distributed Tracing Platform Project",
        tagline: "OpenTelemetry-compatible trace aggregator to visualise request flows across all microservices.",
        desc: "Collects OpenTelemetry spans from every service in the ecosystem and reconstructs complete distributed traces. Visualises service dependency maps, latency percentiles (P50/P90/P99), and error rates.",
        howItWorks: "Microservices are instrumented with OpenTelemetry agents that push OTLP data to the receiver. The platform parses the W3C Trace Contexts, stitches spans together by Parent ID, and visualizes the complete Directed Acyclic Graph (DAG) of the request flow using D3.js.",
        whoIsItFor: "DevOps engineers, SREs, and backend developers debugging latency bottlenecks or silent failures across complex microservice architectures.",
        fullStack: [
            { label: "Backend", value: "Java 17, OpenTelemetry Protocol (OTLP) receiver" },
            { label: "Frontend", value: "React 18, D3.js" },
            { label: "Database", value: "PostgreSQL (traces, spans), Redis" }
        ]
    },
    {
        id: "rag-pipeline", title: "RAG Pipeline as a Service Project",
        tagline: "Private knowledge base engine powered by vector search and Gemini with token streaming.",
        desc: "Upload PDFs, URLs, or text. The service chunks the content, generates embeddings via Gemini, and stores them in PostgreSQL with pgvector.",
        howItWorks: "Apache Tika extracts text from uploaded files, which is semantically chunked and passed to Gemini to generate high-dimensional vectors. A cosine similarity search in pgvector retrieves the closest context chunks, which are then fed to an LLM to generate a grounded, hallucination-free response.",
        whoIsItFor: "Enterprises with proprietary data (legal docs, internal wikis, manuals) who want ChatGPT-like capabilities without exposing their data to public models.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring AI, Apache PDFBox" },
            { label: "Frontend", value: "Next.js 14 (chat interface)" },
            { label: "AI & DB", value: "Google Gemini API, PostgreSQL + pgvector" }
        ]
    },
    {
        id: "ecommerce", title: "E-Commerce Platform Project",
        tagline: "Production-grade multi-vendor shopping platform with real-time inventory and a full checkout pipeline.",
        desc: "A complete e-commerce ecosystem covering product catalogue, inventory management, cart, multi-step checkout, order lifecycle, seller portal, and review system.",
        howItWorks: "Product catalogues are served via SSR in Next.js for SEO. During high-concurrency events (Flash Sales), Redis distributed locks are utilized to decrement inventory atomically, preventing the classic 'overselling' problem.",
        whoIsItFor: "Retailers and independent brands looking for a scalable, highly available online storefront capable of surviving flash-sale traffic spikes.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot 3.3, RabbitMQ" },
            { label: "Frontend", value: "Next.js 14, Tailwind CSS" },
            { label: "Database", value: "PostgreSQL, Redis (locks & sessions)" }
        ]
    },
    {
        id: "llm-workflow", title: "LLM Workflow Automation Engine Project",
        tagline: "Visual drag-and-drop workflow builder using AI nodes for conditional routing and generation.",
        desc: "Build multi-step automated workflows visually. Nodes include webhook triggers, HTTP requests, LLM classification, and conditions.",
        howItWorks: "The frontend React Flow canvas compiles a Directed Acyclic Graph (DAG). The backend executor evaluates the graph topologically, dropping tasks into a RabbitMQ cluster for async execution. AI nodes dynamically prompt Gemini to classify or transform the payload mid-flight.",
        whoIsItFor: "Operations, marketing, and data teams wanting to automate repetitive tasks with built-in AI reasoning (e.g., auto-classifying and routing support tickets).",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot 3.3, RabbitMQ" },
            { label: "Frontend", value: "React 18, React Flow" },
            { label: "AI", value: "Google Gemini API (decision nodes)" }
        ]
    },
    {
        id: "healthcare-app", title: "Healthcare Appointment System Project",
        tagline: "Doctor booking platform with HIPAA-aware audit logs and WebRTC video consultations.",
        desc: "End-to-end appointment booking covering doctor availability templates, conflict-safe slot reservation, and WebRTC video consultations.",
        howItWorks: "Personally Identifiable Information (PII) is encrypted at the column level via AES-256. Interceptors log every database read/write to a tamper-evident audit table. Video consultations use WebSockets for signaling to establish peer-to-peer WebRTC connections.",
        whoIsItFor: "Clinics, telehealth startups, and independent medical practitioners requiring secure, compliant patient management and remote consultation tools.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot 3.3, WebSocket" },
            { label: "Frontend", value: "Angular 17, RxJS" },
            { label: "Security", value: "AES-256 PII encryption, audit logging" }
        ]
    },
    {
        id: "job-board", title: "Job Board Platform Project",
        tagline: "Marketplace with advanced full-text search, skill matching, and Gemini-powered resume parsing.",
        desc: "Marketplace where companies post jobs and candidates apply. Features advanced full-text job search, application state machine, and Gemini-powered resume parsing.",
        howItWorks: "When a PDF is uploaded, Gemini extracts structured JSON data (skills, experience). A PostgreSQL full-text search index allows recruiters to search millions of resumes efficiently, while Spring Batch runs nightly to match new candidates against open roles.",
        whoIsItFor: "HR agencies, recruiters, and corporate talent acquisition teams aiming to automate the initial screening and matching phase of hiring.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot 3.3, Spring Batch" },
            { label: "Frontend", value: "React 18, React Query" },
            { label: "AI & DB", value: "Google Gemini API, PostgreSQL (Full-Text Search)" }
        ]
    },
    {
        id: "iot-pipeline", title: "IoT Data Pipeline & Dashboard Project",
        tagline: "High-throughput sensor data ingestion via Kafka with real-time monitoring and alerting.",
        desc: "A streaming data pipeline designed to handle vast amounts of telemetry data from simulated IoT devices, processing streams on the fly to detect anomalies.",
        howItWorks: "Edge devices stream thousands of messages per second into Apache Kafka topics. Spring Boot consumers aggregate this data over time windows, saving historical metrics to a time-series database while pushing real-time threshold alerts to the dashboard via WebSockets.",
        whoIsItFor: "Manufacturing, logistics, and smart-city operators needing to monitor fleet health and prevent hardware failures before they occur.",
        fullStack: [
            { label: "Backend", value: "Java 17, Apache Kafka, Spring Batch" },
            { label: "Frontend", value: "React 18, Recharts" },
            { label: "Infrastructure", value: "Docker, Cloudflare" }
        ]
    },
    {
        id: "api-gateway", title: "API Gateway Project",
        tagline: "Reactive entry point handling JWT validation, Resilience4j circuit breakers, and Redis caching.",
        desc: "Single entry point for the entire ecosystem. Built on Spring Cloud Gateway with WebFlux. Handles JWT validation centrally, applies Resilience4j circuit breakers, and caches GET responses in Redis.",
        howItWorks: "Utilizing Project Reactor for non-blocking I/O, the gateway intercepts requests, validates RSA signatures on JWTs natively, and routes traffic. If a downstream service latency spikes, the Resilience4j circuit breaker trips open to fail-fast and preserve system stability.",
        whoIsItFor: "Enterprise architectures with 10+ microservices that need centralized cross-cutting concerns (Auth, Rate Limiting, Caching) removed from individual services.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Cloud Gateway, Spring WebFlux" },
            { label: "Patterns", value: "Circuit breaker, API versioning" },
            { label: "Database", value: "Redis (caching), Oracle Autonomous DB" }
        ]
    },
    {
        id: "feature-flag", title: "Feature Flag Service Project",
        tagline: "LaunchDarkly alternative managing live rollouts and A/B tests via Server-Sent Events.",
        desc: "Applications register flags evaluated by user, environment, or custom rules. Supports percentage rollouts and A/B testing. Flag changes push to connected SDK clients in real-time.",
        howItWorks: "Downstream applications connect to this service using Server-Sent Events (SSE). When a product manager toggles a flag in the React dashboard, the backend broadcasts the change down the open HTTP connection, instantly updating the UI without a page reload.",
        whoIsItFor: "Product managers and CI/CD teams aiming to decouple code deployment from feature release, allowing for safe canary rollouts and trunk-based development.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot 3.3, Server-Sent Events" },
            { label: "Frontend", value: "React 18, Tailwind CSS" },
            { label: "Delivery", value: "Spring Boot Starter SDK" }
        ]
    },
    {
        id: "auth-service", title: "Auth Service Project",
        tagline: "Standalone JWT authentication and authorisation service exposing a JWKS endpoint for validation.",
        desc: "The security backbone. Issues RS256-signed JWTs, handles refresh token rotation, Google OAuth2, sliding window rate limiting, and exposes a JWKS endpoint for local token validation.",
        howItWorks: "Authenticates users and generates a JWT signed with an asymmetric RSA Private Key. Instead of making network calls to validate tokens, downstream services fetch the Public Key from the `/jwks` endpoint and cryptographically verify the token locally.",
        whoIsItFor: "Any distributed system requiring stateless, secure, and scalable authentication without bottlenecking a central database for token validation.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Security 6, Auth0 java-jwt" },
            { label: "Security", value: "RS256 asymmetric signing, RBAC, BCrypt" },
            { label: "OAuth2", value: "Google OAuth2 (Authorization Code Flow)" }
        ]
    },
    {
        id: "auth-starter", title: "Auth Client Starter Project",
        tagline: "Spring Boot auto-configuration library that instantly protects endpoints by validating JWTs locally.",
        desc: "A reusable Spring Boot starter that any service imports to get JWT validation for free. Fetches the Auth Service's RSA public key from the JWKS endpoint on startup.",
        howItWorks: "Hooks into the Spring Boot Auto-configuration phase. It sets up a standard Spring Security Filter Chain that intercepts incoming HTTP requests, decodes the JWT, verifies the RS256 signature using a cached public key, and injects the User Principal into the SecurityContextHolder.",
        whoIsItFor: "Internal backend teams who want to secure their microservices simply by adding a single Maven dependency, abstracting away complex security boilerplate.",
        fullStack: [
            { label: "Language", value: "Java 17" },
            { label: "Framework", value: "Spring Boot Auto-configuration, Spring Security" },
            { label: "Patterns", value: "Starter pattern, JWKS key caching, key rotation" }
        ]
    },
    {
        id: "notification-service", title: "Notification Service Project",
        tagline: "Unified asynchronous delivery across Email, SMS, and WebSockets from a single API call.",
        desc: "Any service sends one request; this service delivers across Email, SMS, and WebSocket-based in-app notifications. Features RabbitMQ async delivery, per-user preferences, and dead letter queuing.",
        howItWorks: "Requests are immediately persisted and dropped into RabbitMQ. Asynchronous workers consume the queue, compile Freemarker HTML templates, and dispatch to external providers (e.g., SendGrid/Twilio). Failures are routed to a Dead Letter Queue (DLQ) for exponential backoff retries.",
        whoIsItFor: "Platform ecosystems that need to centralize user communication preferences and guarantee message delivery regardless of external API outages.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring AMQP, WebSocket (STOMP)" },
            { label: "Messaging", value: "RabbitMQ (delivery queues, dead letter queue)" },
            { label: "Frontend", value: "React 18, Recharts" }
        ]
    },
    {
        id: "file-storage", title: "File Storage Service Project",
        tagline: "Unified object storage abstraction handling magic-byte validation, chunking, and pre-signed URLs.",
        desc: "Validates uploads by magic bytes (not extension), generates thumbnails/WebP variants, stores on Oracle Object Storage, serves via time-limited pre-signed URLs.",
        howItWorks: "To prevent malicious uploads, Apache Tika reads the file's binary headers (magic bytes) to verify MIME types. Files are streamed directly to Oracle Object Storage. For downloads, it generates temporary pre-signed URLs so clients download directly from the bucket, bypassing the backend.",
        whoIsItFor: "Content-heavy platforms (social media, document management) that need secure, scalable, and optimized media delivery.",
        fullStack: [
            { label: "Backend", value: "Java 17, Apache Tika, Thumbnailator" },
            { label: "Frontend", value: "Vue 3, Vite, Tailwind CSS" },
            { label: "Database", value: "Oracle Autonomous DB, Oracle Object Storage" }
        ]
    },
    {
        id: "chaos-tool", title: "Chaos Engineering Tool Project",
        tagline: "Fault injection utility using the Docker API to simulate container deaths and network latency.",
        desc: "A platform built to purposefully break microservices in a controlled manner via the Docker API to ensure fallback mechanisms and circuit breakers actually work.",
        howItWorks: "The tool connects directly to the host's Docker Daemon socket. Based on a schedule or manual trigger, it executes commands to randomly pause containers, restart them, or use Linux traffic control (`tc`) to inject artificial network latency into specific Docker networks.",
        whoIsItFor: "QA and Reliability Engineers executing Game Days to verify that the distributed system gracefully degrades rather than catastrophically failing during outages.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot, Docker API Integration" },
            { label: "Frontend", value: "React 18" },
            { label: "Patterns", value: "Chaos Engineering, Fault Injection" }
        ]
    },
    {
        id: "finance-tracker", title: "FinTech Personal Finance Tracker Project",
        tagline: "Personal finance dashboard with time-series data storage and AI-powered categorisation.",
        desc: "Supports multiple accounts, CSV import, Gemini-powered auto-categorisation, and net worth visualisation over time. All financial records are immutable — corrections via reversal entries.",
        howItWorks: "Raw CSV transactions are processed in bulk via Spring Batch. Uncategorized vendor strings (e.g., 'AMZN Mktp US') are batched and sent to Gemini with a strict JSON-schema prompt to return standard categories. PostgreSQL materialized views aggregate monthly time-series rollups.",
        whoIsItFor: "Individuals wanting absolute control over their budget data with the analytical power of LLMs to automatically organize messy bank statements.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Batch, Spring Data JPA" },
            { label: "Frontend", value: "Vue 3 (Composition API), Pinia, Chart.js" },
            { label: "AI & DB", value: "Google Gemini API, PostgreSQL (time-series)" }
        ]
    },
    {
        id: "code-review", title: "AI Code Review Assistant Project",
        tagline: "GitHub App that listens to webhooks and automatically posts AI-generated inline review comments.",
        desc: "Listens to GitHub Webhooks, fetches diffs, streams them to an LLM, and posts contextually aware code review feedback directly on the PR lines.",
        howItWorks: "A Cloudflare Tunnel exposes the local server to GitHub Webhooks. On a `pull_request` event, the app fetches the Git diff, parses the patch files, and feeds the code to Gemini with instructions to look for security flaws and anti-patterns. It then uses the GitHub API to post inline comments.",
        whoIsItFor: "Fast-moving engineering teams wanting an automated 'first pass' code review to catch obvious bugs before a human developer spends time looking at the PR.",
        fullStack: [
            { label: "Backend", value: "Java 17, Spring Boot, GitHub Apps API" },
            { label: "AI", value: "Google Gemini API" },
            { label: "Infrastructure", value: "Docker, Cloudflare Tunnels" }
        ]
    }
];

// Target directory paths relative to the template folder
const projectDir = path.join(__dirname, '../project');

// Ensure /project folder exists
if (!fs.existsSync(projectDir)){
    fs.mkdirSync(projectDir, { recursive: true });
}

// Read template file from the current directory
const templateHTMLPath = path.join(__dirname, 'template.html');
const templateHTML = fs.readFileSync(templateHTMLPath, 'utf8');

projects.forEach(proj => {
    const stackItemsHTML = proj.fullStack.map(item => `<li><strong>${item.label}:</strong> ${item.value}</li>`).join('\n                        ');
    
    // Replace logic (Issue 1 fixed: utilizing exact proj.title instead of .split('. ')[1])
    let outputHTML = templateHTML
        .replace(/\{\{SHORT_TITLE\}\}/g, proj.title) 
        .replace(/\{\{TITLE\}\}/g, proj.title)
        .replace(/\{\{TAGLINE\}\}/g, proj.tagline)
        .replace(/\{\{DESC\}\}/g, proj.desc)
        .replace(/\{\{HOW_IT_WORKS\}\}/g, proj.howItWorks)
        .replace(/\{\{WHO_IS_IT_FOR\}\}/g, proj.whoIsItFor)
        .replace(/\{\{STACK_ITEMS\}\}/g, stackItemsHTML)
        .replace(/\{\{LIVE_LINK\}\}/g, `https://${proj.id}.projects.gauravamarnani.in`)
        .replace(/\{\{CODE_LINK\}\}/g, `https://github.com/gauravamarnani/${proj.id}`);

    // Output to the higher-level project folder
    const outputPath = path.join(projectDir, `${proj.id}.html`);
    fs.writeFileSync(outputPath, outputHTML);
    console.log(`Generated: ../project/${proj.id}.html`);
});

console.log('All 21 Project files successfully generated in the /project folder!');