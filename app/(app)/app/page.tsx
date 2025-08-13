import { redirect } from "next/navigation";

import { createClient } from "@/supabase/server";
import { Dashboard } from "./components/dashboard";

export default async function AppPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    redirect("/login");
  }

  return <Dashboard />;
}
