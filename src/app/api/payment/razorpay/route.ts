import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import Razorpay from "razorpay";

const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

export async function POST(request: NextRequest) {
  try {
    const user = getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Please login to checkout" }, { status: 401 });
    }

    const body = await request.json();
    const { items, customerName, customerEmail, customerPhone, shippingAddress } = body;

    if (!items?.length || !customerName || !customerEmail || !shippingAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0
    );
    const shipping = subtotal >= 5000 ? 0 : 150;
    const total = Math.round(subtotal + shipping);

    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        subtotal,
        shipping,
        total,
        status: "pending",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            slug: item.slug,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
      },
      include: { items: true },
    });

    if (!razorpay) {
      return NextResponse.json({
        orderId: order.id,
        directSuccess: true,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/order/success?orderId=${order.id}`,
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: "INR",
      receipt: order.id,
      notes: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: total * 100,
      currency: "INR",
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      customer: { name: customerName, email: customerEmail, phone: customerPhone },
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
