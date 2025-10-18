"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ClockIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

import { ArticleHeader } from "./article-header";
import { useUser } from "@/hooks/use-user";
import { httpClient } from "@/lib/http-client";
import { toast } from "sonner";
import { useArticle } from "../hooks/use-article";

export const Article = ({ slug }: { slug: string }) => {
  const { user } = useUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioProcessing, setAudioProcessing] = useState(false);

  const { data: article, status, refetch } = useArticle(slug);

  const hasAudio = !!article?.audioUrl;

  const handleGenerateAudio = async () => {
    setAudioProcessing(true);
    try {
      const searchParams = new URLSearchParams({
        articleSlug: slug,
        userId: user?.externalId ?? "",
      });

      await httpClient.post(`/api/audio?${searchParams.toString()}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setTimeout(() => {
        refetch();
        setAudioProcessing(false);
      }, 2000);
    } catch (err) {
      setAudioProcessing(false);
      toast.error("Erro ao gerar áudio");
    }
  };

  if (status === "pending") {
    return <div>Carregando...</div>;
  }

  if (status === "error") {
    return <div>Erro ao carregar o artigo</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <ArticleHeader />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {hasAudio ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                <SpeakerWaveIcon className="w-3 h-3" />
                Áudio disponível
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                <DocumentTextIcon className="w-3 h-3" />
                Texto
              </span>
            )}
            <span className="text-xs text-muted-foreground">•</span>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <ClockIcon className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">
                {article.readTime} min
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            {article.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
            {article.description}
          </p>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="font-medium">{article.source}</span>
            <span>{format(article.createdAt, "dd/MM/yyyy HH:mm")}</span>
          </div>
        </div>

        {hasAudio && article.audioUrl ? (
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-primary hover:bg-primary-glow flex items-center justify-center transition-smooth shadow-glow"
              >
                {isPlaying ? (
                  <PauseIcon className="w-5 h-5 text-primary-foreground" />
                ) : (
                  <PlayIcon className="w-5 h-5 text-primary-foreground ml-0.5" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    {isPlaying ? "Reproduzindo áudio" : "Ouvir artigo"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {Math.floor(audioProgress * article.readTime)}:
                    {String(
                      Math.floor((audioProgress * article.readTime * 60) % 60)
                    ).padStart(2, "0")}{" "}
                    / {article.readTime}:00
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${audioProgress * 100}%` }}
                  />
                </div>

                <audio
                  src={article.audioUrl}
                  onTimeUpdate={(e) => {
                    if (e instanceof HTMLAudioElement) {
                      setAudioProgress((e.currentTime / article.readTime) * 60);
                    }
                  }}
                  onEnded={() => setIsPlaying(false)}
                />
              </div>
              <button className="p-2 rounded-lg hover:bg-primary/10 transition-smooth text-muted-foreground hover:text-primary">
                <SpeakerWaveIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary/40">
                <SpeakerWaveIcon className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">
                  O áudio ainda não foi gerado para este artigo.
                </span>
                <div className="mt-2 text-xs text-muted-foreground">
                  Clique no botão abaixo para gerar o áudio.
                </div>
              </div>
            </div>
            <div className="flex items-center mt-4">
              <button
                onClick={handleGenerateAudio}
                className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/70 flex items-center justify-center transition-smooth shadow text-secondary-foreground font-medium text-sm cursor-pointer"
                disabled={audioProcessing}
              >
                {audioProcessing ? "Gerando áudio..." : "Gerar áudio"}
              </button>
            </div>
            {audioProcessing ? (
              <div className="text-xs text-muted-foreground mt-2">
                O áudio está sendo gerado. Isso pode levar alguns segundos...
              </div>
            ) : null}
          </div>
        )}

        <article className="prose prose-invert max-w-none">
          <div className="text-base text-foreground/90 leading-relaxed space-y-6 prose">
            {article.content}
          </div>
        </article>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Fonte original
              </p>
              <p className="text-xs text-muted-foreground">{article.source}</p>
            </div>
            <a
              href={article.source}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-glow text-primary-foreground text-sm font-medium transition-smooth"
            >
              Visitar fonte
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
