import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema({
  type: String,
  title: String,
  description: String,
  features: [String],
});

export default mongoose.model('License', licenseSchema);
