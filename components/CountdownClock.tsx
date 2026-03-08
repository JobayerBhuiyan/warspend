"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_MIN = 60 * 1000;
const MS_PER_SEC = 1000;

interface CountdownClockProps {
    startDateIso: string;
    className?: string;
}

export function CountdownClock({ startDateIso, className = "" }: CountdownClockProps) {
    const startTime = new Date(startDateIso).getTime();
    const [mounted, setMounted] = useState(false);
    const [elapsed, setElapsed] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const update = () => {
            const diff = Math.max(0, Date.now() - startTime);
            const days = Math.floor(diff / MS_PER_DAY);
            const hours = Math.floor((diff % MS_PER_DAY) / MS_PER_HOUR);
            const mins = Math.floor((diff % MS_PER_HOUR) / MS_PER_MIN);
            const secs = Math.floor((diff % MS_PER_MIN) / MS_PER_SEC);
            setElapsed({ days, hours, mins, secs });
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [mounted, startTime]);

    const units = [
        { value: elapsed.days, label: "DAYS" },
        { value: elapsed.hours, label: "HRS" },
        { value: elapsed.mins, label: "MIN" },
        { value: elapsed.secs, label: "SEC" },
    ];

    return (
        <motion.div
            className={`flex items-center justify-center gap-2 sm:gap-3 ${className}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 8 }}
            transition={{ duration: 0.6 }}
        >
            {units.map((unit, i) => (
                <div key={unit.label} className="flex items-center gap-2 sm:gap-3">
                    <div className="flex flex-col items-center">
                        <span
                            className="inline-flex items-center justify-center rounded-lg bg-white/[0.04] px-3 py-2 sm:px-4 sm:py-3 font-mono text-2xl sm:text-3xl font-bold text-red-400 tabular-nums ring-1 ring-white/[0.06] min-w-[3rem] sm:min-w-[3.5rem]"
                            style={{
                                textShadow: "0 0 20px rgba(239, 68, 68, 0.3)",
                            }}
                        >
                            {String(unit.value).padStart(2, "0")}
                        </span>
                        <span className="mt-1.5 text-[10px] font-mono tracking-[0.2em] text-zinc-600">
                            {unit.label}
                        </span>
                    </div>
                    {i < units.length - 1 && (
                        <span className="text-xl font-mono text-zinc-600 -mt-5">:</span>
                    )}
                </div>
            ))}
        </motion.div>
    );
}
