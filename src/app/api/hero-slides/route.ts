import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCached, setCache } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cacheKey = "hero-slides";
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
      });
    }

    const slides = await prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });

    setCache(cacheKey, slides, 60);

    return NextResponse.json(slides, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch (error) {
    console.error("HeroSlides GET error:", error);
    return NextResponse.json([]);
  }
}
