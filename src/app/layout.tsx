import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LinguaSpeak",
  description: "Bridging Voices, Connecting Worlds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="/node_modules/preline/dist/preline.js" async></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
