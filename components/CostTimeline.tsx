export const timelineEvents = [
    {
        date: "FEB 28 · 04:00 UTC",
        title: "Operation Epic Fury begins",
        description: "First wave: Tomahawk + JASSM-ER strikes on air defenses, C2 nodes. 1,000+ targets struck Day 1.",
        isMajor: true,
    },
    {
        date: "FEB 28 · 04:30 UTC",
        title: "Cyber/Space operations - 'first movers'",
        description: "Coordinated cyber and space operations conducted as opening phase, degrading Iranian C3 capabilities",
    },
    {
        date: "FEB 28 · 06:30 UTC",
        title: "3 U.S. F-15EX aircraft lost to friendly fire from Kuwait",
        description: "$103,000,000 per airframe (CSIS); shot down by Kuwaiti air defenses in apparent misidentification. 3-year replacement timeline.",
        cost: "$309,000,000",
    },
    {
        date: "FEB 28 · 08:00 UTC",
        title: "First Tomahawk salvo – est. 160+ missiles",
        description: "160+ Tomahawk Block V at ~$3.6M each (CSIS replacement cost). Multiple waves of cruise missiles in opening phase.",
        cost: "$576,000,000",
    },
    {
        date: "FEB 28 · 12:00 UTC",
        title: "JASSM-ER strikes on hardened targets",
        description: "Est. 60 JASSM-ER at ~$1.5M each",
        cost: "$90,000,000",
    },
    {
        date: "MAR 1 · 02:00 UTC",
        title: "Second wave strikes – DEAD/SEAD operations",
        description: "Suppression of enemy air defenses, follow-on cruise missile and precision strikes. Tomahawk costs captured in opening salvo total (160+ per CSIS).",
    },
    {
        date: "MAR 1 · 14:00 UTC",
        title: "GBU-57 MOP strikes on Fordow enrichment facility",
        description: "Est. 8 GBU-57 Massive Ordnance Penetrators at ~$3.5M each, delivered by B-2 Spirit ($150K/flight hr × 30 hrs per sortie)",
        cost: "$28,000,000",
        isMajor: true,
    },
    {
        date: "MAR 1 · 18:00 UTC",
        title: "Naval strikes on Iranian forces – 9 vessels hit",
        description: "Anti-ship missile strikes on Iranian naval forces. Est. ~30–50 Harpoon ($1.5M ea) and Naval Strike Missiles ($2.2M ea) expended to neutralize 9 Iranian vessels. Separate from Tomahawk strikes already counted.",
        cost: "$75,000,000",
    },
];

export function CostTimeline() {
    return (
        <div className="w-full max-w-3xl font-mono text-zinc-300">
            <h2 className="text-xs font-semibold tracking-[0.2em] mb-8 text-zinc-400">WHAT HAS THAT MONEY BOUGHT</h2>

            <div className="relative border-l border-zinc-700/50 pl-6 pb-4">
                {timelineEvents.map((event, i) => (
                    <div key={i} className="mb-10 last:mb-0 relative">
                        <div className={`absolute -left-[30px] top-1.5 h-2 w-2 rounded-full ring-4 ring-[#101010] ${event.isMajor ? "bg-red-500" : "bg-zinc-600"}`}></div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs text-zinc-500 tracking-wider">
                                {event.date}
                            </span>
                            <h3 className="text-[15px] font-medium text-zinc-200 uppercase font-sans">
                                {event.title}
                            </h3>
                            <p className="text-sm text-zinc-500 font-sans leading-relaxed">
                                {event.description}
                            </p>
                            {event.cost && (
                                <p className="text-sm text-[#ffaa99] mt-1 font-mono">
                                    Tracked cost: {event.cost}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
