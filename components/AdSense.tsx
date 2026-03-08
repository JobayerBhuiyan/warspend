"use client";

/**
 * AdSense script loader — only renders on content pages.
 * Import this component on pages with substantial publisher content.
 * Do NOT include on 404, error, or under-construction pages.
 */
export function AdSense() {
    return (
        <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2647936076482005"
            crossOrigin="anonymous"
        />
    );
}
