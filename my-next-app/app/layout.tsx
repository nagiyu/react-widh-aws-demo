import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "テスト用ページ",
  description: "テスト用のページです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header>
          <h1>テスト用ページ</h1>
        </header>
        <main>
          {children}
        </main>
        <footer>
          <p>&copy; 2025 テスト用ページ</p>
        </footer>
      </body>
    </html>
  );
}
