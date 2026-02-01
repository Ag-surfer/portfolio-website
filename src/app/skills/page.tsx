import Link from 'next/link';
import type { Metadata } from 'next';
import { skills } from '@/data/skills';
import { constructMetadata } from '@/lib/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Skills',
  description: 'A complete overview of my technical skills and expertise.',
  path: '/skills',
});

const iconMap: Record<string, string> = {
  react: '\u269B\uFE0F',
  typescript: '\uD83D\uDCD8',
  nodejs: '\uD83D\uDFE2',
  database: '\uD83D\uDDC4\uFE0F',
  design: '\uD83C\uDFA8',
  ai: '\uD83E\uDD16',
  c: '\u2699\uFE0F',
  rust: '\uD83E\uDD80',
  python: '\uD83D\uDC0D',
  networking: '\uD83C\uDF10',
};

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  design: 'Design',
  'ai-ml': 'AI / ML',
  database: 'Database',
  systems: 'Systems Programming',
  networking: 'Networking',
};

export default function SkillsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span aria-hidden="true">&larr;</span> Home
      </Link>

      <header className="mt-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Skills
        </h1>
        <p className="mt-2 text-muted-foreground">
          Technologies and disciplines I work with. Click any skill to see the
          full learning roadmap.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {skills.map((skill) => {
          const emoji = iconMap[skill.icon] ?? skill.icon;
          return (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl" role="img" aria-hidden="true">
                  {emoji}
                </span>
                <div>
                  <h2 className="font-semibold tracking-tight text-card-foreground group-hover:text-primary transition-colors">
                    {skill.name}
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {categoryLabels[skill.category] ?? skill.category}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {skill.description}
              </p>
              {/* Proficiency bar */}
              <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
