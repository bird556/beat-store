// backend/models/License.js

import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema({
  type: String,
  title: String,
  description: String,
  features: [String],
  licenseDownloadLink: String,
});

export default mongoose.model('License', licenseSchema);
