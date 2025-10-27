import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { reconstructCookieState } from "@/lib/dataBackup";
import { AuthProvider } from "@/components/auth/AuthProvider";
import BootGate from "@/components/BootGate";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Cookieから状態を復元
  const cookieStore = await cookies()
  const cookieState = reconstructCookieState(cookieStore)
  
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__COOKIE_BACKUP__=${JSON.stringify(cookieState ?? null)};`,
          }}
        />
        <AuthProvider>
          <BootGate>
            {children}
          </BootGate>
        </AuthProvider>
      </body>
    </html>
  );
}
