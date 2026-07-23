import mongoose, { Schema, Document } from "mongoose";

export interface IVariant {
  width?: string;
  height?: string;
  depth?: string;
  length?: string;
  size?: string;
  type?: string;
  brace?: string;
  option?: string;
  cost_gbp?: number;
  unit?: string;
  stock_status?: string;
}

export interface IProduct extends Document {
  category: string;
  categorySlug: string;
  subcategory?: string;
  product_name: string;
  slug: string;
  description?: string;
  notes?: string;
  image?: string;
  variants: IVariant[];
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>(
  {
    width: String,
    height: String,
    depth: String,
    length: String,
    size: String,
    type: String,
    brace: String,
    option: String,
    cost_gbp: Number,
    unit: String,
    stock_status: String,
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    category: { type: String, required: true, index: true },
    categorySlug: { type: String, required: true, index: true },
    subcategory: { type: String, index: true },
    product_name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    notes: String,
    image: String,
    variants: [VariantSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
