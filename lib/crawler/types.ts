import type { CrawledArticle } from "../types";
import type { FinalStatistics } from "@crawlee/cheerio";

export type CrawlerResponse = FinalStatistics & {
  url: string;
  articles: CrawledArticle[];
};
