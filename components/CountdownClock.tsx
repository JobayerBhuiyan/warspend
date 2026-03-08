"use client";

import { useEffect, useRef, useState } from "react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_MIN = 60 * 1000;
const MS_PER_SEC = 1000;

interface CountdownClockProps {
  startDateIso: string;
  className?: string;
}

export function CountdownClock({
  startDateIso,
  className = "",
}: CountdownClockProps) {
  const startTime = new Date(startDateIso).getTime();
  const containerRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLSpanElement>(null);
  const hrsRef = useRef<HTMLSpanElement>(null);
  const minRef = useRef<HTMLSpanElement>(null);
  const secRef = useRef<HTMLSpanElement>(null);
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (mountedRef.current) return;
    mountedRef.current = true;

    const refs = [daysRef, hrsRef, minRef, secRef];

    const update = () => {
      const diff = Math.max(0, Date.now() - startTime);
      const values = [
        Math.floor(diff / MS_PER_DAY),
        Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR),
        Math.floor((diff % MS_PER_HOUR) / MS_PER_MIN),
        Math.floor((diff % MS_PER_MIN) / MS_PER_SEC),
      ];
      for (let i = 0; i < 4; i++) {
        const ref = refs[i];
        if (ref.current) {
          ref.current.textContent = String(values[i]).padStart(2, "0");
        }
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [mounted, startTime]);

  const unitStyle = {
    textShadow:
      "0 0 15px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.2)",
  };
  const unitClass =
    "inline-flex items-center justify-center rounded-2xl bg-[#141015] px-3 py-2 sm:px-4 sm:py-3 font-mono text-2xl sm:text-3xl font-bold text-[#ff5a5a] tabular-nums ring-1 ring-white/5 min-w-[3rem] sm:min-w-[4.5rem] shadow-[inset_0_2px_10px_rgba(239,68,68,0.05)]";

  return (
    <div
      ref={containerRef}
      suppressHydrationWarning
      className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}
    >
      {(
        [
          ["DAYS", daysRef],
          ["HRS", hrsRef],
          ["MIN", minRef],
          ["SEC", secRef],
        ] as const
      ).map(([label, ref], i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <span ref={ref} className={unitClass} style={unitStyle}>
              00
            </span>
            <span className="mt-1.5 text-[10px] font-mono tracking-[0.2em] text-zinc-600">
              {label}
            </span>
          </div>
          {i < 3 && (
            <span className="text-xl font-mono text-zinc-600 -mt-5">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
