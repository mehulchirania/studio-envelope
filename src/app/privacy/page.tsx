import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import PageTransition from "@/components/layout/PageTransition";
import JsonLd from "@/components/seo/JsonLd";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { site } from "@/lib/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for Studio Envelope, outlining how client contact information, project inquiries, and website analytics are handled.",
  path: "/privacy",
});

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 2026";

  return (
    <PageTransition>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Privacy Policy", url: "/privacy" },
        ])}
      />

      <PageHero title="Privacy Policy">
        How Studio Envelope collects, protects, and respects your personal information.
      </PageHero>

      <article className="band-bone section-y">
        <div className="container-x max-w-3xl space-y-12">
          <div>
            <p className="label mb-2 text-muted">Effective Date: {lastUpdated}</p>
            <p className="text-lg leading-relaxed text-ink">
              Studio Envelope (&quot;we,&quot; &quot;our,&quot; or &quot;the studio&quot;), led by Ar. Prachi Chirania Bhalotia in
              Bangalore, India, is committed to safeguarding the personal privacy of clients, collaborators, and visitors to our
              website (<span className="text-teal font-medium">studioenvelope.com</span>).
            </p>
          </div>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">1. Information We Collect</h2>
            <p className="text-base leading-relaxed text-muted">
              We collect information that you voluntarily provide to us when submitting an inquiry through our contact form,
              emailing, or messaging the studio via WhatsApp or telephone. This typically includes:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-base text-muted">
              <li>Your name and contact details (email address, telephone number, city, and neighborhood).</li>
              <li>Details concerning your project (property type, estimated area, budget range, and timeline).</li>
              <li>Any design briefs, site references, or architectural drawings you choose to share.</li>
            </ul>
          </section>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">2. How We Use Your Information</h2>
            <p className="text-base leading-relaxed text-muted">
              Information submitted to Studio Envelope is used solely for professional architectural and interior design
              purposes, specifically:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-base text-muted">
              <li>Reviewing your project brief and preparing consultation proposals.</li>
              <li>Responding to your messages, calls, and meeting requests.</li>
              <li>Managing project timelines, vendor coordination, and turnkey site deliveries.</li>
            </ul>
            <p className="text-base leading-relaxed text-muted">
              We do not sell, rent, or trade your personal data to third-party marketers or advertisers under any circumstances.
            </p>
          </section>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">3. Analytics &amp; Cookies</h2>
            <p className="text-base leading-relaxed text-muted">
              Our website uses privacy-focused, cookie-free web analytics (Vercel Web Analytics) to understand aggregate traffic
              patterns and improve site performance. This system records non-identifying technical data (such as page views,
              browser type, and referral source) without creating cross-site tracking profiles or storing personally identifiable cookies.
            </p>
          </section>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">4. Data Storage &amp; Security</h2>
            <p className="text-base leading-relaxed text-muted">
              Inquiries submitted through our website are securely processed and stored in our database (Google Firebase /
              Firestore) with strict access control rules. Only authorized studio administrators can access the inquiry inbox.
              We implement industry-standard security measures to prevent unauthorized access or disclosure.
            </p>
          </section>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">5. Your Rights</h2>
            <p className="text-base leading-relaxed text-muted">
              You may request a copy of the personal information we hold about you, request corrections, or ask us to delete
              your contact information from our records at any time by writing directly to our studio team.
            </p>
          </section>

          <section className="space-y-4 border-t border-hairline pt-8">
            <h2 className="font-display text-2xl text-ink">6. Contacting the Studio</h2>
            <p className="text-base leading-relaxed text-muted">
              If you have questions or concerns regarding our privacy practices, please contact us:
            </p>
            <div className="rounded-xl border border-hairline bg-paper p-6 text-sm text-ink space-y-2">
              <p className="font-medium text-base">{site.name}</p>
              <p>Email: <a href={`mailto:${site.contact.email}`} className="text-teal hover:underline">{site.contact.email}</a></p>
              <p>Phone: <a href={site.contact.phoneHref} className="text-teal hover:underline">{site.contact.phone}</a></p>
              <p>Location: {site.contact.location}</p>
            </div>
            <p className="pt-4 text-sm text-muted">
              Looking for our terms? Read our <Link href="/terms" className="text-teal hover:underline">Terms of Use</Link>.
            </p>
          </section>
        </div>
      </article>
    </PageTransition>
  );
}
