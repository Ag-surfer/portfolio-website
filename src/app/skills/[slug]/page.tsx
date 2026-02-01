import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { skills, getSkillBySlug } from '@/data/skills';
import { getProjectBySlug } from '@/data/projects';
import { constructMetadata } from '@/lib/metadata';
import { SkillPageClient } from './SkillPageClient';
import { SkillRoadmap } from '@/components/SkillRoadmap';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return skills.map((skill) => ({ slug: skill.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) return {};

  return constructMetadata({
    title: `${skill.name} — Skills`,
    description: skill.description,
    path: `/skills/${skill.slug}`,
  });
}

const iconMap: Record<string, string> = {
  react: '\u269B\uFE0F',
  typescript: '\uD83D\uDCD8',
  nodejs: '\uD83D\uDFE2',
  database: '\uD83D\uDDC4\uFE0F',
  design: '\uD83C\uDFA8',
  ai: '\uD83E\uDD16',
};

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  design: 'Design',
  'ai-ml': 'AI / ML',
  database: 'Database',
};

export default async function SkillPage({ params }: PageProps) {
  const { slug } = await params;
  const skill = getSkillBySlug(slug);
  if (!skill) notFound();

  const emoji = iconMap[skill.icon] ?? skill.icon;
  const relatedProjects = skill.relatedProjectSlugs
    .map(getProjectBySlug)
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
      {/* Back link */}
      <Link
        href="/#skills"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span aria-hidden="true">&larr;</span> Back to skills
      </Link>

      {/* Header */}
      <header className="mt-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl" role="img" aria-hidden="true">
            {emoji}
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {skill.name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-block rounded-full bg-secondary px-3 py-0.5 text-xs font-medium text-secondary-foreground">
                {categoryLabels[skill.category] ?? skill.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} of experience
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Animated proficiency bar (client component) */}
      <SkillPageClient proficiency={skill.proficiency} />

      {/* Long description */}
      <section className="mt-10" aria-label="About this skill">
        <p className="leading-7 text-muted-foreground">{skill.longDescription}</p>
      </section>

      {/* Highlights */}
      {skill.highlights.length > 0 && (
        <section className="mt-10" aria-labelledby="highlights-heading">
          <h2
            id="highlights-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Highlights
          </h2>
          <ul className="mt-4 space-y-3">
            {skill.highlights.map((item, i) => (
              <li key={i} className="flex gap-3 text-muted-foreground">
                <svg
                  className="mt-1 h-4 w-4 shrink-0 text-primary"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M13.25 4.75L6 12 2.75 8.75"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Learning Roadmap */}
      {skill.roadmap.length > 0 && <SkillRoadmap roadmap={skill.roadmap} />}

      {/* Related Projects */}
      {relatedProjects.length > 0 && (
        <section className="mt-12" aria-labelledby="related-projects-heading">
          <h2
            id="related-projects-heading"
            className="text-xl font-semibold tracking-tight"
          >
            Related Projects
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedProjects.map((project) =>
              project ? (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <h3 className="font-semibold tracking-tight text-card-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </Link>
              ) : null,
            )}
          </div>
        </section>
      )}
    </main>
  );
}
