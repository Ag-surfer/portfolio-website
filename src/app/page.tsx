import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import {
  generatePersonSchema,
  generateWebSiteSchema,
  JsonLd,
} from '@/lib/jsonLd';

export default function Home() {
  const personSchema = generatePersonSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <>
      <JsonLd data={personSchema} />
      <JsonLd data={websiteSchema} />

      <HeroSection />

      <AboutSection />

      <ProjectsSection />

      <SkillsSection />

      <ContactSection />
    </>
  );
}
