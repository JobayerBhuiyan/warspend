import Parser from "rss-parser";

const parser = new Parser();

export interface NewsItem {
    title: string;
    link: string;
    source: string;
    pubDate: string;
}

// Google News RSS feeds for Iran war coverage
const RSS_FEEDS = [
    "https://news.google.com/rss/search?q=iran+war&hl=en-US&gl=US&ceid=US:en",
    "https://news.google.com/rss/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNRGd5WTJJU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US:en",
];

// In-memory cache
let cachedNews: NewsItem[] = [];
let lastFetchedAt: string | null = null;

function extractSource(title: string): { cleanTitle: string; source: string } {
    // Google News titles typically end with " - Source Name"
    const match = title.match(/^(.*)\s-\s([^-]+)$/);
    if (match) {
        return { cleanTitle: match[1].trim(), source: match[2].trim() };
    }
    return { cleanTitle: title, source: "Google News" };
}

export async function fetchLatestNews(): Promise<NewsItem[]> {
    console.log("📰 Fetching latest news from Google News RSS...");

    try {
        const allItems: NewsItem[] = [];
        const seenLinks = new Set<string>();

        for (const feedUrl of RSS_FEEDS) {
            try {
                const feed = await parser.parseURL(feedUrl);

                for (const item of feed.items) {
                    if (!item.title || !item.link) continue;
                    if (seenLinks.has(item.link)) continue;
                    seenLinks.add(item.link);

                    const { cleanTitle, source } = extractSource(item.title);
                    allItems.push({
                        title: cleanTitle,
                        link: item.link,
                        source,
                        pubDate: item.pubDate ?? new Date().toISOString(),
                    });
                }
            } catch (err) {
                console.warn(`⚠️ Failed to fetch RSS feed: ${feedUrl}`, err);
            }
        }

        // Sort by publication date (newest first), take top 15
        allItems.sort(
            (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        );

        cachedNews = allItems.slice(0, 15);
        lastFetchedAt = new Date().toISOString();

        console.log(`✅ Fetched ${cachedNews.length} news items from RSS.`);
        return cachedNews;
    } catch (error) {
        console.error("❌ Failed to fetch news from RSS:", error);
        return cachedNews; // Return stale cache on error
    }
}

export function getCachedNews(): { items: NewsItem[]; lastFetchedAt: string | null } {
    return { items: cachedNews, lastFetchedAt };
}
