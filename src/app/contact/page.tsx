import { constructMetadata } from '@/lib/metadata';
import { ContactSection } from '@/components/sections/ContactSection';

export const metadata = constructMetadata({
  title: 'Contact',
  description:
    'Get in touch with Krishna P. Have a project idea, collaboration opportunity, or just want to say hello? Send me a message.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <main>
      <ContactSection showInfo />
    </main>
  );
}
