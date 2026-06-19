import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseAvailable } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    return NextResponse.json({ items: [], total: 0 });
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { sessionId },
      include: { items: true },
    });

    if (!cart) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return NextResponse.json({
      id: cart.id,
      items: cart.items,
      total,
    });
  } catch (error) {
    console.error("Cart GET error:", error);
    return NextResponse.json({ items: [], total: 0 });
  }
}

export async function POST(request: NextRequest) {
  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    return NextResponse.json({ error: "Database unavailable. Cart saved locally." }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { sessionId, productId, slug, title, price, image, quantity = 1 } = body;

    if (!sessionId || !productId || !slug || !title || price == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cart = await prisma.cart.upsert({
      where: { sessionId },
      update: {},
      create: { sessionId },
    });

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    let item;
    if (existingItem) {
      item = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      item = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          slug,
          title,
          price,
          image,
          quantity,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    return NextResponse.json({
      item,
      cart: updatedCart,
      sessionId: cart.sessionId,
    });
  } catch (error) {
    console.error("Cart POST error:", error);
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const dbAvailable = await isDatabaseAvailable();
  if (!dbAvailable) {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { sessionId, itemId } = body;

    if (!sessionId || !itemId) {
      return NextResponse.json({ error: "Session ID and item ID are required" }, { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { sessionId },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    });

    if (!item) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: itemId },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: true },
    });

    return NextResponse.json({
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Cart DELETE error:", error);
    return NextResponse.json({ error: "Failed to remove item from cart" }, { status: 500 });
  }
}