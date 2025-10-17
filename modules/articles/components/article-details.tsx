"use client";

import { useState } from "react";
import {
  ClockIcon,
  PlayIcon,
  PauseIcon,
  ShareIcon,
  BookmarkIcon,
  ArrowLeftIcon,
  EllipsisVerticalIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { getArticle } from "../api";
import { useQuery } from "@tanstack/react-query";

export const Article = ({ slug }: { slug: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  const { data: article, status } = useQuery({
    queryKey: ["article", slug],
    queryFn: () => getArticle(slug),
  });

  const hasAudio = !!article?.audioUrl;

  if (status === "pending") {
    return <div>Carregando...</div>;
  }

  if (status === "error") {
    return <div>Erro ao carregar o artigo</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a
              href="/app"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Voltar</span>
            </a>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-accent transition-all duration-300 text-muted-foreground hover:text-foreground">
                <BookmarkIcon className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-accent transition-all duration-300 text-muted-foreground hover:text-foreground">
                <ShareIcon className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-accent transition-all duration-300 text-muted-foreground hover:text-foreground">
                <EllipsisVerticalIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

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
            <span>
              {new Date(article.createdAt).toLocaleDateString("pt-BR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Audio Player */}
        {hasAudio && (
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
              </div>
              <button className="p-2 rounded-lg hover:bg-primary/10 transition-smooth text-muted-foreground hover:text-primary">
                <SpeakerWaveIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Article Content */}
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
