import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Upload a buffer to Cloudinary and return the secure URL.
 * @param buffer  Raw file bytes
 * @param folder  Cloudinary folder (e.g. "dctimbers/products")
 * @param publicId  Optional custom public_id
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder = "dctimbers/products",
  publicId?: string
): Promise<{ url: string; public_id: string }> {
  return new Promise((resolve, reject) => {
    const options: Record<string, unknown> = {
      folder,
      resource_type: "image",
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" }, // auto WebP/AVIF for browsers that support it
      ],
    };
    if (publicId) options.public_id = publicId;

    const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error || new Error("Cloudinary upload failed"));
      } else {
        resolve({ url: result.secure_url, public_id: result.public_id });
      }
    });

    stream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
