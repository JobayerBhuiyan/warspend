import { GoogleGenAI } from "@google/genai";
import { trackerData as staticTrackerData } from "../data/trackerData";

// Initialize Gemini client (requires GEMINI_API_KEY environment variable)
const ai = new GoogleGenAI({});

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
  ]
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
                parsedData.dailyCostUsd,
                staticTrackerData.dailyCostUsd,
                100_000_000, // at least $100M/day seems plausible
                10_000_000_000 // at most $10B/day
            ),

            // Equipment costs
            equipmentCosts: {
                thaadInterceptor: safeNumber(
                    parsedData.equipmentCosts?.thaadInterceptor,
                    staticTrackerData.equipmentCosts.thaadInterceptor,
                    1_000_000, 100_000_000
                ),
                patriotPac3: safeNumber(
                    parsedData.equipmentCosts?.patriotPac3,
                    staticTrackerData.equipmentCosts.patriotPac3,
                    500_000, 50_000_000
                ),
                iranianShahed136: safeNumber(
                    parsedData.equipmentCosts?.iranianShahed136,
                    staticTrackerData.equipmentCosts.iranianShahed136,
                    5_000, 500_000
                ),
            },

            // Stockpile
            stockpile: {
                totalThaadInterceptors: safeNumber(
                    parsedData.stockpile?.totalThaadInterceptors,
                    staticTrackerData.stockpile.totalThaadInterceptors,
                    100, 5_000
                ),
                usedInJune2025War: safeNumber(
                    parsedData.stockpile?.usedInJune2025War,
                    staticTrackerData.stockpile.usedInJune2025War,
                    0, 1_000
                ),
                purchased2025: safeNumber(
                    parsedData.stockpile?.purchased2025,
                    staticTrackerData.stockpile.purchased2025,
                    0, 500
                ),
                planned2026: safeNumber(
                    parsedData.stockpile?.planned2026,
                    staticTrackerData.stockpile.planned2026,
                    0, 500
                ),
            },

            // Human cost
            humanCost: {
                ...staticTrackerData.humanCost,
                usKilled: safeNumber(parsedData.usKilled, staticTrackerData.humanCost.usKilled, 0, 100_000),
                usWounded: safeNumber(parsedData.usWounded, staticTrackerData.humanCost.usWounded, 0, 500_000),
                iranianMilitaryKilled: safeNumber(parsedData.iranianMilitaryKilled, staticTrackerData.humanCost.iranianMilitaryKilled, 0, 1_000_000),
                iranianMilitaryNote: parsedData.iranianMilitaryNote ?? staticTrackerData.humanCost.iranianMilitaryNote,
                iranianCiviliansKilled: safeNumber(parsedData.iranianCiviliansKilled, staticTrackerData.humanCost.iranianCiviliansKilled, 0, 1_000_000),
                iranianCiviliansWounded: safeNumber(parsedData.iranianCiviliansWounded, staticTrackerData.humanCost.iranianCiviliansWounded, 0, 5_000_000),
            },

            // Other estimates
            otherEstimates:
                parsedData.otherEstimates && Array.isArray(parsedData.otherEstimates) && parsedData.otherEstimates.length > 0
                    ? parsedData.otherEstimates
                    : staticTrackerData.otherEstimates,

            // New timeline events (append to existing, if any)
            newTimelineEvents:
                parsedData.newTimelineEvents && Array.isArray(parsedData.newTimelineEvents)
                    ? parsedData.newTimelineEvents
                    : [],

            // Methodology footer with automation note
            methodologyFooter: staticTrackerData.methodologyFooter + " Data is automatically researched and updated every 6 hours using the Gemini API grounded with Google Search.",
        };

        return updatedTrackerData;

    } catch (error) {
        console.error("❌ Failed to fetch tracker data from Gemini:", error);
        return null;
    }
}
