import { constructMetadata } from '@/lib/metadata';
import { ProjectsPageClient } from './ProjectsPageClient';

export const metadata = constructMetadata({
  title: 'Projects',
  description:
    'Explore projects built by Krishna P -- full-stack web applications, frontend experiments, AI integrations, and more.',
  path: '/projects',
});

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
