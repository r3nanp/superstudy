import { httpClient } from "../http-client";
import type { Article } from "./types";

export async function getArticles() {
  const { data, status } = await httpClient.get<{
    articles: Article[];
    audios: Article[];
  }>("/api/articles");

  if (status !== 200) {
    const error = data as unknown as {
      error: { code: string; message: string };
    };

    throw new Error(error.error.message, { cause: error.error.code });
  }

  return data;
}
