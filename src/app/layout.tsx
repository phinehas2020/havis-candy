import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

import { siteConfig, wacoKeywordTargets } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.domain),
  title: {
    default: "Havi's Candy Co. | Handmade Hard Caramels in Waco, Texas",
    template: "%s | Havi's Candy Co.",
  },
  description: siteConfig.description,
  keywords: [
    "Havi's Candy Co.",
    "Waco candy store",
    "handmade hard caramels",
    "artisan candy Waco",
    ...wacoKeywordTargets,
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Havi's Candy Co. | Handmade Hard Caramels in Waco, Texas",
    description: siteConfig.description,
    url: siteConfig.domain,
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Havi's Candy Co. | Handmade Hard Caramels in Waco, Texas",
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  );
}
