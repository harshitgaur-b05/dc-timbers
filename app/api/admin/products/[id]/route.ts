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

type Params = { params: Promise<{ id: string }> };

// GET — single product
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(JSON.parse(JSON.stringify(product)));
}

// PATCH — update product
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const body = await req.json();

  // If product_name changed, update slug too (but keep unique)
  if (body.product_name) {
    const current = await Product.findById(id).lean() as any;
    if (current && body.product_name !== current.product_name) {
      let baseSlug = slugify(body.product_name);
      let slug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter++}`;
      }
      body.slug = slug;
    }
  }
  if (body.category && !body.categorySlug) {
    body.categorySlug = slugify(body.category);
  }

  const product = await Product.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true }).lean();
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(JSON.parse(JSON.stringify(product)));
}

// DELETE — remove product
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const product = await Product.findByIdAndDelete(id);
  if (!product) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ success: true });
}
