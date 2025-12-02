// backend/routes/beat.js
import express from 'express';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import mongoose from 'mongoose';
import Beat from '../models/Beat.js'; // Your Beat model
import multer from 'multer'; // For handling multipart/form-data file uploads
import path from 'path';

const router = express.Router();

// Configure AWS S3 Client
const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});
const getPresignedUrl = async (key, expires = 3600, disposition = null) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };
    if (disposition) {
      params.ResponseContentDisposition = disposition;
    }
    const command = new GetObjectCommand(params);
    return await getSignedUrl(s3, command, { expiresIn: expires });
  } catch (error) {
    console.error('Error generating presigned URL:'.red, error);
    throw error;
  }
};

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', // .jpg, .jpeg
      'image/png', // .png
      'image/webp', // .webp ✅
      'audio/mpeg', // .mp3
      'application/zip', // .zip
    ];
    console.log('File MIME type:', file.mimetype); // Add this to debug
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Only JPEG, PNG, WEBP, MP3, and ZIP are allowed.'
        )
      );
    }
  },
});

// Upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const { type, title } = req.body;
    const year = new Date().getFullYear();
    // const path = `beats/${year}-beats/${sanitizedTitle}/image/${file.originalname}`;

    console.log('Received upload request:', {
      fileName: file?.originalname,
      fileType: file?.mimetype,
      type,
      title,
    });
    if (!file || !type || !title) {
      return res
        .status(400)
        .json({ error: 'File, type, and title are required.' });
    }

    // Sanitize title for S3 key (remove special characters, spaces, etc.)
    const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    if (!sanitizedTitle) {
      return res.status(400).json({ error: 'Invalid or empty title.' });
    }
    let s3Key;

    // Determine S3 key based on file type
    switch (type) {
      case 'image':
        s3Key = `beats/${year}-beats/${sanitizedTitle}/image/${file.originalname}`;
        break;
      case 'tagged_mp3':
        s3Key = `beats/${year}-beats/${sanitizedTitle}/tagged/${file.originalname}`;
        break;
      case 'basic_mp3':
        s3Key = `beats/${year}-beats/${sanitizedTitle}/basic/${file.originalname}`;
        break;
      case 'premium_zip':
        s3Key = `beats/${year}-beats/${sanitizedTitle}/premium/${file.originalname}`;
        break;
      case 'pro_zip':
        s3Key = `beats/${year}-beats/${sanitizedTitle}/stems/${file.originalname}`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid file type.' });
    }

    const params = {
      Bucket: process.env.AWS_S3_BUCKET, // birdiebands-media-s3
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    console.log('Uploading to S3:', { Bucket: params.Bucket, Key: params.Key });
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Return the S3 URI
    const s3Url = `s3://${process.env.AWS_S3_BUCKET}/${s3Key}`;
    console.log(s3Url, 's3Url');
    res.json({ url: s3Url });
  } catch (error) {
    console.error('Upload error:', error);
    res
      .status(500)
      .json({ error: error.message || 'Failed to upload file to S3.' });
  }
});

// Create beat endpoint
router.post('/beat', async (req, res) => {
  try {
    const {
      title,
      artist,
      duration,
      bpm,
      key,
      tags,
      s3_mp3_url,
      s3_image_url,
      licenses,
      available,
      type,
      youtube_url,
    } = req.body;
    //localhost:3001/api/beat

    // Validate required fields
    http: if (
      !title ||
      !artist ||
      !duration ||
      !bpm ||
      !key ||
      !s3_mp3_url ||
      !s3_image_url ||
      !licenses
    ) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Validate licenses
    const validLicenseTypes = [
      'Basic',
      'Premium',
      'Professional',
      'Legacy',
      'Exclusive',
    ];
    const hasValidLicenses = licenses.every(
      (license) =>
        validLicenseTypes.includes(license.type) &&
        license.price >= 0 &&
        license.currency === 'USD' &&
        license.description &&
        (license.type === 'Basic' ||
          license.type === 'Premium' ||
          license.s3_file_url)
    );

    if (!hasValidLicenses) {
      return res.status(400).json({ error: 'Invalid license configuration.' });
    }
    if (
      youtube_url !== undefined &&
      youtube_url !== null &&
      typeof youtube_url !== 'string'
    ) {
      console.log('Validation failed: Invalid format for youtube_url');
      return res.status(400).json({ error: 'Invalid format for youtube_url.' });
    }

    // Create new beat
    const newBeat = new Beat({
      title,
      artist,
      duration,
      bpm,
      key,
      tags: tags || [],
      s3_mp3_url,
      s3_image_url,
      licenses,
      available: available !== undefined ? available : true,
      type: type || 'Beat',
      youtube_url: youtube_url || null,
      created_at: new Date(),
    });

    await newBeat.save();
    res.status(201).json(newBeat);
  } catch (error) {
    console.error('Create beat error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message || 'Failed to create beat.' });
  }
});

// Update beat endpoint
router.put('/beat', async (req, res) => {
  try {
    const beatId = req.query.beatId;
    console.log(
      'PUT /beat called with beatId:',
      beatId,
      'body:',
      JSON.stringify(req.body, null, 2)
    );

    if (!beatId || !mongoose.Types.ObjectId.isValid(beatId)) {
      console.log('Validation failed: Invalid or missing beatId');
      return res.status(400).json({ error: 'Invalid or missing beatId.' });
    }

    const {
      title,
      artist,
      duration,
      bpm,
      key,
      tags,
      s3_mp3_url,
      s3_image_url,
      licenses,
      available,
      type,
      youtube_url,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !artist ||
      !duration ||
      !bpm ||
      !key ||
      !s3_mp3_url ||
      !s3_image_url ||
      !licenses
    ) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    // Validate licenses
    const validLicenseTypes = [
      'Basic',
      'Premium',
      'Professional',
      'Legacy',
      'Exclusive',
    ];
    const hasValidLicenses = licenses.every(
      (license) =>
        validLicenseTypes.includes(license.type) &&
        license.price >= 0 &&
        license.currency === 'USD' &&
        license.description &&
        (license.type === 'Basic' ||
          license.type === 'Premium' ||
          license.s3_file_url)
    );

    if (!hasValidLicenses) {
      console.log('Validation failed: Invalid license configuration');
      return res.status(400).json({ error: 'Invalid license configuration.' });
    }

    // ➡️ 2. OPTIONAL VALIDATION for the link
    // A simple check to ensure if a link is provided, it's a string.
    if (youtube_url && typeof youtube_url !== 'string') {
      return res.status(400).json({ error: 'Invalid format for youtube_url.' });
    }

    // Update beat
    const updateData = {
      title,
      artist,
      duration,
      bpm,
      key,
      tags: tags || [],
      s3_mp3_url,
      s3_image_url,
      licenses,
      available: available !== undefined ? available : true,
      type: type || 'Beat',
      youtube_url: youtube_url,
      updated_at: new Date(),
    };

    const updatedBeat = await Beat.findByIdAndUpdate(
      beatId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedBeat) {
      console.log('Beat not found:', beatId);
      return res.status(404).json({ error: 'Beat not found.' });
    }

    console.log('Beat updated successfully:', updatedBeat._id);
    res.status(200).json(updatedBeat);
  } catch (error) {
    console.error('Update beat error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message || 'Failed to update beat.' });
  }
});

// Get beat endpoint (for fetching beat data)
router.get('/beat', async (req, res) => {
  try {
    const beatId = req.query.beatId;
    if (!beatId || !mongoose.Types.ObjectId.isValid(beatId)) {
      return res.status(400).json({ error: 'Invalid or missing beatId.' });
    }
    let beatTagged = null;
    let imagePreview = null;

    const beat = await Beat.findById(beatId);
    // Add presigned URLs for previews and images and put license.s3_file_ur null
    const mp3Key = beat.s3_mp3_url.startsWith('s3://')
      ? beat.s3_mp3_url.replace(`s3://${process.env.AWS_S3_BUCKET}/`, '')
      : beat.s3_mp3_url;
    const imageKey = beat.s3_image_url?.startsWith('s3://')
      ? beat.s3_image_url.replace(`s3://${process.env.AWS_S3_BUCKET}/`, '')
      : beat.s3_image_url;
    if (beat.s3_mp3_url) {
      beatTagged = await getPresignedUrl(mp3Key, 3600 * 24 * 7); // 7 days
    }
    if (beat.s3_image_url) {
      imagePreview = imageKey
        ? await getPresignedUrl(imageKey, 3600 * 24 * 7) // 7 days
        : null; // 7 days
    }
    if (!beat) {
      return res.status(404).json({ error: 'Beat not found.' });
    }
    console.log('Beat fetched successfully:', beat);

    // Combine all data into a single object
    const responseData = {
      beat: beat,
      beatTagged: beatTagged,
      imagePreview: imagePreview,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Get beat error:', {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ error: error.message || 'Failed to fetch beat.' });
  }
});

export default router;
