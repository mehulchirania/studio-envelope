import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HideOnAdmin from "@/components/layout/HideOnAdmin";
import BackToTop from "@/components/layout/BackToTop";
import JsonLd from "@/components/seo/JsonLd";
import { getLocalBusinessSchema, getWebSiteSchema, SITE_URL } from "@/lib/seo";
import { site } from "@/lib/content/site";
import { Analytics } from "@vercel/analytics/next";

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

const SHARE_TITLE = "Studio Envelope — Architecture & Interior Design, Bangalore";
const SHARE_IMAGE = "/images/projects/james-residence/living.jpg";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  title: { default: SHARE_TITLE, template: "%s — Studio Envelope" },
  description: site.description,
  keywords: [
    "Studio Envelope",
    "architecture studio Bangalore",
    "interior design Bangalore",
    "Prachi Chirania Bhalotia",
    "residential architecture Bangalore",
    "architects in Bengaluru",
    "interior designer Ballari",
    "architecture Pune",
  ],
  authors: [{ name: site.principal.name }],
  creator: site.principal.name,
  publisher: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: SHARE_TITLE,
    description: site.description,
    url: SITE_URL,
    locale: "en_IN",
    images: [{ url: SHARE_IMAGE, width: 1650, height: 1795, alt: SHARE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: site.description,
    images: [SHARE_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable} h-full antialiased`}>
      <head>
        <JsonLd schema={getLocalBusinessSchema()} />
        <JsonLd schema={getWebSiteSchema()} />
      </head>
      <body id="page-top" className="flex min-h-full flex-col bg-bone font-sans text-ink">
        {/* The header is fixed and overlays each page's dark hero, so <main>
            gets no top padding; every hero clears the header itself. Both are
            hidden on /admin, which renders its own chrome. */}
        <HideOnAdmin>
          <Header />
        </HideOnAdmin>
        <main className="flex-1">{children}</main>
        <HideOnAdmin>
          <Footer />
        </HideOnAdmin>
        <HideOnAdmin>
          <BackToTop />
        </HideOnAdmin>
        <Analytics />
      </body>
    </html>
  );
}
