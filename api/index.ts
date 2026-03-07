import express from "express";
import cors from "cors";
import { trackerData as staticTrackerData } from "./data/trackerData";
import { fetchLatestTrackerData } from "./services/updater";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

// Use a mutable variable to hold the live data, initializing with static fallback
let liveTrackerData = { ...staticTrackerData };

// Update function
async function updateData() {
    const newData = await fetchLatestTrackerData();
    if (newData) {
        liveTrackerData = newData;
        console.log("⬆️ Live tracker data updated successfully in memory.");
    } else {
        console.log("⚠️ Keep using existing liveTrackerData.");
    }
}

// Initial fetch on server start
updateData();

// Schedule automated update every 6 hours (6 * 60 * 60 * 1000 ms)
const UPDATE_INTERVAL_MS = 6 * 60 * 60 * 1000;
setInterval(updateData, UPDATE_INTERVAL_MS);


app.use(cors());
app.use(express.json());

/** Root — friendly landing */
app.get("/", (_req, res) => {
    res.json({
        name: "warspend API",
        version: "1.0.0",
        automation: "Active (Gemini Auto-Updates every 6 hours)",
        endpoints: {
            health: "/health",
            trackerData: "/api/tracker-data",
            forceUpdate: "POST /api/force-update",
        },
    });
});

/** Health check */
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/** Main tracker data endpoint */
app.get("/api/tracker-data", (_req, res) => {
    res.json({
        ...liveTrackerData,
        _servedAt: new Date().toISOString(),
    });
});

/** Force update endpoint */
app.post("/api/force-update", async (_req, res) => {
    console.log("⚡ Manual force-update requested");
    await updateData();
    res.json({
        success: true,
        message: "Data update triggered.",
        updatedAt: new Date().toISOString()
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 warspend API running on port ${PORT}`);
});
