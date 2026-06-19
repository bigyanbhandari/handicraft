import { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shared/product-card";
import type { Product, Category } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Jewelry Collection",
  description: "Explore our handcrafted Indian jewelry collection — Temple, Kundan, Jadau, Silver, and more.",
};

interface JewelryPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JewelryPage({ searchParams }: JewelryPageProps) {
  const params = await searchParams;
  const categorySlug = typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : "newest";
  const priceRange = typeof params.price === "string" ? params.price : undefined;

  const [allProducts, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true, collection: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { title: "asc" } }),
  ]);

  let filteredProducts = [...allProducts];

  if (categorySlug) {
    filteredProducts = filteredProducts.filter((p) =>
      p.category?.slug === categorySlug
    );
  }

  if (priceRange) {
    const parts = priceRange.split("-").map(Number);
    const min = parts[0];
    const max = parts.length > 1 && parts[1] ? parts[1] : Infinity;
    filteredProducts = filteredProducts.filter((p) => {
      const price = p.discountPrice || p.price;
      return price >= min && price <= max;
    });
  }

  switch (sort) {
    case "price-asc":
      filteredProducts.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      break;
    case "price-desc":
      filteredProducts.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      break;
  }

  function buildQuery(overrides: Record<string, string | undefined>) {
    const merged: Record<string, string> = {};
    const currentCategory = overrides.category !== undefined ? overrides.category : categorySlug;
    const currentSort = overrides.sort !== undefined ? overrides.sort : sort;
    const currentPrice = overrides.price !== undefined ? overrides.price : priceRange;
    if (currentCategory) merged.category = currentCategory;
    if (currentSort && currentSort !== "newest") merged.sort = currentSort;
    if (currentPrice) merged.price = currentPrice;
    const qs = new URLSearchParams(merged).toString();
    return qs ? `/jewelry?${qs}` : "/jewelry";
  }

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
            Our Collection
          </p>
          <h1 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-2">
            Handcrafted Jewelry
          </h1>
          <p className="text-neutral-600 max-w-2xl">
            {activeCategory
              ? `Explore our ${activeCategory.title} collection — each piece a testament to India's living jewelry traditions.`
              : "Each piece in our collection embodies the rich tradition of Indian jewelry craftsmanship, from the temples of the South to the courts of the Mughals."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-8">
              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-neutral-900 mb-4">
                  Categories
                </h3>
                <div className="space-y-1">
                  <Link
                    href={buildQuery({ category: undefined, price: priceRange })}
                    className={`block text-sm py-1.5 transition-colors ${!categorySlug ? "text-[#C9A84C] font-medium" : "text-neutral-600 hover:text-neutral-900"}`}
                  >
                    All Jewelry
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={buildQuery({ category: category.slug })}
                      className={`block text-sm py-1.5 transition-colors ${categorySlug === category.slug ? "text-[#C9A84C] font-medium" : "text-neutral-600 hover:text-neutral-900"}`}
                    >
                      {category.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-neutral-900 mb-4">
                  Price Range
                </h3>
                <div className="space-y-1">
                  {[
                    { label: "Under ₹10,000", value: "0-10000" },
                    { label: "₹10,000 – ₹25,000", value: "10000-25000" },
                    { label: "₹25,000 – ₹50,000", value: "25000-50000" },
                    { label: "₹50,000 – ₹1,00,000", value: "50000-100000" },
                    { label: "Above ₹1,00,000", value: "100000-" },
                  ].map((range) => (
                    <Link
                      key={range.value}
                      href={buildQuery({ price: range.value })}
                      className={`block text-sm py-1.5 transition-colors ${priceRange === range.value ? "text-[#C9A84C] font-medium" : "text-neutral-600 hover:text-neutral-900"}`}
                    >
                      {range.label}
                    </Link>
                  ))}
                </div>
              </div>

              {(categorySlug || priceRange) && (
                <Link
                  href="/jewelry"
                  className="inline-block text-xs text-neutral-500 underline underline-offset-4 hover:text-[#C9A84C] transition-colors"
                >
                  Clear all filters
                </Link>
              )}
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-neutral-500">
                {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 hidden sm:inline">Sort by</span>
                <div className="flex gap-1">
                  {[
                    { label: "Newest", value: "newest" },
                    { label: "Price ↑", value: "price-asc" },
                    { label: "Price ↓", value: "price-desc" },
                  ].map((option) => (
                    <Link
                      key={option.value}
                      href={buildQuery({ sort: option.value })}
                      className={`text-xs px-3 py-1.5 rounded-sm transition-colors ${sort === option.value ? "bg-[#C9A84C] text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"}`}
                    >
                      {option.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product: any, index: number) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">✦</div>
                <p className="text-neutral-500 mb-2">No pieces found matching your criteria.</p>
                <Link href="/jewelry" className="text-[#C9A84C] hover:underline text-sm font-medium">
                  View All Jewelry
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
