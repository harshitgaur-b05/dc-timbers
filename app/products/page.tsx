import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export const metadata: Metadata = {
  title: "All Timber & Fencing Products | DCtimbers",
  description:
    "Browse our complete inventory of fencing, gates, decking, timber, and garden landscaping products.",
};

export const revalidate = 3600;

export default async function ProductsPage() {
  let products: any[] = [];
  try {
    const conn = await connectDB();
    if (conn) {
      const raw = await Product.find({})
        .sort({ category: 1, product_name: 1 })
        .lean();
      products = JSON.parse(JSON.stringify(raw));
    }
  } catch (e) {
    console.error("[ProductsPage] DB error:", e);
  }

  const categories = Array.from(
    new Set(products.map((p: any) => p.category))
  ) as string[];

  return (
    <div className="py-12 px-8 max-w-7xl mx-auto w-full">
      <div className="mb-10">
        <h1
          className="text-5xl font-black uppercase mb-3"
          style={{
            fontFamily: "var(--font-headline)",
            color: "var(--color-primary)",
          }}
        >
          Product Catalogue
        </h1>
        <p
          className="text-base opacity-80"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          High-grade timber products for trade professionals and domestic build
          projects.
        </p>
      </div>

      {categories.length > 0 && (
        <div
          className="flex flex-wrap gap-2 mb-10 pb-6 border-b"
          style={{ borderColor: "rgba(128,117,109,0.2)" }}
        >
          <span
            className="text-xs uppercase tracking-widest font-black self-center mr-2"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-outline)",
            }}
          >
            Filter Category:
          </span>
          {categories.map((cat) => {
            const sample = products.find((p: any) => p.category === cat);
            const slug =
              sample?.categorySlug ||
              cat.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            return (
              <Link
                key={cat}
                href={`/products/${slug}`}
                className="px-4 py-2 text-sm font-bold uppercase border-2 transition-all"
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
      )}

      {products.length === 0 ? (
        <div
          className="border-2 p-16 text-center"
          style={{
            borderColor: "var(--color-primary)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <span
            className="material-symbols-outlined text-5xl mb-3 block"
            style={{ color: "var(--color-secondary)" }}
          >
            inventory_2
          </span>
          <h2
            className="text-2xl font-black uppercase mb-2"
            style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
          >
            Catalogue Loading Soon
          </h2>
          <p className="text-sm opacity-70">
            Our full product inventory is being loaded. Contact your local depot for immediate stock availability.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-6 px-6 py-3 text-white font-black uppercase border-2"
            style={{
              fontFamily: "var(--font-headline)",
              backgroundColor: "var(--color-warning-orange)",
              borderColor: "var(--color-primary)",
            }}
          >
            Contact a Depot
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p: any) => (
            <ProductCard
              key={p._id}
              product_name={p.product_name}
              category={p.category}
              categorySlug={p.categorySlug}
              slug={p.slug}
              description={p.description}
              image={p.image}
              variants={p.variants || []}
            />
          ))}
        </div>
      )}
    </div>
  );
}
