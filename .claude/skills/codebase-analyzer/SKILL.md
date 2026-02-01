---
name: codebase-analyzer
description: Deep analysis of codebase structure, dependencies, and architecture. Use when exploring a new codebase, understanding project structure, or planning refactors.
context: fork
agent: Explore
allowed-tools: Read, Glob, Grep, Bash
---

# Codebase Analyzer

Perform a comprehensive analysis of this codebase and return a structured summary.

## Analysis Tasks

### 1. Project Structure
- Map the directory structure (2 levels deep)
- Identify key directories and their purposes
- Note any non-standard organization

### 2. Technology Stack
- Read package.json for dependencies
- Identify framework (Next.js version, React version)
- List key libraries and their purposes
- Note dev dependencies

### 3. Configuration Files
- Check for: tsconfig.json, tailwind.config, next.config, .env.example
- Summarize key configurations
- Note any custom settings

### 4. Database Schema
- If prisma/schema.prisma exists, summarize models
- List relationships between models
- Note any indexes

### 5. API Routes
- Scan src/app/api/ for routes
- List endpoints and HTTP methods
- Note any middleware

### 6. Components
- Scan src/components/ structure
- Identify component categories
- Note shared/reusable components

### 7. Code Patterns
- Check for consistent patterns
- Identify any anti-patterns
- Note testing setup

## Output Format

Return a summary in this structure:

```markdown
# Codebase Analysis

## Overview
- **Framework**: [e.g., Next.js 14.x]
- **Language**: [e.g., TypeScript]
- **Styling**: [e.g., Tailwind CSS]
- **Database**: [e.g., PostgreSQL + Prisma]

## Project Structure
\`\`\`
[Directory tree]
\`\`\`

## Key Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| ... | ... | ... |

## Database Models
[List of models and relationships]

## API Endpoints
| Route | Methods | Description |
|-------|---------|-------------|
| ... | ... | ... |

## Component Architecture
[Summary of component organization]

## Observations
- [Notable patterns]
- [Potential issues]
- [Recommendations]
```

## Instructions

1. Use Glob to find files
2. Use Read to examine key files
3. Use Grep to search for patterns
4. Synthesize findings into the summary format
5. Return ONLY the summary (not raw file contents)

This runs in a forked context to keep the main conversation clean.
