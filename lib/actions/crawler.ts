"use server";

import { eq, getTableColumns } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { users, articles as articlesTable } from "@/db/schema";
import { getSession } from "@/modules/auth/api/session";
import { httpClient } from "@/lib/http-client";
import type { CrawlerResponse } from "../crawler/types";
import type { ArticleStatus } from "../types";

const schema = z.object({
  url: z.url(),
});

export const crawlerAction = async (prevState: any, formData: FormData) => {
  const { url } = schema.parse(Object.fromEntries(formData));
  const { session } = await getSession();

  if (!url) {
    return {
      error: "URL is required",
    };
  }

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.externalId, session.user.id));

    if (!user) {
      return {
        error: "User not found",
      };
    }

    const { data, status } = await httpClient.get<CrawlerResponse>(
      `/api/crawler?url=${url}`
    );

    if (status !== 200) {
      throw new Error("Failed to crawl the website");
    }

    console.dir(data, { depth: null });

    if (data.articles.length === 0) {
      return {
        error: "No articles found",
      };
    }

    const { id, usage, userId, ...rest } = getTableColumns(articlesTable);

    const result = await db
      .insert(articlesTable)
      .values(
        data.articles.map((article) => {
          return {
            ...article,
            readTime: article.readTime ?? 0,
            usage: article.usage,
            status: "processed" as ArticleStatus,
            source: url.toString(),
            userId: user.id,
          };
        })
      )
      .returning({
        ...rest,
      });

    return result;
  } catch (error) {
    console.error(error);

    return {
      error: "Failed to crawl the website",
    };
  }
};
