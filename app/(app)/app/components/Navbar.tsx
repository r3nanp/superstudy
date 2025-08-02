"use client";

import { Branding } from "@/components/branding";
import { useUser } from "@/hooks/use-user";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/avatar";
import Link from "next/link";

export const AppNavbar = () => {
  const { user } = useUser();

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-border py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/app">
            <Branding />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/app/settings">
            <Avatar>
              <AvatarImage src={user?.avatarUrl ?? undefined} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </nav>
  );
};
