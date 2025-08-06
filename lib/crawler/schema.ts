import { z } from "zod";

export const extractArticleSchema = z.object({
  title: z
    .string()
    .describe("The title of the article, will be used as the slug"),
  description: z
    .string()
    .describe(
      "The description of the article or the description in the meta tag"
    ),
  summary: z.string().describe("The summary of the article ").min(100),
  readTime: z
    .number()
    .describe("The read time of the article in minutes")
    .nullish(),
});

export type ExtractArticle = z.infer<typeof extractArticleSchema>;
