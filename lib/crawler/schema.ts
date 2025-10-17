import { z } from "zod";

export const extractArticleSchema = z.object({
  title: z.string().describe("O título do artigo, será usado como slug"),
  description: z
    .string()
    .describe(
      "Uma descrição curta e atrativa do artigo, deve representar bem o conteúdo e despertar interesse. Deve ser único e não deve conter caracteres especiais."
    )
    .max(150),
  summary: z
    .string()
    .describe(
      "O resumo do artigo, deve ser um resumo completo e bem escrito do artigo, com pelo menos 100 palavras."
    )
    .min(150),
  readTime: z
    .number()
    .describe(
      "O tempo estimado de leitura do artigo em minutos, deve ser um tempo razoável para o artigo. Arredonde para o minuto inteiro mais próximo (ex: 3)."
    )
    .nullish(),
});

export type ExtractArticle = z.infer<typeof extractArticleSchema>;
