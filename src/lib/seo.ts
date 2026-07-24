import { Metadata } from 'next';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description = "High-performance Next.js admin dashboard for Kepler Property management",
  image = "/images/default-og-image.jpg",
  url = "",
  type = 'website',
  noIndex = false,
}: SeoProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kepler-admin.vercel.app';
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;

  return {
    title: {
      default: title,
      template: `%s | Kepler Property Admin`,
    },
    description,
    keywords: [
      'bất động sản',
      'real estate',
      'quản lý bất động sản',
      'Kepler Property',
      'admin dashboard'
    ],
    authors: [{ name: 'Kepler Property Team' }],
    creator: 'Kepler Property',
    publisher: 'Kepler Property',

    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    openGraph: {
      type,
      title,
      description,
      url: fullUrl,
      siteName: 'Kepler Property Admin',
      images: [{
        url: fullImageUrl,
        width: 1200,
        height: 630,
        alt: title,
      }],
      locale: 'vi_VN',
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImageUrl],
      creator: '@kepler_property',
    },

    alternates: {
      canonical: fullUrl,
    },

    metadataBase: new URL(baseUrl),
  };
}
