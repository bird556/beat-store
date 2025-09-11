// backend/models/Pack.js

import mongoose from 'mongoose';

const packSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    tags: [{ type: String }],
    s3_image_url: { type: String, required: true },
    s3_mp3_url: { type: String, required: true }, // preview audio
    s3_file_url: { type: String, required: true }, // downloadable zip
    created_at: { type: Date, default: Date.now },
    features: [{ type: String }], // e.g. ["20 loops", "Royalty-Free", etc.]
    available: { type: Boolean, default: true },
    type: { type: String, default: 'Pack' },
  },
  { timestamps: true }
);

export default mongoose.model('Pack', packSchema, 'packs');
