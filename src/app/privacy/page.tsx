import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import PageTransition from "@/components/layout/PageTransition";
import JsonLd from "@/components/seo/JsonLd";
import CookieSettingsLink from "@/components/layout/CookieSettingsLink";
import { getBreadcrumbSchema, pageMetadata } from "@/lib/seo";
import { privacy, site } from "@/lib/content/site";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Notice",
  description:
    "How Studio Envelope collects, uses, stores and deletes personal information, our cookie use, children's data, and how to reach our data contact.",
  path: "/privacy",
});

const h2 = "font-display text-2xl text-ink";
const p = "text-base leading-relaxed text-muted";
const ul = "list-disc space-y-2 pl-5 text-base text-muted";
const section = "space-y-4 border-t border-hairline pt-8";

export default function PrivacyPolicyPage() {
  return (
    <PageTransition>
      <JsonLd
        schema={getBreadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Privacy Notice", url: "/privacy" },
        ])}
      />

      <PageHero title="Privacy Notice">
        How Studio Envelope collects, uses, keeps and deletes your personal information, and how to reach us about it.
      </PageHero>

      <article className="band-bone section-y">
        <div className="container-x max-w-3xl space-y-12">
          <div>
            <p className="label mb-2 text-muted">
              Effective {privacy.effectiveDate} · Version {privacy.policyVersion}
            </p>
            <p className="text-lg leading-relaxed text-ink">
              {site.name} (&quot;we&quot;, &quot;the studio&quot;), led by {site.principal.name} in Bangalore, India, decides why and how
              the personal information described here is used. This notice follows the principles of India&apos;s Digital Personal Data
              Protection Act, 2023.
            </p>
          </div>

          <section className={section}>
            <h2 className={h2}>1. What we collect</h2>
            <p className={p}>Only what you choose to give us, mainly through the enquiry form, email, WhatsApp or phone:</p>
            <ul className={ul}>
              <li>Your name, phone number and email address.</li>
              <li>Details of your project: type of space, scope, timeline and city, plus any note you add.</li>
              <li>How you heard about us (optional).</li>
              <li>
                Your age declaration (18 or older, or a parent or guardian writing for someone under 18) and a record that you agreed to
                this notice, with the date and the version of the notice.
              </li>
            </ul>
            <p className={p}>We do not ask for financial details, government IDs or sensitive personal data through the website.</p>
          </section>

          <section className={section}>
            <h2 className={h2}>2. Why we use it, and your consent</h2>
            <p className={p}>
              We use your details only to reply to your enquiry, discuss your project and, if you go ahead, deliver it. We never sell or
              rent your information or use it for advertising.
            </p>
            <p className={p}>
              We rely on your consent. The enquiry form will not send until you tick the consent box. You can withdraw consent at any time
              by writing to the contact person in section 9; withdrawing does not affect anything done before, and we will then delete your
              enquiry unless the law requires us to keep it.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>3. Children under 18</h2>
            <p className={p}>
              Our services are for people who own or manage property, so the website is not aimed at children. If you are under 18, please
              do not send an enquiry yourself: a parent or legal guardian must make it for you and confirm this on the form. If a guardian
              declaration is made, we may ask the guardian to confirm before we keep or use the details. We do not knowingly collect a
              child&apos;s information without a parent or guardian&apos;s consent, and we do not track or profile children. If you think a
              child has sent us details without that consent, tell the contact person below and we will delete them.
            </p>
          </section>

          <section id="cookies" className={`${section} scroll-mt-24`}>
            <h2 className={h2}>4. Cookies and analytics</h2>
            <p className={p}>
              The website needs no cookies to work, and we set no advertising cookies. Visitors are asked once whether to allow analytics
              cookies; nothing is loaded from Google until you accept.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[32rem] border-collapse text-left text-sm text-muted">
                <thead>
                  <tr className="border-b border-hairline text-ink">
                    <th className="py-2 pr-4 font-medium">What</th>
                    <th className="py-2 pr-4 font-medium">Purpose</th>
                    <th className="py-2 font-medium">When it is used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline align-top">
                  <tr>
                    <td className="py-3 pr-4">
                      Your cookie choice (browser storage, <code>se-consent</code>)
                    </td>
                    <td className="py-3 pr-4">Remembers whether you accepted or declined, so we do not ask again.</td>
                    <td className="py-3">Always; stays on your device until you clear it.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Vercel Web Analytics</td>
                    <td className="py-3 pr-4">Aggregate page views and performance, with no cookies and no cross-site profile.</td>
                    <td className="py-3">Always.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">Google Tag Manager and Google Analytics</td>
                    <td className="py-3 pr-4">Measures how the site is used so we can improve it.</td>
                    <td className="py-3">Only if you click Accept.</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4">YouTube (privacy-enhanced embed)</td>
                    <td className="py-3 pr-4">Plays a studio video.</td>
                    <td className="py-3">Only when you press play on a video.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className={p}>
              You can change or withdraw your choice at any time with{" "}
              <CookieSettingsLink className="text-brand underline underline-offset-4 hover:text-brand-deep" />, also in the footer of
              every page.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>5. Who handles your data for us</h2>
            <p className={p}>We use a small number of service providers who process data only on our behalf:</p>
            <ul className={ul}>
              <li>Google Firebase (Firestore): stores enquiries in a private inbox.</li>
              <li>Vercel: hosts the website, stores project images and videos, and provides cookie-free analytics.</li>
              <li>Resend: delivers the enquiry to the studio&apos;s email.</li>
              <li>Google (Tag Manager and Analytics): only if you accept analytics cookies.</li>
            </ul>
            <p className={p}>
              Some of these providers process data on servers outside India. We do not share your details with anyone else unless the law
              requires it.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>6. How long we keep it</h2>
            <ul className={ul}>
              <li>
                Website enquiries are deleted automatically from our inbox {privacy.retentionMonths} months after you send them, and the
                matching email copies are cleared on the same schedule.
              </li>
              <li>
                If you become a client, we keep the records needed to deliver the project and meet legal, tax and contractual duties for
                as long as those require.
              </li>
              <li>If you ask us to delete your details sooner, we will (section 8).</li>
            </ul>
          </section>

          <section className={section}>
            <h2 className={h2}>7. How we protect it</h2>
            <ul className={ul}>
              <li>The whole site is served over HTTPS, and browsers are told to use only HTTPS.</li>
              <li>
                The enquiry form is checked on our server (length, format, consent), limited in how often it can be used, and protected
                against automated spam.
              </li>
              <li>
                Enquiries are stored in a database that browsers cannot read or write. Only the studio&apos;s admin sign-in can open the
                inbox, and admin sessions use protected cookies that expire.
              </li>
              <li>We keep access to the minimum number of people needed.</li>
            </ul>
            <p className={p}>
              No system is perfectly secure. If a breach affects your personal data, we will tell you and the Data Protection Board of
              India as the law requires.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>8. Your rights</h2>
            <p className={p}>You can ask us to:</p>
            <ul className={ul}>
              <li>tell you what personal data we hold about you and how we use it;</li>
              <li>correct or complete it;</li>
              <li>erase it;</li>
              <li>withdraw your consent;</li>
              <li>nominate another person to exercise these rights if you cannot.</li>
            </ul>
            <p className={p}>
              Write to the contact person below. We aim to reply within 30 days. If you are not satisfied, you may complain to the Data
              Protection Board of India.
            </p>
          </section>

          <section className={section}>
            <h2 className={h2}>9. Contact person for your data</h2>
            <div className="space-y-2 rounded-xl border border-hairline bg-paper p-6 text-sm text-ink">
              <p className="text-base font-medium">
                {privacy.contactPerson.name}, {privacy.contactPerson.role}
              </p>
              <p>
                Email:{" "}
                <a href={`mailto:${site.contact.email}`} className="text-brand hover:underline">
                  {site.contact.email}
                </a>
              </p>
              <p>
                Phone:{" "}
                <a href={site.contact.phoneHref} className="text-brand hover:underline">
                  {site.contact.phone}
                </a>
              </p>
              <p>Location: {site.contact.location}</p>
            </div>
            <p className={p}>
              We may update this notice. The version and date at the top show the latest; we ask for consent again if a change affects how
              we use your details.
            </p>
            <p className="pt-2 text-sm text-muted">
              Looking for our terms? Read our{" "}
              <Link href="/terms" className="text-brand hover:underline">
                Terms of Use
              </Link>
              .
            </p>
          </section>
        </div>
      </article>
    </PageTransition>
  );
}
