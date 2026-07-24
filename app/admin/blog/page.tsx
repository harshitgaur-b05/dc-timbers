"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Post {
  _id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
}

export default function AdminBlogListPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/blog");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });
      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, published: !currentStatus } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 font-bold">Loading articles...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1
            className="text-4xl font-black uppercase"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
          >
            Blog &amp; Articles
          </h1>
          <p className="text-sm opacity-70">
            Publish and manage trade journal guides and advice.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-6 py-3 text-white font-black uppercase text-sm border-2 shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          style={{
            fontFamily: "var(--font-headline)",
            backgroundColor: "var(--color-warning-orange)",
            borderColor: "var(--color-primary)",
          }}
        >
          + Create New Post
        </Link>
      </div>

      <div
        className="border-2 p-6 overflow-x-auto"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-primary)",
        }}
      >
        {posts.length === 0 ? (
          <p className="text-sm opacity-70">No articles created yet.</p>
        ) : (
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr
                className="border-b text-xs uppercase"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--color-outline)",
                }}
              >
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Slug</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr
                  key={p._id}
                  className="border-b last:border-0 hover:bg-surface-container-low transition-colors"
                >
                  <td className="py-4 px-2 font-bold">{p.title}</td>
                  <td className="py-4 px-2 text-xs font-mono opacity-70">{p.slug}</td>
                  <td className="py-4 px-2">
                    <button
                      onClick={() => togglePublish(p._id, p.published)}
                      className="px-3 py-1 text-xs font-bold uppercase border rounded"
                      style={{
                        fontFamily: "var(--font-mono)",
                        backgroundColor: p.published
                          ? "var(--color-tertiary-fixed)"
                          : "var(--color-surface-container-high)",
                        color: p.published ? "var(--color-tertiary)" : "var(--color-outline)",
                      }}
                    >
                      {p.published ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="py-4 px-2 text-right space-x-2">
                    <Link
                      href={`/admin/blog/${p._id}`}
                      className="px-3 py-1 text-xs font-bold uppercase border hover:underline"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="px-3 py-1 text-xs font-bold uppercase border text-red-600 border-red-200 hover:bg-red-50"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
