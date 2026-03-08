"use client";

import { useEffect, useState, useRef } from "react";

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

  // Native spring physics state
  const physicsRef = useRef<{
    value: number;
    velocity: number;
    target: number;
    lastTime: number;
  } | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const stiffness = 30; // Equivalent to Framer Motion stiffness
    const damping = 20; // Equivalent to Framer Motion damping
    let animationFrameId: number;

    const computeCost = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTime);
      const days = elapsed / MS_PER_DAY;
      return days * dailyCostUsd;
    };

    // Initialize physics state on first run
    if (!physicsRef.current) {
      physicsRef.current = {
        value: 0,
        velocity: 0,
        target: 0,
        lastTime: performance.now(),
      };
    }
    physicsRef.current.target = computeCost();

    // Spring animation loop
    const animate = (time: number) => {
      const state = physicsRef.current!;

      const dt = Math.min((time - state.lastTime) / 1000, 0.064);
      state.lastTime = time;

      if (dt > 0) {
        state.target = computeCost();

        // Spring physics: F = -k*x - c*v
        const displacement = state.value - state.target;
        const springForce = -stiffness * displacement;
        const dampingForce = -damping * state.velocity;

        const force = springForce + dampingForce;

        // v = v + a*dt (mass = 1)
        state.velocity += force * dt;

        // p = p + v*dt
        state.value += state.velocity * dt;

        setDisplayValue(state.value);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    physicsRef.current.lastTime = performance.now();
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, startTime, dailyCostUsd]);

  const formatted = displayValue.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <span
      className={`tabular-nums inline-block transition-all duration-700 ease-[cubic-bezier(0.21,0.47,0.32,0.98)] ${mounted ? "opacity-100 translate-y-0 blur-none" : "opacity-0 translate-y-2 blur-[8px]"
        } ${className}`}
      style={{
        textShadow: "0 0 40px rgba(239, 68, 68, 0.3), 0 0 80px rgba(239, 68, 68, 0.1)",
      }}
    >
      {mounted ? formatted : "$0"}
    </span>
  );
}
