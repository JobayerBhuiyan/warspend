const gasPriceFetcher = require("./api/services/gasPriceFetcher.ts");
const newsFetcher = require("./api/services/newsFetcher.ts");

async function main() {
  const prices = await gasPriceFetcher.fetchGasPrices();
  console.log("Prices:", prices);

  const news = await newsFetcher.fetchLatestNews();
  console.log("News count:", news.length);
  if(news.length > 0) {
      console.log("First news:", news[0].title);
  }
}

main().catch(console.error);
