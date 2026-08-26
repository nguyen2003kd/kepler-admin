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
    default: 'Kepler Group Admin',
    template: '%s | Kepler Group Admin',
  },

  description:
    'Hệ thống quản trị Kepler Group — Thẩm định giá, Môi giới & Quản lý Bất động sản.',

  keywords: [
    'Kepler Group',
    'thẩm định giá',
    'môi giới bất động sản',
    'quản lý bất động sản',
    'bất động sản',
    'admin dashboard',
    'kepler admin',
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
    title: 'Kepler Group Admin',
    description:
      'Hệ thống quản trị Kepler Group — Thẩm định giá, Môi giới & Quản lý Bất động sản.',
    url: baseConfig.frontendDomain,
    siteName: 'Kepler Group Admin',
    images: [
      {
        url: `${baseConfig.frontendDomain}/${Logo.src}`,
        width: 1200,
        height: 630,
        alt: 'Kepler Group Admin',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Kepler Group Admin',
    description:
      'Hệ thống quản trị Kepler Group — Thẩm định giá, Môi giới & Quản lý Bất động sản.',
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
