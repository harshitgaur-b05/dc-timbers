import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const { slug } = await params;
    const product = await Product.findOne({ slug }).lean();
    if (!product) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(product);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
