import mongoose from 'mongoose';

// Define the sub-schema for the licenses array
const licenseSchema = new mongoose.Schema({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  description: { type: String, required: true },
  s3_file_url: { type: String, required: true },
  features: [{ type: String }],
});

const packSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    // description: { type: String, required: true },
    price: { type: Number, required: true },
    tags: [{ type: String }],
    s3_image_url: { type: String, required: true },
    s3_mp3_url: { type: String, required: true },
    s3_free_url: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    // features: [{ type: String }],
    available: { type: Boolean, default: true },
    type: { type: String, default: 'Pack' },
    // Add the licenses field
    licenses: [licenseSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Pack', packSchema, 'packs');
