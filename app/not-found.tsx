"use client";

import { Button } from "@/components/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col justify-center items-center space-y-4">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl text-gray-600">Oops! Essa página não existe.</p>

        <Button asChild>
          <Link
            href="/"
            className="bg-primary text-white hover:bg-primary/90 shadow-card hover:shadow-elegant"
          >
            Voltar para home
          </Link>
        </Button>
      </div>
    </div>
  );
}
