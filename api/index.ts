import express from "express";
import cors from "cors";
import { trackerData } from "./data/trackerData";

const app = express();
const PORT = parseInt(process.env.PORT || "3001", 10);

app.use(cors());
app.use(express.json());

/** Root — friendly landing */
app.get("/", (_req, res) => {
    res.json({
        name: "warspend API",
        version: "1.0.0",
        endpoints: {
            health: "/health",
            trackerData: "/api/tracker-data",
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
        ...trackerData,
        _servedAt: new Date().toISOString(),
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 warspend API running on port ${PORT}`);
});
