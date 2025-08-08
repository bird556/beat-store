//backend/api/emailTest.js

import { Router } from 'express';
import nodemailer from 'nodemailer';
import { PDFDocument } from 'pdf-lib'; // Import PDF-lib
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import License from '../models/License.js';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// A function to get a presigned URL for an S3 object
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
    console.error('Error generating presigned URL:', error);
    throw error;
  }
};

// --- Your generateContractPdf function ---
async function generateContractPdf(item, customerName) {
  // 1. Extract and Format Dynamic Data
  const purchaseTimestamp = new Date(); // For testing, use current time. In production, use webhookData.payment.created_at
  const formattedDate = purchaseTimestamp.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: '2-digit',
  });
  const formattedTime = purchaseTimestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  // const effectiveDate = `${formattedDate}, ${formattedTime}`;
  const effectiveDate = `${formattedDate}`;

  const beatName = item.description;
  const leaseType = item.leaseType;
  const pricePaid = item.amount / 100; // Assuming amount is in cents
  const pricePaidText = `${pricePaid.toFixed(2)}`; // --- Dynamic values based on leaseType ---

  // --- Dynamic values based on leaseType ---
  let contractTitlePrefix;

  // 1. Fetch the license document from MongoDB
  const license = await License.findOne({ type: new RegExp(leaseType, 'i') });

  if (!license || !license.licenseContract) {
    throw new Error(
      `License document for type "${leaseType}" not found or missing 'licenseContract' field.`
    );
  }

  // 2. Extract the S3 key from the full S3 URL
  const s3Link = license.licenseContract;
  const templateS3Key = s3Link.replace(
    `s3://${process.env.AWS_S3_BUCKET}/`,
    ''
  );

  switch (leaseType) {
    case 'basic':
      contractTitlePrefix = 'Basic Lease';
      break;
    case 'premium':
      contractTitlePrefix = 'Premium Lease';
      break;
    case 'professional':
      contractTitlePrefix = 'Professional Lease';
      break;
    case 'legacy':
      contractTitlePrefix = 'Legacy Lease';
      break;
    case 'exclusive':
      contractTitlePrefix = 'Exclusive License';
      break;
    default:
      throw new Error(`Unknown lease type: ${leaseType}`);
  }

  // --- Download PDF Template from S3 ---
  let existingPdfBytes;
  try {
    const presignedUrl = await getPresignedUrl(templateS3Key);
    const response = await fetch(presignedUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to download template from S3: ${response.statusText}`
      );
    }
    existingPdfBytes = await response.arrayBuffer();
  } catch (error) {
    console.error(
      `Error fetching PDF template from S3 at key ${templateS3Key}:`,
      error
    );
    throw new Error('Failed to load PDF template from S3.');
  }

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const form = pdfDoc.getForm();

  // --- Fill Form Fields ---
  form.getTextField('effective_date').setText(effectiveDate);
  form.getTextField('licensee_full_name').setText(customerName);
  form.getTextField('composition_title').setText(beatName);
  form.getTextField('license_fee').setText(`$${pricePaidText}`); // For License Fee in intro
  form.getTextField('license_writer').setText(`${customerName} (50%)`); // For License Fee in intro

  // --- Signature Dates ---
  const currentFormattedDate = new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
  try {
    form.getTextField('producer_signature_date').setText(currentFormattedDate);
  } catch (e) {
    /* Field not found, ignore */
  }
  // licensee_signature_date will remain empty for them to fill, or can be dynamically filled if you have that info
  // try { form.getTextField('licensee_signature_date').setText(''); } catch (e) { /* Field not found, ignore */ }

  // Make fields read-only after filling (optional, but good practice for contracts)
  form.getFields().forEach((field) => {
    try {
      field.enableReadOnly();
    } catch (e) {
      // Some fields might not support enableReadOnly, e.g., signature fields
      console.warn(
        `Could not set read-only for field: ${field.getName()}`,
        e.message
      );
    }
  });

  // 4. Save the Filled PDF
  const filledPdfBytes = await pdfDoc.save();
  return {
    filename: `${customerName.replace(/[^a-zA-Z0-9]/g, '')}_${beatName.replace(
      /[^a-zA-Z0-9]/g,
      ''
    )}_${contractTitlePrefix}_Contract.pdf`,
    content: filledPdfBytes,
    contentType: 'application/pdf',
  };
}

router.post('/', async (req, res) => {
  try {
    const { email, customerName, items } = req.body;

    // Define your static producer/licensor names here

    if (
      !email ||
      !customerName ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        error: 'Missing required fields: email, customerName, or items array.',
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_EMAIL_PASSWORD,
      },
    });

    // Declare attachments array BEFORE the loop
    const attachments = [];
    for (const item of items) {
      try {
        // Pass licensorFullName and producerName to the PDF generation function
        const pdfAttachment = await generateContractPdf(item, customerName);
        attachments.push(pdfAttachment);
      } catch (pdfError) {
        console.error(
          `Error generating PDF for item ${item.description} (${item.leaseType}):`,
          pdfError
        );
        // Decide how to handle this: skip this PDF, or throw a global error
        // For now, we'll just log and continue, but you might want to fail the whole request.
        // You might also want to send an email to yourself about the failure.
      }
    }

    // Email to the user (Licensee)
    const mailToUser = {
      from: `"BirdieBands.com" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: 'Your Beat License Agreement(s) from Birdie Bands',
      html: `
                <p>Hello ${customerName},</p>
                <p>Thank you for your purchase from Birdie Bands!</p>
                <p>Attached to this email, you will find your license agreement(s) for the beat(s) you purchased. Please download and review them carefully.</p>
                <p>You can always reach out to us for new download links if the initial link expires.</p>
                <p>If you have any questions, feel free to reply to this email.</p>
                <p>Sincerely,</p>
                <p>Rashaun Bennett (Birdie Bands)</p>
            `,
      attachments: attachments,
    };

    // Email to yourself (Licensor) - optional, but good for tracking
    const mailToSelf = {
      from: `"www.BirdieBands.com" <${process.env.GMAIL_EMAIL}>`,
      replyTo: email,
      to: process.env.GMAIL_EMAIL,
      subject: `New Beat Purchase: ${customerName} - ${items
        .map((i) => i.description)
        .join(', ')}`,
      text: `A new purchase has been made by ${customerName} (${email}).\n\nItems purchased:\n${items
        .map((i) => `- ${i.description} (${i.leaseType} Lease)`)
        .join('\n')}\n\nContracts attached.`,
      attachments: attachments, // Attach contracts to your own email too for easy reference
    };

    await transporter.sendMail(mailToSelf);
    await transporter.sendMail(mailToUser);
    return res.status(200).json({ message: 'Email(s) sent successfully' });
  } catch (error) {
    console.error('Email send error:'.red, error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

export default router;
