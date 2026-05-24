import mongoose, { Schema, type Model } from "mongoose";

export interface IContactSubmission {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  company?: string;
  businessType: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSubmissionSchema = new Schema<IContactSubmission>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String },
    businessType: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ContactSubmissionSchema.index({ createdAt: -1 });
ContactSubmissionSchema.index({ read: 1 });

const ContactSubmission: Model<IContactSubmission> =
  mongoose.models.ContactSubmission ||
  mongoose.model<IContactSubmission>(
    "ContactSubmission",
    ContactSubmissionSchema
  );

export default ContactSubmission;
