import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma, safeQuery } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await safeQuery(() =>
    prisma.blogPost.findUnique({ where: { slug } }),
    null
  );

  if (!post) {
    return { title: "Story Not Found" };
  }

  return {
    title: post.title,
    description: post.excerpt || `Read "${post.title}" — a story from Ratnagiri about Indian jewelry heritage.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read "${post.title}" — a story from Ratnagiri about Indian jewelry heritage.`,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      authors: post.author ? [post.author] : undefined,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await safeQuery(() =>
    prisma.blogPost.findUnique({ where: { slug } }),
    null
  );

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <article>
        <div className="relative h-[50vh] min-h-[400px] overflow-hidden bg-[#1a1a1a]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-[1]" />
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[#E8DDD0]" />
          )}
        </div>

        <div className="max-w-3xl mx-auto px-6 -mt-24 relative z-10">
          <div className="bg-white rounded-sm p-8 md:p-12 shadow-lg">
            <div className="mb-8">
              <Link
                href="/stories"
                className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase font-medium hover:underline"
              >
                ← Back to Stories
              </Link>
            </div>

            <header className="mb-10">
              <h1 className="text-3xl md:text-5xl font-serif text-neutral-900 mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                {post.author && (
                  <span className="font-medium text-neutral-700">{post.author}</span>
                )}
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
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs bg-[#F8F5F0] text-[#C9A84C] px-3 py-1 rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {post.excerpt && (
              <p className="text-lg text-neutral-700 font-light leading-relaxed mb-10 border-l-2 border-[#C9A84C] pl-6 italic">
                {post.excerpt}
              </p>
            )}

            <div className="prose prose-neutral prose-lg max-w-none">
              {post.content ? (
                <div className="text-neutral-700 leading-relaxed space-y-6">
                  {post.content.split("\n").map((paragraph: string, index: number) => {
                    const trimmed = paragraph.trim();
                    if (!trimmed) return null;
                    if (trimmed.startsWith("## ")) {
                      return <h2 key={index} className="text-2xl font-serif text-neutral-900 mt-10 mb-4">{trimmed.replace("## ", "")}</h2>;
                    }
                    if (trimmed.startsWith("### ")) {
                      return <h3 key={index} className="text-xl font-serif text-neutral-900 mt-8 mb-3">{trimmed.replace("### ", "")}</h3>;
                    }
                    if (trimmed.startsWith("> ")) {
                      return <blockquote key={index} className="border-l-2 border-[#C9A84C] pl-6 italic text-neutral-600 my-6">{trimmed.replace("> ", "")}</blockquote>;
                    }
                    return <p key={index}>{trimmed}</p>;
                  })}
                </div>
              ) : (
                <p className="text-neutral-500">Full story coming soon.</p>
              )}
            </div>
          </div>

          <div className="mt-12 text-center pb-16">
            <p className="text-neutral-500 text-sm mb-4">Continue exploring</p>
            <Link
              href="/stories"
              className="text-[#C9A84C] tracking-wider uppercase text-sm font-medium hover:underline"
            >
              More Stories →
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
