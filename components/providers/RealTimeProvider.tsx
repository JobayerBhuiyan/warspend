"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";
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

interface RealTimeProviderProps {
  initialData: ClientTrackerData;
  children: ReactNode;
}

export function RealTimeProvider({ initialData, children }: RealTimeProviderProps) {
  const [data, setData] = useState<ClientTrackerData>(initialData);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    let socket: Socket;

    try {
      socket = io(apiUrl, {
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
      });

      socket.on("connect", () => {
        console.log("🟢 Connected to live tracker stream");
      });

      socket.on("tracker_updated", (raw: unknown) => {
        const data = raw as any;
        setData((prev) => {
          // Derive equipment costs
          const newEquipment = data.equipmentCosts
            ? {
                thaadInterceptor: data.equipmentCosts.thaadInterceptor ?? prev.equipmentCosts.thaadInterceptor,
                patriotPac3: data.equipmentCosts.patriotPac3 ?? prev.equipmentCosts.patriotPac3,
                iranianShahed136: data.equipmentCosts.iranianShahed136 ?? prev.equipmentCosts.iranianShahed136,
              }
            : prev.equipmentCosts;

          const newCostRatio = Math.round(newEquipment.thaadInterceptor / newEquipment.iranianShahed136);

          return {
            ...prev,
            trackerConfig: {
              startDate: data.startDateIso ?? prev.trackerConfig.startDate,
              dailyCostUsd: data.dailyCostUsd ?? prev.trackerConfig.dailyCostUsd,
              operationName: data.operationName ?? prev.trackerConfig.operationName,
              strikesStartLabel: data.strikesStartLabel ?? prev.trackerConfig.strikesStartLabel,
            },
            startDateIso: data.startDateIso ?? prev.startDateIso,
            equipmentCosts: newEquipment,
            costRatio: newCostRatio,
            // Regenerate chart data from latest equipment costs
            costComparisonChartData: [
              { name: "THAAD Interceptor", value: newEquipment.thaadInterceptor, fill: "#dc2626" },
              { name: "Patriot PAC-3", value: newEquipment.patriotPac3, fill: "#ea580c" },
              { name: "Iranian Shahed-136", value: newEquipment.iranianShahed136, fill: "#4b5563" },
            ],
            stockpile: data.stockpile
              ? {
                  totalThaadInterceptors: data.stockpile.totalThaadInterceptors ?? prev.stockpile.totalThaadInterceptors,
                  usedInJune2025War: data.stockpile.usedInJune2025War ?? prev.stockpile.usedInJune2025War,
                  purchased2025: data.stockpile.purchased2025 ?? prev.stockpile.purchased2025,
                  planned2026: data.stockpile.planned2026 ?? prev.stockpile.planned2026,
                }
              : prev.stockpile,
            humanCost: data.humanCost
              ? {
                  usKilled: data.humanCost.usKilled ?? prev.humanCost.usKilled,
                  usWounded: data.humanCost.usWounded ?? prev.humanCost.usWounded,
                  iranianMilitaryKilled: data.humanCost.iranianMilitaryKilled ?? prev.humanCost.iranianMilitaryKilled,
                  iranianMilitaryNote: data.humanCost.iranianMilitaryNote ?? prev.humanCost.iranianMilitaryNote,
                  iranianCiviliansKilled: data.humanCost.iranianCiviliansKilled ?? prev.humanCost.iranianCiviliansKilled,
                  iranianCiviliansWounded: data.humanCost.iranianCiviliansWounded ?? prev.humanCost.iranianCiviliansWounded,
                }
              : prev.humanCost,
            otherEstimates:
              data.otherEstimates && Array.isArray(data.otherEstimates) && data.otherEstimates.length > 0
                ? data.otherEstimates
                : prev.otherEstimates,
            latestNews:
              data.latestNews && Array.isArray(data.latestNews) ? data.latestNews : prev.latestNews,
            timelineEvents:
              data.newTimelineEvents && Array.isArray(data.newTimelineEvents)
                ? data.newTimelineEvents
                : prev.timelineEvents,
            gasPrices: data.gasPrices
              ? {
                  preConflictPrice: data.gasPrices.preConflictPrice ?? prev.gasPrices.preConflictPrice,
                  currentPrice: data.gasPrices.currentPrice ?? prev.gasPrices.currentPrice,
                  brentCrudePrice: data.gasPrices.brentCrudePrice ?? prev.gasPrices.brentCrudePrice,
                  brentCrudeChange: data.gasPrices.brentCrudeChange ?? prev.gasPrices.brentCrudeChange,
                }
              : prev.gasPrices,
            methodologyText: data.methodologyText ?? prev.methodologyText,
            methodologyFooter: data.methodologyFooter ?? prev.methodologyFooter,
            lastUpdated: data._servedAt ?? prev.lastUpdated,
          };
        });
      });

      socket.on("disconnect", () => {
        console.log("🔴 Disconnected from live tracker stream");
      });

      socket.on("connect_error", (err) => {
        console.warn("⚠️ WebSocket connection error:", err.message);
      });

    } catch (err) {
      console.error("Failed to initialize WebSocket:", err);
    }

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <RealTimeDataContext.Provider value={data}>
      {children}
    </RealTimeDataContext.Provider>
  );
}
