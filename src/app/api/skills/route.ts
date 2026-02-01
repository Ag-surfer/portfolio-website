import { NextRequest, NextResponse } from 'next/server';
import { skills } from '@/data/skills';
import type { Skill } from '@/data/types';

/**
 * GET /api/skills
 * Returns skills list with optional filtering by category.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let data: Skill[] = skills;

    if (category) {
      const validCategories = ['frontend', 'backend', 'design', 'ai-ml', 'database', 'systems', 'networking'] as const;
      if (validCategories.includes(category as Skill['category'])) {
        data = data.filter((s) => s.category === category);
      } else {
        return NextResponse.json(
          { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
          { status: 400 },
        );
      }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('[API] GET /api/skills error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}
