"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Variant {
  width?: string;
  height?: string;
  depth?: string;
  length?: string;
  size?: string;
  type?: string;
  brace?: string;
  option?: string;
  cost_gbp?: number | string;
  unit?: string;
  stock_status?: string;
}

interface ProductFormData {
  product_name: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  description: string;
  notes: string;
  image: string;
  variants: Variant[];
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { _id?: string };
  mode: "new" | "edit";
}

interface CategoryOption {
  label: string;
  value: string;
  slug: string;
}

const STOCK_STATUSES = ["In Stock", "Out of Stock", "Limited Stock", "Made to Order", "Discontinued"];

const EMPTY_VARIANT: Variant = {
  width: "",
  height: "",
  depth: "",
  length: "",
  size: "",
  type: "",
  brace: "",
  option: "",
  cost_gbp: "",
  unit: "",
  stock_status: "In Stock",
};

export default function ProductForm({ initialData, mode }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductFormData>({
    product_name: initialData?.product_name || "",
    category: initialData?.category || "",
    categorySlug: initialData?.categorySlug || "",
    subcategory: initialData?.subcategory || "",
    description: initialData?.description || "",
    notes: initialData?.notes || "",
    image: initialData?.image || "",
    variants: initialData?.variants || [],
  });

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || "");
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data.map((c: any) => ({ label: c.name, value: c.name, slug: c.slug })));
        }
      })
      .catch(console.error);
  }, []);

  const handleField = (field: keyof ProductFormData, value: string) => {
    setForm((f) => {
      const updated = { ...f, [field]: value };
      // Auto-set categorySlug when category changes
      if (field === "category") {
        const cat = categories.find((c) => c.value === value);
        updated.categorySlug = cat?.slug || value.toLowerCase().replace(/\s+/g, "-");
      }
      return updated;
    });
  };

  const handleVariantField = (index: number, field: keyof Variant, value: string) => {
    setForm((f) => {
      const variants = [...f.variants];
      variants[index] = { ...variants[index], [field]: field === "cost_gbp" ? value : value };
      return { ...f, variants };
    });
  };

  const addVariant = () => {
    setForm((f) => ({ ...f, variants: [...f.variants, { ...EMPTY_VARIANT }] }));
  };

  const removeVariant = (index: number) => {
    setForm((f) => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/products/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((f) => ({ ...f, image: data.url }));
      setImagePreview(data.url);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.product_name.trim()) { setError("Product name is required"); return; }
    if (!form.category) { setError("Category is required"); return; }

    setSaving(true);
    try {
      // Sanitize variants — convert cost_gbp to number
      const cleanVariants = form.variants.map((v) => ({
        ...v,
        cost_gbp: v.cost_gbp !== "" && v.cost_gbp !== undefined ? Number(v.cost_gbp) : undefined,
      }));

      const payload = { ...form, variants: cleanVariants };

      const url = mode === "edit"
        ? `/api/admin/products/${initialData?._id}`
        : `/api/admin/products`;
      const method = mode === "edit" ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setSuccess(true);
      setTimeout(() => router.push("/admin/products"), 1000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error / Success */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded font-medium">
          ❌ {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded font-medium">
          ✅ Product saved successfully! Redirecting...
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white border border-stone-200 rounded-lg p-6">
        <h2 className="font-black text-lg uppercase text-stone-700 mb-5 pb-3 border-b border-stone-100">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.product_name}
              onChange={(e) => handleField("product_name", e.target.value)}
              placeholder="e.g. Heavy Duty Field Gate"
              className="w-full px-4 py-2.5 border border-stone-300 rounded text-sm focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category}
              onChange={(e) => handleField("category", e.target.value)}
              className="w-full px-4 py-2.5 border border-stone-300 bg-white rounded text-sm focus:outline-none focus:border-amber-600"
            >
              <option value="">— Select Category —</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5">Subcategory</label>
            <input
              type="text"
              value={form.subcategory}
              onChange={(e) => handleField("subcategory", e.target.value)}
              placeholder="e.g. Softwood Gates, Panel Fencing..."
              className="w-full px-4 py-2.5 border border-stone-300 rounded text-sm focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => handleField("description", e.target.value)}
              rows={3}
              placeholder="Product description..."
              className="w-full px-4 py-2.5 border border-stone-300 rounded text-sm focus:outline-none focus:border-amber-600 resize-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => handleField("notes", e.target.value)}
              rows={2}
              placeholder="Internal notes, special instructions..."
              className="w-full px-4 py-2.5 border border-stone-300 rounded text-sm focus:outline-none focus:border-amber-600 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Image */}
      <div className="bg-white border border-stone-200 rounded-lg p-6">
        <h2 className="font-black text-lg uppercase text-stone-700 mb-5 pb-3 border-b border-stone-100">
          Product Image
        </h2>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Preview */}
          <div className="relative w-48 h-36 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-stone-200">
            {imagePreview ? (
              <Image src={imagePreview} alt="Preview" fill className="object-cover" />
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-1">🪵</div>
                <p className="text-xs text-stone-400">No image</p>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5">Upload Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2.5 border-2 border-dashed border-amber-400 text-amber-700 font-bold text-sm rounded hover:bg-amber-50 transition-colors w-full disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "📁 Click to Upload Image"}
              </button>
              <p className="text-xs text-stone-400 mt-1">JPG, PNG, WEBP up to 5MB</p>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-stone-500 mb-1.5">Or Image URL</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => {
                  handleField("image", e.target.value);
                  setImagePreview(e.target.value);
                }}
                placeholder="/products/my-image.jpg or https://..."
                className="w-full px-4 py-2.5 border border-stone-300 rounded text-sm focus:outline-none focus:border-amber-600 font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white border border-stone-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-100">
          <h2 className="font-black text-lg uppercase text-stone-700">
            Variants / Sizes <span className="text-xs font-mono text-stone-400 ml-2">({form.variants.length})</span>
          </h2>
          <button
            type="button"
            onClick={addVariant}
            className="px-3 py-1.5 text-xs font-bold bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
          >
            + Add Variant
          </button>
        </div>

        {form.variants.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <p className="text-2xl mb-2">📐</p>
            <p className="text-sm">No variants yet. Click &quot;Add Variant&quot; to add sizes and pricing.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {form.variants.map((v, i) => (
              <div key={i} className="relative border border-stone-200 rounded-lg p-4 bg-stone-50">
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-600 hover:text-white rounded text-xs font-bold transition-colors"
                >
                  ×
                </button>
                <p className="text-xs font-bold uppercase text-stone-400 mb-3">Variant {i + 1}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {[
                    { field: "width" as keyof Variant, label: "Width" },
                    { field: "height" as keyof Variant, label: "Height" },
                    { field: "depth" as keyof Variant, label: "Depth" },
                    { field: "length" as keyof Variant, label: "Length" },
                    { field: "size" as keyof Variant, label: "Size" },
                    { field: "type" as keyof Variant, label: "Type" },
                    { field: "brace" as keyof Variant, label: "Brace" },
                    { field: "option" as keyof Variant, label: "Option" },
                    { field: "unit" as keyof Variant, label: "Unit" },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <label className="block text-xs text-stone-500 mb-1">{label}</label>
                      <input
                        type="text"
                        value={(v[field] as string) || ""}
                        onChange={(e) => handleVariantField(i, field, e.target.value)}
                        placeholder={label}
                        className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded text-sm focus:outline-none focus:border-amber-600"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Price (£)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={(v.cost_gbp as string) || ""}
                      onChange={(e) => handleVariantField(i, "cost_gbp", e.target.value)}
                      placeholder="0.00"
                      className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded text-sm focus:outline-none focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-stone-500 mb-1">Stock Status</label>
                    <select
                      value={v.stock_status || "In Stock"}
                      onChange={(e) => handleVariantField(i, "stock_status", e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-stone-300 bg-white rounded text-sm focus:outline-none focus:border-amber-600"
                    >
                      {STOCK_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="px-5 py-2.5 border border-stone-300 text-stone-700 font-bold text-sm rounded hover:bg-stone-50"
        >
          ← Back to Products
        </button>
        <button
          type="submit"
          disabled={saving || success}
          className="px-8 py-2.5 bg-amber-600 text-white font-black text-sm uppercase tracking-wider rounded shadow hover:bg-amber-700 disabled:opacity-50 transition-all"
        >
          {saving ? "Saving..." : mode === "new" ? "Create Product" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
