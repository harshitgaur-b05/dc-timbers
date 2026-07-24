require('dotenv').config({ path: '.env.local' });
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

async function test() {
  try {
    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary is working! Response:", result);
  } catch (error) {
    console.error("❌ Cloudinary connection failed!");
    console.error(error);
  }
}

test();
