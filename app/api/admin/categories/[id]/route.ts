import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
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

// PATCH — update category
export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  const body = await req.json();

  if (body.name) {
    const current = await Category.findById(id).lean() as any;
    if (current && body.name !== current.name) {
      let baseSlug = slugify(body.name);
      let slug = baseSlug;
      let counter = 1;
      while (await Category.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter++}`;
      }
      body.slug = slug;
      
      // Update all products with this category
      await Product.updateMany(
        { categorySlug: current.slug },
        { $set: { category: body.name, categorySlug: slug } }
      );
    }
  }

  const category = await Category.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true }).lean();
  if (!category) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(JSON.parse(JSON.stringify(category)));
}

// DELETE — remove category
export async function DELETE(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await connectDB();
  
  const category = await Category.findById(id).lean() as any;
  if (!category) return Response.json({ error: "Not found" }, { status: 404 });

  // Check if products use this category
  const productCount = await Product.countDocuments({ categorySlug: category.slug });
  if (productCount > 0) {
    return Response.json(
      { error: `Cannot delete category: ${productCount} products are using it.` },
      { status: 400 }
    );
  }

  await Category.findByIdAndDelete(id);
  return Response.json({ success: true });
}
