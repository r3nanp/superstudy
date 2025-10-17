"use client";

import {
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  ClockIcon,
  DocumentTextIcon,
  ForwardIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { useActionState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Input } from "@/components/input";
import { useArticles } from "@/hooks/use-articles";
import { Spinner } from "@/components/spinner";
import { crawlerAction } from "@/lib/actions/crawler";
import type { Article, ArticleStatus } from "@/lib/types";

import { FileUploader } from "./file-uploader";
import { cn } from "@/lib/cn";

const POSSIBLE_STATUS: Record<ArticleStatus, { label: string; color: string }> =
  {
    processing: {
      label: "Processando",
      color: "bg-amber-100 text-amber-700 border-amber-200",
    },
    processed: {
      label: "Processado",
      color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    error: { label: "Erro", color: "bg-red-100 text-red-700 border-red-200" },
  };

const ArticleCard = ({ article }: { article: Article }) => {
  const statusInfo = POSSIBLE_STATUS[article.status];
  const hasAudio = article.audioUrl && article.status === "processed";

  return (
    <div className="group relative">
      <Link
        href={`/app/${article.slug}`}
        className="block p-6 rounded-lg bg-card border border-border hover:border-primary/40 hover:shadow-glow transition-all duration-300 cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300 rounded-lg" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-all duration-300 leading-tight flex-1">
              {article.title}
            </h3>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-300 flex-shrink-0 opacity-0 group-hover:opacity-100" />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary">{statusInfo.label}</Badge>
            {hasAudio ? (
              <Badge variant="default">
                <SpeakerWaveIcon className="w-3 h-3" />
                Áudio
              </Badge>
            ) : (
              <Badge variant="default">
                <DocumentTextIcon className="w-3 h-3" />
                Texto
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
            {article.description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs font-medium text-muted-foreground truncate max-w-[60%]">
              {article.source}
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ClockIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {article.readTime} min
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data, status } = useArticles();
  const [state, formAction, isPending] = useActionState(crawlerAction, null);

  return (
    <>
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
                  {state && "error" in state && (
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
    </>
  );
}
