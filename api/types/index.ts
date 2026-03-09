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
};
