import mongoose, { Schema, type Model } from "mongoose";

export interface IService {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  benefits: string[];
  process: string[];
  icon: string;
  imageUrl?: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    benefits: [{ type: String }],
    process: [{ type: String }],
    icon: { type: String, default: "Briefcase" },
    imageUrl: { type: String },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ServiceSchema.index({ published: 1, sortOrder: 1 });

const Service: Model<IService> =
  mongoose.models.Service || mongoose.model<IService>("Service", ServiceSchema);

export default Service;
