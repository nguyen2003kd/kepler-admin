import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import baseConfig from "@configs/base";

const siteUrl = baseConfig.frontendDomain || 'https://kepler-dev.meucorp.com';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: 'Kepler Group Admin',
  manifest: '/favicon-for-app/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-for-app/favicon.ico', sizes: 'any' },
      { url: '/favicon-for-app/icon0.svg', type: 'image/svg+xml' },
      { url: '/favicon-for-app/icon1.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon-for-app/favicon.ico',
    apple: [
      { url: '/favicon-for-app/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },

  title: {
    default: 'Kepler Group | Hệ sinh thái dịch vụ bất động sản toàn diện',
    template: '%s | Kepler Group',
  },

  description:
    'Kepler Group cung cấp hệ sinh thái dịch vụ bất động sản toàn diện: tư vấn đầu tư, thẩm định giá, phát triển dự án, quản lý tài sản, M&A, thiết kế xây dựng và giải pháp số.',

  keywords: [
    'Kepler Group',
    'Kepler Property',
    'dịch vụ bất động sản',
    'tư vấn đầu tư bất động sản',
    'thẩm định giá',
    'môi giới bất động sản',
    'quản lý bất động sản',
    'phát triển dự án bất động sản',
    'tư vấn M&A',
    'thiết kế xây dựng',
    'giải pháp số bất động sản',
    'bất động sản',
  ],

  alternates: {
    canonical: '/',
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  robots: {
    index: false,
    follow: false,
    nocache: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },

  openGraph: {
    title: 'Kepler Group | Hệ sinh thái dịch vụ bất động sản toàn diện',
    description:
      'Kepler Group cung cấp hệ sinh thái dịch vụ bất động sản toàn diện: tư vấn đầu tư, thẩm định giá, phát triển dự án, quản lý tài sản, M&A, thiết kế xây dựng và giải pháp số.',
    url: siteUrl,
    siteName: 'Kepler Group',
    images: [
      {
        url: '/seo.png',
        width: 1731,
        height: 909,
        alt: 'Kepler Group | Hệ sinh thái dịch vụ bất động sản toàn diện',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Kepler Group | Hệ sinh thái dịch vụ bất động sản toàn diện',
    description:
      'Kepler Group cung cấp hệ sinh thái dịch vụ bất động sản toàn diện: tư vấn đầu tư, thẩm định giá, phát triển dự án, quản lý tài sản, M&A, thiết kế xây dựng và giải pháp số.',
    images: ['/seo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
