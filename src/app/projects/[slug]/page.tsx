import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { projects, getProjectBySlug } from '@/data/projects';
import { constructMetadata } from '@/lib/metadata';
import { generateProjectSchema, JsonLd } from '@/lib/jsonLd';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return constructMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${project.slug}`,
  });
}

const categoryGradients: Record<string, string> = {
  fullstack: 'from-violet-500 to-indigo-600',
  frontend: 'from-sky-400 to-blue-600',
  backend: 'from-emerald-400 to-teal-600',
  'ai-ml': 'from-amber-400 to-orange-600',
  design: 'from-pink-400 to-rose-600',
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const schema = generateProjectSchema({
    title: project.title,
    description: project.description,
    slug: project.slug,
    image: project.imageUrl,
    tags: project.tags,
    date: project.completedAt,
  });

  return (
    <>
      <JsonLd data={schema} />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Projects
        </Link>

        <div
          className={`mt-8 aspect-video w-full rounded-xl bg-gradient-to-br ${categoryGradients[project.category] ?? 'from-gray-400 to-gray-600'} flex items-center justify-center`}
        >
          <span className="text-white/20 text-8xl font-bold select-none">
            {project.title.charAt(0)}
          </span>
        </div>

        <h1 className="mt-8 text-4xl font-extrabold tracking-tight sm:text-5xl">
          {project.title}
        </h1>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          {project.longDescription}
        </p>

        <div className="mt-10">
          <h2 className="text-xl font-semibold tracking-tight">Tech Stack</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-mono"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              Source Code
            </a>
          )}
        </div>

        {project.completedAt && (
          <p className="mt-10 text-sm text-muted-foreground">
            Completed{' '}
            <time dateTime={project.completedAt}>
              {new Date(project.completedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </time>
          </p>
        )}
      </main>
    </>
  );
}
