import { describe, it, expect } from 'vitest';
import { skills, getSkillBySlug, getSkillsByCategory } from '@/data/skills';
import { projects } from '@/data/projects';

describe('skills data', () => {
  it('all skills have proficiency between 0 and 100', () => {
    for (const s of skills) {
      expect(s.proficiency).toBeGreaterThanOrEqual(0);
      expect(s.proficiency).toBeLessThanOrEqual(100);
    }
  });

  it('all relatedProjectSlugs reference valid project slugs', () => {
    const validSlugs = new Set(projects.map((p) => p.slug));
    for (const s of skills) {
      for (const slug of s.relatedProjectSlugs) {
        expect(validSlugs.has(slug)).toBe(true);
      }
    }
  });

  it('all skills have required fields', () => {
    for (const s of skills) {
      expect(s.id).toBeTruthy();
      expect(s.slug).toBeTruthy();
      expect(s.name).toBeTruthy();
      expect(s.category).toBeTruthy();
      expect(s.highlights.length).toBeGreaterThan(0);
    }
  });
});

describe('getSkillBySlug', () => {
  it('returns the correct skill for a valid slug', () => {
    const skill = getSkillBySlug('typescript');
    expect(skill).toBeDefined();
    expect(skill!.name).toBe('TypeScript');
  });

  it('returns undefined for an invalid slug', () => {
    expect(getSkillBySlug('nonexistent')).toBeUndefined();
  });
});

describe('getSkillsByCategory', () => {
  it('filters by category correctly', () => {
    const frontend = getSkillsByCategory('frontend');
    expect(frontend.length).toBeGreaterThan(0);
    expect(frontend.every((s) => s.category === 'frontend')).toBe(true);
  });
});
