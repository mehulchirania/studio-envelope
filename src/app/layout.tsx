import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SiteMotion from "@/components/SiteMotion";
import ScrollReveal from "@/components/ScrollReveal";
import Preloader from "@/components/motion/Preloader";
import CursorFollower from "@/components/motion/CursorFollower";

import { site } from "@/lib/site";

const SITE_URL = "https://studioenvelope.in";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/icon.svg" },
  title: {
    default: "Studio Envelope — Architecture & Interior Design, Bangalore",
    template: "%s — Studio Envelope",
  },
  description: site.description,
  keywords: [
    "Studio Envelope",
    "architecture studio Bangalore",
    "interior design Bangalore",
    "Prachi Chirania",
    "residential interior design",
  ],
  authors: [{ name: site.principal.name }],
  openGraph: {
    type: "website",
    siteName: site.name,
    title: "Studio Envelope — Architecture & Interior Design, Bangalore",
    description: site.description,
    url: SITE_URL,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studio Envelope — Architecture & Interior Design, Bangalore",
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
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body id="page-top" className="flex min-h-full flex-col bg-bone font-sans text-ink">
        <Preloader />
        <CursorFollower />
        <SmoothScroll>
          <SiteMotion>
            <ScrollReveal />
            {/* Header is fixed and overlays the page (every page now opens on
                a dark hero) — do NOT add top padding to <main>; each hero
                handles its own clearance for the fixed header. */}
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </SiteMotion>
        </SmoothScroll>
      </body>
    </html>
  );
}
