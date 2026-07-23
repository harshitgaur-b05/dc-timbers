import { connectDB } from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const posts = await BlogPost.find({}).sort({ createdAt: -1 }).lean();
  return Response.json(posts);
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await request.json();
  const { title, slug, excerpt, content, coverImage, author, published, metaTitle, metaDescription } = body;

  if (!title || !slug) {
    return Response.json({ error: "Title and slug required" }, { status: 400 });
  }

  const post = await BlogPost.create({
    title, slug, excerpt, content, coverImage, author, published: !!published,
    publishedAt: published ? new Date() : undefined,
    metaTitle, metaDescription,
  });

  return Response.json(post, { status: 201 });
}
