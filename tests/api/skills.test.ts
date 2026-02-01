import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/skills/route';
import { NextRequest } from 'next/server';
import { skills } from '@/data/skills';

function makeRequest(params = '') {
  return new NextRequest(`http://localhost:3000/api/skills${params}`);
}

describe('GET /api/skills', () => {
  it('returns all skills', async () => {
    const res = await GET(makeRequest());
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.data).toHaveLength(skills.length);
  });

  it('filters by category', async () => {
    const res = await GET(makeRequest('?category=frontend'));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.data.every((s: { category: string }) => s.category === 'frontend')).toBe(true);
  });

  it('returns 400 for invalid category', async () => {
    const res = await GET(makeRequest('?category=invalid'));
    expect(res.status).toBe(400);
  });
});
