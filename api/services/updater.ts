import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { trackerData as staticTrackerData } from "../data/trackerData";

// Initialize Gemini client (requires GEMINI_API_KEY environment variable)
const ai = new GoogleGenAI({});

// Define Zod schema for validation
const geminiResponseSchema = z.object({
    dailyCostUsd: z.number().min(100_000_000).max(10_000_000_000).optional(),
    usKilled: z.number().min(0).max(100_000).optional(),
    usWounded: z.number().min(0).max(500_000).optional(),
    iranianMilitaryKilled: z.number().min(0).max(1_000_000).optional(),
    iranianMilitaryNote: z.string().optional(),
    iranianCiviliansKilled: z.number().min(0).max(1_000_000).optional(),
    iranianCiviliansWounded: z.number().min(0).max(5_000_000).optional(),
    equipmentCosts: z.object({
        thaadInterceptor: z.number().min(1_000_000).max(100_000_000).optional(),
        patriotPac3: z.number().min(500_000).max(50_000_000).optional(),
        iranianShahed136: z.number().min(5_000).max(500_000).optional(),
    }).optional(),
    stockpile: z.object({
        totalThaadInterceptors: z.number().min(100).max(5_000).optional(),
        usedInJune2025War: z.number().min(0).max(1_000).optional(),
        purchased2025: z.number().min(0).max(500).optional(),
        planned2026: z.number().min(0).max(500).optional(),
    }).optional(),
    otherEstimates: z.array(z.object({
        source: z.string(),
        label: z.string(),
        value: z.string(),
    })).optional(),
    newTimelineEvents: z.array(z.object({
        date: z.string(),
        title: z.string(),
        description: z.string(),
        cost: z.string().nullable().optional(),
        isMajor: z.boolean().optional(),
    })).optional(),
    gasPrices: z.object({
        preConflictPrice: z.number().min(1).max(10).optional(),
        currentPrice: z.number().min(1).max(15).optional(),
        brentCrudePrice: z.number().min(20).max(300).optional(),
        brentCrudeChange: z.number().min(-50).max(200).optional(),
    }).optional(),
    marketImpact: z.object({
        sp500ChangePct: z.number().min(-50).max(50).optional(),
        goldPriceUsd: z.number().min(1000).max(10000).optional(),
        lmtStockPrice: z.number().min(100).max(2000).optional(),
        rtxStockPrice: z.number().min(50).max(1000).optional(),
    }).optional(),
    sentiment: z.object({
        globalApproval: z.string().optional(),
        troopDeploymentEstimate: z.number().min(0).max(1_000_000).optional(),
        dominantNarrative: z.string().optional(),
    }).optional()
});

export async function fetchLatestTrackerData() {
    console.log("🔄 Starting automated data research via Gemini + Google Search...");

    const prompt = `
You are a factual research assistant for a war cost tracking dashboard.
Your task is to use Google Search to find the latest verified figures regarding the US-Iran conflict (Operation Epic Fury) as of the current date (March 2026).

Research and return ALL of the following categories:

1. **Daily cost estimate** — the latest Pentagon/CSIS daily cost figure in USD.
2. **Human cost**:
   - US service members killed
   - US service members wounded
   - Iranian military killed
   - Iranian civilians killed
   - Iranian civilians wounded
3. **Equipment costs** (per unit in USD):
   - THAAD interceptor
   - Patriot PAC-3 interceptor
   - Iranian Shahed-136 drone
4. **Stockpile data**:
   - Total THAAD interceptors in US inventory
   - Number used in June 2025 war
   - Number purchased in 2025
   - Number planned for 2026
5. **Other cost estimates** from think tanks and news sources (Penn Wharton, CSIS, Center for American Progress, etc.)
6. **New major events** since Feb 28, 2026 — any significant strikes, escalations, or developments that should be added to a war timeline. Include date, title, short description, and estimated cost if known.
7. **Gas prices** — current U.S. national average gas price per gallon, the pre-conflict price (around Feb 26, 2026), Brent crude oil price per barrel, and percentage change in Brent crude since pre-conflict.
8. **Market Impact** — current change percentage of S&P 500 since conflict start, current price of Gold (USD/oz), and current stock prices for Defense contractors LMT (Lockheed Martin) and RTX (Raytheon).
9. **Sentiment & Troops** — estimated number of total US troops deployed to the region for this operation, a short summary of global approval/sentiment, and the dominant media narrative.

Return the data STRICTLY as a JSON object matching this structure. Do NOT wrap in markdown code blocks, return raw JSON only.

{
  "dailyCostUsd": number,
  "usKilled": number,
  "usWounded": number,
  "iranianMilitaryKilled": number,
  "iranianMilitaryNote": "string describing notable kills",
  "iranianCiviliansKilled": number,
  "iranianCiviliansWounded": number,
  "equipmentCosts": {
    "thaadInterceptor": number,
    "patriotPac3": number,
    "iranianShahed136": number
  },
  "stockpile": {
    "totalThaadInterceptors": number,
    "usedInJune2025War": number,
    "purchased2025": number,
    "planned2026": number
  },
  "otherEstimates": [
    {
      "source": "string",
      "label": "string",
      "value": "string"
    }
  ],
  "newTimelineEvents": [
    {
      "date": "MMM DD · HH:MM UTC",
      "title": "string",
      "description": "string with sources and cost details",
      "cost": "$X,XXX,XXX or null",
      "isMajor": boolean
    }
  ],
  "gasPrices": {
    "preConflictPrice": number,
    "currentPrice": number,
    "brentCrudePrice": number,
    "brentCrudeChange": number
  },
  "marketImpact": {
    "sp500ChangePct": number,
    "goldPriceUsd": number,
    "lmtStockPrice": number,
    "rtxStockPrice": number
  },
  "sentiment": {
    "globalApproval": "string",
    "troopDeploymentEstimate": number,
    "dominantNarrative": "string"
  }
}

Use integers for casualties. Use the most reliable, recently published sources. Include at least 5 cost estimates in otherEstimates. Only include newTimelineEvents if there are genuinely new developments not already in the existing timeline.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                // Enable Google Search grounding
                tools: [{ googleSearch: {} }],
            },
        });

        let text = response.text;
        if (!text) throw new Error("No text returned from Gemini");

        // Strip markdown backticks if Gemini includes them
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
            text = jsonMatch[1];
        }

        console.log("✅ Successfully fetched latest data from Gemini.");

        const parsedData = JSON.parse(text.trim());
        const validatedData = geminiResponseSchema.parse(parsedData);

        // Validate numbers are plausible before merging
        const safeNumber = (val: unknown, fallback: number, min = 0, max = 1e12): number => {
            if (typeof val !== "number" || isNaN(val) || val < min || val > max) return fallback;
            return val;
        };

        // Build the updated object
        const updatedTrackerData = {
            ...staticTrackerData,

            // Daily cost
            dailyCostUsd: safeNumber(
                validatedData.dailyCostUsd,
                staticTrackerData.dailyCostUsd,
                100_000_000, // at least $100M/day seems plausible
                10_000_000_000 // at most $10B/day
            ),

            // Equipment costs
            equipmentCosts: {
                thaadInterceptor: safeNumber(
                    validatedData.equipmentCosts?.thaadInterceptor,
                    staticTrackerData.equipmentCosts.thaadInterceptor,
                    1_000_000, 100_000_000
                ),
                patriotPac3: safeNumber(
                    validatedData.equipmentCosts?.patriotPac3,
                    staticTrackerData.equipmentCosts.patriotPac3,
                    500_000, 50_000_000
                ),
                iranianShahed136: safeNumber(
                    validatedData.equipmentCosts?.iranianShahed136,
                    staticTrackerData.equipmentCosts.iranianShahed136,
                    5_000, 500_000
                ),
            },

            // Stockpile
            stockpile: {
                totalThaadInterceptors: safeNumber(
                    validatedData.stockpile?.totalThaadInterceptors,
                    staticTrackerData.stockpile.totalThaadInterceptors,
                    100, 5_000
                ),
                usedInJune2025War: safeNumber(
                    validatedData.stockpile?.usedInJune2025War,
                    staticTrackerData.stockpile.usedInJune2025War,
                    0, 1_000
                ),
                purchased2025: safeNumber(
                    validatedData.stockpile?.purchased2025,
                    staticTrackerData.stockpile.purchased2025,
                    0, 500
                ),
                planned2026: safeNumber(
                    validatedData.stockpile?.planned2026,
                    staticTrackerData.stockpile.planned2026,
                    0, 500
                ),
            },

            // Human cost
            humanCost: {
                ...staticTrackerData.humanCost,
                usKilled: safeNumber(validatedData.usKilled, staticTrackerData.humanCost.usKilled, 0, 100_000),
                usWounded: safeNumber(validatedData.usWounded, staticTrackerData.humanCost.usWounded, 0, 500_000),
                iranianMilitaryKilled: safeNumber(validatedData.iranianMilitaryKilled, staticTrackerData.humanCost.iranianMilitaryKilled, 0, 1_000_000),
                iranianMilitaryNote: validatedData.iranianMilitaryNote ?? staticTrackerData.humanCost.iranianMilitaryNote,
                iranianCiviliansKilled: safeNumber(validatedData.iranianCiviliansKilled, staticTrackerData.humanCost.iranianCiviliansKilled, 0, 1_000_000),
                iranianCiviliansWounded: safeNumber(validatedData.iranianCiviliansWounded, staticTrackerData.humanCost.iranianCiviliansWounded, 0, 5_000_000),
            },

            // Other estimates
            otherEstimates:
                validatedData.otherEstimates && Array.isArray(validatedData.otherEstimates) && validatedData.otherEstimates.length > 0
                    ? validatedData.otherEstimates
                    : staticTrackerData.otherEstimates,

            // New timeline events (append to existing, if any)
            newTimelineEvents:
                validatedData.newTimelineEvents && Array.isArray(validatedData.newTimelineEvents)
                    ? validatedData.newTimelineEvents
                    : [],

            // Gas prices
            gasPrices: validatedData.gasPrices && typeof validatedData.gasPrices === 'object'
                ? {
                    preConflictPrice: safeNumber(validatedData.gasPrices.preConflictPrice, 2.96, 1, 10),
                    currentPrice: safeNumber(validatedData.gasPrices.currentPrice, 3.45, 1, 15),
                    brentCrudePrice: safeNumber(validatedData.gasPrices.brentCrudePrice, 92.69, 20, 300),
                    brentCrudeChange: safeNumber(validatedData.gasPrices.brentCrudeChange, 19.2, -50, 200),
                }
                : { preConflictPrice: 2.96, currentPrice: 3.45, brentCrudePrice: 92.69, brentCrudeChange: 19.2 },

            // Market Impact
            marketImpact: validatedData.marketImpact && typeof validatedData.marketImpact === 'object'
                ? {
                    sp500ChangePct: safeNumber(validatedData.marketImpact.sp500ChangePct, 0, -50, 50),
                    goldPriceUsd: safeNumber(validatedData.marketImpact.goldPriceUsd, 2800, 1000, 10000),
                    lmtStockPrice: safeNumber(validatedData.marketImpact.lmtStockPrice, 450, 100, 2000),
                    rtxStockPrice: safeNumber(validatedData.marketImpact.rtxStockPrice, 120, 50, 1000),
                } : undefined,

            // Sentiment & Troops
            sentiment: validatedData.sentiment && typeof validatedData.sentiment === 'object'
                ? {
                    globalApproval: validatedData.sentiment.globalApproval ?? "Mixed to critical",
                    troopDeploymentEstimate: safeNumber(validatedData.sentiment.troopDeploymentEstimate, 40000, 0, 1_000_000),
                    dominantNarrative: validatedData.sentiment.dominantNarrative ?? "Escalation concerns growing",
                } : undefined,

            // Methodology footer with automation note
            methodologyFooter: staticTrackerData.methodologyFooter + " Data is automatically researched and updated periodically using the Gemini API grounded with Google Search.",
        };

        return updatedTrackerData;

    } catch (error) {
        console.error("❌ Failed to fetch tracker data from Gemini:", error);
        return null;
    }
}
