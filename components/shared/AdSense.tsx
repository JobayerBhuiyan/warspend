"use client";

import Script from "next/script";

/**
 * AdSense script loader — only renders on content pages.
 * Uses next/script with afterInteractive strategy so it doesn't
 * block rendering or contribute to TBT.
 */
export function AdSense() {
    return (
        <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2647936076482005"
            crossOrigin="anonymous"
            strategy="lazyOnload"
        />
    );
}
