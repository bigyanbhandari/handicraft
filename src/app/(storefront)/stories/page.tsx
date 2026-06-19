import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stories",
  description: "Discover the stories behind Indian jewelry traditions, artisan craftsmanship, and the heritage of Ratnagiri.",
};

export default async function StoriesPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { publishedAt: "desc" },
  });

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-16">
          <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
            The Ratnagiri Journal
          </p>
          <h1 className="text-3xl md:text-5xl font-serif text-neutral-900 mb-4">
            Stories
          </h1>
          <p className="text-neutral-600 max-w-2xl text-lg font-light leading-relaxed">
            Explore the heritage, techniques, and people behind India&apos;s most enduring jewelry traditions.
          </p>
        </div>

        {featuredPost && (
          <Link href={`/stories/${featuredPost.slug}`} className="group block mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="aspect-[4/3] overflow-hidden rounded-sm bg-[#F8F5F0] relative">
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
                  <div className="w-full h-full bg-[#E8DDD0]" />
                )}
              </div>
              <div>
                <p className="text-[#C9A84C] tracking-[0.2em] uppercase text-xs font-medium mb-3">
                  Featured Story
                </p>
                <h2 className="text-2xl md:text-4xl font-serif text-neutral-900 mb-4 group-hover:text-[#C9A84C] transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                {featuredPost.excerpt && (
                  <p className="text-neutral-600 leading-relaxed mb-4 line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-sm text-neutral-500">
                  {featuredPost.author && <span>{featuredPost.author}</span>}
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
                <div className="aspect-[4/3] overflow-hidden rounded-sm bg-[#F8F5F0] mb-4 relative">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#E8DDD0]" />
                  )}
                </div>
                <h3 className="text-lg font-serif text-neutral-900 mb-2 group-hover:text-[#C9A84C] transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-neutral-500">
                  {post.author && <span>{post.author}</span>}
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
            <p className="text-neutral-500 mb-4">Stories are being written. Check back soon.</p>
            <Link href="/" className="text-[#C9A84C] hover:underline text-sm font-medium">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
