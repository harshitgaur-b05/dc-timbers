"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Variant {
  width?: string;
  height?: string;
  size?: string;
  cost_gbp?: number;
  unit?: string;
  stock_status?: string;
}

interface Product {
  _id: string;
  product_name: string;
  category: string;
  categorySlug: string;
  subcategory?: string;
  description?: string;
  image?: string;
  variants: Variant[];
  slug: string;
}

const CATEGORIES = [
  { label: "All Categories", value: "" },
  { label: "Gates", value: "gates" },
  { label: "Fencing", value: "fencing" },
  { label: "Decking", value: "decking" },
  { label: "Timber Products", value: "timber-products" },
  { label: "Concrete Products", value: "concrete-products" },
  { label: "Accessories", value: "accessories" },
];

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      if (category) params.set("category", category);

      const res = await fetch(`/api/admin/products?${params}`);
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotalPages(data.pages);
        setTotal(data.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, category, page, router]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        fetchProducts();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className="text-3xl font-black uppercase"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
          >
            Product Catalogue
          </h1>
          <p className="text-sm opacity-60 mt-1">{total} products in database</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm uppercase tracking-wider rounded shadow-sm transition-all"
        >
          <span>+</span> Add New Product
        </Link>
      </div>

      {/* Filters */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name, category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 border border-stone-300 bg-white text-sm rounded focus:outline-none focus:border-amber-600"
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="px-4 py-2.5 border border-stone-300 bg-white text-sm rounded focus:outline-none focus:border-amber-600"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="px-5 py-2.5 bg-stone-800 text-white font-bold text-sm rounded hover:bg-stone-700 transition-colors"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-stone-400 font-medium">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-stone-400">
            <p className="text-4xl mb-3">📦</p>
            <p className="font-medium">No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-stone-100 border-b border-stone-200">
                <tr className="text-xs uppercase tracking-wider text-stone-500 font-mono">
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Subcategory</th>
                  <th className="px-4 py-3 text-center">Variants</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative h-12 w-16 bg-stone-100 rounded overflow-hidden flex items-center justify-center">
                        {p.image ? (
                          <Image
                            src={p.image}
                            alt={p.product_name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-stone-300 text-xl">🪵</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-stone-800">{p.product_name}</p>
                      <p className="text-xs text-stone-400 font-mono">{p.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 font-bold rounded uppercase">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-500 text-xs">{p.subcategory || "—"}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-block px-2 py-1 text-xs bg-stone-100 text-stone-600 font-mono font-bold rounded">
                        {p.variants.length}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/products/${p._id}`}
                          className="px-3 py-1.5 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="px-3 py-1.5 text-xs font-bold bg-red-100 hover:bg-red-600 text-red-600 hover:text-white rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-bold border rounded disabled:opacity-40 hover:bg-stone-100"
          >
            ← Prev
          </button>
          <span className="px-4 py-2 text-sm text-stone-600 font-mono">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-bold border rounded disabled:opacity-40 hover:bg-stone-100"
          >
            Next →
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-black text-stone-800 mb-2">Delete Product?</h3>
            <p className="text-sm text-stone-500 mb-6">
              This action cannot be undone. The product will be permanently removed from the catalogue.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 border border-stone-300 text-stone-700 font-bold text-sm rounded hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
                className="flex-1 py-2.5 bg-red-600 text-white font-bold text-sm rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
