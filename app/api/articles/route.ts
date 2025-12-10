import { eq, getTableColumns } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { articles as articlesTable, users as usersTable } from "@/db/schema";
import { getSession } from "@/modules/auth/api/session";

export async function GET(request: Request) {
  const { session } = await getSession();

  if (!session) {
    return NextResponse.json(
      {
        error: {
          message: "Unauthorized",
          code: "UNAUTHORIZED",
        },
      },
      { status: 401 }
    );
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.externalId, session.user.id));

  const {
    id: _,
    userId: __,
    usage: ___,
    ...content
  } = getTableColumns(articlesTable);

  const articles = await db
    .select({
      ...content,
    })
    .from(articlesTable)
    .where(eq(articlesTable.userId, user.id));

  const audios = articles.filter((article) => article.audioUrl !== null);
  const articlesWithoutAudio = articles.filter(
    (article) => article.audioUrl === null
  );

  return NextResponse.json(
    {
      articles: articlesWithoutAudio,
      audios,
    },
    {
      status: 200,
    }
  );
}
