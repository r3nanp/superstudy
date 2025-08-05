import type { InferSelectModel, InferEnum } from "drizzle-orm";
import { articles, articleStatus, users } from "@/db/schema";

export type User = Omit<InferSelectModel<typeof users>, "password">;
export type Article = Omit<InferSelectModel<typeof articles>, "userId" | "id">;
export type ArticleStatus = InferEnum<typeof articleStatus>;
