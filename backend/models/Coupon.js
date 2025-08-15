import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, required: true, enum: ['percentage', 'fixed'] },
  discountValue: { type: Number, required: true, min: 0 },
  validFrom: { type: Date, required: true },
  validUntil: { type: Date, required: true },
  minOrderAmount: { type: Number, default: 0, min: 0 },
  maxUses: { type: Number, default: null },
  currentUses: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

// Added pre-save hook to uppercase the code for case-insensitive handling
couponSchema.pre('save', function (next) {
  if (this.isModified('code')) {
    this.code = this.code.toUpperCase();
  }
  next();
});

export default mongoose.model('Coupon', couponSchema, 'coupons');
