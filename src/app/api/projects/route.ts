import { NextRequest, NextResponse } from 'next/server';
import { projects, getFeaturedProjects, getProjectsByCategory } from '@/data/projects';
import type { Project } from '@/data/types';

/**
 * GET /api/projects
 * Returns projects list with optional filtering by category or featured status.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');

    let data: Project[] = projects;

    if (featured === 'true') {
      data = getFeaturedProjects();
    }

    if (category) {
      const validCategories = ['fullstack', 'frontend', 'backend', 'ai-ml', 'design'] as const;
      if (validCategories.includes(category as Project['category'])) {
        data = data.filter((p) => p.category === category);
      } else {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API] GET /api/projects error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
