import mongoose, { Schema, type Model } from "mongoose";

export interface IMediaFile {
  _id: mongoose.Types.ObjectId;
  filename: string;
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  width?: number;
  height?: number;
  folder: string;
  createdAt: Date;
}

const MediaFileSchema = new Schema<IMediaFile>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    format: { type: String, required: true },
    bytes: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    folder: { type: String, default: "tijara" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const MediaFile: Model<IMediaFile> =
  mongoose.models.MediaFile ||
  mongoose.model<IMediaFile>("MediaFile", MediaFileSchema);

export default MediaFile;
