## Overview

Birdie Bands is a full-stack e-commerce platform for selling high-quality type beats and instrumentals. The platform features a modern React frontend with a Node.js/Express backend, offering beat previews, secure payments, license management, and automated email notifications.

## 🚀 Features

- **Beat Store**: Browse and search through a catalog of high-quality instrumentals
- **Audio Previews**: Stream beats directly in the browser
- **Shopping Cart**: Add beats with different license types to cart
- **BOGO Discounts**: Buy 1 Get 1 Free on all leases (excluding Exclusive licenses)
- **Coupon System**: Support for percentage and fixed-amount discounts
- **Secure Payments**: Integration with both PayPal and Stripe
- **License Management**: Multiple license types (Basic, Premium, Professional, Legacy, Exclusive)
- **Automated Email System**: Purchase confirmations with PDF contracts
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Newsletter Integration**: MailerLite subscription system

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for build tooling
- **Framer Motion** for animations
- **React Router** for navigation
- **Shadcn/ui** for UI components
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend
- **Node.js** with **Express.js**
- **MongoDB** with **Mongoose** ODM
- **AWS S3** for file storage with presigned URLs
- **Nodemailer** for email services
- **PayPal Checkout Server SDK**
- **Stripe** for payment processing
- **CORS** for cross-origin requests

### Payment Processing
- **PayPal** Express Checkout
- **Stripe** Checkout with webhooks
- Support for coupons and discount codes

### Email System
- **Nodemailer** with Gmail SMTP
- Custom HTML email templates
- Automated PDF contract generation
- Purchase confirmation emails
- Sales notification emails

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- AWS S3 bucket with proper credentials
- PayPal Developer Account
- Stripe Account
- Gmail account for sending emails
- MailerLite account for newsletter

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server
PORT=3001
APP_BASE_URL=http://localhost:5173
VITE_API_BASE_URL_BACKEND=http://localhost:3001

# Database
MONGODB_URI=your_mongodb_connection_string

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name
AWS_S3_REGION=your_s3_region
AWS_REGION=your_aws_region

# Payments
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email
GMAIL_EMAIL=your_gmail_address
GMAIL_EMAIL_PASSWORD=your_gmail_app_password

# Newsletter
MAILERLITE_API_KEY=your_mailerlite_api_key
MAILERLITE_GROUP_ID=your_mailerlite_group_id

# Google Places (Optional)
VITE_GOOGLE_PLACES=your_google_places_api_key
```

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd birdie-bands
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../src
   npm install
   ```

4. **Start the development servers**
   ```bash
   # Backend (from backend directory)
   npm run dev
   
   # Frontend (from src directory)
   npm run dev
   ```

## 🗄️ Database Schema

### Beat Model
```javascript
{
  title: String,
  artist: String,
  bpm: Number,
  key: String,
  duration: String,
  tags: [String],
  available: Boolean,
  s3_mp3_url: String,
  s3_image_url: String,
  licenses: [{
    type: String,
    price: Number,
    s3_file_url: String,
    features: [String]
  }],
  created_at: Date
}
```

### License Model
```javascript
{
  type: String,
  title: String,
  description: String,
  features: [String],
  licenseDownloadLink: String,
  licenseContract: String,
  created_at: Date
}
```

### Order Model
```javascript
{
  orderId: String,
  paymentType: String,
  stripePaymentIntentId: String,
  paypalOrderId: String,
  customerInfo: {
    name: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  items: [{
    beatId: String,
    licenseType: String,
    price: Number,
    title: String,
    artist: String,
    bpm: Number,
    key: String,
    s3_file_url: String,
    effectivePrice: Number
  }],
  totalPrice: Number,
  createdAt: Date
}
```

## 🔄 API Endpoints

### Beats
- `GET /api/beats` - Fetch paginated beats with search
- `GET /beat?beatId=:id` - Get single beat details
- `GET /api/download/:beatId` - Generate download URL for a beat
- `GET /related-beats` - Get related beats based on tags

### Payments
- `POST /api/paypal/create-order` - Create PayPal order
- `POST /api/paypal/capture-order` - Capture PayPal payment
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks

### Licenses
- `GET /api/licenses` - Fetch all available licenses
- `GET /api/licenses/download/:licenseId` - Download license agreement

### Email
- `POST /api/email` - Send email notifications
- `POST /api/mailerlite/subscribe` - Subscribe to newsletter

### Coupons
- `POST /api/coupons/validate` - Validate coupon code

## 🎨 Frontend Structure

```
src/
├── components/          # Reusable components
│   ├── ui/             # Shadcn/ui components
│   ├── MusicPlayer.tsx # Audio player component
│   ├── Navbar.tsx      # Navigation component
│   └── TrackListing.tsx# Beat listing component
├── contexts/           # React contexts
│   ├── cart-context.tsx# Shopping cart management
│   ├── PlayerContext.tsx# Audio player state
│   └── theme-provider.tsx# Theme management
├── pages/              # Page components
│   ├── Home.tsx        # Homepage
│   ├── Beats.tsx       # All beats page
│   ├── CartCheckOut.tsx# Checkout page
│   └── DownloadPage.tsx# Download page
└── types.ts            # TypeScript type definitions
```

## 💳 Payment Flow

1. User adds beats to cart with selected licenses
2. User proceeds to checkout and enters billing information
3. User selects payment method (PayPal or Stripe)
4. Payment is processed through the respective gateway
5. On successful payment:
   - Exclusive licenses mark beats as unavailable
   - Order is saved to database
   - Confirmation emails are sent to customer and admin
   - Download links are generated with 7-day expiry

## 📧 Email System

The platform sends two types of emails:

1. **Customer Confirmation**: Purchase details with download links
2. **Admin Notification**: Sales alert with order information

Emails include:
- Order details and purchased items
- Download links valid for 7 days
- PDF license contracts attached
- Professional HTML templates

## 🚀 Deployment

The application can be deployed on various platforms:

### Frontend (Netlify/Vercel)
1. Build the React app: `npm run build`
2. Deploy the `dist` folder to your chosen platform
3. Set environment variables for API endpoints

### Backend (Render/Railway)
1. Deploy the backend folder to your chosen platform
2. Set all required environment variables
3. Configure webhook endpoints for Stripe and PayPal

### Important Deployment Notes
- Ensure CORS is properly configured for your production domain
- Set up SSL certificates for secure connections
- Configure webhook endpoints in PayPal and Stripe dashboards
- Set up MongoDB connection string for production

## 📄 License Agreements

The platform generates customized PDF license agreements for each purchase using:
- Pre-designed PDF templates stored in S3
- Dynamic field population with customer and beat information
- Automatic attachment to confirmation emails

## 🔒 Security Features

- CORS configuration with allowed origins
- Secure payment processing with PCI-compliant providers
- Presigned S3 URLs with expiration for secure file access
- Environment variable protection for sensitive data
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📞 Support

For support, email contact@birdiebands.com

## 🎵 About Birdie Bands

Birdie Bands is a platform for music producers to sell their beats and for artists to discover high-quality instrumentals for their projects.
