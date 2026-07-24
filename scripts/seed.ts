/**
 * Seed script — reads main_line_timber_product_hierarchy.json,
 * flattens category → subcategory → product → variants, inserts into MongoDB.
 * Also seeds one admin user.
 *
 * Run: npx tsx scripts/seed.ts
 */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { readFileSync } from "fs";
import { join } from "path";

// ── inline mongoose connection (avoids import issues in script context) ──────
const MONGO_URI = (process.env.MONGO_URI || process.env.MONGODB_URI) as string;
if (!MONGO_URI) {
  console.error("❌  MONGO_URI or MONGODB_URI not set in .env.local");
  process.exit(1);
}

// ── slug helper ───────────────────────────────────────────────────────────────
function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[&]/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ── Schemas (inline for script) ───────────────────────────────────────────────
const VariantSchema = new mongoose.Schema(
  {
    width: String, height: String, depth: String, length: String,
    size: String, type: String, brace: String, option: String,
    cost_gbp: Number, unit: String, stock_status: String,
  },
  { _id: false }
);

const ProductSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, index: true },
    categorySlug: { type: String, required: true, index: true },
    subcategory: { type: String, index: true },
    product_name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    notes: String,
    image: String,
    variants: [VariantSchema],
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("✅  Connected to MongoDB");

  // -- Clear existing products
  await Product.deleteMany({});
  console.log("🗑   Cleared existing products");

  // -- Read JSON
  const jsonPath = join(process.cwd(), "reffrecees", "main_line_timber_product_hierarchy.json");
  const raw = readFileSync(jsonPath, "utf-8");
  const data = JSON.parse(raw);

  const docs: any[] = [];
  const slugCounts: Record<string, number> = {};

  function makeSlug(base: string): string {
    const s = slugify(base);
    slugCounts[s] = (slugCounts[s] || 0) + 1;
    return slugCounts[s] > 1 ? `${s}-${slugCounts[s]}` : s;
  }

  for (const cat of data.categories) {
    const categorySlug = slugify(cat.category);

    // Top-level products (categories with no subcategories, e.g. Trellis, Concrete Products)
    if (cat.products && cat.products.length > 0) {
      for (const product of cat.products) {
        docs.push({
          category: cat.category,
          categorySlug,
          subcategory: undefined,
          product_name: product.product_name,
          slug: makeSlug(product.product_name),
          description: product.description || undefined,
          notes: product.notes || undefined,
          variants: (product.variants || []).map((v: any) => {
            const { price_basis, vat_included, source_refs, ...rest } = v;
            return rest;
          }),
        });
      }
    }

    // Subcategory products
    for (const sub of cat.subcategories || []) {
      for (const product of sub.products || []) {
        docs.push({
          category: cat.category,
          categorySlug,
          subcategory: sub.subcategory,
          product_name: product.product_name,
          slug: makeSlug(product.product_name),
          description: product.description || undefined,
          notes: product.notes || undefined,
          variants: (product.variants || []).map((v: any) => {
            const { price_basis, vat_included, source_refs, ...rest } = v;
            return rest;
          }),
        });
      }
    }
  }

  await Product.insertMany(docs);
  console.log(`✅  Inserted ${docs.length} products`);

  // -- Seed admin user (idempotent)
  const adminEmail = "admin@dctimbers.co.uk";
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    const hashed = await bcrypt.hash("Admin1234!", 12);
    await User.create({ email: adminEmail, password: hashed, role: "admin" });
    console.log(`✅  Admin user created: ${adminEmail} / Admin1234!`);
  } else {
    console.log(`ℹ️   Admin user already exists: ${adminEmail}`);
  }

  await mongoose.disconnect();
  console.log("🏁  Seed complete!");
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
