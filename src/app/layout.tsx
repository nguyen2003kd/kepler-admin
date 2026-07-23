import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import baseConfig from "@configs/base";
import Thumnail from "@/assets/images/case-smeg-thumb.png"
import Facion from "@/assets/images/logo-facion.ico"
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
    default:
      'Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng TP. Hồ Chí Minh',
    template:
      '%s | Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng TP.HCM',
  },

  description:
    'Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng TP. Hồ Chí Minh là đơn vị sự nghiệp công lập trực thuộc Sở Khoa học và Công nghệ, thực hiện kiểm định, hiệu chuẩn, thử nghiệm, tư vấn và chứng nhận tiêu chuẩn, đo lường, chất lượng phục vụ quản lý nhà nước và doanh nghiệp.',

  keywords: [
    'tiêu chuẩn đo lường chất lượng',
    'kiểm định',
    'hiệu chuẩn',
    'thử nghiệm',
    'chuẩn đo lường',
    'kiểm định thiết bị y tế',
    'đo lường',
    'chất lượng sản phẩm',
    'quy chuẩn kỹ thuật',
    'dịch vụ khoa học công nghệ',
    'Sở Khoa học và Công nghệ TP.HCM',
    'kiểm định an toàn thiết bị y tế',
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
    title:
      'Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng TP. Hồ Chí Minh',
    description:
      'Đơn vị sự nghiệp công lập trực thuộc Sở Khoa học và Công nghệ TP.HCM, cung cấp dịch vụ kiểm định, hiệu chuẩn, thử nghiệm, chứng nhận và tư vấn về tiêu chuẩn, đo lường, chất lượng.',
    url: baseConfig.frontendDomain,
    siteName:
      'Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng TP.HCM',
    images: [
      {
        url: `${baseConfig.frontendDomain}/${Thumnail.src}`,
        width: 1200,
        height: 630,
        alt:
          'Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng TP. Hồ Chí Minh',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title:
      'Trung tâm Kỹ thuật Tiêu chuẩn Đo lường Chất lượng TP.HCM',
    description:
      'Kiểm định – Hiệu chuẩn – Thử nghiệm – Tư vấn tiêu chuẩn đo lường chất lượng tại TP. Hồ Chí Minh.',
    images: [`${baseConfig.frontendDomain}/${Thumnail.src}`],
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
