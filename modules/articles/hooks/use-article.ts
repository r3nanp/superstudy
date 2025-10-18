import { useQuery } from "@tanstack/react-query";
import { getArticle } from "../api";

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: ["article", slug],
    queryFn: () => getArticle(slug),
  });
};
