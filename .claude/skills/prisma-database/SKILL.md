---
name: prisma-database
description: Prisma ORM patterns, schema design, migrations, query optimization, and PostgreSQL best practices. Use when designing database schemas, writing queries, or managing database operations.
---

# Prisma Database Patterns for Portfolio

## Complete Portfolio Schema

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// PROJECTS
// ============================================

model Project {
  id          String    @id @default(cuid())
  slug        String    @unique
  title       String
  description String
  content     String?   @db.Text
  excerpt     String?   @db.VarChar(300)
  
  // Media
  imageUrl    String?
  videoUrl    String?
  images      String[]  // Additional gallery images
  
  // Links
  liveUrl     String?
  githubUrl   String?
  figmaUrl    String?
  
  // Metadata
  featured    Boolean   @default(false)
  published   Boolean   @default(false)
  sortOrder   Int       @default(0)
  
  // Dates
  startDate   DateTime?
  endDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publishedAt DateTime?
  
  // Relations
  categories  Category[]
  skills      Skill[]
  
  @@index([published, featured])
  @@index([published, sortOrder])
}

model Category {
  id       String    @id @default(cuid())
  name     String    @unique
  slug     String    @unique
  color    String?   // Hex color for UI
  projects Project[]
  
  @@index([slug])
}

// ============================================
// SKILLS & EXPERIENCE
// ============================================

model Skill {
  id          String      @id @default(cuid())
  name        String      @unique
  slug        String      @unique
  category    SkillCategory
  proficiency Int         @default(50) // 0-100
  yearsUsed   Float?
  iconUrl     String?
  color       String?
  sortOrder   Int         @default(0)
  
  projects    Project[]
  experiences Experience[]
  
  @@index([category, sortOrder])
}

enum SkillCategory {
  FRONTEND
  BACKEND
  DATABASE
  DEVOPS
  DESIGN
  TOOLS
  SOFT_SKILLS
}

model Experience {
  id          String    @id @default(cuid())
  company     String
  position    String
  description String?   @db.Text
  location    String?
  type        JobType   @default(FULL_TIME)
  
  startDate   DateTime
  endDate     DateTime?
  current     Boolean   @default(false)
  
  companyUrl  String?
  logoUrl     String?
  
  skills      Skill[]
  highlights  String[]  // Key achievements
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  @@index([current, startDate])
}

enum JobType {
  FULL_TIME
  PART_TIME
  CONTRACT
  FREELANCE
  INTERNSHIP
}

model Education {
  id          String    @id @default(cuid())
  institution String
  degree      String
  field       String?
  description String?   @db.Text
  
  startDate   DateTime
  endDate     DateTime?
  current     Boolean   @default(false)
  
  gpa         Float?
  honors      String[]
  logoUrl     String?
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// ============================================
// TESTIMONIALS
// ============================================

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  role      String
  company   String?
  content   String   @db.Text
  imageUrl  String?
  featured  Boolean  @default(false)
  approved  Boolean  @default(false)
  sortOrder Int      @default(0)
  
  createdAt DateTime @default(now())
  
  @@index([approved, featured])
}

// ============================================
// CONTACT & ANALYTICS
// ============================================

model Contact {
  id        String        @id @default(cuid())
  name      String
  email     String
  subject   String?
  message   String        @db.Text
  status    ContactStatus @default(UNREAD)
  
  // Metadata
  ipAddress String?
  userAgent String?
  referrer  String?
  
  createdAt DateTime      @default(now())
  readAt    DateTime?
  repliedAt DateTime?
  
  @@index([status, createdAt])
}

enum ContactStatus {
  UNREAD
  READ
  REPLIED
  ARCHIVED
  SPAM
}

model PageView {
  id        String   @id @default(cuid())
  path      String
  referrer  String?
  userAgent String?
  ipHash    String?  // Hashed for privacy
  
  createdAt DateTime @default(now())
  
  @@index([path, createdAt])
}

// ============================================
// SITE CONFIG
// ============================================

model SiteConfig {
  id    String @id @default("config")
  key   String @unique
  value Json
  
  updatedAt DateTime @updatedAt
}
```

## Database Client Setup

```typescript
// src/db/client.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

## Query Functions

```typescript
// src/db/queries/projects.ts
import { prisma } from '../client';
import { Prisma } from '@prisma/client';

// Types
export type ProjectWithRelations = Prisma.ProjectGetPayload<{
  include: { categories: true; skills: true };
}>;

// Get published projects with filtering
export async function getPublishedProjects(options?: {
  category?: string;
  skill?: string;
  featured?: boolean;
  limit?: number;
}) {
  const { category, skill, featured, limit } = options ?? {};

  return prisma.project.findMany({
    where: {
      published: true,
      ...(featured !== undefined && { featured }),
      ...(category && {
        categories: { some: { slug: category } },
      }),
      ...(skill && {
        skills: { some: { slug: skill } },
      }),
    },
    include: {
      categories: true,
      skills: true,
    },
    orderBy: [
      { featured: 'desc' },
      { sortOrder: 'asc' },
      { publishedAt: 'desc' },
    ],
    ...(limit && { take: limit }),
  });
}

// Get single project by slug
export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      categories: true,
      skills: true,
    },
  });
}

// Get featured projects for homepage
export async function getFeaturedProjects(limit = 3) {
  return prisma.project.findMany({
    where: {
      published: true,
      featured: true,
    },
    include: {
      categories: true,
      skills: true,
    },
    orderBy: { sortOrder: 'asc' },
    take: limit,
  });
}

// Get all project slugs for static generation
export async function getAllProjectSlugs() {
  const projects = await prisma.project.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return projects.map((p) => p.slug);
}
```

```typescript
// src/db/queries/skills.ts
import { prisma } from '../client';
import { SkillCategory } from '@prisma/client';

export async function getSkillsByCategory() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
  });

  // Group by category
  return skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, typeof skills>);
}
```

## Seed Script

```typescript
// prisma/seed.ts
import { PrismaClient, SkillCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.category.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Web App', slug: 'web-app', color: '#3B82F6' },
    }),
    prisma.category.create({
      data: { name: 'Mobile', slug: 'mobile', color: '#10B981' },
    }),
    prisma.category.create({
      data: { name: 'Design', slug: 'design', color: '#8B5CF6' },
    }),
  ]);

  // Create skills
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        name: 'React',
        slug: 'react',
        category: SkillCategory.FRONTEND,
        proficiency: 90,
        sortOrder: 1,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'TypeScript',
        slug: 'typescript',
        category: SkillCategory.FRONTEND,
        proficiency: 85,
        sortOrder: 2,
      },
    }),
    prisma.skill.create({
      data: {
        name: 'Node.js',
        slug: 'nodejs',
        category: SkillCategory.BACKEND,
        proficiency: 80,
        sortOrder: 1,
      },
    }),
  ]);

  // Create sample project
  await prisma.project.create({
    data: {
      title: 'Portfolio Website',
      slug: 'portfolio-website',
      description: 'A creative portfolio showcasing my work',
      content: 'Full project details here...',
      featured: true,
      published: true,
      publishedAt: new Date(),
      categories: {
        connect: [{ id: categories[0].id }],
      },
      skills: {
        connect: [{ id: skills[0].id }, { id: skills[1].id }],
      },
    },
  });

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Migration Commands

```bash
# Create a new migration
npx prisma migrate dev --name init

# Apply migrations in production
npx prisma migrate deploy

# Reset database (dev only)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio

# Seed database
npx prisma db seed
```

Add to package.json:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```
