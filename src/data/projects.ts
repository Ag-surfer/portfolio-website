import { Project } from './types';

export const projects: Project[] = [
  {
    id: 'proj-1',
    slug: 'collaborative-workspace',
    title: 'Collaborative Workspace',
    description:
      'A real-time collaborative document editor with nested blocks, live cursors, and slash commands.',
    longDescription:
      'Built from scratch to understand the complexities of real-time collaboration at scale. The editor supports nested block structures with infinite depth, real-time cursor presence, slash commands for quick formatting, and full markdown support. State management was the hardest part -- keeping multiple clients in sync while handling conflicts gracefully required a custom CRDT implementation on top of WebSockets.',
    category: 'fullstack',
    tags: ['real-time', 'collaboration', 'editor', 'websockets'],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Prisma', 'PostgreSQL', 'Liveblocks'],
    imageUrl: '/images/projects/collaborative-workspace.jpg',
    liveUrl: 'https://collab-workspace.demo.dev',
    githubUrl: 'https://github.com/krishnap/collaborative-workspace',
    featured: true,
    completedAt: '2025-08-15',
  },
  {
    id: 'proj-2',
    slug: 'analytics-dashboard',
    title: 'Analytics Dashboard',
    description:
      'An interactive data visualization dashboard with real-time metrics, custom chart builder, and CSV export.',
    longDescription:
      'Designed for a SaaS startup that needed a way to make sense of 2M+ daily events. The dashboard renders complex charts without jank using virtualized lists and canvas-based rendering for large datasets. Users can build custom views by dragging metric cards, setting date ranges, and applying filters. The backend aggregates data in PostgreSQL using materialized views, keeping query times under 200ms even on million-row tables.',
    category: 'frontend',
    tags: ['data-viz', 'dashboard', 'charts', 'performance'],
    techStack: ['React', 'TypeScript', 'D3.js', 'Recharts', 'Tailwind CSS', 'Node.js'],
    imageUrl: '/images/projects/analytics-dashboard.jpg',
    liveUrl: 'https://analytics-dash.demo.dev',
    githubUrl: 'https://github.com/krishnap/analytics-dashboard',
    featured: true,
    completedAt: '2025-05-20',
  },
  {
    id: 'proj-3',
    slug: 'ai-content-engine',
    title: 'AI Content Engine',
    description:
      'A content generation platform powered by LLMs with tone control, brand voice training, and batch processing.',
    longDescription:
      'Built for a marketing agency that was spending 40+ hours a week writing social media copy. The platform lets users define brand voice profiles, generate content in bulk across platforms, and fine-tune outputs with tone sliders. Under the hood, it chains multiple LLM calls with custom prompt templates and uses a RAG pipeline to keep outputs consistent with existing brand materials. Reduced their content production time by 70%.',
    category: 'ai-ml',
    tags: ['ai', 'llm', 'content-generation', 'rag'],
    techStack: ['Next.js', 'TypeScript', 'Python', 'FastAPI', 'OpenAI API', 'Pinecone', 'PostgreSQL'],
    imageUrl: '/images/projects/ai-content-engine.jpg',
    githubUrl: 'https://github.com/krishnap/ai-content-engine',
    featured: true,
    completedAt: '2025-11-10',
  },
  {
    id: 'proj-4',
    slug: 'event-booking-api',
    title: 'Event Booking API',
    description:
      'A high-throughput REST API for event ticketing with seat reservations, waitlists, and payment processing.',
    longDescription:
      'Handles 5,000+ concurrent booking requests without overselling seats. The core challenge was preventing race conditions during high-demand events -- solved with optimistic locking in PostgreSQL and a Redis-based reservation queue. Includes Stripe integration for payments, automatic waitlist promotion when cancellations happen, and webhook notifications. Fully documented with OpenAPI spec and 95% test coverage.',
    category: 'backend',
    tags: ['api', 'payments', 'concurrency', 'redis'],
    techStack: ['Node.js', 'Express', 'TypeScript', 'PostgreSQL', 'Redis', 'Stripe', 'Docker'],
    imageUrl: '/images/projects/event-booking-api.jpg',
    githubUrl: 'https://github.com/krishnap/event-booking-api',
    featured: false,
    completedAt: '2024-12-01',
  },
  {
    id: 'proj-5',
    slug: 'motion-design-system',
    title: 'Motion Design System',
    description:
      'A React component library with built-in animations, dark mode, and accessibility baked into every component.',
    longDescription:
      'Started as an internal tool and grew into a 40+ component library used across three products. Every component ships with coordinated enter/exit animations via Framer Motion, full keyboard navigation, and ARIA labels. The theming system supports dark mode, custom color palettes, and CSS variable overrides. Published on npm with Storybook documentation and visual regression tests using Chromatic.',
    category: 'frontend',
    tags: ['design-system', 'component-library', 'accessibility', 'animation'],
    techStack: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS', 'Storybook', 'Radix UI'],
    imageUrl: '/images/projects/motion-design-system.jpg',
    liveUrl: 'https://motion-ds.demo.dev',
    githubUrl: 'https://github.com/krishnap/motion-design-system',
    featured: true,
    completedAt: '2025-03-08',
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(category: Project['category']): Project[] {
  return projects.filter((p) => p.category === category);
}
