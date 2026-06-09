import Script from "next/script";

/**
 * Third-party scripts, each gated behind an env var so nothing loads until you
 * provide the ID. Setting NEXT_PUBLIC_ADSENSE_CLIENT both enables Google Auto
 * ads and serves as the AdSense site-verification method.
 */
export function SiteScripts() {
  const adsense = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const ga = process.env.NEXT_PUBLIC_GA4_ID;
  return (
    <>
      {adsense ? (
        // Plain async <script> (not next/script) so React hoists the real tag
        // into <head>, where AdSense expects it for site verification and ad
        // serving. next/script afterInteractive only emits a <link rel=preload>
        // in <head> and injects the script into <body>, which the AdSense
        // verifier does not accept.
        <script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense}`}
        />
      ) : null}
      {ga ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
          </Script>
        </>
      ) : null}
    </>
  );
}
