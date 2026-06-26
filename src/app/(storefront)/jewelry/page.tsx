"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "@/components/shared/product-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion";
import type { Product, Category } from "@/types";

const PAGE_SIZE = 12;

export default function JewelryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categorySlug = searchParams.get("category") ?? undefined;
  const sort = searchParams.get("sort") ?? "newest";
  const priceRange = searchParams.get("price") ?? undefined;
  const page = parseInt(searchParams.get("page") ?? "1");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [priceMinInput, setPriceMinInput] = useState(0);
  const [priceMaxInput, setPriceMaxInput] = useState(200000);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const params = new URLSearchParams();
      if (categorySlug) params.set("category", categorySlug);
      params.set("page", String(page));
      params.set("pageSize", String(PAGE_SIZE));

      const [productsRes, categoriesRes] = await Promise.all([
        fetch(`/api/products?${params.toString()}`),
        fetch("/api/categories"),
      ]);
      const [productsData, categoriesData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
      ]);

      if (productsData.products) {
        setProducts(productsData.products);
        setTotal(productsData.total);
      } else {
        setProducts(Array.isArray(productsData) ? productsData : []);
        setTotal(Array.isArray(productsData) ? productsData.length : 0);
      }
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);

      const allPrices = productsData.products
        ? productsData.products.map((p: Product) => p.discountPrice || p.price)
        : Array.isArray(productsData)
          ? productsData.map((p: Product) => p.discountPrice || p.price)
          : [];
      if (allPrices.length > 0) {
        const globalMin = Math.floor(Math.min(...allPrices) / 1000) * 1000;
        const globalMax = Math.ceil(Math.max(...allPrices) / 1000) * 1000;
        setMinPrice(globalMin);
        setMaxPrice(globalMax);
        setPriceMinInput(globalMin);
        setPriceMaxInput(globalMax);
      }
      setLoading(false);
    }
    fetchData();
  }, [categorySlug, page]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (priceRange) {
      const parts = priceRange.split("-").map(Number);
      const min = parts[0];
      const max = parts.length > 1 && parts[1] ? parts[1] : Infinity;
      result = result.filter((p) => {
        const price = p.discountPrice || p.price;
        return price >= min && price <= max;
      });
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "price-desc":
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
    }

    return result;
  }, [products, priceRange, sort]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const buildQuery = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const merged: Record<string, string> = {};
      const currentCategory = overrides.category !== undefined ? overrides.category : categorySlug;
      const currentSort = overrides.sort !== undefined ? overrides.sort : sort;
      const currentPrice = overrides.price !== undefined ? overrides.price : priceRange;
      const currentPage = overrides.page !== undefined ? overrides.page : "1";
      if (currentCategory) merged.category = currentCategory;
      if (currentSort && currentSort !== "newest") merged.sort = currentSort;
      if (currentPrice) merged.price = currentPrice;
      if (currentPage !== "1") merged.page = currentPage;
      const qs = new URLSearchParams(merged).toString();
      return qs ? `/jewelry?${qs}` : "/jewelry";
    },
    [categorySlug, sort, priceRange]
  );

  const handlePriceChange = useCallback(
    (type: "min" | "max", value: number) => {
      if (type === "min") {
        const clamped = Math.min(value, priceMaxInput - 1000);
        setPriceMinInput(clamped);
      } else {
        const clamped = Math.max(value, priceMinInput + 1000);
        setPriceMaxInput(clamped);
      }
    },
    [priceMinInput, priceMaxInput]
  );

  const applyPriceFilter = useCallback(() => {
    const qs = new URLSearchParams();
    if (categorySlug) qs.set("category", categorySlug);
    if (sort !== "newest") qs.set("sort", sort);
    qs.set("price", `${priceMinInput}-${priceMaxInput}`);
    router.push(`/jewelry?${qs.toString()}`);
  }, [categorySlug, sort, priceMinInput, priceMaxInput, router]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-4 w-32 bg-neutral-200 rounded" />
            <div className="h-10 w-96 bg-neutral-200 rounded" />
            <div className="h-4 w-[600px] bg-neutral-200 rounded" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-neutral-100 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <FadeIn>
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
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-8">
              <FadeIn direction="left" delay={0.1}>
                <div>
                  <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-neutral-900 mb-4">
                    Categories
                  </h3>
                  <div className="space-y-1">
                    <Link
                      href={buildQuery({ category: undefined, price: priceRange, page: "1" })}
                      className={`block text-sm py-1.5 transition-colors ${!categorySlug ? "text-[#C9A84C] font-medium" : "text-neutral-600 hover:text-neutral-900"}`}
                    >
                      <span className="inline-flex items-center gap-2">
                        <span
                          className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${
                            !categorySlug
                              ? "bg-[#C9A84C] border-[#C9A84C]"
                              : "border-neutral-300"
                          }`}
                        >
                          {!categorySlug && (
                            <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 12 12">
                              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </span>
                        All Jewelry
                      </span>
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={buildQuery({ category: category.slug, page: "1" })}
                        className={`block text-sm py-1.5 transition-colors ${categorySlug === category.slug ? "text-[#C9A84C] font-medium" : "text-neutral-600 hover:text-neutral-900"}`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span
                            className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors ${
                              categorySlug === category.slug
                                ? "bg-[#C9A84C] border-[#C9A84C]"
                                : "border-neutral-300"
                            }`}
                          >
                            {categorySlug === category.slug && (
                              <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 12 12">
                                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          {category.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="left" delay={0.2}>
                <div>
                  <h3 className="text-xs tracking-[0.2em] uppercase font-medium text-neutral-900 mb-4">
                    Price Range
                  </h3>
                  <div className="px-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-neutral-900">
                        ₹{priceMinInput.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-neutral-400">—</span>
                      <span className="text-sm font-medium text-neutral-900">
                        ₹{priceMaxInput.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="relative h-6 mb-4">
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={1000}
                        value={priceMinInput}
                        onChange={(e) => handlePriceChange("min", Number(e.target.value))}
                        className="absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C9A84C] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C9A84C] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                      />
                      <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        step={1000}
                        value={priceMaxInput}
                        onChange={(e) => handlePriceChange("max", Number(e.target.value))}
                        className="absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none z-20 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C9A84C] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#C9A84C] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white"
                      />
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-neutral-200 rounded-full" />
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#C9A84C] rounded-full"
                        style={{
                          left: `${((priceMinInput - minPrice) / (maxPrice - minPrice)) * 100}%`,
                          right: `${100 - ((priceMaxInput - minPrice) / (maxPrice - minPrice)) * 100}%`,
                        }}
                      />
                    </div>
                    <button
                      onClick={applyPriceFilter}
                      className="w-full text-xs tracking-wider uppercase bg-[#C9A84C] text-white py-2 rounded-sm hover:bg-[#b8943a] transition-colors font-medium"
                    >
                      Apply Price
                    </button>
                  </div>
                </div>
              </FadeIn>

              {(categorySlug || priceRange) && (
                <FadeIn direction="left" delay={0.3}>
                  <Link
                    href="/jewelry"
                    className="inline-block text-xs text-neutral-500 underline underline-offset-4 hover:text-[#C9A84C] transition-colors"
                  >
                    Clear all filters
                  </Link>
                </FadeIn>
              )}
            </div>
          </aside>

          <div className="flex-1">
            <FadeIn delay={0.15}>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-neutral-500">
                  {total} {total === 1 ? "piece" : "pieces"}
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
            </FadeIn>

            {filteredProducts.length > 0 ? (
              <>
                <StaggerContainer staggerChildren={0.06}>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {filteredProducts.map((product, index) => (
                      <StaggerItem key={product.id}>
                        <ProductCard product={product} index={index} />
                      </StaggerItem>
                    ))}
                  </div>
                </StaggerContainer>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {page > 1 && (
                      <Link
                        href={buildQuery({ page: String(page - 1) })}
                        className="px-4 py-2 text-sm border border-neutral-200 rounded-sm hover:bg-neutral-50 transition-colors"
                      >
                        Previous
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={buildQuery({ page: String(p) })}
                        className={`px-4 py-2 text-sm rounded-sm transition-colors ${
                          p === page
                            ? "bg-[#C9A84C] text-white"
                            : "border border-neutral-200 hover:bg-neutral-50"
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                    {page < totalPages && (
                      <Link
                        href={buildQuery({ page: String(page + 1) })}
                        className="px-4 py-2 text-sm border border-neutral-200 rounded-sm hover:bg-neutral-50 transition-colors"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            ) : (
              <FadeIn>
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">✦</div>
                  <p className="text-neutral-500 mb-2">No pieces found matching your criteria.</p>
                  <Link href="/jewelry" className="text-[#C9A84C] hover:underline text-sm font-medium">
                    View All Jewelry
                  </Link>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
