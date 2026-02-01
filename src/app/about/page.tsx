import Link from 'next/link';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { constructMetadata } from '@/lib/metadata';
import { about } from '@/data/about';
import { Timeline } from '@/components/Timeline';

export const metadata = constructMetadata({
  title: 'About',
  description: about.bio,
  path: '/about',
});

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
} as const;

export default function AboutPage() {
  const paragraphs = about.extendedBio.split('\n\n');

  return (
    <main>
      {/* Header */}
      <section className="mx-auto max-w-3xl px-4 pt-24 pb-12 sm:px-6 md:pt-32 md:pb-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-balance">
          {about.name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          {about.title}
        </p>
      </section>

      {/* Extended Bio */}
      <section
        className="mx-auto max-w-2xl px-4 py-12 sm:px-6"
        aria-label="Biography"
      >
        <div className="space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-7 text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section
        className="mx-auto max-w-4xl px-4 py-12 sm:px-6"
        aria-label="Career timeline"
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl mb-10">
          My Journey
        </h2>
        <Timeline items={about.timeline} />
      </section>

      {/* Social Links */}
      <section
        className="mx-auto max-w-2xl px-4 py-12 sm:px-6 pb-24"
        aria-label="Social links"
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl mb-6">
          Find Me Online
        </h2>
        <div className="flex gap-4">
          {(
            Object.entries(about.socialLinks) as [
              keyof typeof socialIcons,
              string,
            ][]
          ).map(([platform, url]) => {
            if (!url) return null;
            const Icon = socialIcons[platform];
            if (!Icon) return null;

            return (
              <Link
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label={`Visit ${platform} profile`}
              >
                <Icon className="h-5 w-5" />
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
