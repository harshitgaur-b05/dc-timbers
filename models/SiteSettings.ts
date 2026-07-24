import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
  heroBannerImage?: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    heroBannerImage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
