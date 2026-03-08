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
    {
        date: "MAR 2 · 06:00 UTC",
        title: "B-2 Spirit strikes on Natanz nuclear facility",
        description: "Multiple B-2 Spirit sorties deploying GBU-57 MOPs on underground centrifuge halls. Est. 12 MOPs at ~$3.5M each plus B-2 flight costs ($150K/hr × 36 hrs per sortie).",
        cost: "$52,000,000",
        isMajor: true,
    },
    {
        date: "MAR 2 · 14:00 UTC",
        title: "F-35A achieves air superiority over western Iran",
        description: "Multiple F-35A sorties from Al Dhafra engage Iranian fighters. Est. 200+ AIM-120D ($1.8M each) and AIM-9X ($400K each) expended. 14 Iranian aircraft downed.",
        cost: "$440,000,000",
    },
    {
        date: "MAR 3 · 08:00 UTC",
        title: "Carrier Strike Group 2 – Tomahawk barrage",
        description: "USS Dwight D. Eisenhower CSG launches second wave of ~120 Tomahawk cruise missiles targeting IRGC command infrastructure.",
        cost: "$432,000,000",
        isMajor: true,
    },
    {
        date: "MAR 4 · 02:00 UTC",
        title: "IRGC Quds Force HQ targeted – Isfahan",
        description: "Precision strikes on IRGC Quds Force headquarters complex using JDAM and SDB II. Multiple IRGC senior commanders reported killed.",
        cost: "$15,000,000",
    },
    {
        date: "MAR 5 · 10:00 UTC",
        title: "Ticonderoga-class cruiser SM-3 intercepts",
        description: "USS Lake Champlain intercepts 18 Iranian ballistic missiles launched at Al Udeid Air Base. SM-3 Block IIA interceptors at ~$36M each.",
        cost: "$648,000,000",
    },
    {
        date: "MAR 6 · 00:00 UTC",
        title: "Strikes on Iranian oil infrastructure – Kharg Island",
        description: "Precision strikes on oil export terminals and refinery complexes. Brent crude spikes to $92+/bbl. Estimated 80+ precision-guided munitions deployed.",
        cost: "$120,000,000",
        isMajor: true,
    },
    {
        date: "MAR 7 · 04:00 UTC",
        title: "Continued SEAD/DEAD and ISR operations",
        description: "Ongoing suppression of Iranian air defense networks. MQ-9 Reaper and RQ-170 Sentinel ISR sorties sustaining 24/7 surveillance. F-16CJ Wild Weasel missions continue.",
        cost: "$85,000,000",
    },
];

type TimelineEvent = {
    date: string;
    title: string;
    description: string;
    cost?: string | null;
    isMajor?: boolean;
};

export function CostTimeline({ extraEvents = [] }: { extraEvents?: TimelineEvent[] }) {
    // Merge static events with any new events from the API
    const allEvents = [...timelineEvents, ...extraEvents];

    return (
        <div className="w-full max-w-3xl font-mono text-zinc-300">
            <h2 className="text-xs font-semibold tracking-[0.2em] mb-8 text-zinc-500 uppercase">
                What Has That Money Bought
            </h2>

            <div className="relative pl-6 pb-4">
                {/* Gradient timeline line */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-px"
                    style={{
                        background: "linear-gradient(180deg, rgba(239,68,68,0.3) 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
                    }}
                />

                {allEvents.map((event, i) => (
                    <div key={i} className="mb-10 last:mb-0 relative group">
                        {/* Timeline dot */}
                        <div
                            className="absolute -left-[24px] top-1.5 h-2.5 w-2.5 rounded-full"
                            style={{
                                background: event.isMajor ? "#ef4444" : "#3f3f46",
                                boxShadow: event.isMajor
                                    ? "0 0 8px rgba(239, 68, 68, 0.6), 0 0 20px rgba(239, 68, 68, 0.2)"
                                    : "0 0 4px rgba(63, 63, 70, 0.3)",
                            }}
                        />

                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs text-zinc-600 tracking-wider font-mono">
                                {event.date}
                            </span>
                            <h3 className="text-[15px] font-medium text-zinc-200 uppercase font-sans leading-snug">
                                {event.title}
                            </h3>
                            <p className="text-sm text-zinc-500 font-sans leading-relaxed">
                                {event.description}
                            </p>
                            {event.cost && (
                                <p
                                    className="text-sm mt-1 font-mono font-medium text-gradient-red inline-block"
                                >
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
