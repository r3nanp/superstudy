import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let supabase: SupabaseClient | null = null;

const createSupabaseClient = () => {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_API_KEY) {
    throw new Error("Missing Supabase URL or API Key");
  }

  if (supabase) return supabase;

  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_API_KEY
  );

  return supabase;
};

export { createSupabaseClient };
