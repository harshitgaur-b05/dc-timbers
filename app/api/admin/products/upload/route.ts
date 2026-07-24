import { NextRequest } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  // Auth check
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file || !file.name) {
    return Response.json({ error: "No file uploaded" }, { status: 400 });
  }

  // Validate type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return Response.json(
      { error: "Only JPG, PNG, WEBP, GIF images are allowed" },
      { status: 400 }
    );
  }

  // Max 10 MB
  if (file.size > 10 * 1024 * 1024) {
    return Response.json({ error: "File too large. Maximum 10 MB." }, { status: 400 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { url, public_id } = await uploadToCloudinary(buffer, "dctimbers/products");

    return Response.json({ url, public_id });
  } catch (err: any) {
    console.error("[Cloudinary Upload Error]", err);
    return Response.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
