import { describe, it, expect } from 'vitest';
import { projects, getProjectBySlug, getFeaturedProjects, getProjectsByCategory } from '@/data/projects';

describe('projects data', () => {
  it('all projects have required fields', () => {
    for (const p of projects) {
      expect(p.id).toBeTruthy();
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.category).toBeTruthy();
      expect(p.tags.length).toBeGreaterThan(0);
      expect(p.techStack.length).toBeGreaterThan(0);
      expect(typeof p.featured).toBe('boolean');
    }
  });
});

describe('getProjectBySlug', () => {
  it('returns the correct project for a valid slug', () => {
    const project = getProjectBySlug('collaborative-workspace');
    expect(project).toBeDefined();
    expect(project!.title).toBe('Collaborative Workspace');
  });

  it('returns undefined for an invalid slug', () => {
    expect(getProjectBySlug('nonexistent')).toBeUndefined();
  });
});

describe('getFeaturedProjects', () => {
  it('returns only featured projects', () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThan(0);
    expect(featured.every((p) => p.featured)).toBe(true);
  });
});

describe('getProjectsByCategory', () => {
  it('filters by category correctly', () => {
    const frontend = getProjectsByCategory('frontend');
    expect(frontend.length).toBeGreaterThan(0);
    expect(frontend.every((p) => p.category === 'frontend')).toBe(true);
  });

  it('returns empty array for category with no projects', () => {
    const design = getProjectsByCategory('design');
    expect(design).toEqual([]);
  });
});
