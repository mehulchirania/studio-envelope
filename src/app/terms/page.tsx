import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import PageTransition from "@/components/layout/PageTransition";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use & Legal",
  description: "Terms of use, intellectual property guidelines, and legal disclosures for Studio Envelope architecture and interior design.",
  path: "/terms",
});

export default function TermsPage() {
  const lastUpdated = "October 2026";

  return (
    <PageTransition>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Terms of Use", url: "/terms" },
        ])}
      />

      <PageHero title="Terms of Use">
        Legal disclosures, intellectual property rights, and terms governing the use of this website.
      </PageHero>

      <article className="band-bone section-y">
        <div className="container-x max-w-3xl space-y-12">
          <div>
            <p className="label mb-2 text-muted">Effective Date: {lastUpdated}</p>
            <p className="text-lg leading-relaxed text-ink">
              Welcome to Studio Envelope (<span className="text-teal font-medium">studioenvelope.com</span>). By accessing or
              browsing this website, you agree to comply with and be bound by the following terms and conditions of use.
            </p>
          </div>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">1. Intellectual Property &amp; Copyright</h2>
            <p className="text-base leading-relaxed text-muted">
              All materials published on this website—including architectural plans, drawings, 3D visualisations, interior concepts,
              photographs, styling layouts, editorial copy, logos, and graphics—are the exclusive intellectual property of Studio
              Envelope and Ar. Prachi Chirania Bhalotia, unless otherwise credited.
            </p>
            <p className="text-base leading-relaxed text-muted">
              You may not reproduce, distribute, modify, republish, or commercially exploit any content, design drawings, or
              photographs from this website without prior express written permission from Studio Envelope.
            </p>
          </section>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">2. Design Visualisations &amp; Portfolio Representation</h2>
            <p className="text-base leading-relaxed text-muted">
              Portfolio images displayed on this site include professional architectural photography of completed spaces as well as
              digital 3D visualisations produced during design development. While we strive for realistic representations, digital
              visualisations reflect conceptual designs and lighting simulations that may differ in minor material finishes from
              built site conditions.
            </p>
          </section>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">3. Consultations &amp; Engagement</h2>
            <p className="text-base leading-relaxed text-muted">
              Inquiries and messages sent through this website do not constitute a formal contractual agreement or guarantee of project
              engagement. Formal architectural and interior design commissions require a bilateral written agreement specifying the
              scope of work, deliverables, timelines, and commercial fee structure.
            </p>
          </section>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">4. Limitation of Liability</h2>
            <p className="text-base leading-relaxed text-muted">
              The content on this website is provided for general informational and portfolio presentation purposes only. Studio
              Envelope makes no warranties regarding the accuracy or completeness of general design advice or material specifications
              outside of a commissioned project agreement.
            </p>
          </section>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">5. Governing Law &amp; Jurisdiction</h2>
            <p className="text-base leading-relaxed text-muted">
              These terms are governed by and construed in accordance with the laws of India. Any disputes arising out of or related
              to the use of this website or design services shall be subject to the exclusive jurisdiction of the competent courts in
              Bengaluru, Karnataka, India.
            </p>
          </section>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">6. Inquiries</h2>
            <p className="text-base leading-relaxed text-muted">
              For legal inquiries or permission requests, please contact:
            </p>
            <div className="rounded-xl border border-hairline bg-paper p-6 text-sm text-ink space-y-2">
              <p className="font-medium text-base">{site.name}</p>
              <p>Email: <a href={`mailto:${site.contact.email}`} className="text-teal hover:underline">{site.contact.email}</a></p>
              <p>Location: {site.contact.location}</p>
            </div>
            <p className="pt-4 text-sm text-muted">
              Please also review our <Link href="/privacy" className="text-teal hover:underline">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </article>
    </PageTransition>
  );
}
