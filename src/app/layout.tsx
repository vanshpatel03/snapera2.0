import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'EraSnap',
  description: 'Discover your historical persona.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Lato:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        {/* 🔥 Adsterra Popunder Script */}
        <Script
          id="adsterra-popunder"
          strategy="afterInteractive"
          src="//pl27454332.profitableratecpm.com/f8/2c/d7/f82cd78bec83f6639ee1d48b2bf39c37.js"
        />

        {children}
        <Toaster />
      </body>
    </html>
  );
}
