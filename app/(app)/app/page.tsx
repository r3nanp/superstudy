import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { AppHome } from "./components/AppHome";

export default async function AppPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    redirect("/login");
  }

  return <AppHome />;
}
