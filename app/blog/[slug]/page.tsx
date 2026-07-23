import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";

type Params = { params: Promise<{ slug: string }> };

// Return empty array at build time when no DB — pages are generated on demand via ISR
export async function generateStaticParams() {
  try {
    const conn = await connectDB();
    if (!conn) return [];
    const posts = await BlogPost.find({ published: true }, "slug").lean();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  try {
    const conn = await connectDB();
    if (conn) {
      const post = await BlogPost.findOne({ slug, published: true }).lean();
      if (post) {
        return {
          title: post.metaTitle || `${post.title} | DCtimbers Blog`,
          description:
            post.metaDescription ||
            post.excerpt ||
            `Read ${post.title} on the DCtimbers trade journal.`,
        };
      }
    }
  } catch {}
  return { title: "Blog | DCtimbers" };
}

export const revalidate = 3600;

export default async function BlogPostDetailPage({ params }: Params) {
  const { slug } = await params;

  let post: any = null;

  try {
    const conn = await connectDB();
    if (conn) {
      const raw = await BlogPost.findOne({ slug, published: true }).lean();
      if (raw) post = JSON.parse(JSON.stringify(raw));
    }
  } catch (e) {
    console.error("[BlogPostDetail] DB error:", e);
  }

  if (!post) notFound();

  return (
    <article className="py-12 px-8 max-w-4xl mx-auto w-full">
      <div
        className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
        style={{ fontFamily: "var(--font-mono)", color: "var(--color-outline)" }}
      >
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>
        <span>/</span>
        <span style={{ color: "var(--color-primary)" }}>{post.title}</span>
      </div>

      <header
        className="mb-8 pb-8 border-b"
        style={{ borderColor: "rgba(128,117,109,0.2)" }}
      >
        <span
          className="text-xs uppercase tracking-widest font-black"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}
        >
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("en-GB")
            : "Published"}
          {post.author ? ` · By ${post.author}` : ""}
        </span>
        <h1
          className="text-4xl md:text-5xl font-black uppercase mt-2 mb-4 leading-tight"
          style={{
            fontFamily: "var(--font-headline)",
            color: "var(--color-primary)",
          }}
        >
          {post.title}
        </h1>
        {post.excerpt && (
          <p
            className="text-xl leading-relaxed opacity-80"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {post.excerpt}
          </p>
        )}
      </header>

      <div
        className="text-base leading-relaxed space-y-6"
        style={{ color: "var(--color-on-surface)" }}
      >
        {(post.content || "").split("\n\n").map((paragraph: string, idx: number) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      <footer
        className="mt-12 pt-8 border-t flex justify-between items-center"
        style={{ borderColor: "rgba(128,117,109,0.2)" }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-black uppercase border-2 px-4 py-2"
          style={{
            fontFamily: "var(--font-headline)",
            borderColor: "var(--color-primary)",
            color: "var(--color-primary)",
          }}
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>{" "}
          Back to Blog
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-sm font-black uppercase text-white px-6 py-2 border-2"
          style={{
            fontFamily: "var(--font-headline)",
            backgroundColor: "var(--color-warning-orange)",
            borderColor: "var(--color-primary)",
          }}
        >
          Get Trade Quote
        </Link>
      </footer>
    </article>
  );
}
