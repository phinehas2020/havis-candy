import type { Metadata } from "next";
import { Monoton, Carter_One, DM_Sans } from "next/font/google";

import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/lib/cart/cart-context";
import { siteConfig, wacoKeywordTargets } from "@/lib/site";
import "./globals.css";

const monoton = Monoton({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-monoton",
});

const carterOne = Carter_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-carter-one",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
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
    <html lang="en" className={`${monoton.variable} ${carterOne.variable} ${dmSans.variable}`}>
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
