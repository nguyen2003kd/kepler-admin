import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import baseConfig from "@configs/base";
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
    icon: "/icon.png",
    shortcut: "/icon.png",
  },

  title: {
    default: 'Kepler Property | Mua bán, Cho thuê & Dự án Bất động sản',
    template: '%s | Kepler Property',
  },

  description: 'Kepler Property cập nhật thông tin mua bán, cho thuê căn hộ, nhà phố, đất nền và các dự án bất động sản. Hỗ trợ tư vấn pháp lý, tài chính và đầu tư.',

  keywords: [
    'Kepler Property',
    'bất động sản',
    'mua bán nhà đất',
    'cho thuê bất động sản',
    'căn hộ',
    'nhà phố',
    'đất nền',
    'biệt thự',
    'dự án bất động sản',
    'tư vấn đầu tư',
    'tư vấn pháp lý',
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
    title: 'Kepler Property | Mua bán, Cho thuê & Dự án Bất động sản',
    description: 'Kepler Property cập nhật thông tin mua bán, cho thuê căn hộ, nhà phố, đất nền và các dự án bất động sản. Hỗ trợ tư vấn pháp lý, tài chính và đầu tư.',
    url: baseConfig.frontendDomain,
    siteName: 'Kepler Property',
    images: [
      {
        url: `${baseConfig.frontendDomain}/seo.png`,
        width: 1200,
        height: 630,
        alt: 'Kepler Property',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Kepler Property | Mua bán, Cho thuê & Dự án Bất động sản',
    description: 'Kepler Property cập nhật thông tin mua bán, cho thuê căn hộ, nhà phố, đất nền và các dự án bất động sản. Hỗ trợ tư vấn pháp lý, tài chính và đầu tư.',
    images: [`${baseConfig.frontendDomain}/seo.png`],
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
