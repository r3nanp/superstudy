import { db } from "@/db";
import { users as usersTable } from "@/db/schema";
import { createSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import z from "zod";

const schema = z.object({
  email: z.email(),
  password: z.string(),
});

export async function POST(request: Request) {
  const { email, password } = schema.parse(await request.json());

  const supabase = createSupabaseClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ ok: false, error: error.message }), {
        status: 400,
      });
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!user) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            message: "Usuário não encontrado",
            code: "USER_NOT_FOUND",
          },
        }),
        {
          status: 400,
        }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            message: "Email ou senha inválidos",
            code: "INVALID_CREDENTIALS",
          },
        }),
        {
          status: 400,
        }
      );
    }

    // create a session for the user
    const { data: session } = await supabase.auth.getSession();

    if (!session) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: {
            message: "Erro ao fazer login",
            code: "LOGIN_ERROR",
          },
        }),
        {
          status: 400,
        }
      );
    }

    return new Response(JSON.stringify({ ok: true, session }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: {
          message: "Erro ao fazer login",
          code: "LOGIN_ERROR",
        },
      }),
      {
        status: 400,
      }
    );
  }
}
