import express, { Request, Response, NextFunction } from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { trackerData as staticTrackerData } from "./data/trackerData";
import { fetchLatestTrackerData } from "./services/updater";
import { fetchLatestNews, getCachedNews } from "./services/newsFetcher";
import { fetchGasPrices } from "./services/gasPriceFetcher";
import { logger, httpLogger } from "./utils/logger";

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.PORT || "3001", 10);

// Configure CORS - MUST be before helmet and other middleware
const allowedOrigins = [
  "https://warspend.com",
  "https://www.warspend.com",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// Add custom FRONTEND_URL if provided
if (
  process.env.FRONTEND_URL &&
  !allowedOrigins.includes(process.env.FRONTEND_URL)
) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn({ origin }, "Blocked by CORS");
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

// Apply CORS before everything else
app.use(cors(corsOptions));

// Handle preflight requests explicitly - use regex to match all routes
app.options(/.*/, (_req, res) => {
  res.setHeader("Access-Control-Allow-Origin", allowedOrigins.join(", "));
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

// Set up security headers - AFTER CORS
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  }),
);

// Setup Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  logger.info(`🔌 Client connected: ${socket.id}`);
  
  // Send immediate data on connection
  const { items: latestNews, lastFetchedAt: newsLastFetched } = getCachedNews();
  socket.emit("tracker_updated", {
    ...liveTrackerData,
    latestNews,
    newsLastFetched,
    _servedAt: new Date().toISOString(),
  });

  socket.on("disconnect", () => {
    logger.info(`🔌 Client disconnected: ${socket.id}`);
  });
});

// Apply HTTP logging middleware
app.use(httpLogger);

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: { error: "Too many requests, please try again later." },
});

app.use(express.json());

// Apply rate limiter to all routes
app.use(limiter);

// Use a mutable variable to hold the live data, initializing with static fallback
import { TrackerData } from "./types";

let liveTrackerData: TrackerData = { ...staticTrackerData };

// Helper to broadcast full data via WebSocket
function broadcastData() {
  const { items: latestNews, lastFetchedAt: newsLastFetched } = getCachedNews();
  io.emit("tracker_updated", {
    ...liveTrackerData,
    latestNews,
    newsLastFetched,
    _servedAt: new Date().toISOString(),
  });
}

// Update tracker data (Gemini)
async function updateTrackerData() {
  try {
    const newData = await fetchLatestTrackerData();
    if (newData) {
      liveTrackerData = newData;
      logger.info("⬆️ Live tracker data updated successfully in memory.");
      broadcastData();
    } else {
      logger.warn("⚠️ Keep using existing liveTrackerData.");
    }
  } catch (error) {
    logger.error({ error }, "Failed to update tracker data");
  }
}

// Update news data (RSS)
async function updateNews() {
  try {
    await fetchLatestNews();
    logger.info("📰 News cache refreshed.");
    broadcastData();
  } catch (error) {
    logger.error({ error }, "Failed to update news data");
  }
}

// Update gas prices (AAA + Brent crude)
async function updateGasPrices() {
  try {
    const prices = await fetchGasPrices();
    if (prices && liveTrackerData.gasPrices) {
      liveTrackerData = {
        ...liveTrackerData,
        gasPrices: {
          preConflictPrice: prices.preConflictPrice,
          currentPrice: prices.currentPrice,
          brentCrudePrice: prices.brentCrudePrice,
          brentCrudeChange: prices.brentCrudeChange,
        },
      };
      logger.info(
        { currentPrice: prices.currentPrice },
        "⛽ Gas prices merged into live data.",
      );
      broadcastData();
    }
  } catch (error) {
    logger.error({ error }, "Failed to update gas prices");
  }
}

// Initial fetches on server start
updateTrackerData();
updateNews();
updateGasPrices();

// Schedule automated updates
const TRACKER_UPDATE_MS = 30 * 60 * 1000; // Every 30 minutes
const NEWS_UPDATE_MS = 30 * 60 * 1000; // Every 30 minutes
const GAS_PRICE_UPDATE_MS = 15 * 60 * 1000; // Every 15 minutes

setInterval(updateTrackerData, TRACKER_UPDATE_MS);
setInterval(updateNews, NEWS_UPDATE_MS);
setInterval(updateGasPrices, GAS_PRICE_UPDATE_MS);

/** Root — friendly landing */
app.get("/", (_req: Request, res: Response) => {
  res.json({
    name: "warspend API",
    version: "2.0.0",
    automation: {
      trackerData: "Gemini Auto-Updates every 30 minutes",
      news: "Google News RSS every 30 minutes",
      gasPrices: "AAA + Brent crude every 15 minutes",
      websockets: "Real-time updates enabled via Socket.io",
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
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/** Main tracker data endpoint — includes news */
app.get("/api/tracker-data", (_req: Request, res: Response) => {
  const { items: latestNews, lastFetchedAt: newsLastFetched } = getCachedNews();

  // Set caching headers for improved performance
  res.set("Cache-Control", "public, max-age=60"); // 1 minute

  res.json({
    ...liveTrackerData,
    latestNews,
    newsLastFetched,
    _servedAt: new Date().toISOString(),
  });
});

/** Latest news endpoint (standalone) */
app.get("/api/latest-news", (_req: Request, res: Response) => {
  const { items, lastFetchedAt } = getCachedNews();

  // Set caching headers
  res.set("Cache-Control", "public, max-age=60"); // 1 minute

  res.json({
    items,
    lastFetchedAt,
    _servedAt: new Date().toISOString(),
  });
});

/** Force update endpoint */
const forceUpdateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5, // Limit each IP to 5 force updates per hour
  message: { error: "Too many force update requests, please try again later." },
});

app.post(
  "/api/force-update",
  forceUpdateLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("⚡ Manual force-update requested");
      await Promise.all([updateTrackerData(), updateNews(), updateGasPrices()]);
      res.json({
        success: true,
        message: "Data and news update triggered.",
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  },
);

// Centralized error handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error({ err }, "Unhandled application error");

  // Check if it's a CORS error
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({ error: "Forbidden: CORS policy violation" });
    return;
  }

  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "An unexpected error occurred",
  });
});

// Handle uncaught exceptions and rejections
process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught Exception");
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.fatal({ reason, promise }, "Unhandled Rejection");
  process.exit(1);
});

server.listen(PORT, "0.0.0.0", () => {
  logger.info(`🚀 warspend API with WebSockets running on port ${PORT}`);
});
