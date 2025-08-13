import type { InferEnum, InferSelectModel } from "drizzle-orm";
import type { LanguageModelUsage } from "ai";

import { articles, articleStatus, users } from "@/db/schema";
import type { ExtractArticle } from "./crawler/schema";

export type User = Omit<InferSelectModel<typeof users>, "password">;
export type Article = Omit<
  InferSelectModel<typeof articles>,
  "userId" | "id" | "usage"
>;
export type ArticleStatus = InferEnum<typeof articleStatus>;

export type ArticleUsage = LanguageModelUsage & {
  cost: string;
};

export type CrawledArticle = ExtractArticle & {
  slug: string;
  usage: ArticleUsage;
  content: string;
};
