import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "وصال — رود ماب التعافي من التعفن الدماغي",
  description: "رحلة ٣ أشهر للتخلص من التعفن الدماغي — مبنية على CBT والـ Gamification",
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/Felfel-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @font-face {
                font-family: 'Felfel';
                src: url('/fonts/Felfel-Bold.woff2') format('woff2');
                font-weight: 700;
                font-style: normal;
                font-display: swap;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistMono.variable} antialiased`}
        style={{
          background: '#0f1f2e',
          color: '#f8f5f0',
          fontFamily: "'Felfel', 'Segoe UI', Tahoma, sans-serif",
        }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
