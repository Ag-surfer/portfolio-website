---
name: testing-patterns
description: Testing patterns for React, Next.js, and APIs using Vitest, Testing Library, and Playwright. Use when writing unit tests, component tests, integration tests, or E2E tests.
---

# Testing Patterns for Portfolio

## Test Setup

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup File
```typescript
// tests/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image
vi.mock('next/image', () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt} />;
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));
```

## Component Testing

### Basic Component Test
```typescript
// tests/components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole('button')).toHaveClass('border');
  });
});
```

### Form Component Test
```typescript
// tests/components/ContactForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/ContactForm';

describe('ContactForm', () => {
  it('renders all form fields', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  it('shows validation errors for empty submission', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    await user.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');
    await user.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const mockSubmit = vi.fn();
    render(<ContactForm onSubmit={mockSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/message/i), 'This is a test message');
    await user.click(screen.getByRole('button', { name: /send/i }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        message: 'This is a test message',
      });
    });
  });
});
```

## API Route Testing

```typescript
// tests/api/projects.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/projects/route';
import { prisma } from '@/db/client';

// Mock Prisma
vi.mock('@/db/client', () => ({
  prisma: {
    project: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('GET /api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns published projects', async () => {
    const mockProjects = [
      { id: '1', title: 'Project 1', published: true },
      { id: '2', title: 'Project 2', published: true },
    ];
    vi.mocked(prisma.project.findMany).mockResolvedValue(mockProjects as any);

    const request = new Request('http://localhost/api/projects');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toEqual(mockProjects);
  });

  it('handles pagination parameters', async () => {
    vi.mocked(prisma.project.findMany).mockResolvedValue([]);

    const request = new Request('http://localhost/api/projects?page=2&limit=5');
    await GET(request);

    expect(prisma.project.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 5,
        take: 5,
      })
    );
  });

  it('returns 500 on database error', async () => {
    vi.mocked(prisma.project.findMany).mockRejectedValue(new Error('DB Error'));

    const request = new Request('http://localhost/api/projects');
    const response = await GET(request);

    expect(response.status).toBe(500);
  });
});
```

## E2E Testing with Playwright

### Playwright Configuration
```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Examples
```typescript
// tests/e2e/homepage.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Portfolio/);
  });

  test('displays hero section', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.getByRole('link', { name: /projects/i }).click();
    await expect(page).toHaveURL(/.*projects/);
  });

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('button', { name: /menu/i })).toBeVisible();
  });
});

test.describe('Contact Form', () => {
  test('submits successfully with valid data', async ({ page }) => {
    await page.goto('/contact');
    
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/message/i).fill('This is a test message for the contact form');
    
    await page.getByRole('button', { name: /send/i }).click();
    
    await expect(page.getByText(/thank you|success/i)).toBeVisible();
  });

  test('shows validation errors', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /send/i }).click();
    
    await expect(page.getByText(/required/i)).toBeVisible();
  });
});
```

### Accessibility E2E Tests
```typescript
// tests/e2e/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('projects page has no accessibility violations', async ({ page }) => {
    await page.goto('/projects');
    
    const results = await new AxeBuilder({ page })
      .exclude('.third-party-widget') // Exclude known issues
      .analyze();
    
    expect(results.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Tab through main navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Can activate link with Enter
    await page.keyboard.press('Enter');
    await expect(page).not.toHaveURL('/');
  });
});
```

## Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed"
  }
}
```
