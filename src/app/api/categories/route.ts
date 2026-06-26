import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCached, setCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cacheKey = "categories";
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
      });
    }

    const categories = await prisma.category.findMany({
      orderBy: { title: "asc" },
    });

    setCache(cacheKey, categories, 60);

    return NextResponse.json(categories, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch (error) {
    console.error("Categories GET error:", error);
    return NextResponse.json([]);
  }
}
