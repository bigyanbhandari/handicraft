import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const categorySlug = request.nextUrl.searchParams.get("category");
    const featured = request.nextUrl.searchParams.get("featured");
    const limit = request.nextUrl.searchParams.get("limit");
    const page = request.nextUrl.searchParams.get("page");
    const pageSize = request.nextUrl.searchParams.get("pageSize");

    const where: any = {};

    if (categorySlug) {
      const category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (category) where.categoryId = category.id;
    }

    if (featured === "true") where.featured = true;

    const take = pageSize ? parseInt(pageSize) : limit ? parseInt(limit) : undefined;
    const skip = page && take ? (parseInt(page) - 1) * take : undefined;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, collection: true },
        orderBy: { createdAt: "desc" },
        ...(take ? { take } : {}),
        ...(skip ? { skip } : {}),
      }),
      prisma.product.count({ where }),
    ]);

    const result = { products, total, page: page ? parseInt(page) : 1, pageSize: take ?? total };

    return NextResponse.json(result, {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (error) {
    console.error("Products GET error:", error);
    return NextResponse.json({ products: [], total: 0, page: 1, pageSize: 0 });
  }
}