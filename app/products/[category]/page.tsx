import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

type Params = { params: Promise<{ category: string }> };

export async function generateStaticParams() {
  await connectDB();
  const categories = await Product.distinct("categorySlug");
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { category } = await params;
  await connectDB();
  const sample = await Product.findOne({ categorySlug: category }).lean();
  const name = sample?.category || category.replace(/-/g, " ");

  return {
    title: `${name} | DCtimbers Catalogue`,
    description: `Explore our trade-grade range of ${name} at DCtimbers. High durability, local yard delivery across Northamptonshire and Warwickshire.`,
  };
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: Params) {
  const { category } = await params;
  await connectDB();

  const rawProducts = await Product.find({ categorySlug: category }).lean();
  if (!rawProducts || rawProducts.length === 0) {
    notFound();
  }
  const products = JSON.parse(JSON.stringify(rawProducts));
  const categoryName = products[0]?.category || category;

  // Extract subcategories
  const subcategories = Array.from(
    new Set(products.map((p: any) => p.subcategory).filter(Boolean))
  ) as string[];

  return (
    <div className="py-12 px-8 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest" style={{ fontFamily: "var(--font-mono)", color: "var(--color-outline)" }}>
        <Link href="/products" className="hover:underline">Catalogue</Link>
        <span>/</span>
        <span style={{ color: "var(--color-primary)" }}>{categoryName}</span>
      </div>

      <div className="mb-10">
        <h1
          className="text-5xl font-black uppercase mb-3"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          {categoryName}
        </h1>
        <p className="text-base opacity-80" style={{ color: "var(--color-on-surface-variant)" }}>
          Showing {products.length} products in {categoryName}.
        </p>
      </div>

      {/* Subcategory Pills */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b" style={{ borderColor: "rgba(128,117,109,0.2)" }}>
          <span className="text-xs uppercase tracking-widest font-black self-center mr-2" style={{ fontFamily: "var(--font-mono)", color: "var(--color-outline)" }}>
            Subcategories:
          </span>
          {subcategories.map((sub) => (
            <a
              key={sub}
              href={`#sub-${sub.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="px-3 py-1 text-xs font-bold uppercase border"
              style={{
                fontFamily: "var(--font-headline)",
                borderColor: "var(--color-primary)",
                backgroundColor: "var(--color-surface-container)",
                color: "var(--color-primary)",
              }}
            >
              {sub}
            </a>
          ))}
        </div>
      )}

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
