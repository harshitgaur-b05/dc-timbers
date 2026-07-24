require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
  api_key: process.env.CLOUDINARY_API_KEY.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
  secure: true,
});

async function testUpload() {
  try {
    console.log("Uploading test image...");
    const result = await cloudinary.uploader.upload("test-image.jpg", {
      folder: "dctimbers/test"
    });
    console.log("✅ Upload successful!", result.secure_url);
  } catch (error) {
    console.error("❌ Upload failed!");
    console.error(error);
  }
}

testUpload();
