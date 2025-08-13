import { useQuery } from "@tanstack/react-query";

import { getArticles } from "@/modules/articles/api";
import { useUser } from "./use-user";

export const useArticles = () => {
  const { user } = useUser();

  return useQuery({
    enabled: !!user,
    queryKey: ["articles"],
    queryFn: async () => {
      const articles = await getArticles();
      return articles;
    },
  });
};
