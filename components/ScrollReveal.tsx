"use client";

import { useEffect, useRef } from "react";

// Shared singleton IntersectionObserver — avoids creating 12+ observers
const observedElements = new Map<Element, () => void>();
let sharedObserver: IntersectionObserver | null = null;

function getSharedObserver(): IntersectionObserver {
    if (!sharedObserver) {
        sharedObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const callback = observedElements.get(entry.target);
                        if (callback) {
                            callback();
                            sharedObserver!.unobserve(entry.target);
                            observedElements.delete(entry.target);
                        }
                    }
                }
            },
            { rootMargin: "0px 0px -80px 0px" }
        );
    }
    return sharedObserver;
}

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

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = getSharedObserver();

        observedElements.set(el, () => {
            el.classList.remove("scroll-reveal");
            el.classList.add("scroll-reveal-visible");
        });

        observer.observe(el);

        return () => {
            observer.unobserve(el);
            observedElements.delete(el);
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`${className} scroll-reveal reveal-${direction}`}
            style={{ transitionDelay: `${delay}s` }}
        >
            {children}
        </div>
    );
}
