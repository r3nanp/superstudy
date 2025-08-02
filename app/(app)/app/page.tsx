import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  return <div>AppPage</div>;
}
