"use client";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card";
import { Form } from "@/components/form";
import { Input } from "@/components/input";
import {
  BookOpenIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { FileUploader } from "./FileUploader";

export function AppHome() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for the demo
  const recentArticles = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence in Education",
      source: "TechEd Weekly",
      readTime: "8 min read",
      summary: "Exploring how AI is transforming learning experiences...",
      status: "processed",
    },
    {
      id: 2,
      title: "Quantum Computing: A Beginner's Guide",
      source: "Science Today",
      readTime: "12 min read",
      summary: "Understanding the principles behind quantum mechanics...",
      status: "processing",
    },
    {
      id: 3,
      title: "Sustainable Development Goals 2024",
      source: "Global Report",
      readTime: "15 min read",
      summary: "Progress report on global sustainability initiatives...",
      status: "processed",
    },
  ];

  const studyStats = [
    { label: "Articles Processed", value: "23", trend: "+5 this week" },
    { label: "Study Hours", value: "12.5", trend: "+2.3 hours" },
    { label: "Flashcards Mastered", value: "89", trend: "87% accuracy" },
    { label: "Audio Sessions", value: "6", trend: "4.2 hrs total" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-8">
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
                <div className="grid gap-4">
                  <FileUploader />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Ou cole uma URL</label>
                  <Input
                    placeholder="https://example.com/article"
                    className="w-full"
                  />
                  <Button className="w-full">Process URL</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search your content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                  Articles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentArticles.map((article) => (
                  <div
                    key={article.id}
                    className="p-4 border rounded-lg hover:shadow-card transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <Badge
                        variant={
                          article.status === "processed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {article.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{article.source}</span>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {article.readTime}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SpeakerWaveIcon className="h-5 w-5" />
                  Audio Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg hover:shadow-card transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold hover:text-primary transition-colors">
                      AI in Education Podcast
                    </h3>
                    <Badge variant="default">processed</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Deep dive into how artificial intelligence is reshaping
                    education...
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Tech Talks</span>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      45 min
                    </div>
                  </div>
                </div>
                <div className="p-4 border rounded-lg hover:shadow-card transition-all duration-300 cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold hover:text-primary transition-colors">
                      Quantum Computing Explained
                    </h3>
                    <Badge variant="secondary">processing</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Simple explanation of quantum computing principles...
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Science Audio</span>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-3 w-3" />
                      28 min
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
