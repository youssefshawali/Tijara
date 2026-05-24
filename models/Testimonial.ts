import mongoose, { Schema, type Model } from "mongoose";

export interface ITestimonial {
  _id: mongoose.Types.ObjectId;
  clientName: string;
  position: string;
  company: string;
  quote: string;
  imageUrl?: string;
  rating: number;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    clientName: { type: String, required: true },
    position: { type: String, required: true },
    company: { type: String, required: true },
    quote: { type: String, required: true },
    imageUrl: { type: String },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    published: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
