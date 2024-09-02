import Script from "next/script"
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google"

export default function MetaGoogleAnalytics({
  gtm,
  gta,
  meta,
}: {
  gtm?: string
  gta?: string
  meta?: string
}) {
  return (
    <div>
      {gtm && gtm !== "" && <GoogleTagManager gtmId={gtm} />}
      {gta && gta !== "" && <GoogleAnalytics gaId={gta} />}
      {meta && meta !== "" && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            if ('${meta}') {
              !(function(f, b, e, v) {
                if (f._fbq) return; // Check if _fbq is already defined
                const n = (f.fbq = function() {
                  n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                });
                n.push = n.queue = [];
                n.loaded = true;
                n.version = '2.0';
                const t = b.createElement(e);
                t.async = true;
                t.src = v;
                const s = b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t, s);
              })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${meta}'); // Initialize the pixel
              fbq('track', 'PageView'); // Track page view
            }
          `}
        </Script>
      )}
    </div>
  )
}
