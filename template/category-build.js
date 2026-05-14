const fs = require('fs');
const path = require('path');

// Keep your exact same 'projects' array here
const projects = [
    { id: "saas-boilerplate", title: "Multi-Tenant SaaS Boilerplate", tagline: "Production-ready SaaS starter with schema-level multi-tenancy, subscription billing, and team management.", headlineStack: ["Spring Boot", "Next.js", "PostgreSQL", "Redis", "RabbitMQ"] },
    { id: "banking-ledger", title: "Event Sourcing Banking Ledger", tagline: "A bank account simulation built on Event Sourcing and CQRS — every transaction is an immutable event.", headlineStack: ["Spring Boot", "Angular", "PostgreSQL", "RabbitMQ", "CQRS"] },
    { id: "rate-limiter", title: "Distributed Rate Limiter", tagline: "Standalone rate limiting service with pluggable algorithms, tiered quotas, and a Spring Boot starter SDK.", headlineStack: ["Spring Boot", "React", "Redis", "Lua Scripting"] },
    { id: "payment-gateway", title: "Payment Gateway Service", tagline: "Provider-agnostic payment abstraction with idempotency, webhook verification, and an append-only ledger.", headlineStack: ["Spring Boot", "Next.js", "Razorpay", "PayPal", "Redis"] },
    { id: "collab-editor", title: "Real-Time Collaborative Document Editor", tagline: "Google Docs lite — multiple users edit simultaneously with conflict-free real-time sync via CRDTs.", headlineStack: ["Spring Boot", "React", "Yjs", "WebSocket"] },
    { id: "tracing-platform", title: "Distributed Tracing Platform", tagline: "OpenTelemetry-compatible trace aggregator to visualise request flows across all microservices.", headlineStack: ["Spring Boot", "React", "D3.js", "OpenTelemetry"] },
    { id: "rag-pipeline", title: "RAG Pipeline as a Service", tagline: "Private knowledge base engine powered by vector search and Gemini with token streaming.", headlineStack: ["Spring Boot", "Next.js", "pgvector", "Google Gemini", "Spring AI"] },
    { id: "ecommerce", title: "E-Commerce Platform", tagline: "Production-grade multi-vendor shopping platform with real-time inventory and a full checkout pipeline.", headlineStack: ["Spring Boot", "Next.js", "PostgreSQL", "Redis", "RabbitMQ"] },
    { id: "llm-workflow", title: "LLM Workflow Automation Engine", tagline: "Visual drag-and-drop workflow builder using AI nodes for conditional routing and generation.", headlineStack: ["Spring Boot", "React", "React Flow", "Google Gemini"] },
    { id: "healthcare-app", title: "Healthcare Appointment System", tagline: "Doctor booking platform with HIPAA-aware audit logs and WebRTC video consultations.", headlineStack: ["Spring Boot", "Angular", "PostgreSQL", "WebRTC", "WebSocket"] },
    { id: "job-board", title: "Job Board Platform", tagline: "Marketplace with advanced full-text search, skill matching, and Gemini-powered resume parsing.", headlineStack: ["Spring Boot", "React", "PostgreSQL", "Google Gemini", "Spring Batch"] },
    { id: "iot-pipeline", title: "IoT Data Pipeline & Dashboard", tagline: "High-throughput sensor data ingestion via Kafka with real-time monitoring and alerting.", headlineStack: ["Spring Boot", "React", "Apache Kafka", "Spring Batch"] },
    { id: "api-gateway", title: "API Gateway", tagline: "Reactive entry point handling JWT validation, Resilience4j circuit breakers, and Redis caching.", headlineStack: ["Spring Cloud Gateway", "WebFlux", "Resilience4j", "Redis"] },
    { id: "feature-flag", title: "Feature Flag Service", tagline: "LaunchDarkly alternative managing live rollouts and A/B tests via Server-Sent Events.", headlineStack: ["Spring Boot", "React", "Redis", "SSE", "PostgreSQL"] },
    { id: "auth-service", title: "Auth Service", tagline: "Standalone JWT authentication and authorisation service exposing a JWKS endpoint for validation.", headlineStack: ["Spring Boot", "Spring Security", "Redis", "JWT (RS256)"] },
    { id: "auth-starter", title: "Auth Client Starter", tagline: "Spring Boot auto-configuration library that instantly protects endpoints by validating JWTs locally.", headlineStack: ["Spring Boot Starter", "JWT", "JWKS", "Auto-configuration"] },
    { id: "notification-service", title: "Notification Service", tagline: "Unified asynchronous delivery across Email, SMS, and WebSockets from a single API call.", headlineStack: ["Spring Boot", "React", "RabbitMQ", "WebSocket"] },
    { id: "file-storage", title: "File Storage Service", tagline: "Unified object storage abstraction handling magic-byte validation, chunking, and pre-signed URLs.", headlineStack: ["Spring Boot", "Vue 3", "Oracle Object Storage", "Apache Tika"] },
    { id: "chaos-tool", title: "Chaos Engineering Tool", tagline: "Fault injection utility using the Docker API to simulate container deaths and network latency.", headlineStack: ["Spring Boot", "React", "Docker API", "Resilience4j"] },
    { id: "finance-tracker", title: "FinTech Personal Finance Tracker", tagline: "Personal finance dashboard with time-series data storage and AI-powered categorisation.", headlineStack: ["Spring Boot", "Vue 3", "PostgreSQL", "Google Gemini"] },
    { id: "code-review", title: "AI Code Review Assistant", tagline: "GitHub App that listens to webhooks and automatically posts AI-generated inline review comments.", headlineStack: ["Spring Boot", "React", "Google Gemini", "GitHub Webhooks"] }
];

const categories = [
    {
        id: "bfsi-quants",
        title: "Core BFSI & Capital Markets",
        desc: "Architectures optimized for strict ACID compliance, zero-downtime, and event-driven data ingestion.",
        projectIds: ["banking-ledger", "payment-gateway", "rate-limiter", "chaos-tool", "api-gateway", "tracing-platform", "auth-service"]
    },
    {
        id: "payments-wealthtech",
        title: "Payments & WealthTech",
        desc: "High-throughput transaction processing, secure ledger states, and idempotency logic.",
        projectIds: ["payment-gateway", "finance-tracker", "banking-ledger", "rate-limiter", "auth-service", "api-gateway"]
    },
    {
        id: "ecommerce-retail",
        title: "High-Scale E-Commerce & D2C",
        desc: "Distributed caching, catalog management, and surviving extreme traffic spikes during flash sales.",
        projectIds: ["ecommerce", "rate-limiter", "notification-service", "payment-gateway", "file-storage", "feature-flag", "api-gateway", "auth-service"]
    },
    {
        id: "mobility-food",
        title: "Mobility, Food & Hyper-Local",
        desc: "Real-time state tracking, WebSockets, dynamic API routing, and event streaming.",
        projectIds: ["rate-limiter", "notification-service", "banking-ledger", "api-gateway", "llm-workflow", "tracing-platform", "auth-service"]
    },
    {
        id: "logistics-supplychain",
        title: "Logistics & Supply Chain",
        desc: "Physical event streaming, pipeline observability, and automated workflow processing.",
        projectIds: ["iot-pipeline", "tracing-platform", "banking-ledger", "notification-service", "llm-workflow", "api-gateway", "file-storage"]
    },
    {
        id: "adtech-gaming",
        title: "AdTech, MarTech & Gaming",
        desc: "Sub-50ms latency implementations, feature toggles, and high-throughput real-time state management.",
        projectIds: ["rate-limiter", "feature-flag", "collab-editor", "iot-pipeline", "chaos-tool", "tracing-platform"]
    },
    {
        id: "media-travel",
        title: "Media, Streaming & Travel",
        desc: "Highly available booking engines, optimized binary file delivery, and global notifications.",
        projectIds: ["file-storage", "healthcare-app", "feature-flag", "rate-limiter", "notification-service", "api-gateway"]
    },
    {
        id: "b2b-saas",
        title: "B2B SaaS & Enterprise Software",
        desc: "Schema-level multi-tenancy, granular RBAC, robust integrations, and real-time collaboration.",
        projectIds: ["saas-boilerplate", "feature-flag", "collab-editor", "auth-service", "llm-workflow", "notification-service", "api-gateway"]
    },
    {
        id: "cloud-infra",
        title: "Cloud, Infra, Telecom & DevTools",
        desc: "Distributed systems reliability, custom SDKs, network resiliency, and microservice observability.",
        projectIds: ["tracing-platform", "chaos-tool", "api-gateway", "auth-starter", "code-review", "rate-limiter"]
    },
    {
        id: "cybersecurity",
        title: "Cybersecurity, SecOps & InsurTech",
        desc: "Zero-trust architectures, cryptographic algorithms, API protection, and strict audit logging.",
        projectIds: ["auth-service", "healthcare-app", "rate-limiter", "auth-starter", "api-gateway", "feature-flag"]
    },
    {
        id: "ai-data",
        title: "AI, Data Platforms & Analytics",
        desc: "Big data pipelines, RAG vector implementations, LLM workflow orchestration, and data ingestion.",
        projectIds: ["rag-pipeline", "llm-workflow", "code-review", "job-board", "finance-tracker", "iot-pipeline"]
    },
    {
        id: "healthtech",
        title: "HealthTech & Life Sciences",
        desc: "Strict privacy controls, encryption, secure medical file storage, and doctor-patient scheduling.",
        projectIds: ["healthcare-app", "saas-boilerplate", "file-storage", "rag-pipeline", "auth-service", "notification-service"]
    },
    {
        id: "semiconductors-iot",
        title: "Semiconductors, IoT & Industrial Tech",
        desc: "High-frequency telemetry ingestion, hardware edge monitoring, and simulating system faults.",
        projectIds: ["iot-pipeline", "tracing-platform", "chaos-tool", "rate-limiter", "api-gateway"]
    },
    {
        id: "cleantech-proptech",
        title: "CleanTech, SpaceTech & PropTech",
        desc: "Isolated property management contexts, energy grid telemetry, and peer-to-peer ledger systems.",
        projectIds: ["saas-boilerplate", "iot-pipeline", "banking-ledger", "file-storage", "healthcare-app"]
    },
    {
        id: "govtech-hrtech",
        title: "GovTech, Public Infra & HRTech",
        desc: "Population-scale concurrency, candidate matchmaking, document parsing, and mass communications.",
        projectIds: ["job-board", "saas-boilerplate", "ecommerce", "notification-service", "collab-editor", "api-gateway", "auth-service"]
    }
];

// Target directory paths relative to the template folder
const categoryDir = path.join(__dirname, '../category');

// Ensure /category folder exists
if (!fs.existsSync(categoryDir)){
    fs.mkdirSync(categoryDir, { recursive: true });
}

// Read template file from the current directory
const templateHTMLPath = path.join(__dirname, 'category-template.html');
const templateHTML = fs.readFileSync(templateHTMLPath, 'utf8');

categories.forEach(cat => {
    let projectCardsHTML = '';

    cat.projectIds.forEach(projectId => {
        const proj = projects.find(p => p.id === projectId);
        if(!proj) return;

        const badgesHTML = proj.headlineStack.map(tech => `<span class="badge" onclick="event.stopPropagation()">${tech}</span>`).join('');

        // Issue 2 & 3 Fixed: Clean absolute path routing, Div wrapper, onclick handler
        projectCardsHTML += `
            <div onclick="window.location.href='/project/${proj.id}'" class="card-wrapper">
                <div class="card-content">
                    <div class="card-inner-glow"></div>
                    <div class="card-content-layer">
                        <h3 class="card-title">${proj.title}</h3>
                        <p class="card-tagline">${proj.tagline}</p>
                        
                        <div class="headline-stack">
                            ${badgesHTML}
                        </div>

                        <div class="card-actions">
                            <a href="https://${proj.id}.projects.gauravamarnani.in" target="_blank" class="btn btn-primary" onclick="event.stopPropagation()">Visit Live</a>
                            <a href="https://github.com/gauravamarnani/${proj.id}" target="_blank" class="btn btn-secondary" onclick="event.stopPropagation()">Source Code</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    const outputHTML = templateHTML
        .replace(/\{\{CATEGORY_TITLE\}\}/g, cat.title)
        .replace(/\{\{CATEGORY_DESC\}\}/g, cat.desc)
        .replace(/\{\{PROJECT_CARDS\}\}/g, projectCardsHTML);

    const outputPath = path.join(categoryDir, `${cat.id}.html`);
    fs.writeFileSync(outputPath, outputHTML);
    console.log(`Generated: ../category/${cat.id}.html`);
});

console.log('All 15 Category files successfully generated in the /category folder!');