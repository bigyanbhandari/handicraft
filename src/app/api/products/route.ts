import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const categorySlug = request.nextUrl.searchParams.get("category");
    const featured = request.nextUrl.searchParams.get("featured");
    const limit = request.nextUrl.searchParams.get("limit");

    const where: any = {};

    if (categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (category) where.categoryId = category.id;
    }

    if (featured === "true") where.featured = true;

    const products = await prisma.product.findMany({
      where,
      include: { category: true, collection: true },
      orderBy: { createdAt: "desc" },
      ...(limit ? { take: parseInt(limit) } : {}),
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json([]);
  }
}
