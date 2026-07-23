import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const metadata: Metadata = {
  title: "All Timber & Fencing Products | DCtimbers",
  description: "Browse our complete inventory of fencing, gates, decking, timber, and garden landscaping products.",
};

export const revalidate = 3600; // ISR revalidation 1 hour

export default async function ProductsPage() {
  await connectDB();
  const rawProducts = await Product.find({}).sort({ category: 1, product_name: 1 }).lean();
  const products = JSON.parse(JSON.stringify(rawProducts));

  // Group categories
  const categories = Array.from(new Set(products.map((p: any) => p.category))) as string[];

  return (
    <div className="py-12 px-8 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h1
          className="text-5xl font-black uppercase mb-3"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Product Catalogue
        </h1>
        <p className="text-base opacity-80" style={{ color: "var(--color-on-surface-variant)" }}>
          High-grade timber products for trade professionals and domestic build projects.
        </p>
      </div>

      {/* Category quick links */}
      <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b" style={{ borderColor: "rgba(128,117,109,0.2)" }}>
        <span className="text-xs uppercase tracking-widest font-black self-center mr-2" style={{ fontFamily: "var(--font-mono)", color: "var(--color-outline)" }}>
          Filter Category:
        </span>
        {categories.map((cat) => {
          const sample = products.find((p: any) => p.category === cat);
          const slug = sample?.categorySlug || cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <Link
              key={cat}
              href={`/products/${slug}`}
              className="px-4 py-2 text-sm font-bold uppercase border-2 transition-all hover:bg-primary hover:text-white"
              style={{
                fontFamily: "var(--font-headline)",
                borderColor: "var(--color-primary)",
                backgroundColor: "var(--color-surface)",
                color: "var(--color-primary)",
              }}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p: any) => (
          <ProductCard
            key={p._id}
            product_name={p.product_name}
            category={p.category}
            categorySlug={p.categorySlug}
            slug={p.slug}
            description={p.description}
            variants={p.variants || []}
          />
        ))}
      </div>
    </div>
  );
}
