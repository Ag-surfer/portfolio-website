---
name: nextjs-patterns
description: Next.js 14+ App Router patterns, API routes, server actions, caching strategies, and middleware. Use when building backend functionality, API endpoints, or server-side logic in Next.js.
---

# Next.js 14+ App Router Patterns

## API Route Patterns

### Standard API Route Structure
```typescript
// src/app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/db/client';

// Request validation schema
const CreateResourceSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
});

// GET - List resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.resource.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.resource.count(),
    ]);

    return NextResponse.json({
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[API] GET /resource error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

// POST - Create resource
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = CreateResourceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: validation.data,
    });

    return NextResponse.json({ data: resource }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /resource error:', error);
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}
```

### Dynamic Route with Params
```typescript
// src/app/api/[resource]/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  
  const resource = await prisma.resource.findUnique({
    where: { id },
  });

  if (!resource) {
    return NextResponse.json(
      { error: 'Resource not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: resource });
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const body = await request.json();

  const resource = await prisma.resource.update({
    where: { id },
    data: body,
  });

  return NextResponse.json({ data: resource });
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  await prisma.resource.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
```

## Server Actions

### Form Submission Pattern
```typescript
// src/app/actions/contact.ts
'use server';

import { z } from 'zod';
import { prisma } from '@/db/client';
import { revalidatePath } from 'next/cache';

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitContact(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  const rawData = {
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  };

  const validation = ContactSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: 'Validation failed',
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.contact.create({
      data: validation.data,
    });

    revalidatePath('/contact');

    return {
      success: true,
      message: 'Message sent successfully!',
    };
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong. Please try again.',
    };
  }
}
```

## Caching Strategies

### Static Data (Build Time)
```typescript
// For data that rarely changes
export const revalidate = 3600; // Revalidate every hour

async function getStaticData() {
  const data = await prisma.skill.findMany();
  return data;
}
```

### Dynamic Data with Cache Tags
```typescript
import { unstable_cache } from 'next/cache';

const getProjects = unstable_cache(
  async () => {
    return prisma.project.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    });
  },
  ['projects'],
  { revalidate: 60, tags: ['projects'] }
);

// Revalidate when projects change
import { revalidateTag } from 'next/cache';
revalidateTag('projects');
```

## Middleware Pattern
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rate limiting check
  const ip = request.ip ?? 'unknown';
  
  // Add security headers
  const response = NextResponse.next();
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

## Error Handling Pattern
```typescript
// src/lib/api-error.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage in route
try {
  // ... logic
} catch (error) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }
  throw error;
}
```
