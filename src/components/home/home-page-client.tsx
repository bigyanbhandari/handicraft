"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, HoverScale } from "@/components/animations/motion";
import { Button } from "@/components/ui/button";
import { Carousel as EmblaCarousel, CarouselContent, CarouselItem, CarouselDots, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { ProductCard } from "@/components/shared/product-card";
import type { Product, Category, Collection } from "@/types";

const CATEGORY_ICONS: Record<string, string> = {
  "temple-jewelry": "🛕",
  "kundan-jewelry": "💎",
  "jadau-jewelry": "👑",
  "silver-jewelry": "✨",
  "brass-jewelry": "🔨",
  "gemstone-jewelry": "💠",
};

interface HomePageClientProps {
  featuredProducts: Product[];
  categories: Category[];
  collections: Collection[];
  heroSlides: any[];
  settings: Record<string, any>;
}

export function HomePageClient({ featuredProducts, categories, collections, heroSlides, settings }: HomePageClientProps) {
  const [autoplayMounted, setAutoplayMounted] = useState(false);
  useEffect(() => setAutoplayMounted(true), []);

  const newArrivals = featuredProducts.slice(0, 8);
  const hasCategories = categories.length > 0;
  const hasFeatured = featuredProducts.length > 0;
  const hasNewArrivals = newArrivals.length > 0;
  const hasHero = heroSlides.length > 0;

  const autoplayPlugins = autoplayMounted
    ? [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
    : [];

  return (
    <main>
      {hasHero ? (
        <EmblaCarousel
          opts={{ loop: true, align: "start" }}
          plugins={autoplayPlugins}
          className="relative"
        >
          <CarouselContent>
            {heroSlides.map((slide, idx) => (
              <CarouselItem key={slide.id}>
                <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-[1]" />
                  {slide.image ? (
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority={idx === 0}
                      sizes="100vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-[#1a1a1a] z-0 flex items-center justify-center">
                      <div className="text-[#C9A84C]/10 text-[20rem] font-serif leading-none select-none">✦</div>
                    </div>
                  )}
                  <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
                    <FadeIn>
                      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1]">
                        {slide.title}
                      </h1>
                    </FadeIn>
                    {slide.subtitle && (
                      <FadeIn delay={0.2}>
                        <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                          {slide.subtitle}
                        </p>
                      </FadeIn>
                    )}
                    {slide.ctaText && slide.ctaLink && (
                      <FadeIn delay={0.4}>
                        <Button asChild size="lg" className="bg-[#C9A84C] hover:bg-[#B8973A] text-white px-8 text-base tracking-wide">
                          <Link href={slide.ctaLink}>{slide.ctaText}</Link>
                        </Button>
                      </FadeIn>
                    )}
                  </div>
                </section>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <CarouselDots />
          </div>
        </EmblaCarousel>
      ) : (
        <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#1a1a1a]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60 z-[1]" />
          <div className="absolute inset-0 bg-[#1a1a1a] z-0 flex items-center justify-center">
            <div className="text-[#C9A84C]/10 text-[20rem] font-serif leading-none select-none">✦</div>
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <FadeIn>
              <p className="text-[#C9A84C] tracking-[0.3em] uppercase text-sm mb-6 font-medium">
                Handcrafted with Devotion
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white mb-6 leading-[1.1]">
                {settings.heroTitle || "Where Heritage Meets Elegance"}
              </h1>
            </FadeIn>
            <FadeIn delay={0.4}>
              <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                {settings.heroSubtitle || "Discover jewelry that carries centuries of Indian craftsmanship — each piece a testament to the artisans of Ratnagiri."}
              </p>
            </FadeIn>
            <FadeIn delay={0.6}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[#C9A84C] hover:bg-[#B8973A] text-white px-8 text-base tracking-wide">
                  <Link href="/jewelry">Explore Collection</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8 text-base tracking-wide">
                  <Link href="/stories">Our Stories</Link>
                </Button>
              </div>
            </FadeIn>
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
            <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#C9A84C]" />
          </div>
        </section>
      )}

      {hasCategories ? (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
                  Browse by Category
                </p>
                <h2 className="text-3xl md:text-4xl font-serif text-neutral-900">
                  Jewelry Traditions
                </h2>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6" staggerDelay={0.1}>
              {categories.slice(0, 6).map((category: Category) => (
                <StaggerItem key={category.id}>
                  <Link href={`/jewelry?category=${category.slug}`}>
                    <HoverScale>
                      <div className="group text-center">
                        <div className="aspect-square rounded-sm overflow-hidden bg-[#F8F5F0] mb-4 flex items-center justify-center border border-neutral-100 group-hover:border-[#C9A84C]/30 transition-colors duration-300 relative">
                          {category.image ? (
                            <Image
                              src={category.image}
                              alt={category.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                            />
                          ) : (
                            <span className="text-3xl">
                              {CATEGORY_ICONS[category.slug] || "✦"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm font-medium text-neutral-900 group-hover:text-[#C9A84C] transition-colors">
                          {category.title}
                        </h3>
                      </div>
                    </HoverScale>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F8F5F0] mb-6">
                <span className="text-2xl">✦</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-3">
                Categories Coming Soon
              </h2>
              <p className="text-neutral-500 max-w-md mx-auto">
                We&apos;re curating our jewelry traditions. Check back soon to explore our collections.
              </p>
            </FadeIn>
          </div>
        </section>
      )}

      {hasFeatured ? (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="text-center mb-14">
                <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
                  Most Loved
                </p>
                <h2 className="text-3xl md:text-4xl font-serif text-neutral-900">
                  Best Sellers
                </h2>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <EmblaCarousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {featuredProducts.map((product: Product, index: number) => (
                    <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/4">
                      <ProductCard product={product} index={index} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </EmblaCarousel>
            </FadeIn>
          </div>
        </section>
      ) : (
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F8F5F0] mb-6">
                <span className="text-2xl">💎</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-3">
                Best Sellers on the Way
              </h2>
              <p className="text-neutral-500 max-w-md mx-auto mb-6">
                Our most-loved pieces are being prepared. Be the first to discover them.
              </p>
              <Button asChild className="bg-[#C9A84C] hover:bg-[#B8973A] text-white px-8">
                <Link href="/jewelry">Browse All Jewelry</Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      )}

      <section className="py-24 px-6 bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn direction="left">
              <div className="aspect-[3/4] bg-[#C9A84C]/10 rounded-sm overflow-hidden relative flex items-center justify-center">
                <span className="text-[#C9A84C]/20 text-[12rem] font-serif select-none">✦</span>
              </div>
            </FadeIn>
            <div>
              <FadeIn direction="right">
                <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
                  The Art of Adornment
                </p>
              </FadeIn>
              <FadeIn direction="right" delay={0.1}>
                <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 leading-tight">
                  Centuries of Craft,<br />Worn Today
                </h2>
              </FadeIn>
              <FadeIn direction="right" delay={0.2}>
                <p className="text-white/70 mb-4 leading-relaxed">
                  India&apos;s jewelry traditions stretch back millennia — from the temple goldsmiths of South India who forged divine ornaments for deities, to the Mughal artisans whose Kundan and Jadau techniques remain unmatched. At Ratnagiri, we honor these living traditions by partnering with master craftspeople across the subcontinent.
                </p>
              </FadeIn>
              <FadeIn direction="right" delay={0.3}>
                <p className="text-white/70 mb-8 leading-relaxed">
                  Each technique — whether it&apos;s the ancient wax-casting of Temple jewelry, the meticulous stone-setting of Kundan, or the luminous gilding of Jadau — carries forward a legacy of devotion, skill, and artistry that transcends ornamentation. When you wear a Ratnagiri piece, you carry these stories with you.
                </p>
              </FadeIn>
              <FadeIn direction="right" delay={0.4}>
                <Button asChild variant="outline" className="border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white">
                  <Link href="/stories">Read Our Stories</Link>
                </Button>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {hasNewArrivals ? (
        <section className="py-20 px-6 bg-[#F8F5F0]">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
                    Just Arrived
                  </p>
                  <h2 className="text-3xl md:text-4xl font-serif text-neutral-900">
                    New Arrivals
                  </h2>
                </div>
                <Link href="/jewelry" className="text-sm text-[#C9A84C] tracking-wider uppercase hover:underline hidden md:block">
                  View All →
                </Link>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" staggerDelay={0.05}>
              {newArrivals.map((product: Product, index: number) => (
                <StaggerItem key={product.id}>
                  <ProductCard product={product} index={index} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ) : (
        <section className="py-20 px-6 bg-[#F8F5F0]">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif text-neutral-900 mb-3">
                New Arrivals Coming Soon
              </h2>
              <p className="text-neutral-500 max-w-md mx-auto mb-6">
                We&apos;re adding new pieces to our collection. Stay tuned for fresh arrivals.
              </p>
              <Button asChild variant="outline" className="border-[#C9A84C] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white px-8">
                <Link href="/jewelry">Browse All Jewelry</Link>
              </Button>
            </FadeIn>
          </div>
        </section>
      )}

      <section className="py-20 px-6 bg-white border-t border-neutral-100">
        <div className="max-w-2xl mx-auto text-center">
          <FadeIn>
            <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
              Stay Connected
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 mb-4">
              Join the Ratnagiri Circle
            </h2>
            <p className="text-neutral-600 mb-8">
              Be the first to discover new collections, artisan stories, and exclusive offers.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <form className="flex gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 h-12 px-4 border border-neutral-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:ring-offset-2"
              />
              <Button size="lg" className="bg-[#C9A84C] hover:bg-[#B8973A] text-white px-8">
                Subscribe
              </Button>
            </form>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}