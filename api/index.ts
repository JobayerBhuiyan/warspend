import express from "express";
import cors from "cors";
import { trackerData as staticTrackerData } from "./data/trackerData";
import { fetchLatestTrackerData } from "./services/updater";
import { fetchLatestNews, getCachedNews } from "./services/newsFetcher";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

// Use a mutable variable to hold the live data, initializing with static fallback
let liveTrackerData: Record<string, unknown> = { ...staticTrackerData };

// Update tracker data (Gemini)
async function updateTrackerData() {
    const newData = await fetchLatestTrackerData();
    if (newData) {
        liveTrackerData = newData;
        console.log("⬆️ Live tracker data updated successfully in memory.");
    } else {
        console.log("⚠️ Keep using existing liveTrackerData.");
    }
}

// Update news data (RSS)
async function updateNews() {
    await fetchLatestNews();
    console.log("📰 News cache refreshed.");
}

// Initial fetches on server start
updateTrackerData();
updateNews();

// Schedule automated updates
const TRACKER_UPDATE_MS = 6 * 60 * 60 * 1000; // Every 6 hours
const NEWS_UPDATE_MS = 30 * 60 * 1000;         // Every 30 minutes

setInterval(updateTrackerData, TRACKER_UPDATE_MS);
setInterval(updateNews, NEWS_UPDATE_MS);


app.use(cors());
app.use(express.json());

/** Root — friendly landing */
app.get("/", (_req, res) => {
    res.json({
        name: "warspend API",
        version: "2.0.0",
        automation: {
            trackerData: "Gemini Auto-Updates every 6 hours",
            news: "Google News RSS every 30 minutes",
        },
        endpoints: {
            health: "/health",
            trackerData: "/api/tracker-data",
            latestNews: "/api/latest-news",
            forceUpdate: "POST /api/force-update",
        },
    });
});

/** Health check */
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/** Main tracker data endpoint — includes news */
app.get("/api/tracker-data", (_req, res) => {
    const { items: latestNews, lastFetchedAt: newsLastFetched } = getCachedNews();
    res.json({
        ...liveTrackerData,
        latestNews,
        newsLastFetched,
        _servedAt: new Date().toISOString(),
    });
});

/** Latest news endpoint (standalone) */
app.get("/api/latest-news", (_req, res) => {
    const { items, lastFetchedAt } = getCachedNews();
    res.json({
        items,
        lastFetchedAt,
        _servedAt: new Date().toISOString(),
    });
});

/** Force update endpoint */
app.post("/api/force-update", async (_req, res) => {
    console.log("⚡ Manual force-update requested");
    await Promise.all([updateTrackerData(), updateNews()]);
    res.json({
        success: true,
        message: "Data and news update triggered.",
        updatedAt: new Date().toISOString()
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 warspend API running on port ${PORT}`);
});
