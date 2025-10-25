import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { AuthProvider } from "@/components/auth/AuthProvider"; // 一時的にコメントアウト

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIスケジュール調整 - 学習管理アプリ",
  description: "AIがあなたの学習スケジュールを自動で最適化します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <AuthProvider> */}
          {children}
        {/* </AuthProvider> */}
      </body>
    </html>
  );
}
