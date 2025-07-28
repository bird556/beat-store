import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import emailRouter from './api/email.js';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import colors from 'colors';
import Beat from './models/Beat.js';
import License from './models/License.js';

//
dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
// const client = new MongoClient(uri);
// const db = client.db('beatstore');
// const beats = db.collection('beats');
// const orders = db.collection('orders');
// const customers = db.collection('customers');

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// Generate presigned URL for S3 file
const getPresignedUrl = async (key, expires = 3600) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    });
    return await getSignedUrl(s3, command, { expiresIn: expires });
  } catch (error) {
    console.error('Error generating presigned URL:'.red, error);
    throw error;
  }
};

async function startServer() {
  try {
    console.log(`Attempting to connect to MongoDB URI: ${uri.blue}`); // Log the URI
    await mongoose.connect(uri, {
      // Use the `uri` variable here
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // You can also specify the dbName here, though it's usually in the URI
      // dbName: 'beatstore'
    });
    console.log('Connected to MongoDB Atlas via Mongoose'.green);

    // Verify the connected database name
    console.log(`Connected database name: ${mongoose.connection.name.cyan}`);

    // Verify the collection name Mongoose is using
    // This isn't directly exposed as easily, but your model definition
    // `mongoose.model('Beat', beatSchema, 'beats')` should ensure 'beats' is used.
    // The countDocuments will confirm if the model is correctly mapping.

    const beatCount = await Beat.countDocuments();
    console.log(`Found ${beatCount} beats in collection`.green);

    // Only start listening for requests AFTER successful DB connection
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`.blue.bold)
    );
  } catch (error) {
    console.error('MongoDB connection error:'.red, error);
    process.exit(1);
  }
}

startServer();

// Route for sending email
app.use('/api/email', emailRouter);

// Fetch all beats with presigned URLs for previews and images
app.get('/api/beats', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20; // Default to 20 for home page
    const skip = (page - 1) * limit;

    const beatsList = await Beat.find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Add presigned URLs for previews and images
    for (const beat of beatsList) {
      const mp3Key = beat.s3_mp3_url.startsWith('s3://')
        ? beat.s3_mp3_url.replace(`s3://${process.env.AWS_S3_BUCKET}/`, '')
        : beat.s3_mp3_url;
      const imageKey = beat.s3_image_url?.startsWith('s3://')
        ? beat.s3_image_url.replace(`s3://${process.env.AWS_S3_BUCKET}/`, '')
        : beat.s3_image_url;

      beat.s3_mp3_url = await getPresignedUrl(mp3Key, 3600); // 1-hour for previews
      beat.s3_image_url = imageKey
        ? await getPresignedUrl(imageKey, 3600)
        : null; // 1-hour for images
      for (const license of beat.licenses) {
        license.s3_file_url = null; // Hide download URLs
      }
    }

    const totalBeats = await Beat.countDocuments();
    const totalPages = Math.ceil(totalBeats / limit);

    res.json({ beats: beatsList, page, totalPages, totalBeats });
  } catch (error) {
    console.error('Error fetching beats:'.red, error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch all licenses
app.get('/api/licenses', async (req, res) => {
  try {
    const licenses = await License.find();
    // console.log(licenses, 'licenses');
    res.json(licenses);
  } catch (err) {
    console.error('Error fetching licenses:', err);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`.blue.bold));
