import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { title: "asc" },
      include: { products: true },
    });
    return NextResponse.json(collections);
  } catch (error) {
    console.error("Collections GET error:", error);
    return NextResponse.json([]);
  }
}
