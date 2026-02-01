import Link from 'next/link';

const socialLinks = [
  { href: 'https://github.com/krishnap', label: 'GitHub' },
  { href: 'https://linkedin.com/in/krishnap', label: 'LinkedIn' },
  { href: 'mailto:hello@krishnap.dev', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Krishna. All rights reserved.
        </p>
        <nav aria-label="Social links">
          <ul className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={
                    link.href.startsWith('http')
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
