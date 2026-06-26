import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma, safeQuery } from "@/lib/prisma";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductCard } from "@/components/shared/product-card";
import { AddToCartBtn } from "@/components/shared/add-to-cart-btn";
import { ImageGallery } from "@/components/shared/image-gallery";
import type { Product } from "@/types";

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await safeQuery(() =>
    prisma.product.findUnique({ where: { slug } }),
    null
  );

  if (!product) {
    return { title: "Product Not Found" };
  }

  const seo = product.seo as { title?: string; description?: string; ogImage?: string } | null;
  const images = product.images as { url: string; alt?: string }[];

  return {
    title: seo?.title || product.title,
    description: seo?.description || `Discover the ${product.title} — handcrafted Indian jewelry by Ratnagiri.`,
    openGraph: {
      title: seo?.title || product.title,
      description: seo?.description || `Discover the ${product.title} — handcrafted Indian jewelry by Ratnagiri.`,
      images: images?.[0]?.url ? [{ url: images[0].url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await safeQuery(() =>
    prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    }),
    null
  );

  if (!product) {
    notFound();
  }

  const images = product.images as { url: string; alt?: string }[];
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? calculateDiscount(product.price, product.discountPrice!) : 0;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;

  const relatedProducts = await safeQuery(() =>
    prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: product.id },
      },
      include: { category: true },
      take: 4,
    }),
    []
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: `Handcrafted ${product.title} by Ratnagiri`,
    image: images.map((img) => img.url),
    offers: {
      "@type": "Offer",
      price: currentPrice,
      priceCurrency: "INR",
      availability: product.stockStatus === "In Stock"
        ? "https://schema.org/InStock"
        : product.stockStatus === "Limited Stock"
        ? "https://schema.org/LimitedAvailability"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Ratnagiri",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <nav className="text-sm text-neutral-500 mb-8 flex items-center gap-2">
            <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/jewelry" className="hover:text-[#C9A84C] transition-colors">Jewelry</Link>
            {product.category && (
              <>
                <span>/</span>
                <Link
                  href={`/jewelry?category=${product.category.slug}`}
                  className="hover:text-[#C9A84C] transition-colors"
                >
                  {product.category.title}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-neutral-900">{product.title}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
            <ImageGallery images={images} />

            <div className="flex flex-col">
              <div className="mb-6">
                {product.category && (
                  <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-2">
                    {product.category.title}
                  </p>
                )}
                <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4">
                  {product.title}
                </h1>
                {product.craftType && (
                  <p className="text-sm text-neutral-500 mb-4">{product.craftType}</p>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl md:text-3xl font-semibold text-neutral-900">
                    {formatPrice(currentPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-lg text-neutral-400 line-through">
                        {formatPrice(product.price)}
                      </span>
                      <Badge variant="sale">{discountPercent}% OFF</Badge>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-6">
                  {product.stockStatus === "In Stock" && (
                    <Badge variant="instock">In Stock</Badge>
                  )}
                  {product.stockStatus === "Limited Stock" && (
                    <Badge variant="limited">Limited Stock</Badge>
                  )}
                  {product.stockStatus === "Pre-order" && (
                    <Badge variant="preorder">Pre-order</Badge>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <AddToCartBtn
                  productId={product.id}
                  slug={product.slug}
                  title={product.title}
                  price={currentPrice}
                  image={images?.[0]?.url}
                />
              </div>

              {product.occasion && product.occasion.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs tracking-[0.2em] uppercase font-medium text-neutral-900 mb-2">
                    Perfect For
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.occasion.map((occ: string) => (
                      <span key={occ} className="text-xs bg-[#F8F5F0] text-neutral-700 px-3 py-1 rounded-sm">
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Tabs defaultValue="description" className="mt-auto">
                <TabsList>
                  <TabsTrigger value="description">Description</TabsTrigger>
                  <TabsTrigger value="craft">Craft Story</TabsTrigger>
                  <TabsTrigger value="materials">Materials & Origin</TabsTrigger>
                  <TabsTrigger value="shipping">Shipping</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                </TabsList>
                <TabsContent value="description">
                  <div className="prose prose-neutral max-w-none text-sm leading-relaxed text-neutral-700">
                    {product.description ? (
                      <p>{product.description}</p>
                    ) : (
                      <p>A handcrafted piece from the Ratnagiri collection, made with devotion by master artisans using traditional Indian jewelry techniques.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="craft">
                  <div className="text-sm leading-relaxed text-neutral-700 space-y-4">
                    {product.craftType ? (
                      <>
                        <p>
                          This piece is crafted using the <strong>{product.craftType}</strong> technique — one of India&apos;s great jewelry traditions.
                          Passed down through generations of artisans, this craft transforms precious metals and stones into wearable art.
                        </p>
                        <p>
                          At Ratnagiri, we work directly with master craftspeople who have dedicated their lives to preserving these techniques.
                          Each piece undergoes meticulous hand-finishing, ensuring that the legacy of Indian craftsmanship lives on in every detail.
                        </p>
                      </>
                    ) : (
                      <p>
                        At Ratnagiri, every piece is handcrafted by master artisans who carry forward centuries of Indian jewelry tradition.
                        From the initial sketch to the final polish, each step is performed with the care and precision that our heritage demands.
                      </p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="materials">
                  <div className="text-sm leading-relaxed text-neutral-700 space-y-4">
                    {product.materials && product.materials.length > 0 && (
                      <div>
                        <p className="font-medium text-neutral-900 mb-2">Materials</p>
                        <ul className="list-disc list-inside space-y-1">
                          {product.materials.map((material: string) => (
                            <li key={material}>{material}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {product.origin && (
                      <div>
                        <p className="font-medium text-neutral-900 mb-2">Origin</p>
                        <p>{product.origin}</p>
                      </div>
                    )}
                    {!product.materials && !product.origin && (
                      <p>Contact us for detailed materials and origin information for this piece.</p>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="shipping">
                  <div className="text-sm leading-relaxed text-neutral-700 space-y-3">
                    <p className="font-medium text-neutral-900">Shipping & Delivery</p>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span>Standard Delivery</span>
                        <span className="text-neutral-500">5–7 business days</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Express Delivery</span>
                        <span className="text-neutral-500">2–3 business days</span>
                      </li>
                    </ul>
                    <p className="text-xs text-neutral-500 mt-4">
                      All jewelry is carefully packaged in our signature Ratnagiri box.
                      Free insured shipping on orders above ₹25,000.
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="reviews">
                  <div className="text-sm leading-relaxed text-neutral-700">
                    <p className="text-neutral-500">Customer reviews coming soon.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section className="mt-20 pt-16 border-t border-neutral-100">
              <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
                You May Also Love
              </p>
              <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-8">
                Related Pieces
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((related: any, index: number) => (
                  <ProductCard key={related.id} product={related} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </>
  );
}
