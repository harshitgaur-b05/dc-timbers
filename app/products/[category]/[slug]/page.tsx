import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import EnquiryForm from "@/components/EnquiryForm";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

type Params = { params: Promise<{ category: string; slug: string }> };

export async function generateStaticParams() {
  await connectDB();
  const products = await Product.find({}, "categorySlug slug").lean();
  return products.map((p) => ({
    category: p.categorySlug,
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug }).lean();

  if (!product) return {};

  return {
    title: `${product.product_name} | ${product.category} | DCtimbers`,
    description: product.description || `Buy ${product.product_name} from DCtimbers trade yards. Made-to-measure and stock sizes available.`,
  };
}

export const revalidate = 3600;

export default async function ProductDetailPage({ params }: Params) {
  const { category, slug } = await params;
  await connectDB();

  const rawProduct = await Product.findOne({ slug }).lean();
  if (!rawProduct) notFound();

  const product = JSON.parse(JSON.stringify(rawProduct));

  // Related products
  const rawRelated = await Product.find({
    categorySlug: category,
    slug: { $ne: slug },
  })
    .limit(4)
    .lean();
  const related = JSON.parse(JSON.stringify(rawRelated));

  // Product JSON-LD Schema
  const minPrice = product.variants?.map((v: any) => v.cost_gbp).filter(Boolean).sort((a: number, b: number) => a - b)[0];
  const productJsonLd = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.product_name,
    description: product.description || product.notes,
    brand: { "@type": "Brand", name: "DCtimbers" },
    offers: minPrice
      ? {
          "@type": "Offer",
          priceCurrency: "GBP",
          price: minPrice,
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className="py-12 px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb */}
        <div
          className="mb-6 flex items-center gap-2 text-xs uppercase tracking-widest"
          style={{ fontFamily: "var(--font-mono)", color: "var(--color-outline)" }}
        >
          <Link href="/products" className="hover:underline">Catalogue</Link>
          <span>/</span>
          <Link href={`/products/${product.categorySlug}`} className="hover:underline">
            {product.category}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--color-primary)" }}>{product.product_name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Product Image Placeholder */}
          <div
            className="border-2 h-96 blueprint-grid flex items-center justify-center relative overflow-hidden"
            style={{
              borderColor: "var(--color-primary)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <span
              className="material-symbols-outlined opacity-20"
              style={{ fontSize: "140px", color: "var(--color-primary)" }}
            >
              forest
            </span>
            <div
              className="absolute top-4 left-4 notched-tag px-4 py-1 text-white font-black text-xs uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-mono)",
                backgroundColor: "var(--color-primary)",
              }}
            >
              Trade Stock
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <span
                className="text-xs uppercase tracking-widest font-black"
                style={{ fontFamily: "var(--font-mono)", color: "var(--color-secondary)" }}
              >
                {product.subcategory || product.category}
              </span>
              <h1
                className="text-4xl md:text-5xl font-black uppercase mt-1"
                style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
              >
                {product.product_name}
              </h1>
            </div>

            {product.description && (
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--color-on-surface-variant)" }}
              >
                {product.description}
              </p>
            )}

            {product.notes && (
              <div
                className="p-4 border text-sm"
                style={{
                  backgroundColor: "var(--color-surface-container)",
                  borderColor: "rgba(128,117,109,0.2)",
                  color: "var(--color-on-surface-variant)",
                }}
              >
                <strong className="uppercase font-bold block mb-1" style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}>
                  Specification Notes:
                </strong>
                {product.notes}
              </div>
            )}

            {/* Variant Cut-list Table */}
            {product.variants && product.variants.length > 0 ? (
              <div className="border-2 overflow-x-auto" style={{ borderColor: "var(--color-primary)" }}>
                <div
                  className="px-4 py-2 border-b text-xs uppercase tracking-widest font-black flex justify-between items-center"
                  style={{
                    fontFamily: "var(--font-mono)",
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                  }}
                >
                  <span>Cut-List &amp; Options</span>
                  <span>Unit Price</span>
                </div>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr
                      className="border-b text-xs uppercase"
                      style={{
                        fontFamily: "var(--font-mono)",
                        backgroundColor: "var(--color-surface-container-high)",
                        color: "var(--color-primary)",
                      }}
                    >
                      <th className="p-3">Dimensions / Spec</th>
                      <th className="p-3">Unit</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3 text-right">Price (GBP)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.variants.map((v: any, idx: number) => {
                      const dims = [v.width && `W: ${v.width}`, v.height && `H: ${v.height}`, v.depth && `D: ${v.depth}`, v.length && `L: ${v.length}`, v.size, v.type, v.brace, v.option]
                        .filter(Boolean)
                        .join(" | ");

                      return (
                        <tr
                          key={idx}
                          className="border-b last:border-0 hover:bg-surface-container-low transition-colors"
                          style={{ borderColor: "rgba(128,117,109,0.15)" }}
                        >
                          <td className="p-3 font-medium">{dims || "Standard"}</td>
                          <td className="p-3 opacity-70">{v.unit || "Each"}</td>
                          <td className="p-3">
                            <span
                              className="text-xs font-bold uppercase"
                              style={{
                                fontFamily: "var(--font-mono)",
                                color: v.stock_status === "In Stock" ? "var(--color-tertiary)" : "var(--color-secondary)",
                              }}
                            >
                              {v.stock_status || "Available"}
                            </span>
                          </td>
                          <td className="p-3 text-right font-black" style={{ fontFamily: "var(--font-headline)" }}>
                            {v.cost_gbp ? `£${v.cost_gbp.toFixed(2)}` : "Enquire"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm italic opacity-70">
                Contact our yard for current sizes and bespoke made-to-measure pricing.
              </p>
            )}

            <a
              href="#enquiry"
              className="inline-flex items-center justify-center gap-2 py-4 px-8 text-white font-black uppercase text-lg border-2 shadow-hard transition-all hover:translate-x-0.5 hover:translate-y-0.5"
              style={{
                fontFamily: "var(--font-headline)",
                backgroundColor: "var(--color-warning-orange)",
                borderColor: "var(--color-primary)",
              }}
            >
              Enquire For This Item
              <span className="material-symbols-outlined">arrow_downward</span>
            </a>
          </div>
        </div>

        {/* Pre-filled Enquiry Section */}
        <section
          id="enquiry"
          className="p-8 border-2 mb-16"
          style={{
            backgroundColor: "var(--color-surface-container-highest)",
            borderColor: "var(--color-primary)",
          }}
        >
          <div className="max-w-2xl mx-auto">
            <h2
              className="text-3xl font-black uppercase mb-2 text-center"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
            >
              Request Quote: {product.product_name}
            </h2>
            <p className="text-sm opacity-80 text-center mb-8">
              Fill out your details below and our yard manager will provide exact pricing and delivery availability.
            </p>
            <EnquiryForm productName={product.product_name} />
          </div>
        </section>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2
              className="text-3xl font-black uppercase mb-6"
              style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
            >
              Related {product.category} Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((p: any) => (
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
        )}
      </div>
    </>
  );
}
