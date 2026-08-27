import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import baseConfig from "@configs/base";
import Facion from "@/assets/images/logo-facion.ico"
import Logo from "@/assets/images/logo.png"
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
  icons: {
    icon: `${Facion.src}`,
    shortcut: `${Facion.src}`,
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

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    title: 'Kepler Group | Hệ sinh thái dịch vụ bất động sản toàn diện',
    description:
      'Kepler Group cung cấp hệ sinh thái dịch vụ bất động sản toàn diện: tư vấn đầu tư, thẩm định giá, phát triển dự án, quản lý tài sản, M&A, thiết kế xây dựng và giải pháp số.',
    url: baseConfig.frontendDomain,
    siteName: 'Kepler Group',
    images: [
      {
        url: `${baseConfig.frontendDomain}/${Logo.src}`,
        width: 1200,
        height: 630,
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
    images: [`${baseConfig.frontendDomain}/${Logo.src}`],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
