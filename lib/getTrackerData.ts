import {
  TRACKER_CONFIG,
  START_DATE_ISO,
  EQUIPMENT_COSTS,
  STOCKPILE,
  HUMAN_COST,
  OTHER_ESTIMATES,
  COST_COMPARISON_CHART_DATA,
  ALTERNATIVE_METRICS_COSTS,
  GAS_PRICES,
} from "@/config/trackerData";

export type NewsItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string;
};

export type TimelineEvent = {
  date: string;
  title: string;
  description: string;
  cost?: string | null;
  isMajor?: boolean;
};

export type TrackerData = {
  startDateIso: string;
  trackerConfig: {
    startDate: Date;
    dailyCostUsd: number;
    operationName: string;
    strikesStartLabel: string;
  };
  equipmentCosts: {
    thaadInterceptor: number;
    patriotPac3: number;
    iranianShahed136: number;
  };
  costRatio: number;
  stockpile: {
    totalThaadInterceptors: number;
    usedInJune2025War: number;
    purchased2025: number;
    planned2026: number;
  };
  humanCost: {
    usKilled: number;
    usWounded: number;
    iranianMilitaryKilled: number;
    iranianMilitaryNote: string;
    iranianCiviliansKilled: number;
    iranianCiviliansWounded: number;
  };
  otherEstimates: { source: string; label: string; value: string }[];
  costComparisonChartData: { name: string; value: number; fill: string }[];
  alternativeMetricsCosts: {
    homelessHoused: number;
    mentalHealthTreated: number;
    childrenFed: number;
    studentLoansForgiven: number;
  };
  methodologyText: string;
  methodologyFooter: string;
  lastUpdated?: string;
  latestNews: NewsItem[];
  timelineEvents: TimelineEvent[];
  gasPrices: {
    preConflictPrice: number;
    currentPrice: number;
    brentCrudePrice: number;
    brentCrudeChange: number;
  };
  marketImpact?: {
    sp500ChangePct: number;
    goldPriceUsd: number;
    lmtStockPrice: number;
    rtxStockPrice: number;
  };
  sentiment?: {
    globalApproval: string;
    troopDeploymentEstimate: number;
    dominantNarrative: string;
  };
};

/** Shape of JSON returned by the Railway API */
type ApiTrackerData = {
  title?: string;
  startDateIso?: string;
  dailyCostUsd?: number;
  operationName?: string;
  strikesStartLabel?: string;
  equipmentCosts?: {
    thaadInterceptor?: number;
    patriotPac3?: number;
    iranianShahed136?: number;
  };
  stockpile?: {
    totalThaadInterceptors?: number;
    usedInJune2025War?: number;
    purchased2025?: number;
    planned2026?: number;
  };
  humanCost?: {
    usKilled?: number;
    usWounded?: number;
    iranianMilitaryKilled?: number;
    iranianMilitaryNote?: string;
    iranianCiviliansKilled?: number;
    iranianCiviliansWounded?: number;
  };
  otherEstimates?: { source: string; label: string; value: string }[];
  methodologyText?: string;
  methodologyFooter?: string;
  latestNews?: NewsItem[];
  newTimelineEvents?: TimelineEvent[];
  gasPrices?: {
    preConflictPrice?: number;
    currentPrice?: number;
    brentCrudePrice?: number;
    brentCrudeChange?: number;
  };
  marketImpact?: {
    sp500ChangePct?: number;
    goldPriceUsd?: number;
    lmtStockPrice?: number;
    rtxStockPrice?: number;
  };
  sentiment?: {
    globalApproval?: string;
    troopDeploymentEstimate?: number;
    dominantNarrative?: string;
  };
  _servedAt?: string;
};

function mapApiToTrackerData(data: ApiTrackerData): TrackerData {
  const equipmentCosts = {
    thaadInterceptor: data.equipmentCosts?.thaadInterceptor ?? EQUIPMENT_COSTS.thaadInterceptor,
    patriotPac3: data.equipmentCosts?.patriotPac3 ?? EQUIPMENT_COSTS.patriotPac3,
    iranianShahed136: data.equipmentCosts?.iranianShahed136 ?? EQUIPMENT_COSTS.iranianShahed136,
  };
  const costRatio = Math.round(
    equipmentCosts.thaadInterceptor / equipmentCosts.iranianShahed136
  );
  return {
    startDateIso: data.startDateIso ?? START_DATE_ISO,
    trackerConfig: {
      startDate: new Date(data.startDateIso ?? START_DATE_ISO),
      dailyCostUsd: data.dailyCostUsd ?? TRACKER_CONFIG.dailyCostUsd,
      operationName: data.operationName ?? TRACKER_CONFIG.operationName,
      strikesStartLabel: data.strikesStartLabel ?? TRACKER_CONFIG.strikesStartLabel,
    },
    equipmentCosts,
    costRatio,
    stockpile: {
      totalThaadInterceptors: data.stockpile?.totalThaadInterceptors ?? STOCKPILE.totalThaadInterceptors,
      usedInJune2025War: data.stockpile?.usedInJune2025War ?? STOCKPILE.usedInJune2025War,
      purchased2025: data.stockpile?.purchased2025 ?? STOCKPILE.purchased2025,
      planned2026: data.stockpile?.planned2026 ?? STOCKPILE.planned2026,
    },
    humanCost: {
      usKilled: data.humanCost?.usKilled ?? HUMAN_COST.usKilled,
      usWounded: data.humanCost?.usWounded ?? HUMAN_COST.usWounded,
      iranianMilitaryKilled: data.humanCost?.iranianMilitaryKilled ?? HUMAN_COST.iranianMilitaryKilled,
      iranianMilitaryNote: data.humanCost?.iranianMilitaryNote ?? HUMAN_COST.iranianMilitaryNote,
      iranianCiviliansKilled: data.humanCost?.iranianCiviliansKilled ?? HUMAN_COST.iranianCiviliansKilled,
      iranianCiviliansWounded: data.humanCost?.iranianCiviliansWounded ?? HUMAN_COST.iranianCiviliansWounded,
    },
    otherEstimates:
      data.otherEstimates && data.otherEstimates.length > 0
        ? data.otherEstimates
        : [...OTHER_ESTIMATES],
    costComparisonChartData: [
      { name: "THAAD Interceptor", value: equipmentCosts.thaadInterceptor, fill: "#dc2626" },
      { name: "Patriot PAC-3", value: equipmentCosts.patriotPac3, fill: "#ea580c" },
      { name: "Iranian Shahed-136", value: equipmentCosts.iranianShahed136, fill: "#4b5563" },
    ],
    alternativeMetricsCosts: ALTERNATIVE_METRICS_COSTS,
    methodologyText:
      data.methodologyText ??
      "Our bottom-up cost model: 13 aircraft types, naval deployments, munitions tracking, and sources. Nancy Youssef (WSJ) — Pentagon preliminary estimate: $1B/day via congressional official. NYT DealBook (Niko Gallogly, Mar 4 2026) — Kavanagh/Defense Priorities interceptor analysis. Penn Wharton Budget Model (Kent Smetters) — $40B–$95B direct, up to $210B economic impact. Center for American Progress — >$5B through Day 4. DoD Comptroller FY2024/25 reimbursable flight-hour rates. Congressional Budget Office (CBO) cost reports. Government Accountability Office (GAO) sustainment reports. Brown University Costs of War Project. DoD/CENTCOM official statements. AP, Reuters, AFP, Al Jazeera reporting.",
    methodologyFooter:
      data.methodologyFooter ??
      "This tracker exists because the public deserves real-time transparency about the cost of military operations — not just after-the-fact reports years later. The counter uses the Pentagon's own preliminary estimate of $1 billion per day. Independent analyses suggest the true cost may be significantly higher.",
    lastUpdated: data._servedAt,
    latestNews: data.latestNews ?? [],
    timelineEvents: data.newTimelineEvents ?? [],
    gasPrices: {
      preConflictPrice: data.gasPrices?.preConflictPrice ?? GAS_PRICES.preConflictPrice,
      currentPrice: data.gasPrices?.currentPrice ?? GAS_PRICES.currentPrice,
      brentCrudePrice: data.gasPrices?.brentCrudePrice ?? GAS_PRICES.brentCrudePrice,
      brentCrudeChange: data.gasPrices?.brentCrudeChange ?? GAS_PRICES.brentCrudeChange,
    },
    marketImpact: data.marketImpact?.sp500ChangePct !== undefined ? {
      sp500ChangePct: data.marketImpact.sp500ChangePct ?? 0,
      goldPriceUsd: data.marketImpact.goldPriceUsd ?? 2800,
      lmtStockPrice: data.marketImpact.lmtStockPrice ?? 450,
      rtxStockPrice: data.marketImpact.rtxStockPrice ?? 120,
    } : undefined,
    sentiment: data.sentiment?.globalApproval !== undefined ? {
      globalApproval: data.sentiment.globalApproval ?? "Mixed to critical",
      troopDeploymentEstimate: data.sentiment.troopDeploymentEstimate ?? 40000,
      dominantNarrative: data.sentiment.dominantNarrative ?? "Escalation concerns growing",
    } : undefined,
  };
}

function getFallbackData(): TrackerData {
  const costRatio = Math.round(
    EQUIPMENT_COSTS.thaadInterceptor / EQUIPMENT_COSTS.iranianShahed136
  );
  return {
    startDateIso: START_DATE_ISO,
    trackerConfig: {
      startDate: new Date(START_DATE_ISO),
      dailyCostUsd: TRACKER_CONFIG.dailyCostUsd,
      operationName: TRACKER_CONFIG.operationName,
      strikesStartLabel: TRACKER_CONFIG.strikesStartLabel,
    },
    equipmentCosts: EQUIPMENT_COSTS,
    costRatio,
    stockpile: STOCKPILE,
    humanCost: HUMAN_COST,
    otherEstimates: [...OTHER_ESTIMATES],
    costComparisonChartData: [...COST_COMPARISON_CHART_DATA],
    alternativeMetricsCosts: ALTERNATIVE_METRICS_COSTS,
    methodologyText:
      "Our bottom-up cost model: 13 aircraft types, naval deployments, munitions tracking, and sources. Nancy Youssef (WSJ) — Pentagon preliminary estimate: $1B/day via congressional official. NYT DealBook (Niko Gallogly, Mar 4 2026) — Kavanagh/Defense Priorities interceptor analysis. Penn Wharton Budget Model (Kent Smetters) — $40B–$95B direct, up to $210B economic impact. Center for American Progress — >$5B through Day 4. DoD Comptroller FY2024/25 reimbursable flight-hour rates. Congressional Budget Office (CBO) cost reports. Government Accountability Office (GAO) sustainment reports. Brown University Costs of War Project. DoD/CENTCOM official statements. AP, Reuters, AFP, Al Jazeera reporting.",
    methodologyFooter:
      "This tracker exists because the public deserves real-time transparency about the cost of military operations — not just after-the-fact reports years later. The counter uses the Pentagon's own preliminary estimate of $1 billion per day. Independent analyses suggest the true cost may be significantly higher.",
    latestNews: [],
    timelineEvents: [],
    gasPrices: GAS_PRICES,
  };
}

/** Check if the API URL is configured */
function isApiConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_API_URL;
}

/** Fetch tracker data from the Railway API, with fallback to static config */
export async function getTrackerData(): Promise<TrackerData> {
  if (!isApiConfigured()) {
    return getFallbackData();
  }

  const MAX_RETRIES = 2;
  const TIMEOUT_MS = 5000; // 5 second timeout

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/tracker-data`,
        { 
          next: { revalidate: 60 },
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        if (attempt === MAX_RETRIES) {
          console.warn(`[getTrackerData] API responded with ${res.status}. Falling back to static data.`);
        }
        throw new Error(`API error: ${res.status}`);
      }

      const data: ApiTrackerData = await res.json();
      return mapApiToTrackerData(data);
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed to fetch tracker data:`, error);
      
      // If it's the last attempt, break and return fallback
      if (attempt === MAX_RETRIES) {
        console.error("All attempts to fetch tracker data failed, using fallback data.");
        break;
      }
      
      // Exponential backoff before retry (e.g., 1000ms, 2000ms)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return getFallbackData();
}
