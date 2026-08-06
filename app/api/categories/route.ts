import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ order: 1, name: 1 }).lean();
    return Response.json(categories);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
