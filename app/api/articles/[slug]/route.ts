import { db } from "@/db";
import { articles as articlesTable, users } from "@/db/schema";
import { getSession } from "@/modules/auth/api/session";
import { and, eq, getTableColumns } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { session } = await getSession();

  if (!session) {
    return NextResponse.json(
      { error: { message: "Unauthorized", code: "UNAUTHORIZED" } },
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const [currentUser] = await db
      .select({
        id: users.id,
      })
      .from(users)
      .where(eq(users.externalId, session.user.id))
      .limit(1);

    if (!currentUser) {
      return NextResponse.json(
        { error: { message: "User not found", code: "USER_NOT_FOUND" } },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const { id, userId, usage, ...columns } = getTableColumns(articlesTable);

    const [article] = await db
      .select(columns)
      .from(articlesTable)
      .where(
        and(
          eq(articlesTable.slug, slug),
          eq(articlesTable.userId, currentUser.id)
        )
      );

    if (!article) {
      return NextResponse.json(
        { error: { message: "Article not found", code: "ARTICLE_NOT_FOUND" } },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return NextResponse.json(article, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        },
      },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
