/**
 * Tracker data served by the API.
 * Edit these values to update what the frontend displays.
 */
export const trackerData = {
    title: "Iran War Cost Tracker",
    startDateIso: "2026-02-28T00:00:00Z",
    dailyCostUsd: 1_000_000_000,
    operationName: "Operation Epic Fury",
    strikesStartLabel: "Strikes Began Feb 28, 2026",

    equipmentCosts: {
        thaadInterceptor: 12_700_000,
        patriotPac3: 3_700_000,
        iranianShahed136: 35_000,
    },

    stockpile: {
        totalThaadInterceptors: 600,
        usedInJune2025War: 150,
        purchased2025: 12,
        planned2026: 37,
    },

    humanCost: {
        usKilled: 0,
        usWounded: 0,
        iranianMilitaryKilled: 0,
        iranianMilitaryNote: "incl. senior leadership",
        iranianCiviliansKilled: 0,
        iranianCiviliansWounded: 0,
    },

    otherEstimates: [
        {
            source: "Penn Wharton Budget Model",
            label: "Total economic impact",
            value: "up to $210B",
        },
        {
            source: "Penn Wharton",
            label: "Direct budgetary cost",
            value: "$40B–$95B",
        },
        {
            source: "Center for American Progress",
            label: "Through Day 4",
            value: ">$5B",
        },
        {
            source: "Anadolou Agency",
            label: "First 24 hours",
            value: "$779M",
        },
        {
            source: "IPS/Nat'l Priorities Project",
            label: "Major equip. O&S",
            value: "$59.4M/day",
        },
    ],

    methodologyText:
        "Our bottom-up cost model: 13 aircraft types, naval deployments, munitions tracking, and sources. Nancy Youssef (WSJ) — Pentagon preliminary estimate: $1B/day via congressional official. NYT DealBook (Niko Gallogly, Mar 4 2026) — Kavanagh/Defense Priorities interceptor analysis. Penn Wharton Budget Model (Kent Smetters) — $40B–$95B direct, up to $210B economic impact. Center for American Progress — >$5B through Day 4. DoD Comptroller FY2024/25 reimbursable flight-hour rates. Congressional Budget Office (CBO) cost reports. Government Accountability Office (GAO) sustainment reports. Brown University Costs of War Project. DoD/CENTCOM official statements. AP, Reuters, AFP, Al Jazeera reporting.",

    methodologyFooter:
        "This tracker exists because the public deserves real-time transparency about the cost of military operations — not just after-the-fact reports years later. The counter uses the Pentagon's own preliminary estimate of $1 billion per day. Independent analyses suggest the true cost may be significantly higher.",
};
