import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCached, setCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cacheKey = "collections";
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
      });
    }

    const collections = await prisma.collection.findMany({
      orderBy: { title: "asc" },
    });

    setCache(cacheKey, collections, 60);

    return NextResponse.json(collections, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch (error) {
    console.error("Collections GET error:", error);
    return NextResponse.json([]);
  }
}
