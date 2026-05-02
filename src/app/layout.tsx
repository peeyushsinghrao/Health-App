import type { Metadata } from "next";
import "./web-portal.css";

export const metadata: Metadata = {
  title: "Soochna Sahayak — Smart Office Assistant",
  description:
    "Soochna Sahayak (Smart Office Assistant) — Empowering Office Efficiency. PLP Report Generator, Staff Attendance, and more. An Initiative by Peeyush Singh Rao, Assistant Accounts Officer Grade II.",
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Serif+Devanagari:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0A6E6E" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}})();` }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
