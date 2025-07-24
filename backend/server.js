import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import emailRouter from './api/email.js';
import { MongoClient } from 'mongodb';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const db = client.db('beatstore');
const beats = db.collection('beats');
const orders = db.collection('orders');
const customers = db.collection('customers');

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
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    await beats.createIndex({ created_at: -1 });
    await beats.createIndex({ 'licenses.type': 1, bpm: 1, key: 1 });
    await orders.createIndex({ purchase_date: -1, customer_email: 1 });
    await customers.createIndex({ email: 1 }, { unique: true });
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
startServer();

// Route for sending email
app.use('/api/email', emailRouter);

// Fetch all beats with presigned URLs for previews and images
app.get('/api/beats', async (req, res) => {
  try {
    const beatsList = await beats.find().sort({ created_at: -1 }).toArray();

    // Add presigned URLs for previews and images
    for (const beat of beatsList) {
      beat.s3_mp3_url = await getPresignedUrl(
        beat.s3_mp3_url.split('/').slice(3).join('/'),
        300 // 5-min for previews
      );
      beat.s3_image_url = await getPresignedUrl(
        beat.s3_image_url.split('/').slice(3).join('/'),
        3600 // 1-hour for images
      );
      for (const license of beat.licenses) {
        license.s3_file_url = null; // Hide download URLs
      }
    }

    res.json({ beats: beatsList });
  } catch (error) {
    console.error('Error fetching beats:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
