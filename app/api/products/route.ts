import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    const filter: Record<string, string> = {};
    if (category) filter.categorySlug = category;
    if (subcategory) filter.subcategory = subcategory;

    const products = await Product.find(filter)
      .select("product_name slug category categorySlug subcategory description variants")
      .lean();

    return Response.json(products);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
