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
      model: openai("gpt-5-mini"),
      schema: extractArticleSchema,
      prompt: `
Você é um assistente útil e um especialista em copywriting.
Você receberá o HTML de um artigo e deve extrair as seguintes informações: título, descrição, resumo e tempo médio de leitura.

INSTRUÇÕES:
- Título:
  Deve ser o título do artigo ou o conteúdo da tag <title> ou <meta name="title">.
  Se o título não estiver disponível no HTML, gere um título coerente com base no conteúdo do artigo.
  O título deve ser único e não deve conter caracteres especiais.

- Descrição:
  Deve ser uma descrição curta e atrativa (estilo meta description).
  Deve ter menos de 150 caracteres, representar bem o conteúdo e despertar interesse.
  Deve ser único e não deve conter caracteres especiais.

- Resumo:
  Deve ser um resumo completo e bem escrito do artigo, com pelo menos 100 palavras.
  Evite repetições e mantenha linguagem natural, fluida e fiel ao conteúdo do texto.

- Tempo de leitura:
  Calcule uma estimativa aproximada do tempo de leitura em minutos, considerando 200 palavras por minuto.
  Arredonde para o minuto inteiro mais próximo (ex: 3).

- Importante:
  - Use o esquema abaixo como guia para estruturar os dados extraídos.
  - Não invente informações. Baseie-se apenas no conteúdo do HTML.
  - Caso alguma informação não possa ser identificada, retorne o campo como null (ou [] para listas).
  - Toda a resposta deve estar em português do Brasil (pt-BR).

SAÍDA SOLICITADA (JSON):
Retorne apenas um objeto JSON válido com as seguintes chaves:
{
  "title": string | null,
  "description": string | null,
  "summary": string | null,
  "readTime": number | null
}

REGRAS ADICIONAIS:
- "description" deve ter no máximo 150 caracteres.
- "summary" deve conter pelo menos 100 palavras.
- "readTime" deve ser um número (ex: 1, 2, 3) ou null se não for possível calcular.
- Não inclua texto explicativo fora do JSON.

ARTIGO:
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
