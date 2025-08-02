"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/supabase/server";
import { users as usersTable } from "@/db/schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";

const signupSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { email, password } = loginSchema.parse(Object.fromEntries(formData));

  const { data: supabaseData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    redirect("/error");
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.externalId, supabaseData.user.id));

  if (!user) {
    return {
      ok: false,
      error: {
        message: "Usuário não encontrado",
        code: "USER_NOT_FOUND",
      },
    };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return {
      ok: false,
      error: {
        message: "Email ou senha inválidos",
        code: "INVALID_CREDENTIALS",
      },
    };
  }

  redirect("/app");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const { email, password, name } = signupSchema.parse(
    Object.fromEntries(formData)
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error(error);
    redirect("/error");
  }

  const existingUser = await db.query.users.findFirst({
    where: eq(usersTable.email, email),
  });

  if (existingUser) {
    return {
      ok: false,
      error: {
        message: "Usuário já existe",
        code: "USER_ALREADY_EXISTS",
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(usersTable).values({
    email,
    name,
    password: hashedPassword,
    externalId: data.user?.id,
  });

  redirect("/app");
}
