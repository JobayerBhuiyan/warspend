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

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://iran-cost-ticker.com";

export const metadata: Metadata = {
  title: "Iran War Cost Tracker — Live Estimate of U.S. Taxpayer Spending",
  description:
    "Live estimate of U.S. taxpayer spending on military operations. Based on the Pentagon's preliminary estimate of $1 billion per day.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Iran War Cost Tracker — Live Estimate of U.S. Taxpayer Spending",
    description:
      "Live estimate of U.S. taxpayer spending on military operations. Based on the Pentagon's preliminary estimate of $1 billion per day.",
    url: siteUrl,
    siteName: "Iran War Cost Tracker",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iran War Cost Tracker — Live Estimate of U.S. Taxpayer Spending",
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
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2647936076482005"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
