import { createClient } from "@/supabase/server";

export async function getSession() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  return data;
}
