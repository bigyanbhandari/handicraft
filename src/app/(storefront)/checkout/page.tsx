"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [form, setForm] = useState<ShippingForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setUser(d.user);
          setForm((prev) => ({ ...prev, email: d.user.email, firstName: d.user.name?.split(" ")[0] || "", lastName: d.user.name?.split(" ").slice(1).join(" ") || "" }));
        }
        setLoadingUser(false);
      })
      .catch(() => setLoadingUser(false));
  }, []);

  const subtotal = getTotal();
  const freeShipping = subtotal >= 25000;
  const shippingCost = freeShipping ? 0 : 150;
  const total = subtotal + shippingCost;

  function updateField(field: keyof ShippingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const requiredFields: (keyof ShippingForm)[] = [
      "firstName", "lastName", "email", "phone", "address1", "city", "state", "pincode",
    ];
    const missing = requiredFields.filter((f) => !form[f].trim());
    if (missing.length > 0) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingAddress = {
        line1: form.address1,
        line2: form.address2,
        city: form.city,
        state: form.state,
        postal_code: form.pincode,
        country: "IN",
      };

      const res = await fetch("/api/payment/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            slug: item.slug,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          customerName: `${form.firstName} ${form.lastName}`,
          customerEmail: form.email,
          customerPhone: form.phone,
          shippingAddress,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push(`/login?redirect=/checkout`);
          return;
        }
        throw new Error(data.error || "Checkout failed");
      }

      if (data.directSuccess) {
        clearCart();
        router.push(data.url);
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Ratnagiri",
        description: "Handcrafted Jewelry",
        order_id: data.razorpayOrderId,
        prefill: {
          name: data.customer.name,
          email: data.customer.email,
          contact: data.customer.phone,
        },
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            clearCart();
            router.push(`/order/success?orderId=${data.orderId}`);
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  }

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && !isSubmitting) {
    return (
      <main className="min-h-screen bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-3xl font-serif text-cream mb-4">
              Nothing to Checkout
            </h1>
            <p className="text-cream-dark/70 mb-8">
              Your cart is empty. Add some beautiful pieces before checking out.
            </p>
            <Button asChild size="lg" variant="default" className="px-8">
              <Link href="/jewelry">Explore Collection</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-gold tracking-[0.2em] uppercase text-xs font-medium mb-3">
            Checkout
          </p>
          <h1 className="text-3xl font-serif text-cream">
            Complete Your Order
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-[#141414] rounded-sm p-6 md:p-8 border border-[rgba(201,168,76,0.1)]">
                <h2 className="text-lg font-serif text-cream mb-6">
                  Shipping Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-gold-muted mb-1.5">
                      First Name *
                    </label>
                    <Input
                      value={form.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-gold-muted mb-1.5">
                      Last Name *
                    </label>
                    <Input
                      value={form.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-gold-muted mb-1.5">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-gold-muted mb-1.5">
                      Phone *
                    </label>
                    <Input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs tracking-wider uppercase text-gold-muted mb-1.5">
                      Address Line 1 *
                    </label>
                    <Input
                      value={form.address1}
                      onChange={(e) => updateField("address1", e.target.value)}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs tracking-wider uppercase text-gold-muted mb-1.5">
                      Address Line 2
                    </label>
                    <Input
                      value={form.address2}
                      onChange={(e) => updateField("address2", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-gold-muted mb-1.5">
                      City *
                    </label>
                    <Input
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-gold-muted mb-1.5">
                      State *
                    </label>
                    <Input
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-gold-muted mb-1.5">
                      PIN Code *
                    </label>
                    <Input
                      value={form.pincode}
                      onChange={(e) => updateField("pincode", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#141414] rounded-sm p-6 lg:sticky lg:top-24 border border-[rgba(201,168,76,0.1)]">
                <h2 className="text-lg font-serif text-cream mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="w-14 h-16 rounded-sm overflow-hidden bg-[#0a0a0a] shrink-0 relative border border-[rgba(201,168,76,0.1)]">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="56px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-cream-dark/40 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-cream line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-xs text-gold-muted">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-cream shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[rgba(201,168,76,0.1)] pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cream-dark/70">Subtotal</span>
                    <span className="text-cream">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-dark/70">Shipping</span>
                    <span className={freeShipping ? "text-emerald-400" : "text-cream"}>
                      {freeShipping ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  {!freeShipping && (
                    <p className="text-xs text-gold-muted">
                      Add {formatPrice(25000 - subtotal)} more for free shipping
                    </p>
                  )}
                </div>

                <div className="border-t border-[rgba(201,168,76,0.1)] my-4" />

                <div className="flex justify-between text-base font-semibold mb-6">
                  <span className="text-cream">Total</span>
                  <span className="text-cream">{formatPrice(total)}</span>
                </div>

                {error && (
                  <p className="text-red-400 text-xs mb-4 bg-red-400/10 px-3 py-2 rounded-sm">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  variant="default"
                  className="w-full"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Place Order"
                  )}
                </Button>

                <p className="text-xs text-gold-muted text-center mt-4">
                  Secure checkout powered by Razorpay
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
