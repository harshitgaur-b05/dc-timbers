import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[&]/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET — list all products (with optional search/filter)
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const url = new URL(req.url);
  const search = url.searchParams.get("search") || "";
  const category = url.searchParams.get("category") || "";
  const page = parseInt(url.searchParams.get("page") || "1");
  const limit = parseInt(url.searchParams.get("limit") || "20");

  const query: any = {};
  if (search) {
    query.$or = [
      { product_name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { subcategory: { $regex: search, $options: "i" } },
    ];
  }
  if (category) query.categorySlug = category;

  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .sort({ category: 1, product_name: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return Response.json({
    products: JSON.parse(JSON.stringify(products)),
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

// POST — create new product
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const { product_name, category, categorySlug, subcategory, description, notes, image, variants } = body;

  if (!product_name || !category) {
    return Response.json({ error: "product_name and category are required" }, { status: 400 });
  }

  // Generate unique slug
  let baseSlug = slugify(product_name);
  let slug = baseSlug;
  let counter = 1;
  while (await Product.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const catSlug = categorySlug || slugify(category);

  const product = await Product.create({
    product_name,
    category,
    categorySlug: catSlug,
    subcategory: subcategory || undefined,
    description: description || undefined,
    notes: notes || undefined,
    image: image || undefined,
    variants: variants || [],
    slug,
  });

  return Response.json(JSON.parse(JSON.stringify(product)), { status: 201 });
}
