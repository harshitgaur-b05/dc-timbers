import mongoose from "mongoose";
import dotenv from "dotenv";

// Load env vars
dotenv.config({ path: ".env.local" });

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const INITIAL_CATEGORIES = [
  { name: "Gates", slug: "gates", order: 1 },
  { name: "Fencing", slug: "fencing", order: 2 },
  { name: "Decking", slug: "decking", order: 3 },
  { name: "Timber Products", slug: "timber-products", order: 4 },
  { name: "Concrete Products", slug: "concrete-products", order: 5 },
  { name: "Accessories", slug: "accessories", order: 6 },
];

async function seedCategories() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log("Connected.");

    for (const cat of INITIAL_CATEGORIES) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (!exists) {
        await Category.create(cat);
        console.log(`Created category: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
      }
    }

    console.log("Done seeding categories.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedCategories();
