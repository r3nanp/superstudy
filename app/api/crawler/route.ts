import { crawl } from "@/lib/crawler/crawler";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);

  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  const result = await crawl(url);

  if (!result) {
    return NextResponse.json(
      { error: "Failed to crawl the website" },
      { status: 500 }
    );
  }

  return NextResponse.json(result, { status: 200 });
};
