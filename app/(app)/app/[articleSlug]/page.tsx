import { Article } from "../components/Article";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ articleSlug: string }>;
}) {
  const { articleSlug } = await params;

  return <Article slug={articleSlug} />;
}
