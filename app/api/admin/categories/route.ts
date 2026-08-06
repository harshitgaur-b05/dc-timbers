import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import { getAdminSession } from "@/lib/auth";

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[&]/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET — list all categories
export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const categories = await Category.find({}).sort({ order: 1, name: 1 }).lean();
  return Response.json(categories);
}

// POST — create new category
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json();
  const { name, description, order } = body;

  if (!name) {
    return Response.json({ error: "Category name is required" }, { status: 400 });
  }

  let baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;
  while (await Category.findOne({ slug })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const category = await Category.create({
    name,
    slug,
    description: description || undefined,
    order: order || 0,
  });

  return Response.json(JSON.parse(JSON.stringify(category)), { status: 201 });
}
