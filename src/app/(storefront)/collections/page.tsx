import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collections",
  description: "Explore our curated collections of handcrafted Indian jewelry — bridal, everyday, and heritage pieces.",
};

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { title: "asc" },
  });

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-16">
          <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
            Curated Worlds
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-neutral-900 mb-4">
            Collections
          </h1>
          <p className="text-neutral-600 max-w-2xl text-lg font-light leading-relaxed">
            Each collection tells a story — from the grandeur of bridal finery to the understated elegance of everyday pieces. Discover the world that speaks to you.
          </p>
        </div>

        {collections.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {collections.map((collection, index) => (
              <Link key={collection.id} href={`/collections/${collection.slug}`} className="group block">
                <div className={`relative overflow-hidden rounded-sm ${index % 3 === 0 ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#E8DDD0] flex items-center justify-center">
                      <span className="text-[#C9A84C]/30 text-8xl font-serif select-none">✦</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <h2 className="text-2xl md:text-3xl font-serif text-white mb-2">
                      {collection.title}
                    </h2>
                    {collection.description && (
                      <p className="text-white/80 text-sm max-w-md line-clamp-2">
                        {collection.description}
                      </p>
                    )}
                    <span className="inline-block mt-4 text-[#C9A84C] text-sm tracking-wider uppercase group-hover:tracking-[0.25em] transition-all duration-300">
                      View Collection →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✦</div>
            <p className="text-neutral-500 mb-2">Collections are being curated.</p>
            <Link href="/jewelry" className="text-[#C9A84C] hover:underline text-sm font-medium">
              Browse All Jewelry →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
