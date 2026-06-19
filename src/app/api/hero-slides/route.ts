import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const slides = await prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(slides);
  } catch (error) {
    console.error("HeroSlides GET error:", error);
    return NextResponse.json([]);
  }
}
