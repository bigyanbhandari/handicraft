import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma, safeQuery } from "@/lib/prisma";
import { ProductCard } from "@/components/shared/product-card";
import type { Product } from "@/types";

export const dynamic = "force-dynamic";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await safeQuery(() =>
    prisma.collection.findUnique({ where: { slug } }),
    null
  );

  if (!collection) {
    return { title: "Collection Not Found" };
  }

  const seo = collection.seo as { title?: string; description?: string; ogImage?: string } | null;

  return {
    title: seo?.title || collection.title,
    description: seo?.description || `Explore the ${collection.title} collection — handcrafted Indian jewelry by Ratnagiri.`,
    openGraph: {
      title: seo?.title || collection.title,
      description: seo?.description || `Explore the ${collection.title} collection — handcrafted Indian jewelry by Ratnagiri.`,
      images: collection.image ? [{ url: collection.image }] : undefined,
    },
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await safeQuery(() =>
    prisma.collection.findUnique({
      where: { slug },
      include: {
        products: {
          include: { category: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    null
  );

  if (!collection) {
    notFound();
  }

  const products = collection.products || [];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative h-[50vh] min-h-[400px] flex items-end overflow-hidden bg-[#1a1a1a]">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1]" />
        {collection.image ? (
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            className="object-contain"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[#E8DDD0]" />
        )}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pb-12">
          <p className="text-[#C9A84C] tracking-[0.3em] uppercase text-xs font-medium mb-3">
            Collection
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-white/80 max-w-2xl text-lg font-light leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <p className="text-sm text-neutral-500">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((product: any, index: number) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-neutral-500 mb-4">This collection is being curated. Check back soon.</p>
              <Link href="/jewelry" className="text-[#C9A84C] hover:underline text-sm font-medium">
                Browse All Jewelry
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
