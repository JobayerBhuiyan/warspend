"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValueEvent } from "framer-motion";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface DaysElapsedProps {
  startDateIso: string;
  className?: string;
}

export function DaysElapsed({ startDateIso, className = "" }: DaysElapsedProps) {
  const startTime = new Date(startDateIso).getTime();
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 40, damping: 25 });

  useMotionValueEvent(spring, "change", (latest) =>
    setDisplayValue(Math.floor(latest))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const compute = () => {
      const elapsed = Math.max(0, Date.now() - startTime);
      return elapsed / MS_PER_DAY;
    };
    const update = () => spring.set(compute());
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [mounted, startTime, spring]);

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {mounted ? displayValue : 0} days
    </motion.span>
  );
}
