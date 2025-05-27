/**
 * TrackingProvider component that initializes and manages all tracking scripts
 */

'use client';

import React, { createContext, useContext, useEffect } from 'react';
import Script from 'next/script';
import { useTracking } from '@/hooks/useTracking';

interface TrackingContextValue {
  isInitialized: boolean;
}

const TrackingContext = createContext<TrackingContextValue>({
  isInitialized: false,
});

export const TrackingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { trackPageView } = useTracking();
  const [isInitialized, setIsInitialized] = React.useState(false);

  useEffect(() => {
    // Mark as initialized once all scripts are loaded
    setIsInitialized(true);
  }, []);

  return (
    <TrackingContext.Provider value={{ isInitialized }}>
      {/* Google Tag Manager */}
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <>
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}

      {/* Hotjar Tracking Code */}
      {process.env.NEXT_PUBLIC_HOTJAR_ID && (
        <Script
          id="hotjar-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
                a=o.getElementsByTagName('head')[0];
                r=o.createElement('script');r.async=1;
                r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />
      )}

      {/* Microsoft Clarity */}
      {process.env.NEXT_PUBLIC_CLARITY_ID && (
        <Script
          id="clarity-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_ID}");
            `,
          }}
        />
      )}

      {/* First-party tracking pixel */}
      <Script
        id="first-party-tracking"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // First-party tracking fallback
            window._fp = window._fp || [];
            window._fp.push(['init', {
              endpoint: '${process.env.NEXT_PUBLIC_API_URL || ''}/api/analytics',
              cookieDomain: window.location.hostname,
              sessionTimeout: 30
            }]);
          `,
        }}
      />

      {children}
    </TrackingContext.Provider>
  );
};

export const useTrackingContext = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTrackingContext must be used within TrackingProvider');
  }
  return context;
}; 