import { openai } from "@ai-sdk/openai";
import { generateObject, NoObjectGeneratedError } from "ai";
import { extractArticleSchema } from "./schema";

export const getCost = (usage: {
  promptTokens: number;
  completionTokens: number;
}) => {
  const promptCost = usage.promptTokens * (0.15 / 1000000);
  const completionCost = usage.completionTokens * (0.6 / 1000000);
  return (promptCost + completionCost).toFixed(6);
};

export const extractArticle = async (html: string) => {
  try {
    console.time("START EXTRACTING ARTICLE");

    const { object, usage } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: extractArticleSchema,
      prompt: `
        You are a helpful assistant and specialist in copywriting. You are given a html of an article and you need to extract the title, description, summary, and approximate read time of the article.

        INSTRUCTIONS:
        - The title should be the title of the article.
        - The description should be a short description of the article or the description in the meta tag.
        - The summary should be the summary of the article, it should be at least 100 words and should be a good summary of the article.
        - The read time should be the approximate read time of the article in minutes.
        - Use the schema to guide you on what data to extract.
        - Stick to the data you find in the HTML, and don't make up any information.
        - If you can't find the data, leave the field 'null' or '[]' (for arrays).

        ARTICLE:
        <article>
        ${html}
        </article>
      `.trim(),
    });

    return {
      article: object,
      usage,
    };
  } catch (error) {
    console.error(error);

    if (NoObjectGeneratedError.isInstance(error)) {
      return {
        article: null,
        usage: error.usage,
      };
    }

    return {
      article: null,
      usage: null,
    };
  } finally {
    console.timeEnd("END EXTRACTING ARTICLE");
  }
};
