"use client";

import { useEffect, useRef, useCallback, useState } from "react";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface AnimatedCounterProps {
  startDateIso: string;
  dailyCostUsd: number;
  className?: string;
}

// Memoized formatter — avoids toLocaleString overhead on every frame
const currencyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function AnimatedCounter({
  startDateIso,
  dailyCostUsd,
  className = "",
}: AnimatedCounterProps) {
  const startTime = new Date(startDateIso).getTime();
  const spanRef = useRef<HTMLSpanElement>(null);
  const mountedRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  // Native spring physics state
  const physicsRef = useRef<{
    value: number;
    velocity: number;
    target: number;
    lastTime: number;
  } | null>(null);

  // Direct DOM update — bypasses React reconciliation entirely
  const updateDOM = useCallback((value: number) => {
    if (spanRef.current) {
      spanRef.current.textContent = currencyFmt.format(Math.round(value));
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (mountedRef.current) return;
    mountedRef.current = true;

    const el = spanRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.classList.remove("opacity-0", "translate-y-2");
        el.classList.add("opacity-100", "translate-y-0");
      });
    }

    const stiffness = 30;
    const damping = 20;
    let animationFrameId: number;

    const computeCost = () => {
      const now = Date.now();
      const elapsed = Math.max(0, now - startTime);
      const days = elapsed / MS_PER_DAY;
      return days * dailyCostUsd;
    };

    physicsRef.current = {
      value: 0,
      velocity: 0,
      target: computeCost(),
      lastTime: performance.now(),
    };

    let settledInterval: ReturnType<typeof setInterval> | null = null;

    // Spring animation loop — writes directly to DOM, no React setState
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

        updateDOM(state.value);

        // Check if spring has settled (close to target, low velocity)
        if (Math.abs(displacement) < 1 && Math.abs(state.velocity) < 0.5) {
          state.value = state.target;
          updateDOM(state.target);
          // Switch to slow interval to track drift
          settledInterval = setInterval(() => {
            const newTarget = computeCost();
            if (Math.abs(newTarget - state.value) > 1) {
              if (settledInterval) clearInterval(settledInterval);
              settledInterval = null;
              state.target = newTarget;
              state.lastTime = performance.now();
              animationFrameId = requestAnimationFrame(animate);
            } else {
              state.value = newTarget;
              updateDOM(newTarget);
            }
          }, 1000);
          return;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (settledInterval) clearInterval(settledInterval);
    };
  }, [mounted, startTime, dailyCostUsd, updateDOM]);

  return (
    <span
      ref={spanRef}
      suppressHydrationWarning
      className={`tabular-nums inline-block transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.21,0.47,0.32,0.98)] will-change-[opacity,transform] opacity-0 translate-y-2 ${className}`}
      style={{
        textShadow: "0 0 20px rgba(239, 68, 68, 0.5), 0 0 40px rgba(239, 68, 68, 0.3), 0 0 80px rgba(239, 68, 68, 0.15)",
      }}
    >
      $0
    </span>
  );
}
