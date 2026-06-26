import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { getCached, setCache, invalidateCache } from "@/lib/cache";

export async function GET() {
  try {
    const cacheKey = "site-settings";
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json(cached, {
        headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
      });
    }

    const settings = await prisma.siteSetting.findMany();
    const result: Record<string, any> = {};
    settings.forEach((s) => { result[s.key] = s.value });

    setCache(cacheKey, result, 120);

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300" },
    });
  } catch {
    return NextResponse.json({});
  }
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    for (const [key, value] of Object.entries(body)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any },
      });
    }
    invalidateCache("site-settings");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
