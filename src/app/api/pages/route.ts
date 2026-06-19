import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");
    if (slug) {
      const page = await prisma.pageContent.findUnique({
        where: { slug, published: true },
      });
      if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json(page);
    }
    const pages = await prisma.pageContent.findMany({
      where: { published: true },
      orderBy: { title: "asc" },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Pages GET error:", error);
    return NextResponse.json([]);
  }
}
