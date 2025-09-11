// backend/models/Order.js

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  paymentType: { type: String, required: true, enum: ['PayPal', 'Stripe'] },
  paypalOrderId: { type: String, sparse: true },
  stripePaymentIntentId: { type: String, sparse: true },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  items: [
    {
      beatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beat',
        required: true,
      },
      licenseType: { type: String, required: true },
      price: { type: Number, required: true },
      title: { type: String, required: true },
      artist: { type: String, required: true },
      type: { type: String, required: true },
      s3_image_url: { type: String },
      s3_file_url: { type: String, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema, 'orders');
