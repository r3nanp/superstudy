import { getUser } from "@/lib/api/get-user";
import { createClient } from "@/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

export function useUser() {
  const supabase = createClient();

  const { data: user, status } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session) {
        redirect("/login");
      }

      return getUser();
    },
  });

  return { user, status };
}
