import { Article } from "../components/article-details";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ articleSlug: string }>;
}) {
  const { articleSlug } = await params;

  return <Article slug={articleSlug} />;
}
