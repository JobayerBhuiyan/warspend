"use client";

import { motion } from "framer-motion";
import { Fuel } from "lucide-react";

interface GasPriceTrackerProps {
    preConflictPrice?: number;
    currentPrice?: number;
    brentCrudePrice?: number;
    brentCrudeChange?: number;
}

export function GasPriceTracker({
    preConflictPrice = 2.96,
    currentPrice = 3.41,
    brentCrudePrice = 92.69,
    brentCrudeChange = 19.2,
}: GasPriceTrackerProps) {
    const increase = currentPrice - preConflictPrice;
    const pctChange = ((increase / preConflictPrice) * 100).toFixed(1);

    const rows = [
        { label: "Pre-conflict (Feb 26)", value: `$${preConflictPrice.toFixed(2)}`, color: "text-zinc-300" },
        { label: "Current national avg", value: `$${currentPrice.toFixed(2)}`, color: "text-zinc-300" },
        { label: "Increase", value: `+$${increase.toFixed(2)} (+${pctChange}%)`, color: "text-red-400" },
        { label: "Brent crude (live)", value: `$${brentCrudePrice.toFixed(2)}/bbl (+${brentCrudeChange}%)`, color: "text-red-400" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-xs font-mono font-semibold tracking-[0.2em] text-zinc-500 uppercase mb-5">
                Pain at the Pump
            </h2>
            <div className="rounded-xl glass overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5">
                    <Fuel className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-mono font-semibold tracking-[0.15em] text-amber-400 uppercase">
                        National Average Gas Price
                    </span>
                </div>
                <div className="p-5 space-y-0">
                    {rows.map((row) => (
                        <div
                            key={row.label}
                            className="flex items-center justify-between py-2.5 border-b border-white/[0.03] last:border-0"
                        >
                            <span className="text-sm text-zinc-400">{row.label}</span>
                            <span className={`text-sm font-mono font-medium tabular-nums ${row.color}`}>
                                {row.value}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="px-5 pb-4">
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        The national average jumped <strong className="text-zinc-300">nearly 27 cents in a single week</strong> as
                        the Iran conflict threatens the Strait of Hormuz, through
                        which <strong className="text-zinc-300">20% of the world&apos;s daily oil</strong> moves.
                        AAA reports the fastest weekly increase since Russia&apos;s invasion of Ukraine in 2022.
                    </p>
                    <p className="mt-3 text-xs text-zinc-600 italic">
                        Source:{" "}
                        <a href="https://gasprices.aaa.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400 transition-colors">
                            AAA Gas Prices
                        </a>{" "}
                        ·{" "}
                        <a href="https://newsroom.aaa.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-zinc-400 transition-colors">
                            AAA Newsroom, Mar 2026
                        </a>
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
