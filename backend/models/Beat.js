// backend/models/Beat.js

import mongoose from 'mongoose';
import { features } from 'process';

const licenseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['Basic', 'Premium', 'Professional', 'Legacy', 'Exclusive'],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'USD',
    },
    description: {
      type: String,
      required: true,
    },
    s3_file_url: {
      type: String,
      required: false,
    },
    features: {
      type: [String],
      required: true,
    },
  },
  { _id: false }
);

const beatSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: String,
    required: true,
  },
  bpm: {
    type: Number,
    required: true,
    min: 0,
  },
  key: {
    type: String,
    required: true,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  s3_mp3_url: {
    type: String,
    required: true,
  },
  s3_image_url: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
    get: (v) => (v instanceof Date ? v : new Date(v)), // Handle $date
  },
  licenses: [licenseSchema],
  available: { type: Boolean, required: true, default: true }, // ✅ Add this
  type: { type: String, required: true, default: 'Beat' },
});

// Ensure _id is treated as ObjectId
beatSchema.set('toJSON', { getters: true, virtuals: false });
beatSchema.set('toObject', { getters: true, virtuals: false });

// Indexes for efficient queries
beatSchema.index({ created_at: -1 });
beatSchema.index({ 'licenses.type': 1, bpm: 1, key: 1 });

export default mongoose.model('Beat', beatSchema, 'beats'); // Explicitly set collection name
