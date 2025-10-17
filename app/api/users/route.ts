import { NextRequest, NextResponse } from "next/server";
import { eq, getTableColumns } from "drizzle-orm";
import { users as usersTable } from "@/db/schema";
import { db } from "@/db";
import z from "zod";
import { getSession } from "@/modules/auth/api/session";

const schema = z.object({
  type: z.enum(["avatar", "audio"]),
  url: z.string().nullish(),
});

export async function GET(request: NextRequest) {
  const { session } = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { password: _, ...columns } = getTableColumns(usersTable);

  const [user] = await db
    .select({
      ...columns,
    })
    .from(usersTable)
    .where(eq(usersTable.externalId, session.user.id));

  if (!user) {
    return NextResponse.json(
      {
        error: {
          message: "Usuário não encontrado",
          code: "USER_NOT_FOUND",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json(user, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const { session } = await getSession();
  const { type, url } = schema.parse(await request.json());

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [user] = await db
      .select({
        id: usersTable.id,
      })
      .from(usersTable)
      .where(eq(usersTable.externalId, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({
        error: {
          message: "Usuário não encontrado",
          code: "USER_NOT_FOUND",
        },
      });
    }

    const isAvatar = type === "avatar";
    const updateStatement = isAvatar ? { avatarUrl: url } : { audioUrl: url };

    const [updatedUser] = await db
      .update(usersTable)
      .set(updateStatement)
      .where(eq(usersTable.id, user.id))
      .returning();

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";

    return NextResponse.json(
      { error: { message, code: "INTERNAL_SERVER_ERROR" } },
      { status: 500 }
    );
  }
}
