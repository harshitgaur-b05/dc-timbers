"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("DCtimbers Yard Team");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[&]/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          author,
          metaTitle,
          metaDescription,
          published,
        }),
      });

      if (res.ok) {
        router.push("/admin/blog");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create post");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-4xl font-black uppercase"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
          >
            Create New Article
          </h1>
          <p className="text-sm opacity-70">Add a new post to the DCtimbers journal.</p>
        </div>
        <Link
          href="/admin/blog"
          className="px-4 py-2 text-xs font-bold uppercase border"
          style={{ fontFamily: "var(--font-mono)", borderColor: "var(--color-primary)" }}
        >
          ← Cancel
        </Link>
      </div>

      {error && (
        <div className="p-4 mb-6 border text-sm text-red-700 bg-red-50 border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-8 border-2" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-primary)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-mono font-bold">Article Title *</label>
            <input
              type="text"
              required
              className="p-3 border outline-none text-sm"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. How to Choose the Right Fencing Panels"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-mono font-bold">URL Slug *</label>
            <input
              type="text"
              required
              className="p-3 border outline-none text-sm font-mono"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs uppercase font-mono font-bold">Author</label>
            <input
              type="text"
              className="p-3 border outline-none text-sm"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="pub"
              className="w-5 h-5 cursor-pointer"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <label htmlFor="pub" className="text-sm font-bold uppercase cursor-pointer" style={{ fontFamily: "var(--font-headline)" }}>
              Publish immediately
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase font-mono font-bold">Excerpt / Summary</label>
          <textarea
            rows={2}
            className="p-3 border outline-none text-sm"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief snippet shown on article cards..."
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs uppercase font-mono font-bold">Article Content (Markdown supported)</label>
          <textarea
            rows={10}
            required
            className="p-3 border outline-none text-sm font-mono"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write article content here..."
          />
        </div>

        <div className="border-t pt-6 flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase font-mono">SEO Meta Overrides (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              className="p-3 border outline-none text-sm"
              placeholder="SEO Meta Title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
            />
            <input
              type="text"
              className="p-3 border outline-none text-sm"
              placeholder="SEO Meta Description"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="py-4 text-white font-black uppercase text-lg border-2 shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 transition-all mt-4"
          style={{
            fontFamily: "var(--font-headline)",
            backgroundColor: "var(--color-warning-orange)",
            borderColor: "var(--color-primary)",
          }}
        >
          {loading ? "Saving Article..." : "Save & Publish Article"}
        </button>
      </form>
    </div>
  );
}
