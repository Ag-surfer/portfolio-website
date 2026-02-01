import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/projects/route';
import { NextRequest } from 'next/server';
import { projects } from '@/data/projects';

function makeRequest(params = '') {
  return new NextRequest(`http://localhost:3000/api/projects${params}`);
}

describe('GET /api/projects', () => {
  it('returns all projects', async () => {
    const res = await GET(makeRequest());
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.data).toHaveLength(projects.length);
  });

  it('filters by category', async () => {
    const res = await GET(makeRequest('?category=frontend'));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.data.every((p: { category: string }) => p.category === 'frontend')).toBe(true);
  });

  it('filters by featured', async () => {
    const res = await GET(makeRequest('?featured=true'));
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.data.every((p: { featured: boolean }) => p.featured)).toBe(true);
  });

  it('returns 400 for invalid category', async () => {
    const res = await GET(makeRequest('?category=invalid'));
    expect(res.status).toBe(400);
  });
});
