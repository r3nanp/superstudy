import { db } from "@/db";
import { users } from "@/db/schema";
import { createSupabaseClient } from "@/lib/supabase";
import bcrypt from "bcryptjs";
import z from "zod";

const schema = z.object({
  email: z.email({
    message: "Email inválido",
  }),
  password: z.string().min(8, {
    message: "Senha deve ter pelo menos 8 caracteres",
  }),
  name: z.string().min(1, { message: "Nome é obrigatório" }),
});

export async function POST(request: Request) {
  try {
    const { email, password, name } = schema.parse(await request.json());

    const supabase = createSupabaseClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
      externalId: data.user?.id,
    });

    return new Response(JSON.stringify({ data }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Erro ao criar conta" }), {
      status: 400,
    });
  }
}
