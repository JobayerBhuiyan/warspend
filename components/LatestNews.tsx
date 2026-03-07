"use client";

import { motion } from "framer-motion";
import { Newspaper, ExternalLink } from "lucide-react";

interface NewsItem {
    title: string;
    link: string;
    source: string;
    pubDate: string;
}

function timeAgo(dateString: string): string {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    const diffDays = Math.floor(diffHrs / 24);
    return `${diffDays}d ago`;
}

export function LatestNews({ items }: { items: NewsItem[] }) {
    if (!items || items.length === 0) return null;

    return (
        <section className="mt-10">
            <div className="flex items-center gap-2 mb-6">
                <Newspaper className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    Latest News
                </h2>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    Auto-Updated
                </span>
            </div>
            <div className="space-y-2">
                {items.slice(0, 10).map((item, i) => (
                    <motion.a
                        key={item.link}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-4 py-3 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800/70 group"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.03 }}
                    >
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                                {item.title}
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                <span className="font-medium">{item.source}</span>
                                <span>·</span>
                                <span>{timeAgo(item.pubDate)}</span>
                            </div>
                        </div>
                        <ExternalLink className="h-4 w-4 flex-shrink-0 mt-1 text-zinc-400 group-hover:text-red-500 transition-colors" />
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
