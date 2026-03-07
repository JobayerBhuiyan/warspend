import { GoogleGenAI } from "@google/genai";
import { trackerData as staticTrackerData } from "../data/trackerData";

// Initialize Gemini client (requires GEMINI_API_KEY environment variable)
const ai = new GoogleGenAI({});

export async function fetchLatestTrackerData() {
    console.log("🔄 Starting automated data research via Gemini + Google Search...");

    const prompt = `
You are a factual research assistant for a war cost tracking dashboard.
Your task is to use Google Search to find the latest estimates and verified figures regarding the US-Iran conflict (Operation Epic Fury) as of the current date (March 2026).

Specifically, I need:
1. The estimated total economic impact (e.g., Penn Wharton Budget Model or similar).
2. The estimated direct budgetary cost or daily cost.
3. The latest number of US service members killed.
4. The latest number of US service members wounded.
5. The latest number of Iranian military killed.
6. The latest number of Iranian civilians killed.
7. The latest number of Iranian civilians wounded.

Return the data STRICTLY as a JSON object matching this TypeScript interface, based on the most reliable sources you find. Do NOT wrap it in markdown blockquotes, just return the raw JSON string.

{
  "usKilled": number,
  "usWounded": number,
  "iranianMilitaryKilled": number,
  "iranianCiviliansKilled": number,
  "iranianCiviliansWounded": number,
  "otherEstimates": [
    {
      "source": string,
      "label": string,
      "value": string
    }
  ]
}

Include the most significant cost estimates in the "otherEstimates" array (e.g., from CSIS, Penn Wharton, Pentagon, etc.). Keep the labels concise. Use integers for casualties.
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

        // Ensure parsing works
        const parsedData = JSON.parse(text.trim());

        // Build the updated object based on the static data but injected with fresh numbers
        const updatedTrackerData = {
            ...staticTrackerData,
            humanCost: {
                ...staticTrackerData.humanCost,
                usKilled: parsedData.usKilled ?? staticTrackerData.humanCost.usKilled,
                usWounded: parsedData.usWounded ?? staticTrackerData.humanCost.usWounded,
                iranianMilitaryKilled: parsedData.iranianMilitaryKilled ?? staticTrackerData.humanCost.iranianMilitaryKilled,
                iranianCiviliansKilled: parsedData.iranianCiviliansKilled ?? staticTrackerData.humanCost.iranianCiviliansKilled,
                iranianCiviliansWounded: parsedData.iranianCiviliansWounded ?? staticTrackerData.humanCost.iranianCiviliansWounded,
            },
            otherEstimates: parsedData.otherEstimates && Array.isArray(parsedData.otherEstimates) && parsedData.otherEstimates.length > 0
                ? parsedData.otherEstimates
                : staticTrackerData.otherEstimates,

            // Add a note about the automated update
            methodologyFooter: staticTrackerData.methodologyFooter + " Data is automatically researched and updated periodically using the Gemini API grounded with Google Search.",
        };

        return updatedTrackerData;

    } catch (error) {
        console.error("❌ Failed to fetch tracker data from Gemini:", error);
        return null; // Return null so the caller knows it failed and can keep using old data
    }
}
