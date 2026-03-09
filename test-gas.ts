import * as gasPriceFetcher from "./api/services/gasPriceFetcher";
import * as newsFetcher from "./api/services/newsFetcher";

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
