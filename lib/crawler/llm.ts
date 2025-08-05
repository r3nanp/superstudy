import { openai } from "@ai-sdk/openai";
import { generateObject, generateText, NoObjectGeneratedError } from "ai";
import { extractArticleSchema } from "./schema";

export const summarizeArticle = async (html: string) => {
  try {
    console.time("START SUMMARIZING ARTICLE");

    const { text, usage } = await generateText({
      model: openai("gpt-4o-mini"),
      prompt: `You are a helpful assistant and specialist and copywriter. You are given a html of an article and you need to generate a summary of the content of the article. Extract relevant information from the article, don't return any HTML.

      INSTRUCTIONS:
      - Stick to the data you find in the HTML, and don't make up any information.

      ARTICLE:
      <article>
      ${html}
      </article>
      `,
    });

    return {
      summary: text,
      usage,
    };
  } catch (error) {
    console.error(error);

    return {
      summary: null,
      usage: null,
    };
  } finally {
    console.timeEnd("END SUMMARIZING ARTICLE");
  }
};

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
        You are a helpful assistant and specialist and copywriter. You are given a html of an article and you need to extract the title, description, content, and read time of the article.

        INSTRUCTIONS:
        - The title should be the title of the article.
        - The description should be a short description of the article or the description in the meta tag.
        - The content should be the content of the article.
        - The read time should be the read time of the article in minutes.
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
