import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { invalidateCache } from "@/lib/cache";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({ orderBy: { title: "asc" } });
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const collection = await prisma.collection.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        image: data.image || null,
        seo: data.seo || null,
      },
    });
    invalidateCache("collections");
    invalidateCache("home:collections");
    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await request.json();
    const collection = await prisma.collection.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        image: data.image || null,
        seo: data.seo || null,
      },
    });
    invalidateCache("collections");
    invalidateCache("home:collections");
    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    await prisma.collection.delete({ where: { id } });
    invalidateCache("collections");
    invalidateCache("home:collections");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}
