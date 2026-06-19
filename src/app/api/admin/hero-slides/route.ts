import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";

export async function GET() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(slides);
}

export async function POST(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await request.json();
    const maxOrder = await prisma.heroSlide.aggregate({ _max: { order: true } });
    const slide = await prisma.heroSlide.create({
      data: { title: data.title, subtitle: data.subtitle || null, ctaText: data.ctaText || null, ctaLink: data.ctaLink || null, image: data.image || null, order: (maxOrder._max.order || 0) + 1 },
    });
    return NextResponse.json(slide, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create slide" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const data = await request.json();
    const slide = await prisma.heroSlide.update({
      where: { id: data.id },
      data: { title: data.title, subtitle: data.subtitle || null, ctaText: data.ctaText || null, ctaLink: data.ctaLink || null, image: data.image || null, order: data.order, active: data.active },
    });
    return NextResponse.json(slide);
  } catch {
    return NextResponse.json({ error: "Failed to update slide" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = getUserFromRequest(request);
  if (!user || user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await request.json();
    await prisma.heroSlide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete slide" }, { status: 500 });
  }
}
