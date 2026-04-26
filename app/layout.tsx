import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Noto_Serif_JP } from "next/font/google";

const notoSerifJP = Noto_Serif_JP({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "小川クリニック | 予約システム",
  description: "体の不調を根本から改善。オンライン予約・会員管理システム。",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "小川クリニック",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2d6a4f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`antialiased min-h-screen bg-[#faf8f5] ${notoSerifJP.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
