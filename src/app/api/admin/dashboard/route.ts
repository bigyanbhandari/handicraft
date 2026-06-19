import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [productCount, orderCount, categoryCount, userCount, revenue] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.category.count(),
      prisma.user.count(),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: "paid" } }),
    ]);

    const recentOrders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      productCount,
      orderCount,
      categoryCount,
      userCount,
      revenue: revenue._sum.total || 0,
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}
