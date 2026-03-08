"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react";
import type { TrackerData } from "@/lib/getTrackerData";

/**
 * Serializable version of TrackerData for client components.
 * Identical to TrackerData but startDate is a string (ISO) instead of Date.
 */
export type ClientTrackerData = Omit<TrackerData, "trackerConfig"> & {
  trackerConfig: {
    startDate: string;
    dailyCostUsd: number;
    operationName: string;
    strikesStartLabel: string;
  };
};

const RealTimeDataContext = createContext<ClientTrackerData | null>(null);

export function useRealTimeData(): ClientTrackerData {
  const ctx = useContext(RealTimeDataContext);
  if (!ctx) throw new Error("useRealTimeData must be used within <RealTimeProvider>");
  return ctx;
}

const POLL_INTERVAL_MS = 60_000; // 60 seconds

interface RealTimeProviderProps {
  initialData: ClientTrackerData;
  children: ReactNode;
}

export function RealTimeProvider({ initialData, children }: RealTimeProviderProps) {
  const [data, setData] = useState<ClientTrackerData>(initialData);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLatest = useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    try {
      const res = await fetch(`${apiUrl}/api/tracker-data`, { cache: "no-store" });
      if (!res.ok) return;

      const raw = await res.json();

      setData((prev) => {
        // Derive equipment costs
        const newEquipment = raw.equipmentCosts
          ? {
              thaadInterceptor: raw.equipmentCosts.thaadInterceptor ?? prev.equipmentCosts.thaadInterceptor,
              patriotPac3: raw.equipmentCosts.patriotPac3 ?? prev.equipmentCosts.patriotPac3,
              iranianShahed136: raw.equipmentCosts.iranianShahed136 ?? prev.equipmentCosts.iranianShahed136,
            }
          : prev.equipmentCosts;

        const newCostRatio = Math.round(newEquipment.thaadInterceptor / newEquipment.iranianShahed136);

        return {
          ...prev,
          trackerConfig: {
            startDate: raw.startDateIso ?? prev.trackerConfig.startDate,
            dailyCostUsd: raw.dailyCostUsd ?? prev.trackerConfig.dailyCostUsd,
            operationName: raw.operationName ?? prev.trackerConfig.operationName,
            strikesStartLabel: raw.strikesStartLabel ?? prev.trackerConfig.strikesStartLabel,
          },
          startDateIso: raw.startDateIso ?? prev.startDateIso,
          equipmentCosts: newEquipment,
          costRatio: newCostRatio,
          // Regenerate chart data from latest equipment costs
          costComparisonChartData: [
            { name: "THAAD Interceptor", value: newEquipment.thaadInterceptor, fill: "#dc2626" },
            { name: "Patriot PAC-3", value: newEquipment.patriotPac3, fill: "#ea580c" },
            { name: "Iranian Shahed-136", value: newEquipment.iranianShahed136, fill: "#4b5563" },
          ],
          stockpile: raw.stockpile
            ? {
                totalThaadInterceptors: raw.stockpile.totalThaadInterceptors ?? prev.stockpile.totalThaadInterceptors,
                usedInJune2025War: raw.stockpile.usedInJune2025War ?? prev.stockpile.usedInJune2025War,
                purchased2025: raw.stockpile.purchased2025 ?? prev.stockpile.purchased2025,
                planned2026: raw.stockpile.planned2026 ?? prev.stockpile.planned2026,
              }
            : prev.stockpile,
          humanCost: raw.humanCost
            ? {
                usKilled: raw.humanCost.usKilled ?? prev.humanCost.usKilled,
                usWounded: raw.humanCost.usWounded ?? prev.humanCost.usWounded,
                iranianMilitaryKilled: raw.humanCost.iranianMilitaryKilled ?? prev.humanCost.iranianMilitaryKilled,
                iranianMilitaryNote: raw.humanCost.iranianMilitaryNote ?? prev.humanCost.iranianMilitaryNote,
                iranianCiviliansKilled: raw.humanCost.iranianCiviliansKilled ?? prev.humanCost.iranianCiviliansKilled,
                iranianCiviliansWounded: raw.humanCost.iranianCiviliansWounded ?? prev.humanCost.iranianCiviliansWounded,
              }
            : prev.humanCost,
          otherEstimates:
            raw.otherEstimates && Array.isArray(raw.otherEstimates) && raw.otherEstimates.length > 0
              ? raw.otherEstimates
              : prev.otherEstimates,
          latestNews:
            raw.latestNews && Array.isArray(raw.latestNews) ? raw.latestNews : prev.latestNews,
          timelineEvents:
            raw.newTimelineEvents && Array.isArray(raw.newTimelineEvents)
              ? raw.newTimelineEvents
              : prev.timelineEvents,
          gasPrices: raw.gasPrices
            ? {
                preConflictPrice: raw.gasPrices.preConflictPrice ?? prev.gasPrices.preConflictPrice,
                currentPrice: raw.gasPrices.currentPrice ?? prev.gasPrices.currentPrice,
                brentCrudePrice: raw.gasPrices.brentCrudePrice ?? prev.gasPrices.brentCrudePrice,
                brentCrudeChange: raw.gasPrices.brentCrudeChange ?? prev.gasPrices.brentCrudeChange,
              }
            : prev.gasPrices,
          methodologyText: raw.methodologyText ?? prev.methodologyText,
          methodologyFooter: raw.methodologyFooter ?? prev.methodologyFooter,
          lastUpdated: raw._servedAt ?? prev.lastUpdated,
        };
      });
    } catch {
      // Silently fail — keep showing previous data
    }
  }, []);

  useEffect(() => {
    // Fetch immediately on mount so client picks up fresh API data
    // even if the server-side build used fallback values
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLatest();

    // Start polling
    intervalRef.current = setInterval(fetchLatest, POLL_INTERVAL_MS);

    // Pause when tab is hidden, resume when visible
    const handleVisibility = () => {
      if (document.hidden) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Fetch immediately on return, then resume interval
        fetchLatest();
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(fetchLatest, POLL_INTERVAL_MS);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [fetchLatest]);

  return (
    <RealTimeDataContext.Provider value={data}>
      {children}
    </RealTimeDataContext.Provider>
  );
}
