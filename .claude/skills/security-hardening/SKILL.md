---
name: security-hardening
description: Web application security patterns, OWASP Top 10 protections, Next.js security configuration, input validation, and security headers. Use when implementing security features, reviewing code for vulnerabilities, or hardening the application.
---

# Security Hardening for Next.js Portfolio

## Next.js Security Configuration

### Security Headers
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://www.google-analytics.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
```

## Input Validation with Zod

### Validation Schemas
```typescript
// src/lib/validations/contact.ts
import { z } from 'zod';

// Strict email validation
const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email too long')
  .transform((email) => email.toLowerCase().trim());

// Sanitize text input
const sanitizeString = (str: string) => {
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 10000); // Max length
};

export const ContactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .transform(sanitizeString),
  email: emailSchema,
  subject: z
    .string()
    .max(200, 'Subject too long')
    .optional()
    .transform((val) => val ? sanitizeString(val) : undefined),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message too long')
    .transform(sanitizeString),
  // Honeypot field - should be empty
  website: z
    .string()
    .max(0, 'Invalid submission')
    .optional(),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;
```

### Safe API Validation
```typescript
// src/lib/api-validation.ts
import { NextRequest, NextResponse } from 'next/server';
import { z, ZodSchema } from 'zod';

export async function validateRequest<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        error: NextResponse.json(
          { 
            error: 'Validation failed',
            // Don't expose detailed errors in production
            ...(process.env.NODE_ENV === 'development' && {
              details: result.error.flatten(),
            }),
          },
          { status: 400 }
        ),
      };
    }

    return { data: result.data };
  } catch {
    return {
      error: NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      ),
    };
  }
}
```

## Rate Limiting

### With Upstash Redis
```typescript
// src/lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Different limits for different routes
export const rateLimits = {
  contact: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 per hour
    analytics: true,
  }),
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 per minute
    analytics: true,
  }),
};

export async function checkRateLimit(
  request: NextRequest,
  limiter: Ratelimit
): Promise<{ success: boolean; response?: NextResponse }> {
  const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
  const { success, remaining, reset } = await limiter.limit(ip);

  if (!success) {
    return {
      success: false,
      response: NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      ),
    };
  }

  return { success: true };
}
```

### In-Memory Rate Limit (No Redis)
```typescript
// src/lib/rate-limit-memory.ts
const requests = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimitMemory(
  identifier: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = requests.get(identifier);

  if (!record || now > record.resetTime) {
    requests.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}
```

## CSRF Protection

```typescript
// src/lib/csrf.ts
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

const CSRF_TOKEN_KEY = '__csrf_token';

export async function generateCsrfToken(): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const cookieStore = await cookies();
  
  cookieStore.set(CSRF_TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60, // 1 hour
  });

  return token;
}

export async function validateCsrfToken(token: string): Promise<boolean> {
  const cookieStore = await cookies();
  const storedToken = cookieStore.get(CSRF_TOKEN_KEY)?.value;
  
  if (!storedToken || !token) return false;
  
  // Timing-safe comparison
  return timingSafeEqual(storedToken, token);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
```

## XSS Prevention

### Safe HTML Rendering
```typescript
// src/lib/sanitize.ts
import DOMPurify from 'isomorphic-dompurify';

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  });
}

// Usage in component
export function SafeHtml({ content }: { content: string }) {
  return (
    <div 
      dangerouslySetInnerHTML={{ 
        __html: sanitizeHtml(content) 
      }} 
    />
  );
}
```

## Environment Variables Security

```typescript
// src/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  // Optional
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  GOOGLE_ANALYTICS_ID: z.string().optional(),
});

export const env = envSchema.parse(process.env);
```

## Security Checklist Script
```typescript
// scripts/security-check.ts
import { execSync } from 'child_process';

console.log('🔒 Running Security Checks...\n');

// Check for vulnerable dependencies
console.log('📦 Checking dependencies...');
try {
  execSync('npm audit --audit-level=high', { stdio: 'inherit' });
  console.log('✅ No high/critical vulnerabilities\n');
} catch {
  console.log('⚠️  Vulnerabilities found - review npm audit output\n');
}

// Check for secrets in code
console.log('🔑 Checking for exposed secrets...');
const secretPatterns = [
  'password\\s*=\\s*["\'][^"\']+["\']',
  'api[_-]?key\\s*=\\s*["\'][^"\']+["\']',
  'secret\\s*=\\s*["\'][^"\']+["\']',
];

// Add more checks as needed
console.log('✅ Security checks complete\n');
```

## Secure Error Handling
```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// In API routes - never expose internal errors
export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof AppError && error.isOperational) {
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode }
    );
  }

  // Generic error for unexpected issues
  return NextResponse.json(
    { error: 'An unexpected error occurred' },
    { status: 500 }
  );
}
```
