import { httpClient } from "@/lib/http-client";
import type { APIErrorResponse, Article } from "@/lib/types";

export async function getArticles() {
  const { data, status } = await httpClient.get<{
    articles: Article[];
    audios: Article[];
  }>("/api/articles");

  if (status !== 200) {
    const error = data as unknown as APIErrorResponse;

    throw new Error(error.error.message, { cause: error.error.code });
  }

  return data;
}

export async function getArticle(slug: string) {
  const { data, status } = await httpClient.get<
    Omit<Article, "userId" | "id" | "usage">
  >(`/api/articles/${slug}`);

  if (status !== 200) {
    const error = data as unknown as APIErrorResponse;

    throw new Error(error.error.message, { cause: error.error.code });
  }

  return data;
}
