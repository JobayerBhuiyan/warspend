import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://warspend.com";

export const metadata: Metadata = {
  title: "Iran War Spend Tracker — Live Estimate of U.S. Taxpayer Spending",
  description:
    "Live estimate of U.S. taxpayer spending on military operations. Based on the Pentagon's preliminary estimate of $1 billion per day.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Iran War Spend Tracker — Live Estimate of U.S. Taxpayer Spending",
    description:
      "Live estimate of U.S. taxpayer spending on military operations. Based on the Pentagon's preliminary estimate of $1 billion per day.",
    url: siteUrl,
    siteName: "Iran War Spend Tracker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iran War Spend Tracker — Live Estimate of U.S. Taxpayer Spending",
    description:
      "Live estimate of U.S. taxpayer spending on military operations.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS prefetch and preconnect for faster API connections */}
        {apiUrl && (
          <>
            <link rel="dns-prefetch" href={apiUrl} />
            <link rel="preconnect" href={apiUrl} crossOrigin="anonymous" />
          </>
        )}
        {/* Preconnect to Google Fonts (used by next/font) */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Preconnect to AdSense - loaded lazily but connection can start early */}
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
