"use client";

import { Branding } from "@/components/branding";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Branding />

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">
          Oops! Essa página não existe.
        </p>
        <Link
          href="/"
          className="bg-primary text-white hover:bg-primary/90 shadow-card hover:shadow-elegant"
        >
          Voltar para home
        </Link>
      </div>
    </div>
  );
}
