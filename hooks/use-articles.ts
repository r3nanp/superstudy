import { getArticles } from "@/lib/api/get-articles";
import { useUser } from "./use-user";
import { useQuery } from "@tanstack/react-query";

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
