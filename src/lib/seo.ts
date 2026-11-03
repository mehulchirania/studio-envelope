import type { Metadata } from "next";
import { site } from "@/lib/content/site";
import type { Project } from "@/lib/content/types";

export const SITE_URL = "https://www.studioenvelope.com";

export const SHARE_TITLE = "Studio Envelope — Architecture & Interior Design Studio";
export const SHARE_DESCRIPTION =
  "Architecture and interior design studio based in Bangalore, crafting bespoke residential and commercial spaces across India.";

/** Default share image (1200x630), used wherever a page has no image of its own. */
export const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: "A dining area at a Studio Envelope home, beside a mirror work wall panel" };

/** Per-page metadata: sets the canonical URL and keeps Open Graph in step with
 * the title and description. Prefer this over hand-writing both blocks. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, title: `${title} | ${site.name}`, description, url: path, locale: "en_IN", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title: `${title} | ${site.name}`, description, images: [OG_IMAGE.url] },
  };
}

/** Base business entity schema (ArchitecturalService + LocalBusiness).
 * Only facts the studio has confirmed: no hours, price range or payment terms. */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["ArchitecturalService", "ProfessionalService", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: site.name,
    legalName: site.name,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/og-image.jpg`,
    description: site.description,
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    founder: {
      "@type": "Person",
      name: site.principal.name,
      jobTitle: "Principal Architect",
      sameAs: [site.principal.instagram],
    },
    areaServed: [
      {
        "@type": "City",
        name: "Bangalore",
        containedInPlace: { "@type": "State", name: "Karnataka" },
      },
      { "@type": "Country", name: "India" },
    ],
    sameAs: [
      site.socials.instagram,
      site.principal.instagram,
    ],
    knowsAbout: [
      "Architecture Design",
      "Interior Design",
      "Space Planning",
      "Furniture and Lighting Selection",
      "Colour and Material Consultation",
    ],
  };
}

/** WebSite schema for brand recognition and Google site name */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: site.name,
    alternateName: "Studio Envelope Bangalore",
    description: site.description,
    inLanguage: "en-IN",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

/** BreadcrumbList schema generator */
export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/** FAQPage schema for FAQs on Services page */
export function getFaqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/** Case study / CreativeWork schema for project pages */
export function getProjectSchema(project: Project) {
  const images = [
    project.coverImage,
    ...project.rooms.flatMap((r) => r.images.map((img) => img.src)),
  ].map((src) => (src.startsWith("http") ? src : `${SITE_URL}${src}`));

  return {
    "@context": "https://schema.org",
    "@type": ["CreativeWork", "VisualArtwork"],
    name: project.title,
    headline: `${project.title}, ${project.scope} by Studio Envelope`,
    description: project.summary || project.description.slice(0, 200),
    url: `${SITE_URL}/projects/${project.slug}`,
    image: Array.from(new Set(images)),
    creator: {
      "@type": "Person",
      name: site.principal.name,
      jobTitle: site.principal.role,
    },
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    ...(project.location ? { locationCreated: { "@type": "Place", name: project.location } } : {}),
    ...(project.year ? { dateCreated: `${project.year}` } : {}),
    genre: project.scope,
    artform: "Architecture and Interior Design",
  };
}
