import { z } from "zod";

export const extractArticleSchema = z.object({
  title: z
    .string()
    .describe("The title of the article, will be used as the slug"),
  description: z
    .string()
    .describe(
      "The description of the article or the description in the meta tag"
    )
    .nullish(),
  content: z.string().describe("The content of the article"),
  readTime: z
    .number()
    .describe("The read time of the article in minutes")
    .nullish(),
});
