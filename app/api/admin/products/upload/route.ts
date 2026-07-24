import { NextRequest } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file || !file.name) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return Response.json({ error: "Only JPG, PNG, WEBP, GIF images are allowed" }, { status: 400 });
  }

  // Max 5MB
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: "File too large. Maximum 5MB." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const filename = `product-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Ensure products upload dir exists
  const uploadDir = join(process.cwd(), "public", "products");
  await mkdir(uploadDir, { recursive: true });

  const filepath = join(uploadDir, filename);
  await writeFile(filepath, buffer);

  return Response.json({ url: `/products/${filename}` });
}
