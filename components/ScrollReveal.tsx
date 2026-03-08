"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right";
}

export function ScrollReveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-80px" });

    const directionMap = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { x: 40, y: 0 },
        right: { x: -40, y: 0 },
    };

    const { x, y } = directionMap[direction];

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, x, y }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x, y }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
        >
            {children}
        </motion.div>
    );
}
