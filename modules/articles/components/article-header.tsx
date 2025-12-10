"use client";

import {
  ArrowLeftIcon,
  BookmarkIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export const ArticleHeader = () => {
  return (
    <div className="backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-6 py-4 border-b border-border ">
        <div className="flex items-center justify-between">
          <Link
            href="/app"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Voltar</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-accent transition-all duration-300 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <BookmarkIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-accent transition-all duration-300 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <ShareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
