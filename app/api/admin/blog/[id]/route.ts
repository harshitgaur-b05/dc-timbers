import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { getAdminSession } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const body = await request.json();

  if (body.published && !body.publishedAt) body.publishedAt = new Date();

  const post = await BlogPost.findByIdAndUpdate(id, body, { new: true });
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(post);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  await BlogPost.findByIdAndDelete(id);
  return Response.json({ success: true });
}

export async function GET(_req: Request, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { id } = await params;
  const post = await BlogPost.findById(id).lean();
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(post);
}
