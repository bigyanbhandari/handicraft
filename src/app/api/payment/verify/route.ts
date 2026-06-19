import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    if (razorpay_order_id && razorpay_payment_id && razorpay_signature) {
      const secret = process.env.RAZORPAY_KEY_SECRET || "";
      const generated = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generated !== razorpay_signature) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }

      await prisma.order.update({
        where: { razorpayOrderId: razorpay_order_id },
        data: {
          status: "paid",
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "paid" },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
