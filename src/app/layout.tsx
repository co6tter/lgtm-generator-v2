import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "LGTM Generator - 簡単にLGTM画像を生成",
  description:
    "Unsplash、Pexels、Pixabayから画像を検索してLGTM画像を簡単に生成できるツール",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-gray-50 antialiased">
        <Header />
        {children}
      </body>
    </html>
  );
}
