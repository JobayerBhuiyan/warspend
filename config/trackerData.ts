/**
 * Centralized configuration for the War Cost Tracker.
 * Used as FALLBACK when Sanity CMS is unavailable (missing env vars or fetch error).
 * When Sanity is configured, data is fetched from CMS and these values are ignored.
 */

/** ISO string for client-side parsing — avoids serialization issues */
export const START_DATE_ISO = "2026-02-28T00:00:00Z";

export const TRACKER_CONFIG = {
  /** When military strikes began (used for live cost calculation) */
  startDate: new Date(START_DATE_ISO),

  /** Pentagon's preliminary estimate: cost per day in USD */
  dailyCostUsd: 1_000_000_000,

  /** Operation name */
  operationName: "Operation Epic Fury",

  /** Short label for the strikes start */
  strikesStartLabel: "Strikes Began Feb 28, 2026",
} as const;

/** Equipment costs (USD) — used for cost comparison charts */
export const EQUIPMENT_COSTS = {
  thaadInterceptor: 12_700_000,
  patriotPac3: 3_700_000,
  iranianShahed136: 35_000,
} as const;

/** Cost ratio: interceptor vs drone (THAAD / Shahed-136) */
export const COST_RATIO = Math.round(
  EQUIPMENT_COSTS.thaadInterceptor / EQUIPMENT_COSTS.iranianShahed136
);

/** Stockpile & depletion stats */
export const STOCKPILE = {
  totalThaadInterceptors: 600,
  usedInJune2025War: 150,
  purchased2025: 12,
  planned2026: 37,
} as const;

/** Human cost — update as official/verified numbers become available */
export const HUMAN_COST = {
  usKilled: 6,
  usWounded: 18,
  iranianMilitaryKilled: 1_300,
  iranianMilitaryNote: "incl. senior leadership & IRGC commanders",
  iranianCiviliansKilled: 1_332,
  iranianCiviliansWounded: 5_000,
} as const;

/** Other estimates from various sources */
export const OTHER_ESTIMATES = [
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
    source: "CSIS (Cancian & Park)",
    label: "First 100 hours",
    value: "$3.7B",
  },
  {
    source: "CSIS",
    label: "Daily cost estimate",
    value: "$891.4M/day",
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
] as const;

/** Chart data: interceptor vs drone cost comparison */
export const COST_COMPARISON_CHART_DATA = [
  { name: "THAAD Interceptor", value: EQUIPMENT_COSTS.thaadInterceptor, fill: "#dc2626" },
  { name: "Patriot PAC-3", value: EQUIPMENT_COSTS.patriotPac3, fill: "#ea580c" },
  { name: "Iranian Shahed-136", value: EQUIPMENT_COSTS.iranianShahed136, fill: "#4b5563" },
] as const;
