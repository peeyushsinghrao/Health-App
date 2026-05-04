import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Soochna Sahayak — Smart Office Assistant",
  description:
    "Soochna Sahayak (Smart Office Assistant) — Empowering Office Efficiency. PLP Report Generator, Staff Attendance, and more. An Initiative by Peeyush Singh Rao, Assistant Accounts Officer Grade II.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Soochna Sahayak',
  },
};

export const viewport = {
  themeColor: '#1A5C38',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Lora:ital,wght@0,400..700;1,400..700&family=JetBrains+Mono:wght@100..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-body">
        {children}
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
              navigator.serviceWorker.register('/sw.js').catch(function(err) {
                console.warn('SW registration failed:', err);
              });
            });
          }
        `}} />
      </body>
    </html>
  );
}
