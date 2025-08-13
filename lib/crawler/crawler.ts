import { CheerioCrawler } from "@crawlee/cheerio";
import chalk from "chalk";
import slugify from "slugify";
import { extractArticle, getCost } from "./llm";
import type { CrawledArticle } from "@/lib/types";
import type { CrawlerResponse } from "./types";

export async function crawl(url: string): Promise<CrawlerResponse | null> {
  const articleFromRequest = new Set<CrawledArticle>();

  const crawler = new CheerioCrawler({
    requestHandler: async ({ request, $ }) => {
      // Remove unwanted elements
      $("script, style, nav, header, footer, aside, form, iframe").remove();

      // Candidate tags that usually contain article text
      const candidates = $("article, section, main, div");
      const classNamesCandidates = candidates
        .map((_, el) => {
          const className = $(el).attr("class");
          return className ? className.split(" ") : [];
        })
        .get();

      let bestNode = null;
      let bestScore = 0;

      const getWeight = (tagName: string) => {
        // process classnames, like "markdown-body", markdown-content, markdown, content, etc
        const classNamesWeight = classNamesCandidates.reduce(
          (acc, className) => {
            if (className.includes("markdown")) return acc + 3;
            if (className.includes("content")) return acc + 2;
            if (className.includes("body")) return acc + 1;
            return acc;
          },
          0
        );

        if (tagName === "article") return 3 + classNamesWeight;
        if (tagName === "section") return 2 + classNamesWeight;

        return 1 + classNamesWeight;
      };

      candidates.each((_, el) => {
        const text = $(el).text().trim();
        if (text.length < 200) return; // Skip very short blocks

        const tag = el.tagName.toLowerCase();
        const weight = getWeight(tag);

        // Score = text length * tag weight
        const score = text.length * weight;

        if (score > bestScore) {
          bestScore = score;
          bestNode = el;
        }
      });

      let content = "";

      if (bestNode) {
        // Extract only paragraph-like text from the best node
        content = $(bestNode)
          .find("p")
          .map((i, p) => $(p).text().trim())
          .get()
          .join("\n\n");

        if (!content) {
          // If no <p>, just get text
          content = $(bestNode).text().trim();
        }
      }

      const { article, usage } = await extractArticle(content);

      if (!article) {
        return;
      }

      const articleUsage = {
        ...usage,
        cost: getCost({
          completionTokens: usage.outputTokens ?? 0,
          promptTokens: usage.inputTokens ?? 0,
        }),
      };

      const slug = slugify(article.title, { lower: true, strict: true });

      articleFromRequest.add({
        ...article,
        usage: articleUsage,
        content,
        slug,
      });
    },
    errorHandler: async ({ request, error }) => {
      console.log(chalk.red(`Request ${request.url} failed:`, error));
      articleFromRequest.clear();
    },
  });

  await crawler.addRequests([{ url }], {
    batchSize: 1,
    waitForAllRequestsToBeAdded: true,
  });

  try {
    const result = await crawler.run();

    return {
      url,
      ...result,
      articles: Array.from(articleFromRequest),
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
