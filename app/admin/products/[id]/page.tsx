"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "../_components/ProductForm";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (res.status === 401) { router.push("/admin/login"); return; }
        if (res.status === 404) { setNotFound(true); return; }
        if (res.ok) setProduct(await res.json());
      } catch (e) {
        console.error(e);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-stone-400 font-medium">
        Loading product...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-stone-600 font-bold">Product not found.</p>
        <button
          onClick={() => router.push("/admin/products")}
          className="mt-4 px-4 py-2 bg-amber-600 text-white font-bold text-sm rounded"
        >
          ← Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-3xl font-black uppercase"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Edit Product
        </h1>
        <p className="text-sm opacity-60 mt-1 font-mono">{product?.product_name}</p>
      </div>
      <ProductForm mode="edit" initialData={product} />
    </div>
  );
}
