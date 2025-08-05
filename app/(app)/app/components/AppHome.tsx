"use client";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Input } from "@/components/input";
import {
  BookOpenIcon,
  ClockIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { FileUploader } from "./FileUploader";
import { useArticles } from "@/hooks/use-articles";
import type { Article, ArticleStatus } from "@/lib/api/types";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
import { crawlerAction } from "@/lib/actions/crawler";
import { useActionState } from "react";

const POSSIBLE_STATUS: Record<ArticleStatus, string> = {
  processing: "Processando",
  processed: "Processado",
  error: "Erro",
};

const ArticleCard = ({ article }: { article: Article }) => {
  return (
    <Link
      href={`/app/${article.slug}`}
      className="p-4 border rounded-lg hover:shadow-card transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold hover:text-primary transition-colors">
          {article.title}
        </h3>
        <Badge variant="default">{POSSIBLE_STATUS[article.status]}</Badge>

        {article.audioUrl && article.status === "processed" ? (
          <Badge variant="default">Audio</Badge>
        ) : (
          <Badge variant="default">Texto</Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{article.description}</p>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{article.source}</span>
        <div className="flex items-center gap-1">
          <ClockIcon className="h-3 w-3" />
          {article.readTime}
        </div>
      </div>
    </Link>
  );
};

export function AppHome() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data, status } = useArticles();

  const [state, formAction, isPending] = useActionState(crawlerAction, null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Bem-vindo ao seu{" "}
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            Hub de Estudo
          </span>
        </h1>
        <p className="text-muted-foreground">
          Transforme seus artigos em recursos de estudo poderosos
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                Carregar arquivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="w-full">
                <FileUploader />
              </div>

              <form action={formAction}>
                <label className="text-sm font-medium">Ou cole uma URL</label>
                <div className="space-y-3">
                  <Input
                    placeholder="https://example.com/article"
                    className="w-full"
                    name="url"
                    disabled={isPending}
                  />
                  {state?.error && (
                    <p className="text-sm text-destructive">{state.error}</p>
                  )}

                  <Button className="w-full" type="submit" disabled={isPending}>
                    {isPending ? (
                      <div className="flex items-center gap-2">
                        <Spinner className="size-4" />
                        Importando...
                      </div>
                    ) : (
                      "Importar via URL"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar conteúdo..."
                  value={searchParams.get("search") || ""}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    params.set("search", e.target.value);
                    router.push(`?${params.toString()}`);
                  }}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpenIcon className="h-5 w-5" />
                Artigos
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {data?.articles.length === 0 && status === "pending" && (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              )}

              {data?.articles.length === 0 && (
                <div className="flex items-center">
                  <div className="flex items-center gap-x-2">
                    <InformationCircleIcon className="h-5 w-5" />
                    <p className="text-sm text-white">
                      Carregue um arquivo ou cole uma URL para começar.
                    </p>
                  </div>
                </div>
              )}

              {data?.articles.map((article) => (
                <ArticleCard key={article.uuid} article={article} />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SpeakerWaveIcon className="h-5 w-5" />
                Audios gerados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.articles.length === 0 && status === "pending" && (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              )}

              {data?.audios.length === 0 && (
                <div className="flex items-center">
                  <div className="flex items-center gap-x-2">
                    <InformationCircleIcon className="h-5 w-5" />
                    <p className="text-sm text-white">Nenhum audio gerado.</p>
                  </div>
                </div>
              )}

              {data?.audios.map((audio) => (
                <ArticleCard key={audio.uuid} article={audio} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
