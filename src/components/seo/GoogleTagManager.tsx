"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useConsent } from "@/lib/consent";

const GTM_ID = "GTM-WJ2N886K";

/** Google Tag Manager container. Production only, only after the visitor accepts analytics
 * cookies, and never on /admin, so edits made by the studio are not counted as visits. Render once in the root layout `<body>`. */
export default function GoogleTagManager() {
  const pathname = usePathname();
  const consent = useConsent();
  if (process.env.NODE_ENV !== "production" || consent !== "granted" || pathname?.startsWith("/admin")) return null;
  return (
    <>
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        />
      </noscript>
    </>
  );
}
