import { logger } from "../utils/logger";

export interface GasPriceData {
    currentPrice: number;
    brentCrudePrice: number;
    brentCrudeChange: number;
    preConflictPrice: number;
    fetchedAt: string;
}

/** Pre-conflict national average (Feb 26, 2026) — fixed reference point */
const PRE_CONFLICT_PRICE = 2.96;

// In-memory cache
let cachedGasPrices: GasPriceData | null = null;

/**
 * Fetch the current U.S. national average gas price from AAA's website.
 * AAA embeds a JSON-LD or inline data blob we can parse from the page HTML.
 * Falls back to scraping the prominent price display.
 */
async function fetchAAAGasPrice(): Promise<number | null> {
    try {
        const res = await fetch("https://gasprices.aaa.com/", {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml",
            },
            signal: AbortSignal.timeout(10_000),
        });

        if (!res.ok) {
            logger.warn({ status: res.status }, "AAA returned non-OK status");
            return null;
        }

        const html = await res.text();

        // Strategy 1: Look for the national average price in the page.
        // AAA shows it as e.g. "$3.450" inside a prominent element.
        // Common patterns: "$X.XXX" or "$X.XX"
        const pricePatterns = [
            // Matches prices near "national average" text
            /national\s*average[^$]*?\$(\d+\.\d{2,3})/i,
            // Matches the large displayed price (usually 3 decimals)
            /\$(\d+\.\d{3})\s*(?:▲|▼|&#9650;|&#9660;|<)/i,
            // Generic price near "average" 
            /average[^$]{0,50}\$(\d+\.\d{2,3})/i,
            // Fallback: any prominent gas price pattern
            /class="[^"]*price[^"]*"[^>]*>\s*\$?(\d+\.\d{2,3})/i,
            // Last resort: first price-like value on the page
            /\$(\d\.\d{2,3})\b/,
        ];

        for (const pattern of pricePatterns) {
            const match = html.match(pattern);
            if (match) {
                const price = parseFloat(match[1]);
                // Sanity check: gas price should be between $1 and $10
                if (price >= 1 && price <= 10) {
                    logger.info({ price, pattern: pattern.source }, "Parsed AAA gas price");
                    return price;
                }
            }
        }

        logger.warn("Could not parse gas price from AAA HTML");
        return null;
    } catch (error) {
        logger.error({ error }, "Failed to fetch AAA gas price page");
        return null;
    }
}

/**
 * Fetch Brent crude oil price from a public financial data source.
 */
async function fetchBrentCrudePrice(): Promise<{ price: number; change: number } | null> {
    try {
        // Use Yahoo Finance's chart API for Brent crude (BZ=F)
        const res = await fetch(
            "https://query1.finance.yahoo.com/v8/finance/chart/BZ=F?interval=1d&range=1d",
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                },
                signal: AbortSignal.timeout(10_000),
            }
        );

        if (!res.ok) {
            logger.warn({ status: res.status }, "Yahoo Finance returned non-OK status");
            return null;
        }

        const data = await res.json() as {
            chart?: {
                result?: Array<{
                    meta?: { regularMarketPrice?: number };
                }>;
            };
        };

        const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
        if (typeof price === "number" && price > 20 && price < 300) {
            // Pre-conflict Brent was ~$77.7/bbl (late Feb 2026)
            const preConflictBrent = 77.7;
            const change = ((price - preConflictBrent) / preConflictBrent) * 100;
            logger.info({ price, change: change.toFixed(1) }, "Fetched Brent crude price");
            return { price: Math.round(price * 100) / 100, change: Math.round(change * 10) / 10 };
        }

        logger.warn("Invalid Brent crude price from Yahoo Finance");
        return null;
    } catch (error) {
        logger.error({ error }, "Failed to fetch Brent crude price");
        return null;
    }
}

/**
 * Fetch all gas/oil prices and return a consolidated object.
 * Falls back to cached data on failure.
 */
export async function fetchGasPrices(): Promise<GasPriceData | null> {
    logger.info("⛽ Fetching real-time gas & oil prices...");

    const [aaaPrice, brent] = await Promise.all([
        fetchAAAGasPrice(),
        fetchBrentCrudePrice(),
    ]);

    // Only update if we got at least the gas price
    if (aaaPrice !== null) {
        cachedGasPrices = {
            currentPrice: aaaPrice,
            preConflictPrice: PRE_CONFLICT_PRICE,
            brentCrudePrice: brent?.price ?? cachedGasPrices?.brentCrudePrice ?? 92.69,
            brentCrudeChange: brent?.change ?? cachedGasPrices?.brentCrudeChange ?? 19.2,
            fetchedAt: new Date().toISOString(),
        };

        logger.info(
            { currentPrice: aaaPrice, brent: brent?.price },
            "✅ Gas prices updated"
        );
        return cachedGasPrices;
    }

    // If AAA failed but we have Brent, update just that
    if (brent !== null && cachedGasPrices) {
        cachedGasPrices = {
            ...cachedGasPrices,
            brentCrudePrice: brent.price,
            brentCrudeChange: brent.change,
            fetchedAt: new Date().toISOString(),
        };
        return cachedGasPrices;
    }

    logger.warn("⚠️ Gas price fetch failed, using cached data");
    return cachedGasPrices;
}

export function getCachedGasPrices(): GasPriceData | null {
    return cachedGasPrices;
}
