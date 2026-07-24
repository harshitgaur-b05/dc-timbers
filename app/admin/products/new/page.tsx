import ProductForm from "../_components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1
          className="text-3xl font-black uppercase"
          style={{ fontFamily: "var(--font-headline)", color: "var(--color-primary)" }}
        >
          Add New Product
        </h1>
        <p className="text-sm opacity-60 mt-1">
          Fill in the details below to add a product to the catalogue.
        </p>
      </div>
      <ProductForm mode="new" />
    </div>
  );
}
