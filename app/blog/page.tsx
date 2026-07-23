import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

export const metadata: Metadata = {
  title: "Timber & Fencing Knowledge Base & Blog | DCtimbers",
  description: "Guides, trade advice, installation tips, and timber maintenance updates from the DCtimbers team.",
};

export const revalidate = 3600;

export default async function BlogPage() {
  await connectDB();
  const rawPosts = await BlogPost.find({ published: true })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();
  const posts = JSON.parse(JSON.stringify(rawPosts));

  return (
    <div className="py-12 px-8 max-w-7xl mx-auto w-full">
      <div className="mb-12">
        <h1
          className="text-5xl font-black uppercase mb-3"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Timber Journal &amp; Trade Advice
        </h1>
        <p className="text-base opacity-80" style={{ color: "var(--color-on-surface-variant)" }}>
          Industry guides, timber treatments, fencing installations, and yard news.
        </p>
      </div>

      {posts.length === 0 ? (
        <div
          className="p-12 border-2 text-center"
          style={{
            backgroundColor: "var(--color-surface)",
            borderColor: "var(--color-primary)",
          }}
        >
          <span className="material-symbols-outlined text-5xl mb-2" style={{ color: "var(--color-secondary)" }}>
            article
          </span>
          <h2 className="text-2xl font-bold uppercase mb-1" style={{ fontFamily: "var(--font-headline)" }}>
            No Articles Published Yet
          </h2>
          <p className="text-sm opacity-70">Check back soon for news and trade guides from our team.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="group border-2 flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-primary)",
              }}
            >
              <div
                className="h-48 border-b-2 blueprint-grid flex items-center justify-center relative"
                style={{ borderColor: "var(--color-primary)" }}
              >
                <span className="material-symbols-outlined text-6xl opacity-20" style={{ color: "var(--color-primary)" }}>
                  newspaper
                </span>
                <div
                  className="absolute top-3 left-3 notched-tag px-3 py-1 text-xs font-black uppercase text-white"
                  style={{
                    fontFamily: "var(--font-mono)",
                    backgroundColor: "var(--color-primary)",
                  }}
                >
                  Guide
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-3">
                <span className="text-xs opacity-60 uppercase" style={{ fontFamily: "var(--font-mono)" }}>
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-GB") : "Recent"}
                </span>
                <h2
                  className="text-2xl font-black uppercase group-hover:underline leading-tight"
                  style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
                >
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm opacity-80 line-clamp-3 leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
                    {post.excerpt}
                  </p>
                )}
              </div>

              <div
                className="px-6 py-3 border-t text-xs font-black uppercase flex items-center justify-between"
                style={{
                  backgroundColor: "var(--color-surface-container)",
                  borderColor: "rgba(128,117,109,0.2)",
                  fontFamily: "var(--font-headline)",
                  color: "var(--color-primary)",
                }}
              >
                <span>Read Full Article</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
