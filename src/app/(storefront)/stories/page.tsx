import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma, safeQuery } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stories",
  description: "Discover the stories behind Himalayan handicraft traditions, artisan craftsmanship, and the heritage of Ratnagiri.",
};

export default async function StoriesPage() {
  const posts = await safeQuery(() =>
    prisma.blogPost.findMany({
      orderBy: { publishedAt: "desc" },
    }),
    []
  );

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-16">
          <p className="text-gold tracking-[0.25em] uppercase text-xs font-medium mb-3">
            The Ratnagiri Journal
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-cream mb-4">
            Stories
          </h1>
          <p className="text-cream-dark/70 max-w-2xl text-lg font-light leading-relaxed">
            Explore the heritage, techniques, and people behind the Himalaya&apos;s most enduring handicraft traditions.
          </p>
        </div>

        {featuredPost && (
          <Link href={`/stories/${featuredPost.slug}`} className="group block mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-[#141414] relative luxe-card">
                {featuredPost.coverImage ? (
                  <Image
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                    <span className="text-gold/20 text-6xl font-serif select-none">✦</span>
                  </div>
                )}
              </div>
              <div>
                <p className="text-gold tracking-[0.25em] uppercase text-xs font-medium mb-3">
                  Featured Story
                </p>
                <h2 className="text-2xl md:text-4xl font-serif text-cream mb-4 group-hover:text-gold transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                {featuredPost.excerpt && (
                  <p className="text-cream-dark/70 leading-relaxed mb-4 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-sm text-gold-muted">
                  {featuredPost.author && <span className="text-cream-dark">{featuredPost.author}</span>}
                  {featuredPost.publishedAt && (
                    <>
                      {featuredPost.author && <span>·</span>}
                      <time dateTime={featuredPost.publishedAt.toISOString()}>
                        {featuredPost.publishedAt.toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Link>
        )}

        {remainingPosts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {remainingPosts.map((post) => (
              <Link key={post.id} href={`/stories/${post.slug}`} className="group block">
                <div className="aspect-[4/3] overflow-hidden rounded-sm bg-[#141414] mb-4 relative luxe-card">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                      <span className="text-gold/20 text-5xl font-serif select-none">✦</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-serif text-cream mb-2 group-hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-cream-dark/70 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-gold-muted">
                  {post.author && <span className="text-cream-dark">{post.author}</span>}
                  {post.publishedAt && (
                    <>
                      {post.author && <span>·</span>}
                      <time dateTime={post.publishedAt.toISOString()}>
                        {post.publishedAt.toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-cream-dark/70 mb-4">Stories are being written. Check back soon.</p>
            <Link href="/" className="text-gold hover:text-gold-light text-sm font-medium transition-colors">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
