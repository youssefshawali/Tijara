import mongoose, { Schema, type Model } from "mongoose";

export interface ISiteSettings {
  _id: mongoose.Types.ObjectId;
  companyName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  instagramHandle: string;
  address: string;
  logoUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  homepageHeroTitle?: string;
  homepageHeroSubtitle?: string;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    companyName: { type: String, default: "TIJARA" },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    instagram: { type: String, required: true },
    instagramHandle: { type: String, required: true },
    address: { type: String, required: true },
    logoUrl: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    homepageHeroTitle: { type: String },
    homepageHeroSubtitle: { type: String },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);

export default SiteSettings;
