import type { Metadata } from 'next';
import { siteMetadata } from '@/data/siteMetadata';

interface ConstructMetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  image,
  path = '',
  noIndex = false,
}: ConstructMetadataOptions = {}): Metadata {
  const url = `${siteMetadata.siteUrl}${path}`;
  const ogImage = image || siteMetadata.ogImage;
  const metaDescription = description || siteMetadata.description;

  return {
    metadataBase: new URL(siteMetadata.siteUrl),
    title: title
      ? { default: title, template: `%s | ${siteMetadata.name}` }
      : {
          default: siteMetadata.title,
          template: `%s | ${siteMetadata.name}`,
        },
    description: metaDescription,
    keywords: siteMetadata.keywords,
    authors: [{ name: siteMetadata.name, url: siteMetadata.siteUrl }],
    creator: siteMetadata.name,
    publisher: siteMetadata.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: siteMetadata.name,
      title: title || siteMetadata.title,
      description: metaDescription,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title || siteMetadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || siteMetadata.title,
      description: metaDescription,
      images: [ogImage],
      creator: siteMetadata.social?.twitter
        ? `@${siteMetadata.social.twitter}`
        : undefined,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large' as const,
            'max-snippet': -1,
          },
        },
    alternates: {
      canonical: url,
    },
  };
}
