import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '@/app/api/contact/route';
import { NextRequest } from 'next/server';

function makeRequest(body: Record<string, unknown>) {
  return new NextRequest('http://localhost:3000/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/contact', () => {
  it('succeeds with valid data', async () => {
    const res = await POST(makeRequest({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello there!',
    }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('returns errors for missing fields', async () => {
    const res = await POST(makeRequest({}));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.errors).toContain('Name is required');
    expect(data.errors).toContain('Email is required');
    expect(data.errors).toContain('Message is required');
  });

  it('returns error for invalid email', async () => {
    const res = await POST(makeRequest({
      name: 'John',
      email: 'not-an-email',
      message: 'Hello',
    }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.errors).toContain('Email format is invalid');
  });

  it('honeypot field silently succeeds', async () => {
    const res = await POST(makeRequest({
      name: 'Bot',
      email: 'bot@spam.com',
      message: 'spam',
      honeypot: 'gotcha',
    }));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('rejects message over 2000 characters', async () => {
    const res = await POST(makeRequest({
      name: 'John',
      email: 'john@example.com',
      message: 'a'.repeat(2001),
    }));
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data.errors).toContain('Message must be 2000 characters or less');
  });
});
