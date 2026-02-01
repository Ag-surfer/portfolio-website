# Krishna's Creative Portfolio Website

## Project Overview

A visually stunning, interactive portfolio website with multi-agent architecture. Features dedicated skill pages, AI chatbot integration, and exceptional design that demonstrates technical creativity.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Testing**: Vitest, Testing Library, Playwright
- **Deployment**: Vercel

---

## 🤖 Multi-Agent Architecture

### Specialist Agents

Invoke with `@agent-name` syntax:

| Agent | Skills Loaded | Responsibility |
|-------|---------------|----------------|
| `@orchestrator` | — | Coordinates all agents, parallel execution, architecture |
| `@backend-dev` | nextjs-patterns | API routes, server actions, integrations |
| `@frontend-dev` | react-components, framer-motion, tailwind-design-system | UI/UX, components, animations |
| `@database-admin` | prisma-database | Schema design, migrations, queries |
| `@security` | security-hardening | OWASP compliance, vulnerability review |
| `@qa-tester` | testing-patterns | Unit, component, E2E tests |
| `@seo-analyst` | seo-optimization | Metadata, structured data, Core Web Vitals |
| `@content-writer` | portfolio-content | Copy, microcopy, brand voice |

### Parallel Execution

The orchestrator can spawn multiple agents simultaneously when tasks have no dependencies:

```
PARALLEL (no dependencies):
├── @database-admin → Schema design
├── @frontend-dev → Design system setup  
└── @content-writer → Content structure

THEN SEQUENTIAL:
├── @backend-dev → API routes (needs schema)
└── @frontend-dev → Components (needs API)
```

---

## 📚 Skills Library

Skills are auto-loaded by agents and provide domain expertise:

| Skill | Location | Purpose |
|-------|----------|---------|
| nextjs-patterns | `.claude/skills/nextjs-patterns/` | API routes, caching, middleware |
| react-components | `.claude/skills/react-components/` | Component patterns, hooks |
| framer-motion | `.claude/skills/framer-motion/` | Animation patterns |
| tailwind-design-system | `.claude/skills/tailwind-design-system/` | Design tokens, theming |
| prisma-database | `.claude/skills/prisma-database/` | Schema, queries, migrations |
| security-hardening | `.claude/skills/security-hardening/` | OWASP, validation, headers |
| testing-patterns | `.claude/skills/testing-patterns/` | Test examples, setup |
| seo-optimization | `.claude/skills/seo-optimization/` | Metadata, structured data |
| portfolio-content | `.claude/skills/portfolio-content/` | Copy templates, voice |
| codebase-analyzer | `.claude/skills/codebase-analyzer/` | Deep codebase analysis (forked) |

---

## ⚡ Slash Commands

| Command | Description |
|---------|-------------|
| `/plan [feature]` | Create implementation plan with orchestrator |
| `/implement [feature]` | Build feature with appropriate agents |
| `/review [files]` | Security review (OWASP compliance) |
| `/test [target]` | Write and run tests |
| `/audit [pages]` | SEO and accessibility audit |

---

## 🔌 MCP Integrations

External tools available via `.mcp.json`:

| Server | Purpose | Setup Required |
|--------|---------|----------------|
| GitHub | Issues, PRs, repo management | Set `GITHUB_TOKEN` env var (optional) |
| Fetch | Web content and API access | None |
| Filesystem | Project file access | None |

---

## 🪝 Automated Hooks

Configured in `.claude/hooks.json`:

| Hook | Trigger | Action |
|------|---------|--------|
| PostToolUse | After writing .ts/.tsx files | Auto-format with Prettier |
| PreCommit | Before git commits | Run lint + type-check |
| SubagentStop | When subagent completes | Log completion |

---

## 📁 Project Structure

```
portfolio-website/
├── .claude/
│   ├── agents/           # 8 specialist agents
│   ├── commands/         # 5 slash commands
│   ├── skills/           # 10 domain skills
│   └── hooks.json        # Automation hooks
├── .mcp.json             # MCP server config
├── prisma/
│   └── schema.prisma     # Database schema
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── projects/     # Project pages
│   │   ├── skills/       # Skill pages
│   │   └── ...
│   ├── components/       # React components
│   ├── db/               # Database client & queries
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities
│   └── styles/           # Global styles
├── tests/                # Test files
└── CLAUDE.md             # This file
```

---

## 🚀 Quick Start

### Start Building
```bash
claude
```

### First Command
```
@orchestrator Think hard about the architecture, then create a phased 
implementation plan for my portfolio website with these features:
- Animated hero section
- About me story
- Filterable project showcase
- Individual skill pages (one per skill)
- AI chatbot integration
- Contact form
- Dark/light mode
```

### Useful Patterns

**Analyze the codebase:**
```
/skill:codebase-analyzer
```

**Plan a specific feature:**
```
/plan skill pages with proficiency indicators and related projects
```

**Direct task to specialist:**
```
@frontend-dev Build the hero section with animated text reveal using Framer Motion
```

**Security review:**
```
/review src/app/api/
```

---

## 🎯 Site Architecture

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page (hero, about, projects, skills, contact) |
| `/about` | Extended about page |
| `/projects` | All projects with filtering |
| `/projects/[slug]` | Project detail/case study |
| `/skills/[slug]` | Individual skill page |
| `/contact` | Contact form page |

### API Endpoints

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/projects` | GET, POST | List/create projects |
| `/api/projects/[id]` | GET, PATCH, DELETE | Single project |
| `/api/skills` | GET | List skills |
| `/api/contact` | POST | Submit contact form |
| `/api/chat` | POST | AI chatbot endpoint |

---

## ✅ Quality Standards

### Performance Targets
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100

### Security Requirements
- OWASP Top 10 compliance
- Input validation on all endpoints
- Rate limiting on public APIs
- Security headers configured

### Testing Coverage
- Statements: 80%+
- Branches: 75%+
- E2E: Critical paths covered

---

## 🔧 Development Commands

```bash
# Development
npm run dev

# Build
npm run build

# Tests
npm test
npm run test:e2e

# Database
npx prisma migrate dev
npx prisma studio

# Linting
npm run lint
npm run type-check
```
