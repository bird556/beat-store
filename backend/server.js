// backend/server.js
import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import emailRouter from './api/email.js';
import emailTestRouter from './api/emailTest.js';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import colors from 'colors';
import Beat from './models/Beat.js';
import License from './models/License.js';
import Order from './models/Order.js';
import Customer from './models/Customer.js';
import paypal from '@paypal/checkout-server-sdk';
import Stripe from 'stripe';
import crypto from 'crypto';
import iso3166 from 'iso-3166-1';
//
dotenv.config();
const app = express();
const PORT = 3001;

// app.use(cors());
app.use(cors({ origin: process.env.APP_BASE_URL }));
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// Generate presigned URL for S3 file
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

// PayPal setup
const paypalClient = new paypal.core.PayPalHttpClient(
  new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
  )
);

// Stripe: Webhook for Payment Confirmation
// Stripe Webhook: This MUST come BEFORE express.json() for this specific path
// It uses express.raw() to get the raw body for signature verification.

app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      // Modified: Verify raw body is a Buffer and signature is present
      if (!Buffer.isBuffer(req.body)) {
        throw new Error('Request body must be a Buffer');
      }
      if (!sig) {
        throw new Error('Missing stripe-signature header');
      }
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Stripe webhook error:'.red, err);
      return res.status(400).json({ error: 'Webhook Error' });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const { orderId, cartItems, customerInfo } = session.metadata;
      // console.log(
      //   cartItems.length + customerInfo.length + orderId.length,
      //   'full length of metadata'
      // );
      try {
        const parsedCartItems = JSON.parse(cartItems);
        const parsedCustomerInfo = JSON.parse(customerInfo);
        // const parsedImageUrls = JSON.parse(imageUrls);
        const { validatedItems, totalPrice } = await validateCartItems(
          parsedCartItems
        );

        if (session.amount_total !== Math.round(parseFloat(totalPrice) * 100)) {
          throw new Error('Amount mismatch');
        }

        const orderItems = await Promise.all(
          validatedItems.map(async (item, index) => {
            // const beat = await Beat.findById(item.beatId).lean(); // ✅ Fetch beat data
            const beat = await Beat.findById(item.beatId); // ✅ Fetch beat data
            if (item.licenseType === 'Exclusive') {
              beat.available = false;
              await beat.save();
              console.log(
                `Beat with ID ${item.beatId} has been set to available: ${beat.available}`
              );
            }

            const plainBeat = beat.toObject(); // ✅ Converts to a clean object

            return {
              ...item,
              bpm: plainBeat?.bpm ?? null, // ✅ Add bpm
              key: plainBeat?.key ?? null, // ✅ Add key
              s3_file_url: await getPresignedUrl(
                item.s3_file_url.replace(
                  `s3://${process.env.AWS_S3_BUCKET}/`,
                  ''
                ),
                3600 * 24 * 7,
                `attachment; filename="${
                  item.title
                } (Prod Birdie Bands).${item.s3_file_url.split('.').pop()}"`
              ),
              // s3_image_url: parsedImageUrls[index], // temporary not needed
            };
          })
        );

        await Order.create({
          orderId,
          paymentType: 'Stripe',
          stripePaymentIntentId: session.payment_intent,
          customerInfo: parsedCustomerInfo,
          items: orderItems,
          totalPrice: parseFloat(totalPrice),
        });
        // // save to my customers collection but if customer already exists, update it

        const purchaseDate = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        await fetch(`${process.env.VITE_API_BASE_URL_BACKEND}/api/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: parsedCustomerInfo.email,
            // subject: 'Your Birdie Bands Purchase - Download Link',
            subject: `Birdie Bands | Download Your Beat (Order #${orderId.slice(
              0,
              4
            )}...) – 7-Day Access`,
            message: `
            Thank You for Your Purchase!\n
            Your order ID: ${orderId}\n\n
            Purchased Beats:\n
            ${orderItems
              .map(
                (item) =>
                  `- ${item.title} - ${item.artist} Type Beat (${item.licenseType} License)\n  <img src="${item.s3_image_url}" alt="${item.title}" width="100" />`
              )
              .join('\n')}
            \n
            Download your files here: ${
              process.env.APP_BASE_URL
            }/download?orderId=${orderId}\n
            This link is valid for 7 days.
          `,
            purchaseDate: purchaseDate,
            template: 'purchaseConfirmation',
            data: {
              customerName: parsedCustomerInfo.name,
              orderId: orderId,
              purchaseDate: purchaseDate,
              orderItems: orderItems, // This array now correctly contains BPM and Key
              totalPrice: totalPrice,
              downloadLink: `${process.env.APP_BASE_URL}/download?orderId=${orderId}`,
              paymentType: 'Stripe',
            },
          }),
        });

        res.json({ received: true });
      } catch (err) {
        console.error('Stripe webhook processing error:'.red, err);
        res.status(500).json({ error: 'Failed to process webhook' });
      }
    } else {
      res.json({ received: true });
    }
  }
);
// General JSON body parser - apply AFTER the specific raw body webhook handler
app.use(express.json());

const uri = process.env.MONGODB_URI;

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});

// let environment;
// if (process.env.NODE_ENV === 'production') {
//   environment = new paypal.core.LiveEnvironment(
//     process.env.PAYPAL_CLIENT_ID,
//     process.env.PAYPAL_CLIENT_SECRET
//   );
// } else {
//   environment = new paypal.core.SandboxEnvironment(
//     process.env.PAYPAL_CLIENT_ID,
//     process.env.PAYPAL_CLIENT_SECRET
//   );
// }

// const paypalClient = new paypal.core.PayPalHttpClient(environment);

// Stripe setup
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

// Generate unique order ID
const generateOrderId = () => crypto.randomUUID();

// Validate cart items against MongoDB
const validateCartItems = async (cartItems) => {
  let totalPrice = 0;
  const validatedItems = [];

  for (const item of cartItems) {
    const beat = await Beat.findById(item.beatId).lean();
    if (!beat) {
      throw new Error(`Beat with ID ${item.beatId} not found`);
    }
    const license = beat.licenses.find((lic) => lic.type === item.licenseType);
    if (!license) {
      throw new Error(
        `License ${item.licenseType} not found for beat ${item.beatId}`
      );
    }
    totalPrice += parseFloat(license.price);
    validatedItems.push({
      beatId: item.beatId,
      licenseType: item.licenseType,
      price: parseFloat(license.price),
      title: beat.title,
      artist: beat.artist,
      s3_image_url: item.s3_image_url,
      s3_file_url: license.s3_file_url,
    });
  }

  return { validatedItems, totalPrice: totalPrice.toFixed(2) };
};

async function startServer() {
  try {
    // console.log(`Attempting to connect to MongoDB URI: ${uri.blue}`); // Log the URI
    console.log(`Attempting to connect to MongoDB URI`.blue); // Log the URI
    await mongoose.connect(uri, {
      // Use the `uri` variable here
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    // Log a success message
    console.log('Connected to MongoDB Atlas via Mongoose'.green);
    // Verify the connected database name
    console.log(`Connected database name: ${mongoose.connection.name.cyan}`);

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
app.use('/api/emailTest', emailTestRouter);

// Fetch all beats with presigned URLs for previews and images
app.get('/api/beats', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6; // Default to 20 for home page
    let search = req.query.search || ''; // Get search query
    const skip = (page - 1) * limit;
    // Build query
    let query = { available: true };
    if (search) {
      if (search == 'g funk' || search == 'gfunk') {
        search = 'g-funk';
      }
      query = {
        available: true,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { artist: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } },
        ],
      };
    }

    // const beatsList = await Beat.find({ available: true })
    const beatsList = await Beat.find(query)
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

      beat.s3_mp3_url = await getPresignedUrl(mp3Key, 3600 * 24 * 7); // 7 days
      beat.s3_image_url = imageKey
        ? await getPresignedUrl(imageKey, 3600 * 24 * 7) // 7 days
        : null;
      for (const license of beat.licenses) {
        license.s3_file_url = null; // Hide download URLs
      }
    }

    // const totalBeats = await Beat.countDocuments();
    // const totalPages = Math.ceil(totalBeats / limit);
    // Count beats matching the query
    const totalBeats = await Beat.countDocuments(query);
    const totalPages = Math.ceil(totalBeats / limit);

    res.json({ beats: beatsList, page, totalPages, totalBeats });
  } catch (error) {
    console.error('Error fetching beats:'.red, error);
    res.status(500).json({ error: 'Server error' });
  }
});

// New /api/download/:beatId endpoint
app.get('/api/download/:beatId', async (req, res) => {
  try {
    const { beatId } = req.params;
    // const user = req.user; // Uncomment if using authentication middleware (e.g., JWT)

    // Fetch beat from database
    const beat = await Beat.findById(beatId).lean();
    if (!beat) {
      return res.status(404).json({ error: 'Beat not found' });
    }

    // Optional: Validate purchase
    // Replace with your purchase validation logic
    /*
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const hasPurchased = await Purchase.findOne({ userId: user.id, beatId }).lean();
    if (!hasPurchased) {
      return res.status(403).json({ error: 'Purchase required' });
    }
    */

    // Use s3_mp3_url or a separate field (e.g., s3_download_url) for the downloadable file
    const mp3Key = beat.s3_mp3_url.startsWith('s3://')
      ? beat.s3_mp3_url.replace(`s3://${process.env.AWS_S3_BUCKET}/`, '')
      : beat.s3_mp3_url;

    // Generate presigned URL with Content-Disposition: attachment
    const downloadUrl = await getPresignedUrl(
      mp3Key,
      3600 * 24 * 7, // Short expiry for security
      `attachment; filename="(www.BirdieBands.com) - ${beat.title} [${beat.bpm} BPM - ${beat.key}] [Prod Birdie Bands].mp3"`
      // `attachment; filename="${beat.artist} Type Beat - ${beat.title.replace(
      //   /[^a-zA-Z0-9]/g,
      //   '_'
      // )} [Prod Birdie Bands].mp3"`
    );

    res.json({ downloadUrl });
  } catch (error) {
    console.error('Error generating download URL:'.red, error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});
// download license /api/licenses/download/:licenseId
app.get('/api/licenses/download/:licenseId', async (req, res) => {
  try {
    const { licenseId } = req.params;
    const license = await License.findById(licenseId).lean();
    if (!license) {
      return res.status(404).json({ error: 'License not found' });
    }
    const fileKey = license.licenseDownloadLink.startsWith('s3://')
      ? license.licenseDownloadLink.replace(
          `s3://${process.env.AWS_S3_BUCKET}/`,
          ''
        )
      : license.licenseDownloadLink;
    const downloadUrl = await getPresignedUrl(fileKey, 3600 * 24 * 7); // 7 days
    res.json({ downloadUrl });
  } catch (error) {
    console.error('Error generating download URL:'.red, error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
});

// Fetch all licenses
app.get('/api/licenses', async (req, res) => {
  try {
    const licenses = await License.find({}, { licenseContract: 0 }).sort({
      created_at: 1,
    });

    // const licenses = await License.find();
    res.json(licenses);
  } catch (err) {
    console.error('Error fetching licenses:', err);
    res.status(500).send('Server error');
  }
});

// PayPal: Create Order
app.post('/api/paypal/create-order', async (req, res) => {
  const { cartItems, customerInfo } = req.body;
  const newOrderId = generateOrderId();
  // const country = iso3166.whereCountry(customerInfo.country);
  // if (!country) {
  //   return res.status(400).json({ error: 'Invalid country code' });
  // }
  // Check if country is an ISO code or name
  let countryCode = customerInfo.country;
  if (!/^[A-Z]{2}$/.test(customerInfo.country)) {
    // Try to resolve as a country name
    const country = iso3166.whereCountry(customerInfo.country);
    if (!country) {
      return res.status(400).json({ error: 'Invalid country name or code' });
    }
    countryCode = country.alpha2;
  } else {
    // Verify it's a valid ISO code
    const country = iso3166.whereAlpha2(customerInfo.country);
    if (!country) {
      return res.status(400).json({ error: 'Invalid country code' });
    }
    countryCode = customerInfo.country; // Already an ISO code
  }

  try {
    if (!customerInfo.email || !customerInfo.name) {
      throw new Error('Missing customerInfo fields');
    }
    // save customer info to MONGO DB
    await Customer.findOneAndUpdate(
      { email: customerInfo.email },
      {
        $set: {
          name: customerInfo.name,
          email: customerInfo.email,
          address: customerInfo.address,
          city: customerInfo.city,
          state: customerInfo.state,
          zip: customerInfo.zip,
          country: customerInfo.country,
        },
      },
      { upsert: true }
    );
    const { validatedItems, totalPrice } = await validateCartItems(cartItems);
    // console.log('Validated Items:', validatedItems, 'Total Price:', totalPrice);

    const paypalClient = new paypal.core.PayPalHttpClient(
      new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET
      )
    );

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: totalPrice,
            breakdown: {
              item_total: { currency_code: 'USD', value: totalPrice },
            },
          },
          items: validatedItems.map((item) => ({
            name: `${item.title} (${
              item.licenseType == 'Exclusive'
                ? `${item.licenseType} License`
                : `${item.licenseType} Lease`
            })`,
            unit_amount: { currency_code: 'USD', value: item.price.toFixed(2) },
            quantity: 1,
          })),
          custom_id: newOrderId,
        },
      ],
      application_context: {
        return_url: `${process.env.APP_BASE_URL}/download?orderId=${newOrderId}`, // Success URL
        cancel_url: `${process.env.APP_BASE_URL}/checkout`, // Cancel URL
        shipping_preference: 'NO_SHIPPING', // Since you're selling digital beats
        user_action: 'PAY_NOW', // Changes button text to "Pay Now"
        brand_name: 'Birdie Bands', // Appears on PayPal checkout page
      },
      payer: {
        // name: { given_name: customerInfo.name },
        name: {
          given_name: customerInfo.name.split(' ')[0],
          surname:
            customerInfo.name.split(' ').slice(1).join(' ') || 'Customer',
        }, // PayPal requires given_name and surname

        email_address: customerInfo.email,
        address: {
          address_line_1: customerInfo.address,
          admin_area_2: customerInfo.city,
          admin_area_1: customerInfo.state,
          postal_code: customerInfo.zip,
          country_code: countryCode,
        },
      },
    });

    const response = await paypalClient.execute(request);
    console.log('Paypal order created', response.result);
    res.json({ orderId: response.result.id });
    // res.json({ orderId: newOrderId });
  } catch (err) {
    console.error('PayPal create order error:'.red, err);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// PayPal: Capture Order
app.post('/api/paypal/capture-order', async (req, res) => {
  const { orderId, cartItems, customerInfo } = req.body;
  // console.log(orderId, 'orderId from paypal capture endpoint');
  // console.log(cartItems, 'cartItems from paypal capture endpoint');
  // console.log(customerInfo, 'customerInfo from paypal capture endpoint');
  try {
    const { validatedItems, totalPrice } = await validateCartItems(cartItems);

    // Verify PayPal order amount
    const request = new paypal.orders.OrdersGetRequest(orderId);
    const order = await paypalClient.execute(request);
    if (
      order.result.status !== 'APPROVED' ||
      parseFloat(order.result.purchase_units[0].amount.value) !==
        parseFloat(totalPrice)
    ) {
      throw new Error('Invalid order or amount mismatch');
    }

    // Capture the order
    const captureRequest = new paypal.orders.OrdersCaptureRequest(orderId);
    captureRequest.prefer('return=representation');
    const capture = await paypalClient.execute(captureRequest);

    if (capture.result.status === 'COMPLETED') {
      const orderItems = await Promise.all(
        validatedItems.map(async (item, index) => {
          // const beat = await Beat.findById(item.beatId).lean(); // ✅ Fetch beat data
          const beat = await Beat.findById(item.beatId); // ✅ Fetch beat data
          // ✅ Update availability if license is "Exclusive"
          if (item.licenseType === 'Exclusive') {
            beat.available = false;
            await beat.save();
            console.log(
              `Beat with ID ${item.beatId} has been set to available: ${beat.available}`
            );
          }
          const plainBeat = beat.toObject(); // ✅ Converts to a clean object

          return {
            ...item,
            bpm: plainBeat?.bpm ?? null, // ✅ Add bpm
            key: plainBeat?.key ?? null, // ✅ Add key
            s3_file_url: await getPresignedUrl(
              item.s3_file_url.replace(
                `s3://${process.env.AWS_S3_BUCKET}/`,
                ''
              ),
              3600 * 24 * 7,
              `attachment; filename="${
                item.title
              } (Prod Birdie Bands).${item.s3_file_url.split('.').pop()}"`
            ),
            // s3_image_url: parsedImageUrls[index], // temporary not needed
          };
        })
      );

      await Order.create({
        // orderId: newOrderId,
        orderId: orderId,
        paymentType: 'PayPal',
        paypalOrderId: orderId,
        customerInfo,
        items: orderItems,
        totalPrice: parseFloat(totalPrice),
      });

      // Send email
      const purchaseDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Send email via /api/email
      await fetch(`${process.env.VITE_API_BASE_URL_BACKEND}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: customerInfo.email,
          // subject: 'Your Birdie Bands Purchase - Download Link',
          subject: `Birdie Bands | Download Your Beat (Order #${orderId.slice(
            0,
            4
          )}...) – 7-Day Access`,
          message: `
            Thank You for Your Purchase!\n
            Your order ID: ${orderId}\n\n
            Purchased Beats:\n
            ${orderItems
              .map(
                (item) =>
                  `- ${item.title} - ${item.artist} Type Beat (${item.licenseType} License)\n  <img src="${item.s3_image_url}" alt="${item.title}" width="100" />`
              )
              .join('\n')}
            \n
            Download your files here: ${
              process.env.APP_BASE_URL
            }/download?orderId=${orderId}\n
            This link is valid for 7 days.
          `,
          purchaseDate: purchaseDate,
          template: 'purchaseConfirmation',
          data: {
            customerName: customerInfo.name,
            orderId: orderId,
            purchaseDate: purchaseDate,
            orderItems: orderItems, // This array now correctly contains BPM and Key
            totalPrice: totalPrice,
            downloadLink: `${process.env.APP_BASE_URL}/download?orderId=${orderId}`,
            paymentType: 'PayPal',
          },
        }),
      });

      res.json({
        status: 'success',
        // orderId: newOrderId,
        orderId: orderId,
        items: orderItems.map((item) => ({
          title: item.title,
          artist: item.artist,
          imageUrl: item.s3_image_url,
          licenseType: item.licenseType,
        })),
      });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (err) {
    console.error('PayPal capture error:'.red, err);
    res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
});

// Stripe: Create Checkout Session
app.post('/api/stripe/create-checkout-session', async (req, res) => {
  const { cartItems, customerInfo } = req.body;
  // console.log(customerInfo, 'customerInfo');
  // save customer info to MONGO DB
  // save to my customers collection but if customer already exists, update it
  await Customer.findOneAndUpdate(
    { email: customerInfo.email },
    {
      $set: {
        name: customerInfo.name,
        email: customerInfo.email,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zip: customerInfo.zip,
        country: customerInfo.country,
      },
    },
    { upsert: true }
  );

  try {
    const { validatedItems, totalPrice } = await validateCartItems(cartItems);
    // console.log(validatedItems, 'validatedItems');
    const newOrderId = generateOrderId();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: validatedItems.map((item) => {
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${item.title} (${
                item.licenseType == 'Exclusive'
                  ? `${item.licenseType} License`
                  : `${item.licenseType} Lease`
              })`,
              images: [item.s3_image_url],
              description: `${item.artist} Type Beat`,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: 1,
        };
      }),
      mode: 'payment',
      success_url: `${process.env.APP_BASE_URL}/download?orderId=${newOrderId}`,
      cancel_url: `${process.env.APP_BASE_URL}/checkout`,
      customer_email: customerInfo.email,
      client_reference_id: newOrderId,
      metadata: {
        orderId: newOrderId,
        // cartItems: JSON.stringify(cartItems),
        // only pass in beatid and license type from validateditems
        cartItems: JSON.stringify(
          validatedItems.map((item) => ({
            beatId: item.beatId,
            licenseType: item.licenseType,
          }))
        ),
        customerInfo: JSON.stringify({
          name: customerInfo.name,
          email: customerInfo.email,
        }),
        // imageUrls: JSON.stringify(
        //   validatedItems.map((item) => item.s3_image_url)
        // ),
      },
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error('Stripe create checkout session error:'.red, err);
    res.status(500).json({ error: 'Failed to create Checkout Session' });
  }
});

// Download endpoint
app.get('/download', async (req, res) => {
  const { orderId } = req.query;

  try {
    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // --- Extracting information from the 'order' object ---
    const customerName = order.customerInfo?.name; // Using optional chaining for safety
    const customerEmail = order.customerInfo?.email; // Using optional chaining for safety

    const orderItemsWithBeatDetails = await Promise.all(
      order.items.map(async (item) => {
        const beat = await Beat.findById(item.beatId).lean();
        // Ensure beat exists before trying to access its properties
        if (!beat) {
          console.warn(
            `Beat with ID ${item.beatId} not found for order ${orderId}`
          );
          return {
            title: item.title,
            artist: item.artist,
            downloadUrl: item.s3_file_url,
            s3_image_url: null, // Or a default image URL
            bpm: null,
            key: null,
            licenseType: item.licenseType, // Get item's license type
          };
        }

        const s3_image_url_cleaned = beat.s3_image_url?.startsWith('s3://')
          ? beat.s3_image_url.replace(`s3://${process.env.AWS_S3_BUCKET}/`, '')
          : beat.s3_image_url;

        return {
          title: item.title,
          artist: item.artist,
          downloadUrl: item.s3_file_url, // Assuming this is already a direct URL or handled elsewhere
          s3_image_url: s3_image_url_cleaned,
          bpm: beat.bpm,
          key: beat.key,
          licenseType: item.licenseType, // Get item's license type
        };
      })
    );

    // Generate presigned URLs for images
    const imageUrls = await Promise.all(
      orderItemsWithBeatDetails.map(async (item) => {
        return item.s3_image_url
          ? await getPresignedUrl(item.s3_image_url, 3600 * 24 * 7) // 7 days
          : null;
      })
    );

    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
    if (diffDays > 7) {
      return res.status(403).json({ error: 'Download link expired' });
    }

    res.json({
      orderId,
      customerName, // Included
      customerEmail, // Included
      items: orderItemsWithBeatDetails.map((item, index) => ({
        title: item.title,
        artist: item.artist,
        downloadUrl: item.downloadUrl,
        imageUrl: imageUrls[index], // Assign the resolved image URL
        bpm: item.bpm,
        key: item.key,
        licenseType: item.licenseType, // Included
      })),
    });
  } catch (err) {
    console.error('Download error:'.red, err);
    res.status(500).json({ error: 'Failed to retrieve download' });
  }
});

// get single beat
// curl localhost:3001/api/beat/:id
app.get('/beat', async (req, res) => {
  const { beatId } = req.query;
  // console.log(beatId, 'beatId');
  try {
    const beat = await Beat.findById(beatId).lean();
    if (!beat) {
      return res.status(404).json({ error: 'Beat not found' });
    }
    // Add presigned URLs for previews and images and put license.s3_file_ur null
    const mp3Key = beat.s3_mp3_url.startsWith('s3://')
      ? beat.s3_mp3_url.replace(`s3://${process.env.AWS_S3_BUCKET}/`, '')
      : beat.s3_mp3_url;
    const imageKey = beat.s3_image_url?.startsWith('s3://')
      ? beat.s3_image_url.replace(`s3://${process.env.AWS_S3_BUCKET}/`, '')
      : beat.s3_image_url;

    beat.s3_mp3_url = await getPresignedUrl(mp3Key, 3600 * 24 * 7); // 7 days
    beat.s3_image_url = imageKey
      ? await getPresignedUrl(imageKey, 3600 * 24 * 7) // 7 days
      : null;

    for (const license of beat.licenses) {
      license.s3_file_url = null; // Hide download URLs
    }

    res.json(beat);
  } catch (err) {
    console.error('Get beat error:'.red, err);
    res.status(500).json({ error: 'Failed to retrieve beat' });
  }
});

// get related beats
app.get('/related-beats', async (req, res) => {
  const { tags, excludeBeatId } = req.query;
  // console.log(tags, 'tags');
  // console.log(excludeBeatId, 'excludeBeatId');
  if (!tags) {
    return res.status(400).json({ error: 'Tags parameter is required.' });
  }

  const tagArray = tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  if (tagArray.length === 0) {
    return res.json([]); // No tags provided, return empty array
  }
  try {
    const relatedBeats = await Beat.find({
      tags: {
        $in: tagArray,
      }, // Find beats where the 'tags' array contains any of the provided tags
      _id: { $ne: excludeBeatId }, // Exclude the current beat
    })
      .limit(10) // Limit the number of related beats (e.g., 8 or 12)
      .sort({ createdAt: -1 }) // Or sort by views, popularity, etc.
      .lean(); // For plain JavaScript objects
    // Add presigned URLs for previews and images for related beats
    for (const beat of relatedBeats) {
      if (beat.s3_mp3_url) {
        const mp3Key = beat.s3_mp3_url.startsWith('s3://')
          ? beat.s3_mp3_url.replace(`s3://${process.env.AWS_S3_BUCKET}/`, '')
          : beat.s3_mp3_url;
        beat.s3_mp3_url = await getPresignedUrl(mp3Key, 3600); // Shorter expiry for preview
      }
      if (beat.s3_image_url) {
        const imageKey = beat.s3_image_url.startsWith('s3://')
          ? beat.s3_image_url.replace(`s3://${process.env.AWS_S3_BUCKET}/`, '')
          : beat.s3_image_url;
        beat.s3_image_url = await getPresignedUrl(imageKey, 3600 * 24 * 7); // Longer expiry for images
      }
      // Ensure licenses don't expose download URLs
      if (beat.licenses && Array.isArray(beat.licenses)) {
        for (const license of beat.licenses) {
          license.s3_file_url = null;
        }
      }
      // Map _id to id for consistency with frontend Track interface
      beat.id = beat._id;
    }
    // console.log(relatedBeats, 'relatedBeats');
    res.json(relatedBeats);
  } catch (err) {
    console.error('Get related beats error:'.red, err);
    res.status(500).json({ error: 'Failed to retrieve related beats' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`.blue.bold));
