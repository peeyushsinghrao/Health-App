import type { Metadata } from "next";
import "./globals.css";

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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0A0F1E" />
      </head>
      <body className="antialiased">
        <div className="grain-overlay pointer-events-none fixed inset-0 z-50"></div>
        {children}
      </body>
    </html>
  );
}
