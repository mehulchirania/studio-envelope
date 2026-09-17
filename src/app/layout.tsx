import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Grain from "@/components/Grain";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollReveal from "@/components/ScrollReveal";

import { site } from "@/lib/site";

const SITE_URL = "https://studioenvelope.in";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.name} — Architecture & Interior Design Studio`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Studio Envelope",
    "architecture studio India",
    "interior design India",
    "Prachi Chirania",
    "residential interior design",
    "art and installations",
  ],
  authors: [{ name: site.principal.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} — Architecture & Interior Design Studio`,
    description: site.description,
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Architecture & Interior Design Studio`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col text-fg">
        <SmoothScroll>
          <Grain />
          <ScrollReveal />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}

