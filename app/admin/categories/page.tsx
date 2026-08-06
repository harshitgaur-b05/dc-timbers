"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", order: 0 });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (res.ok) {
        setCategories(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");
      setForm({ name: "", description: "", order: 0 });
      setEditingId(null);
      fetchCategories();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete category");
      setDeleteId(null);
      fetchCategories();
    } catch (e: any) {
      setError(e.message);
      setDeleteId(null);
    }
  };

  const startEdit = (c: Category) => {
    setEditingId(c._id);
    setForm({ name: c.name, description: c.description || "", order: c.order || 0 });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: "", description: "", order: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1
          className="text-3xl font-black uppercase"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Category Management
        </h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded mb-6 font-medium">
          ❌ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white border border-stone-200 rounded-lg p-6 mb-8 shadow-sm">
        <h2 className="font-bold text-lg mb-4 text-stone-700">
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-stone-300 rounded text-sm focus:border-amber-600 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Display Order</label>
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-stone-300 rounded text-sm focus:border-amber-600 focus:outline-none"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 border border-stone-300 rounded text-sm focus:border-amber-600 focus:outline-none"
              rows={2}
            />
          </div>
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="px-4 py-2 border border-stone-300 text-stone-600 font-bold text-sm rounded hover:bg-stone-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 text-white font-bold text-sm rounded hover:bg-amber-700"
          >
            {editingId ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </form>

      {/* List */}
      <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-stone-500">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-stone-500">No categories found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-100 border-b border-stone-200 uppercase text-xs text-stone-500 font-bold">
              <tr>
                <th className="px-4 py-3 w-16 text-center">Order</th>
                <th className="px-4 py-3">Category Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((c) => (
                <tr key={c._id} className="hover:bg-stone-50">
                  <td className="px-4 py-3 text-center text-stone-500 font-mono">{c.order}</td>
                  <td className="px-4 py-3 font-bold text-stone-800">{c.name}</td>
                  <td className="px-4 py-3 text-stone-500 font-mono text-xs">{c.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => startEdit(c)}
                      className="px-3 py-1 bg-amber-100 text-amber-700 font-bold text-xs rounded mr-2 hover:bg-amber-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(c._id)}
                      className="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded hover:bg-red-200"
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

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-stone-800 mb-2">Delete Category?</h3>
            <p className="text-sm text-stone-500 mb-6">
              Are you sure? You cannot delete a category if it is currently assigned to products.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border text-stone-600 font-bold text-sm rounded hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white font-bold text-sm rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
