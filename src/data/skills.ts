import { Skill } from './types';

export const skills: Skill[] = [
  {
    id: 'skill-1',
    slug: 'react-nextjs',
    name: 'React / Next.js',
    category: 'frontend',
    proficiency: 90,
    icon: 'react',
    description:
      'Building fast, interactive UIs with React and production-grade apps with Next.js.',
    longDescription:
      'React has been the foundation of my frontend work for four years. I started with class components and have evolved through hooks, context, server components, and the App Router. I reach for Next.js on every new project because it handles the hard parts -- routing, SSR, image optimization, API routes -- so I can focus on the product. I care deeply about component architecture: small, composable pieces that are easy to test and reason about.',
    highlights: [
      'Built 10+ production apps with Next.js App Router and Server Components',
      'Created a 40-component design system with Framer Motion animations',
      'Reduced bundle size by 35% through code splitting and lazy loading',
      'Implemented real-time collaboration features using React concurrent mode',
    ],
    relatedProjectSlugs: [
      'collaborative-workspace',
      'analytics-dashboard',
      'motion-design-system',
    ],
    yearsOfExperience: 4,
    roadmap: [
      {
        level: 'beginner',
        label: 'Beginner',
        topics: ['JSX syntax & expressions', 'Props & component composition', 'State with useState', 'Event handling', 'Conditional rendering', 'Lists & keys', 'Basic CSS-in-JS / Tailwind'],
      },
      {
        level: 'intermediate',
        label: 'Intermediate',
        topics: ['Custom hooks', 'Context API & providers', 'useEffect & data fetching', 'React Router / Next.js routing', 'Form handling & validation', 'Error boundaries', 'Code splitting with lazy/Suspense'],
      },
      {
        level: 'advanced',
        label: 'Advanced',
        topics: ['Server Components & SSR', 'Streaming & progressive rendering', 'Caching strategies (ISR, on-demand)', 'Optimistic UI updates', 'Concurrent features & transitions', 'Bundle analysis & tree-shaking', 'Advanced state management patterns'],
      },
      {
        level: 'expert',
        label: 'Expert',
        topics: ['Architecture for large-scale apps', 'Performance profiling & optimization', 'Custom renderers & reconciliation', 'Comprehensive testing strategies', 'Design system architecture', 'Monorepo component libraries', 'Migration & upgrade strategies'],
      },
    ],
  },
  {
    id: 'skill-2',
    slug: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    proficiency: 85,
    icon: 'typescript',
    description:
      'Writing type-safe code that catches bugs at compile time, not in production.',
    longDescription:
      'I switched to TypeScript three years ago and never looked back. Strict mode is non-negotiable on my projects. I use discriminated unions for state machines, generics for reusable utilities, and Zod for runtime validation that stays in sync with my types. TypeScript makes refactoring fearless -- when I rename a prop or change an API response shape, the compiler tells me every place that needs updating.',
    highlights: [
      'Strict mode enabled on all projects with zero any-casts in production code',
      'Built type-safe API clients using generics and Zod schema inference',
      'Created custom utility types for complex form validation patterns',
    ],
    relatedProjectSlugs: [
      'collaborative-workspace',
      'analytics-dashboard',
      'event-booking-api',
      'motion-design-system',
    ],
    yearsOfExperience: 3,
    roadmap: [
      {
        level: 'beginner',
        label: 'Beginner',
        topics: ['Primitive types & type annotations', 'Interfaces & type aliases', 'Enums & literal types', 'Arrays & tuples', 'Function signatures', 'Union & intersection types', 'Type inference basics'],
      },
      {
        level: 'intermediate',
        label: 'Intermediate',
        topics: ['Generics & constraints', 'Utility types (Partial, Pick, Omit)', 'Type guards & narrowing', 'Discriminated unions', 'Index signatures & Record', 'Module augmentation', 'Zod & runtime validation'],
      },
      {
        level: 'advanced',
        label: 'Advanced',
        topics: ['Mapped types & template literals', 'Conditional types & infer', 'Decorators & metadata', 'Variance & covariance', 'Recursive types', 'Branded / nominal types', 'Declaration files & .d.ts authoring'],
      },
      {
        level: 'expert',
        label: 'Expert',
        topics: ['Compiler API & custom transforms', 'Declaration merging & augmentation', 'Type-level programming', 'Performance tuning (type complexity)', 'Custom ESLint rules with type info', 'Monorepo type strategies', 'Migration of large JS codebases'],
      },
    ],
  },
  {
    id: 'skill-3',
    slug: 'nodejs-backend',
    name: 'Node.js / Backend',
    category: 'backend',
    proficiency: 85,
    icon: 'nodejs',
    description:
      'Designing APIs and backend systems that are fast, reliable, and easy to maintain.',
    longDescription:
      'I have been building backend services with Node.js for four years, from simple REST APIs to event-driven architectures handling thousands of concurrent connections. I think carefully about data flow, error handling, and observability. My APIs come with OpenAPI documentation, structured logging, and comprehensive test suites. I have experience with Express, Fastify, and Next.js API routes, and I pick the right tool based on the problem.',
    highlights: [
      'Built a booking API handling 5,000+ concurrent requests with zero oversells',
      'Designed event-driven architectures using Redis pub/sub and message queues',
      'Implemented rate limiting, caching, and circuit breaker patterns',
      'Maintained 95%+ test coverage on all backend services',
    ],
    relatedProjectSlugs: [
      'collaborative-workspace',
      'event-booking-api',
      'ai-content-engine',
    ],
    yearsOfExperience: 4,
    roadmap: [
      {
        level: 'beginner',
        label: 'Beginner',
        topics: ['Core modules (fs, path, http)', 'npm & package management', 'HTTP request/response cycle', 'Environment variables', 'Basic file I/O', 'JSON APIs', 'Error handling basics'],
      },
      {
        level: 'intermediate',
        label: 'Intermediate',
        topics: ['Express / Fastify middleware', 'RESTful API design', 'Input validation & sanitization', 'Authentication (JWT, sessions)', 'Database integration (Prisma)', 'Structured logging', 'Testing with Vitest / Jest'],
      },
      {
        level: 'advanced',
        label: 'Advanced',
        topics: ['Caching strategies (Redis)', 'Message queues & workers', 'WebSocket & real-time', 'Rate limiting & throttling', 'Circuit breaker patterns', 'OpenAPI documentation', 'CI/CD pipeline integration'],
      },
      {
        level: 'expert',
        label: 'Expert',
        topics: ['Microservices architecture', 'Horizontal scaling & load balancing', 'Distributed tracing & observability', 'Security hardening (OWASP)', 'Event-driven architecture', 'Performance profiling & tuning', 'Zero-downtime deployments'],
      },
    ],
  },
  {
    id: 'skill-4',
    slug: 'database-design',
    name: 'Database Design',
    category: 'database',
    proficiency: 80,
    icon: 'database',
    description:
      'Modeling data that scales well and writing queries that stay fast as tables grow.',
    longDescription:
      'Good database design is the backbone of every reliable application. I work primarily with PostgreSQL and use Prisma as my ORM for type-safe queries. I think about access patterns before writing schemas, use indexes strategically, and know when to denormalize for performance. I have experience with materialized views for analytics, optimistic locking for concurrency, and migrations that run safely in production without downtime.',
    highlights: [
      'Designed schemas for apps serving 100K+ users with sub-200ms query times',
      'Used materialized views to speed up analytics queries by 10x',
      'Implemented zero-downtime migrations on production PostgreSQL databases',
    ],
    relatedProjectSlugs: [
      'collaborative-workspace',
      'event-booking-api',
      'analytics-dashboard',
    ],
    yearsOfExperience: 3,
    roadmap: [
      {
        level: 'beginner',
        label: 'Beginner',
        topics: ['SQL fundamentals (SELECT, INSERT, UPDATE)', 'CRUD operations', 'JOINs & relationships', 'Primary & foreign keys', 'Basic data types', 'Simple filtering & sorting', 'Database clients & GUIs'],
      },
      {
        level: 'intermediate',
        label: 'Intermediate',
        topics: ['Schema design & ERD modeling', 'Normalization (1NF–3NF)', 'Migrations & versioning', 'Aggregations & subqueries', 'Prisma ORM patterns', 'Seeding & fixtures', 'Connection pooling'],
      },
      {
        level: 'advanced',
        label: 'Advanced',
        topics: ['Indexing strategies (B-tree, GIN)', 'Query plans & EXPLAIN ANALYZE', 'Transactions & isolation levels', 'Optimistic & pessimistic locking', 'Materialized views', 'Full-text search', 'Database triggers & functions'],
      },
      {
        level: 'expert',
        label: 'Expert',
        topics: ['Replication (primary-replica)', 'Sharding & partitioning', 'Distributed consensus', 'Zero-downtime schema migrations', 'Performance benchmarking', 'Multi-tenant architectures', 'Disaster recovery & backups'],
      },
    ],
  },
  {
    id: 'skill-5',
    slug: 'ui-ux-design',
    name: 'UI/UX Design',
    category: 'design',
    proficiency: 75,
    icon: 'design',
    description:
      'Designing interfaces that look great and feel intuitive, from wireframe to polished pixel.',
    longDescription:
      'I bridge the gap between design and engineering. I work in Figma for wireframes and prototyping, then translate those designs into pixel-perfect code with Tailwind CSS. I care about the details that make interfaces feel alive: micro-interactions, smooth transitions, consistent spacing, and thoughtful color systems. Accessibility is always part of the design process, not an afterthought. Every component I build meets WCAG 2.1 AA standards.',
    highlights: [
      'Created a design system used across three production products',
      'Built accessible components meeting WCAG 2.1 AA standards',
      'Designed and shipped responsive layouts for 50+ pages',
      'Improved a SaaS onboarding flow, increasing completion rate by 25%',
    ],
    relatedProjectSlugs: [
      'motion-design-system',
      'analytics-dashboard',
      'collaborative-workspace',
    ],
    yearsOfExperience: 3,
    roadmap: [
      {
        level: 'beginner',
        label: 'Beginner',
        topics: ['Color theory & palettes', 'Typography fundamentals', 'Spacing & layout basics', 'Visual hierarchy', 'Basic wireframing', 'Design tool navigation (Figma)', 'Mood boards & inspiration'],
      },
      {
        level: 'intermediate',
        label: 'Intermediate',
        topics: ['Component-based design', 'Responsive layout patterns', 'Figma auto-layout & variants', 'Icon systems', 'Interaction states (hover, focus, active)', 'Design handoff workflows', 'Usability heuristics'],
      },
      {
        level: 'advanced',
        label: 'Advanced',
        topics: ['Design system architecture', 'Motion design & micro-interactions', 'Advanced prototyping', 'Token-based theming', 'Cross-platform design (web + mobile)', 'Design QA processes', 'Accessibility (WCAG 2.1 AA)'],
      },
      {
        level: 'expert',
        label: 'Expert',
        topics: ['User research & testing', 'Accessibility auditing & remediation', 'Design ops & governance', 'Multi-brand design systems', 'Data-driven design decisions', 'Design team mentorship', 'Strategic design thinking'],
      },
    ],
  },
  {
    id: 'skill-6',
    slug: 'ai-ml-integration',
    name: 'AI/ML Integration',
    category: 'ai-ml',
    proficiency: 70,
    icon: 'ai',
    description:
      'Integrating large language models and ML pipelines into real products people use daily.',
    longDescription:
      'I got into AI integration two years ago when I built my first RAG pipeline for a marketing agency. Since then, I have worked with OpenAI, Anthropic, and open-source models to build features like content generation, semantic search, and conversational interfaces. I focus on the engineering side: prompt design, chunking strategies, vector storage, streaming responses, and keeping costs predictable. I believe AI features should feel seamless, not gimmicky.',
    highlights: [
      'Built a RAG pipeline that reduced content production time by 70%',
      'Implemented streaming chat interfaces with sub-100ms time to first token',
      'Designed prompt chains for consistent, brand-aligned content generation',
    ],
    relatedProjectSlugs: ['ai-content-engine', 'collaborative-workspace'],
    yearsOfExperience: 2,
    roadmap: [
      {
        level: 'beginner',
        label: 'Beginner',
        topics: ['Prompt engineering fundamentals', 'OpenAI / Anthropic API basics', 'Chat completion endpoints', 'Token counting & context limits', 'Temperature & sampling parameters', 'Streaming responses', 'Basic error handling & retries'],
      },
      {
        level: 'intermediate',
        label: 'Intermediate',
        topics: ['Embeddings & vector databases', 'RAG pipeline design', 'Chunking strategies', 'Semantic search implementation', 'Prompt chaining & templates', 'Function calling / tool use', 'Cost tracking & optimization'],
      },
      {
        level: 'advanced',
        label: 'Advanced',
        topics: ['Fine-tuning workflows', 'Agent architectures', 'Multi-step reasoning chains', 'Guardrails & content filtering', 'Evaluation frameworks', 'A/B testing prompts', 'Hybrid search (keyword + semantic)'],
      },
      {
        level: 'expert',
        label: 'Expert',
        topics: ['Production ML ops & monitoring', 'Model evaluation at scale', 'Cost optimization & caching layers', 'Multi-model orchestration', 'Custom model deployment', 'Compliance & data privacy', 'AI feature product strategy'],
      },
    ],
  },
];

export function getSkillBySlug(slug: string): Skill | undefined {
  return skills.find((s) => s.slug === slug);
}

export function getSkillsByCategory(category: Skill['category']): Skill[] {
  return skills.filter((s) => s.category === category);
}
