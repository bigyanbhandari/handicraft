import { prisma, safeQuery } from "@/lib/prisma";
import { withCache } from "@/lib/cache";
import { HomePageClient } from "@/components/home/home-page-client";

export const revalidate = 60;

export default async function HomePage() {
  const [products, categories, collections, heroSlides, siteSettings] = await Promise.all([
    withCache("home:featuredProducts", () =>
      safeQuery(() =>
        prisma.product.findMany({
          where: { featured: true },
          include: { category: true, collection: true },
          orderBy: { createdAt: "desc" },
          take: 8,
        }),
        []
      ),
      60
    ),
    withCache("home:categories", () =>
      safeQuery(() => prisma.category.findMany({ orderBy: { title: "asc" } }), []),
      300
    ),
    withCache("home:collections", () =>
      safeQuery(() => prisma.collection.findMany({ orderBy: { title: "asc" } }), []),
      300
    ),
    withCache("home:heroSlides", () =>
      safeQuery(() => prisma.heroSlide.findMany({ where: { active: true }, orderBy: { order: "asc" } }), []),
      120
    ),
    withCache("home:siteSettings", () => safeQuery(() => prisma.siteSetting.findMany(), []), 300),
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