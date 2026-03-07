"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValueEvent } from "framer-motion";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface AnimatedCounterProps {
  startDateIso: string;
  dailyCostUsd: number;
  className?: string;
}

export function AnimatedCounter({
  startDateIso,
  dailyCostUsd,
  className = "",
}: AnimatedCounterProps) {
  const startTime = new Date(startDateIso).getTime();
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const spring = useSpring(0, { stiffness: 30, damping: 20 });

  useMotionValueEvent(spring, "change", (latest) => setDisplayValue(latest));

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const computeCost = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTime);
      const days = elapsed / MS_PER_DAY;
      return days * dailyCostUsd;
    };

    const update = () => {
      spring.set(computeCost());
    };

    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [mounted, startTime, dailyCostUsd, spring]);

  const formatted = displayValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {mounted ? formatted : "$0"}
    </motion.span>
  );
}
