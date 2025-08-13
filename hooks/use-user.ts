import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";

import { getUser } from "@/modules/user/api";
import { createClient } from "@/supabase/client";

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
