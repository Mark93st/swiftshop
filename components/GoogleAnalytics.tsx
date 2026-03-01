'use client';

import React, { useState, useEffect } from 'react';
import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your actual ID

export function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // 1. Initial check on mount
    const consent = localStorage.getItem('cookie_consent');
    if (consent === 'all') {
      setHasConsent(true);
    }

    // 2. Listen for the custom event from the CookieConsent component
    const handleCookiesAccepted = () => {
      setHasConsent(true);
    };

    window.addEventListener('cookies_accepted', handleCookiesAccepted);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('cookies_accepted', handleCookiesAccepted);
    };
  }, []);

  if (!hasConsent) return null;

  return (
    <>
      {/* Global Site Tag (gtag.js) - Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
