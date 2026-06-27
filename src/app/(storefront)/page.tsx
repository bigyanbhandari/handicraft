import { prisma, safeQuery } from "@/lib/prisma";
import { HomePageClient } from "@/components/home/home-page-client";

export const revalidate = 60;

export default async function HomePage() {
  const [products, categories, collections, heroSlides, siteSettings] = await Promise.all([
    safeQuery(() =>
      prisma.product.findMany({
        where: { featured: true },
        include: { category: true, collection: true },
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
      []
    ),
    safeQuery(() => prisma.category.findMany({ orderBy: { title: "asc" } }), []),
    safeQuery(() => prisma.collection.findMany({ orderBy: { title: "asc" } }), []),
    safeQuery(() => prisma.heroSlide.findMany({ where: { active: true }, orderBy: { order: "asc" } }), []),
    safeQuery(() => prisma.siteSetting.findMany(), []),
  ]);

  const settings: Record<string, any> = {};
  siteSettings.forEach((s) => { settings[s.key] = s.value; });

  return (
    <HomePageClient
      featuredProducts={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
      collections={JSON.parse(JSON.stringify(collections))}
      heroSlides={JSON.parse(JSON.stringify(heroSlides))}
      settings={settings}
    />
  );
}