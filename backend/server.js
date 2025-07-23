import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import emailRouter from './api/email.js';
import { MongoClient } from 'mongodb';
import { S3Client } from '@aws-sdk/client-s3';
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

// Fetch paginated beats
app.get('/api/beats', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const beatsList = await beats
      .find()
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalBeats = await beats.countDocuments();
    const totalPages = Math.ceil(totalBeats / limit);

    res.json({ beats: beatsList, page, totalPages, totalBeats });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
