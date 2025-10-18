import { get_encoding } from "@dqbd/tiktoken";

/**
 * Checks if the given text exceeds the token limit for gpt-4o-mini-tts.
 * @param text The input text to measure.
 * @param limit Optional override for token limit (default 2000).
 */
export const checkTokenLimit = (text: string, limit = 2000) => {
  const encoding = get_encoding("cl100k_base"); // same tokenizer family as GPT-4o models
  const tokens = encoding.encode(text);
  const tokenCount = tokens.length;
  encoding.free();

  return {
    tokenCount,
    withinLimit: tokenCount <= limit,
    exceededBy: Math.max(0, tokenCount - limit),
    remaining: Math.max(0, limit - tokenCount),
  };
};

const SENTENCE_END_REGEX = /(?<=[.!?])\s+/;

/**
 * Splits text into chunks by token limit, keeping sentence boundaries when possible.
 * Returns an array of text chunks (not tokens).
 */
export function splitTextSmart(text: string, limit = 1900): string[] {
  const encoding = get_encoding("cl100k_base");
  const sentences = text.split(SENTENCE_END_REGEX);

  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    const candidate = current ? `${current} ${s}` : s;
    const length = encoding.encode(candidate).length;

    if (length > limit) {
      if (current) chunks.push(current.trim());
      // if a single sentence itself exceeds the limit, split it by words
      if (encoding.encode(s).length > limit) {
        chunks.push(...splitLongSentence(s, limit, encoding));
        current = "";
      } else {
        current = s;
      }
    } else {
      current = candidate;
    }
  }

  if (current) chunks.push(current.trim());

  encoding.free();
  return chunks;
}

/**
 * Fallback helper to split a very long sentence by words if it exceeds the token limit.
 */
function splitLongSentence(
  sentence: string,
  limit: number,
  encoding: ReturnType<typeof get_encoding>
): string[] {
  const words = sentence.split(" ");
  const chunks: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (encoding.encode(candidate).length > limit) {
      if (current) chunks.push(current.trim());
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) chunks.push(current.trim());
  return chunks;
}
