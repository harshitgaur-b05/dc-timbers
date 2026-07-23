import Link from "next/link";

interface Variant {
  cost_gbp?: number;
  stock_status?: string;
}

interface ProductCardProps {
  product_name: string;
  category: string;
  categorySlug: string;
  slug: string;
  description?: string;
  subcategory?: string;
  variants: Variant[];
}

export default function ProductCard({
  product_name,
  categorySlug,
  slug,
  description,
  variants,
}: ProductCardProps) {
  const prices = variants
    .map((v) => v.cost_gbp)
    .filter((p): p is number => typeof p === "number" && p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const hasStock = variants.some((v) => v.stock_status === "In Stock");
  const isMadeToOrder = variants.some((v) =>
    (v.stock_status || "").toLowerCase().includes("order")
  );

  return (
    <Link
      href={`/products/${categorySlug}/${slug}`}
      className="group flex flex-col border-2 transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--color-surface)",
        borderColor: "var(--color-primary)",
      }}
    >
      {/* Image placeholder */}
      <div
        className="h-48 border-b-2 relative overflow-hidden flex items-center justify-center blueprint-grid"
        style={{ borderColor: "var(--color-primary)" }}
      >
        <span
          className="material-symbols-outlined opacity-20 text-8xl"
          style={{ color: "var(--color-primary)" }}
        >
          forest
        </span>
        {/* Stock badge */}
        {(hasStock || isMadeToOrder) && (
          <div
            className="absolute top-3 left-3 notched-tag px-3 py-1 text-xs font-black uppercase tracking-widest text-white"
            style={{
              fontFamily: "var(--font-mono)",
              backgroundColor: hasStock ? "var(--color-primary)" : "var(--color-secondary)",
            }}
          >
            {hasStock ? "In Stock" : "Made to Order"}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col gap-2">
        <h3
          className="text-lg font-bold uppercase leading-tight group-hover:underline"
          style={{
            fontFamily: "var(--font-headline)",
            color: "var(--color-primary)",
          }}
        >
          {product_name}
        </h3>
        {description && (
          <p
            className="text-sm leading-relaxed line-clamp-2 flex-1"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 border-t flex justify-between items-center"
        style={{
          backgroundColor: "var(--color-surface-container)",
          borderColor: "rgba(128,117,109,0.2)",
        }}
      >
        <span
          className="text-xs uppercase tracking-wider font-black"
          style={{
            fontFamily: "var(--font-mono)",
            color: "var(--color-secondary)",
          }}
        >
          {minPrice ? `From £${minPrice.toFixed(2)}` : "Enquire for price"}
        </span>
        <span
          className="text-xs uppercase flex items-center gap-1 font-bold"
          style={{
            fontFamily: "var(--font-headline)",
            color: "var(--color-primary)",
          }}
        >
          View{" "}
          <span className="material-symbols-outlined text-base">
            open_in_new
          </span>
        </span>
      </div>
    </Link>
  );
}
