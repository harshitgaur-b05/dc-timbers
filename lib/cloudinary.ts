/**
 * Cloudinary upload utility — uses UNSIGNED uploads via REST API.
 * No API Secret or timestamp signature required.
 * Relies on an unsigned upload preset configured in the Cloudinary dashboard.
 */

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME?.trim() || "";
const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET?.trim() || "dctimbers_uploads";

/**
 * Upload a raw buffer to Cloudinary using an unsigned upload preset.
 * Returns the secure CDN URL and public_id.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder = "dctimbers/products"
): Promise<{ url: string; public_id: string }> {
  const formData = new FormData();
  formData.append("file", new Blob([buffer]));
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.error?.message || `Cloudinary upload failed (${res.status})`
    );
  }

  return { url: data.secure_url as string, public_id: data.public_id as string };
}

/**
 * Delete an image by public_id using the Cloudinary Admin API (signed).
 * This requires API Key + Secret and is only called server-side.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  const cloudinaryModule = await import("cloudinary");
  const cloudinary = cloudinaryModule.v2;
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY?.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
    secure: true,
  });
  await cloudinary.uploader.destroy(publicId);
}
