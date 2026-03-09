"use client";

import { useEffect, useState, useRef } from "react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface DaysElapsedProps {
  startDateIso: string;
  className?: string;
}

export function DaysElapsed({ startDateIso, className = "" }: DaysElapsedProps) {
  const startTime = new Date(startDateIso).getTime();
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const springRef = useRef({ value: 0, velocity: 0, target: 0, lastTime: 0 });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const stiffness = 40;
    const damping = 25;
    let raf: number;

    const compute = () => {
      const elapsed = Math.max(0, Date.now() - startTime);
      return elapsed / MS_PER_DAY;
    };

    springRef.current.lastTime = performance.now();
    springRef.current.target = compute();

    const animate = (time: number) => {
      const s = springRef.current;
      const dt = Math.min((time - s.lastTime) / 1000, 0.064);
      s.lastTime = time;
      if (dt > 0) {
        s.target = compute();
        const displacement = s.value - s.target;
        s.velocity += (-stiffness * displacement - damping * s.velocity) * dt;
        s.value += s.velocity * dt;
        setDisplayValue(Math.floor(s.value));
      }
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [mounted, startTime]);

  return (
    <span
      className={`transition-opacity duration-400 ${mounted ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {mounted ? displayValue : 0} days
    </span>
  );
}
