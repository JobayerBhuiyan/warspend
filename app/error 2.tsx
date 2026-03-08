"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-red-500/10 p-4 mb-6">
        <AlertTriangle className="h-10 w-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-mono font-bold tracking-[0.1em] text-zinc-200 uppercase mb-4">
        Something went wrong!
      </h2>
      <p className="text-sm text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
        We encountered an unexpected error while loading the tracker data. Please try again or check back later.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-zinc-300 font-mono text-sm tracking-wider hover:bg-white/10 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
