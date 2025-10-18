import { db } from "@/db";
import { articles as articlesTable, users as usersTable } from "@/db/schema";
import { generateAudioFromText } from "@/lib/audio";
import { httpClient } from "@/lib/http-client";
import { checkTokenLimit, splitTextSmart } from "@/lib/tokenizer";
import { eq } from "drizzle-orm";
import { after, NextResponse } from "next/server";
import z from "zod";

export const runtime = "nodejs";

const schema = z.object({
  articleSlug: z.string(),
  userId: z.string(),
});

const base64ToFile = async (base64: string, filename: string) => {
  const response = await fetch(base64);
  const blob = await response.blob();

  return new File([blob], filename, { type: "audio/mp3" });
};

export const POST = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const parsedSearchParams = schema.parse(Object.fromEntries(searchParams));

  const [user] = await db
    .select({
      id: usersTable.id,
    })
    .from(usersTable)
    .where(eq(usersTable.externalId, parsedSearchParams.userId))
    .limit(1);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const [article] = await db
    .select({
      id: articlesTable.id,
      slug: articlesTable.slug,
      content: articlesTable.content,
      audioUrl: articlesTable.audioUrl,
      user: {
        id: usersTable.id,
        externalId: usersTable.externalId,
      },
    })
    .from(articlesTable)
    .where(eq(articlesTable.slug, parsedSearchParams.articleSlug))
    .innerJoin(usersTable, eq(articlesTable.userId, user.id))
    .limit(1);

  if (!article) {
    return NextResponse.json(
      {
        error: {
          message: "Article not found",
          code: "ARTICLE_NOT_FOUND",
        },
      },
      { status: 404 }
    );
  }

  if (article.audioUrl) {
    return NextResponse.json({ audioUrl: article.audioUrl }, { status: 200 });
  }

  after(async () => {
    let content = article.content;

    if (checkTokenLimit(article.content).exceededBy > 0) {
      content = content.slice(0, checkTokenLimit(content).exceededBy);
    }

    const { audio } = await generateAudioFromText(content);

    const formData = new FormData();

    const filename = `audio-${article.slug}-${Date.now()}.mp3`;
    const dataUrl = `data:audio/mp3;base64,${audio.base64}`;
    const file = await base64ToFile(dataUrl, filename);

    const searchParams = new URLSearchParams({
      type: "audio",
      userId: article.user.externalId!,
    });

    formData.append("file", file);

    const { data: audioUrlData, status } = await httpClient.post<{
      url: string;
    }>(`/api/upload?${searchParams.toString()}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (status !== 200) {
      return NextResponse.json(
        { error: audioUrlData, code: "FAILED_TO_UPLOAD_AUDIO" },
        { status: status }
      );
    }

    await db
      .update(articlesTable)
      .set({ audioUrl: audioUrlData.url, status: "processed" })
      .where(eq(articlesTable.id, article.id));
  });

  return NextResponse.json(
    {
      message: "Audio generation in progress",
      audioUrl: null,
    },
    { status: 200 }
  );
};
