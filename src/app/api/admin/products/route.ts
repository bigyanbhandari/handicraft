import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true, collection: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Admin products GET error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        title: data.title,
        slug: data.slug,
        price: parseFloat(data.price),
        discountPrice: data.discountPrice ? parseFloat(data.discountPrice) : null,
        description: data.description || null,
        materials: data.materials || [],
        craftType: data.craftType || null,
        origin: data.origin || null,
        occasion: data.occasion || [],
        images: data.images || [],
        stockStatus: data.stockStatus || "In Stock",
        featured: data.featured || false,
        seo: data.seo || null,
        categoryId: data.categoryId || null,
        collectionId: data.collectionId || null,
      },
      include: { category: true, collection: true },
    });
    revalidatePath("/");
    revalidatePath("/api/products");
    revalidatePath("/jewelry");
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Admin products POST error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
