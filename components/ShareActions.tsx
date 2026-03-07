"use client";

import { useState, useEffect } from "react";
import { Copy, Share2 } from "lucide-react";

export function ShareActions() {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Iran War Spend Tracker",
          text: "Live estimate of U.S. taxpayer spending on military operations.",
          url: window.location.href,
        });
      } catch {
        // ignore
      }
    } else {
      handleCopy();
    }
  };

  const handleXPost = () => {
    const text = encodeURIComponent("Live estimate of U.S. taxpayer spending on military operations.\n\nTrack the cost: ");
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleXPost}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-[#222]"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
        Post
      </button>
      {canShare && (
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-[#222]"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-[#222]"
      >
        <Copy className="h-4 w-4" />
        {copied ? "Copied" : "Copy Link"}
      </button>
    </div>
  );
}
