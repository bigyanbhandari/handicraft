import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({ orderBy: { title: "asc" } });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const category = await prisma.category.create({
      data: { title: data.title, slug: data.slug, description: data.description || null, image: data.image || null },
    });
    revalidatePath("/");
    revalidatePath("/api/categories");
    revalidatePath("/jewelry");
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const category = await prisma.category.update({
      where: { id: data.id },
      data: { title: data.title, slug: data.slug, description: data.description || null, image: data.image || null },
    });
    revalidatePath("/");
    revalidatePath("/api/categories");
    revalidatePath("/jewelry");
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    await prisma.category.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/api/categories");
    revalidatePath("/jewelry");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
