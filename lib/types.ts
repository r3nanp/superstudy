import type { LanguageModelUsage } from "ai";
import type { InferEnum, InferSelectModel } from "drizzle-orm";

import type { articleStatus, articles, users } from "@/db/schema";
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

export type APIErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};
