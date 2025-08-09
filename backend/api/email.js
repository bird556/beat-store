// backend/api/email.js

import { Router } from 'express';
import nodemailer from 'nodemailer';
import { PDFDocument } from 'pdf-lib'; // Import PDF-lib
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import License from '../models/License.js';
import dotenv from 'dotenv';
import { generateContactEmails } from '../generators/contactEmails.js';
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

// Function to generate the purchase confirmation HTML email
const generatePurchaseConfirmationEmail = (data) => {
  const {
    customerName,
    orderId,
    purchaseDate,
    orderItems,
    totalPrice,
    downloadLink,
    paymentType,
  } = data;

  return `
<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
 <head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Birdie Bands • Order Complete</title>
  <style>
    @font-face {
    font-family: 'Plaid';
    font-style: normal;
    font-weight: 400;
    src: url(https://assets.stoemp-dev.com/tanneurs/Plaid.woff2) format('woff2');
    }
    @font-face {
    font-family: 'RandoDisplay-Regular';
    font-style: normal;
    font-weight: 400;
    src: url(https://assets.stoemp-dev.com/tanneurs/RandoDisplay-Regular.woff2) format('woff2');
    }
    @font-face {
    font-family: 'Zeyada';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/zeyada/v15/11hAGpPTxVPUbgZzM2ys.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    :root {
    color-scheme: light;
    supported-color-schemes: light;
    }
    html,
    body {
    margin: 0 auto !important;
    padding: 0 !important;
    height: 100% !important;
    width: 100% !important;
    }
    div[style*="margin: 16px 0"] {
    margin: 0 !important;
    }
    table,
    td {
    mso-table-lspace: 0pt !important;
    mso-table-rspace: 0pt !important;
    }
    table {
    border-spacing: 0 !important;
    border-collapse: collapse !important;
    table-layout: fixed !important;
    margin: 0 auto !important;
    }
  </style>
  <style>
    h2{
    font-family: RandoDisplay-Regular, Arial, sans-serif; font-size: 50px; mso-line-height-rule: exactly; line-height: 70px; color: #ffffff; margin: 0;background:none;border:0
    }
    p,a{
    font-family: Plaid, Arial, sans-serif; color: #ffffff;
    }
  </style>
  <style>
    a {
    text-decoration: none;
    }
    a[x-apple-data-detectors] {
    border-bottom: 0 !important;
    cursor: default !important;
    color: inherit !important;
    text-decoration: none !important;
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    }
    [x-apple-data-detectors-type="calendar-event"] {
    color: inherit !important;
    -webkit-text-decoration-color: inherit !important;
    text-decoration: none !important;
    }
    a[x-apple-data-detectors="true"] {
    color: inherit !important;
    text-decoration: inherit !important;
    }
  </style>
  <style>
      @media only screen and (min-device-width: 320px) and (max-device-width: 374px) {
      u ~ div .email-container {
      min-width: 320px !important;
      }
      }
      @media only screen and (min-device-width: 375px) and (max-device-width: 413px) {
      u ~ div .email-container {
      min-width: 375px !important;
      }
      }
      @media only screen and (min-device-width: 414px) {
      u ~ div .email-container {
      min-width: 414px !important;
      }
      }
      </style>
      <style>
      .button-td,
      .button-a {
      transition: all 100ms ease-in;
      }
      .button-td-primary:hover,
      .button-a-primary:hover {
      background: #d6b500 !important;
      border-color: #d6b500!important;
      }
      .mobile-content {
      display: none !important;
      max-height: none !important;
      mso-hide: all !important;
      height: 0 !important;
      }
    </style>
    <style>
      @media screen and (max-width: 600px) {
      .stack-column {
      display: block !important;
      width: 100% !important;
      max-width: 100% !important;
      direction: ltr !important;
      }
      .stack-column table {
      height: auto !important;
      }
      .stack-column img {
      max-width: 100% !important;
      }
      .text-left {
      text-align: left !important;
      }
      .desktop-content {
      display: none !important;
      height: 0 !important;
      }
      .mobile-content {
      display: block !important;
      width: auto !important;
      max-height: none !important;
      overflow: visible !important;
      height: 100% !important;
      }
      }
    </style>
    <style>
      ul {
      padding-left: 17px !important;
      }
      ol {
      padding-left: 20px !important;
      }
    </style>
    </head>
 <body style="margin: 0 auto !important; padding: 0 !important;background-color: #000000;">
  <div role="article" aria-roledescription="email" aria-label="Order Complete" lang="en" dir="ltr" style="width: 100%;background-color: #000000;">
   <div style="display:none;max-height:0;overflow:hidden">Your purchase is complete, Shaun. Your beats are ready for download 🎧</div>
          <div style="max-width: 680px; margin: 0 auto;">
           <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:680px; width:100% !important; max-width:680px;">
             <tr>
               <td style="background-color: #000000;">
                 <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                   <tr>
                     <td id="headerContainer">
                       <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                         <tr>
                           <td aria-hidden="true" height="25" style="background-color: #000000; font-size: 0px; line-height: 25px; height: 25px;">
                             &nbsp;
                           </td>
                         </tr>
                         <tr>
                           <td style="padding: 0 25px; background-color: #000000;" width="100%">
                             <table aria-hidden="true" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                               <tr>
                                 <td height="1" width="100%" style="font-size: 0; line-height: 0; border-top: 1px solid #ffffff;">&nbsp;</td>
                               </tr>
                             </table>
                           </td>
                         </tr>
                         <tr>
                           <td style="background-color: #000000; padding: 5px 25px 25px;">
                             <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                               <tr>
                                 <td mc:edit="HEADER_LEFT" valign="top" style="font-family: Plaid, Arial, sans-serif; font-size: 10px; mso-line-height-rule: exactly; line-height: 15px; color: #ffffff; text-align: left;">
                                   <p style="margin: 0;">
                                     Birdie Bands
                                   </p>
                                   <p style="margin: 0;">
                                     Order# ${orderId}
                                   </p>
                                                                                                 <p style="margin: 0;">
                                     Transaction Date: ${purchaseDate}
                                   </p>
                                 </td>
                                 <td mc:edit="HEADER_RIGHT" valign="top" style="font-family: Plaid, Arial, sans-serif; font-size: 10px; mso-line-height-rule: exactly; line-height: 15px; color: #ffffff; text-align: right;">
                                   <p style="margin: 0;"><a href="http://www.birdiebands.com" style="font-family: Plaid, Arial, sans-serif; font-size: 10px; mso-line-height-rule: exactly; line-height: 15px; color: #ffffff;text-decoration:none">birdiebands.com</a></p>
                                 </td>
                               </tr>
                             </table>
                           </td>
                         </tr>
                         <tr>
                           <td style="background-color: #000000; padding: 25px 25px;">
                             <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                               <tr>
                                 <td align="center">
                                   <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                     <tr>
                                       <td align="center" style="text-align: center;">
                                         <img mc:edit="LOGO_IMG" alt="Birdie Bands Logo" src="https://birdie-public-bucket.s3.us-east-1.amazonaws.com/LOGOS/BirdieBands+Brand+Logo+Transparent.png" width="226" style="max-width: 126px; display: block; border: 0; margin: 0 auto;" />
                                       </td>
                                     </tr>
                                   </table>
                                 </td>
                               </tr>
                             </table>
                           </td>
                         </tr>
                       </table>
                     </td>
                   </tr>
                   <tr>
                     <td id="bodyContainer"  align="center" style="background-color: #000000; padding: 0 0 50px;">
                       <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                         <tr>
                           <td align="center" style="padding: 25px 25px 20px;">
                             <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                               <tr>
                                 <td align="center" style="text-align: center;">
                                   <h1 style="margin:0;background:none;border:0;display:block;font-family:RandoDisplay-Regular, Arial, sans-serif;font-size:24px; color:#FFD700;">Order Complete</h1>
                                 </td>
                               </tr>
                             </table>
                           </td>
                         </tr>
                         <tr>
                           <td style="padding: 10px 25px;">
                             <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                               <tr>
                                 <td style="font-family: Plaid, Arial, sans-serif; font-size: 18px; mso-line-height-rule: exactly; line-height: 21px; color: #ffffff; text-align: center;">
                                   <p mc:edit="S1_TXT" style="margin: 0;">
                                     Your purchase is complete, ${
                                       customerName.split(' ')[0]
                                     }.
                                   </p>
                                                                                                 <p mc:edit="S1_TXT" style="margin: 0;">Your beats are ready for download 🎧
                                   </p>
                                   <p style="font-size: 14px; color: #aaaaaa; margin-top: 15px;">Order ID: ${orderId}</p>
                                 </td>
                               </tr>
                             </table>
                           </td>
                         </tr>
                         <tr>
                           <td style="padding: 25px;">
                             <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                               <tr>
                                 <td align="center" style="font-family: Plaid, Arial, sans-serif; font-size: 16px; mso-line-height-rule: exactly; line-height: 20px; color: #ffffff; text-align: left;">
                                   <ul style="margin: 0; padding: 0; list-style-type: none;">
                                   ${orderItems
                                     .map(
                                       (item) => `
                                           <li style="margin-bottom: 15px; background-color: #1f1f1f; padding: 15px; border-radius: 10px;">
                                               <p style="margin: 0; font-size: 16px; color: #f0f0f0;">${
                                                 item.title
                                               } - $${item.price.toFixed(2)}</p>
                                               <p style="margin: 0px 0 0; font-size: 14px; color: #bbb;">${
                                                 item.bpm || 'N/A'
                                               } BPM | Key: ${
                                         item.key || 'N/A'
                                       }</p>
                                               <p style="margin: 0px 0 0; font-size: 14px; color: #bbb;">License: ${
                                                 item.licenseType
                                               }</p>
                                           </li>
                                           `
                                     )
                                     .join('')}
                                   </ul>
                                   <p style="margin: 20px 0 0; font-size: 18px; color: #FFD700; text-align: right;">Total Price: $${totalPrice}</p>
                                 </td>
                               </tr>
                             </table>
                           </td>
                         </tr>
                         <tr>
                           <td align="center" style="padding: 50px 25px;">
                             <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                               <tr>
                                 <td align="center">
                                   <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0">
                                       <tr>
                                         <td mc:edit="S1_CTA" style="background-color: #FFD700;font-family: Plaid, Arial, sans-serif;font-size: 16px;mso-line-height-rule: exactly;line-height: 16px;text-decoration: none;padding: 20px 40px;mso-padding-alt: 20px 0;color: #121212; font-weight: bold;border-radius: 50px; text-transform: uppercase">
                                           <a class="button-a button-a-primary" href="${downloadLink}" style="background-color: #FFD700;font-family: Plaid, Arial, sans-serif;font-size: 16px;mso-line-height-rule: exactly;line-height: 16px;text-decoration: none;
                                             color: #121212; font-weight: bold;display: block;
                                             border-radius: 50px; text-transform: uppercase;">Download Your Beats
                                           </a>
                                         </td>
                                       </tr>
                                     </table>
                                     </td>
                               </tr>
                               <tr>
                                 <td align="center" style="font-family: Plaid, Arial, sans-serif; font-size: 13px; mso-line-height-rule: exactly; line-height: 15px; color: #888; text-align: center; padding: 8px 0;"
                                   >
                                   <p style="margin: 0;">Valid for 7 days</p>
                                 </td>
                               </tr>
                             </table>
                           </td>
                         </tr>
                         <tr>
                           <td style="padding: 25px 25px;" width="100%">
                             <table aria-hidden="true" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                               <tr>
                                 <td height="1" width="100%" style="font-size: 0; line-height: 0; border-top: 1px solid #ffffff;">&nbsp;</td>
                               </tr>
                             </table>
                           </td>
                         </tr>
                       </table>
                     </td>
                   </tr>
                   <tr>
                     <td id="footerContainer" align="center" style="font-size: 0; background-color: #000000;">
                       <div class="footer" style="font-family: Plaid, Arial, sans-serif; font-size: 14px; mso-line-height-rule: exactly; line-height: 18px; color: #ffffff; text-align: center; padding: 20px;">
                         &copy; 2025 Birdie Bands<br>
                         <a href="https://birdiebands.com/" style="color: #FFD700; text-decoration: none;">Beat Store</a> |
                         <a href="https://www.instagram.com/birdiebands" style="color: #FFD700; text-decoration: none;">Instagram</a> |
                         <a href="https://www.youtube.com/@birdiebands?sub_confirmation=1" style="color: #FFD700; text-decoration: none;">YouTube</a> |
                         <a href="https://open.spotify.com/artist/44CuCf1NgVzB4fPiAgpNoQ" style="color: #FFD700; text-decoration: none;">Spotify</a>
                       </div>
                     </td>
                   </tr>
                 </table>
               </td>
             </tr>
           </table>
          </div>
          </div>
 </body>
</html>
  `;
};

// Function to generate the sales-focused email
const generateSaleConfirmationEmail = (data) => {
  try {
    const {
      customerName,
      orderId,
      purchaseDate,
      orderItems,
      totalPrice,
      downloadLink,
      paymentType,
    } = data;

    // 2. Generate the HTML email with the new sales-focused message and download link
    return `
<!DOCTYPE html>
      <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <title>Birdie Bands • New Sale! 💸</title>
        <style>
          @font-face { font-family: 'Plaid'; font-style: normal; font-weight: 400; src: url(https://assets.stoemp-dev.com/tanneurs/Plaid.woff2) format('woff2'); }
          @font-face { font-family: 'RandoDisplay-Regular'; font-style: normal; font-weight: 400; src: url(https://assets.stoemp-dev.com/tanneurs/RandoDisplay-Regular.woff2) format('woff2'); }
          @font-face { font-family: 'Zeyada'; font-style: normal; font-weight: 400; font-display: swap; src: url(https://fonts.gstatic.com/s/zeyada/v15/11hAGpPTxVPUbgZzM2ys.woff2) format('woff2'); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
          :root { color-scheme: light; supported-color-schemes: light; }
          html, body { margin: 0 auto !important; padding: 0 !important; height: 100% !important; width: 100% !important; }
          div[style*="margin: 16px 0"] { margin: 0 !important; }
          table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }
          table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; }
        </style>
        <style>
          h2{ font-family: RandoDisplay-Regular, Arial, sans-serif; font-size: 50px; mso-line-height-rule: exactly; line-height: 70px; color: #ffffff; margin: 0;background:none;border:0 }
          p,a{ font-family: Plaid, Arial, sans-serif; color: #ffffff; }
        </style>
        <style>
          a { text-decoration: none; }
          a[x-apple-data-detectors] { border-bottom: 0 !important; cursor: default !important; color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
          [x-apple-data-detectors-type="calendar-event"] { color: inherit !important; -webkit-text-decoration-color: inherit !important; text-decoration: none !important; }
          a[x-apple-data-detectors="true"] { color: inherit !important; text-decoration: inherit !important; }
        </style>
        <style>
          @media only screen and (min-device-width: 320px) and (max-device-width: 374px) { u ~ div .email-container { min-width: 320px !important; } }
          @media only screen and (min-device-width: 375px) and (max-device-width: 413px) { u ~ div .email-container { min-width: 375px !important; } }
          @media only screen and (min-device-width: 414px) { u ~ div .email-container { min-width: 414px !important; } }
        </style>
        <style>
          .button-td, .button-a { transition: all 100ms ease-in; }
          .button-td-primary:hover, .button-a-primary:hover { background: #d6b500 !important; border-color: #d6b500!important; }
          .mobile-content { display: none !important; max-height: none !important; mso-hide: all !important; height: 0 !important; }
        </style>
        <style>
          @media screen and (max-width: 600px) {
            .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important; }
            .stack-column table { height: auto !important; }
            .stack-column img { max-width: 100% !important; }
            .text-left { text-align: left !important; }
            .desktop-content { display: none !important; height: 0 !important; }
            .mobile-content { display: block !important; width: auto !important; max-height: none !important; overflow: visible !important; height: 100% !important; }
          }
        </style>
        <style>
          ul { padding-left: 17px !important; }
          ol { padding-left: 20px !important; }
        </style>
      </head>
      <body style="margin: 0 auto !important; padding: 0 !important;background-color: #000000;">
        <div role="article" aria-roledescription="email" aria-label="New Sale" lang="en" dir="ltr" style="width: 100%;background-color: #000000;">
          <div style="display:none;max-height:0;overflow:hidden">You've made a new sale! 💰</div>
          <div style="max-width: 680px; margin: 0 auto;">
            <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" style="width:680px; width:100% !important; max-width:680px;">
              <tr>
                <td style="background-color: #000000;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td id="headerContainer">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td aria-hidden="true" height="25" style="background-color: #000000; font-size: 0px; line-height: 25px; height: 25px;"> </td>
                          </tr>
                          <tr>
                            <td style="padding: 0 25px; background-color: #000000;" width="100%">
                              <table aria-hidden="true" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                                <tr>
                                  <td height="1" width="100%" style="font-size: 0; line-height: 0; border-top: 1px solid #ffffff;"> </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #000000; padding: 5px 25px 25px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                                <tr>
                                  <td mc:edit="HEADER_LEFT" valign="top" style="font-family: Plaid, Arial, sans-serif; font-size: 10px; mso-line-height-rule: exactly; line-height: 15px; color: #ffffff; text-align: left;">
                                    <p style="margin: 0;">Birdie Bands</p>
                                    <p style="margin: 0;">Order# ${orderId}</p>
                                    <p style="margin: 0;">Transaction Date: ${purchaseDate}</p>
                                    <p style="margin: 0;">Payment: ${
                                      paymentType || 'N/A'
                                    }</p>
                                  </td>
                                  <td mc:edit="HEADER_RIGHT" valign="top" style="font-family: Plaid, Arial, sans-serif; font-size: 10px; mso-line-height-rule: exactly; line-height: 15px; color: #ffffff; text-align: right;">
                                    <p style="margin: 0;"><a href="http://www.birdiebands.com" style="font-family: Plaid, Arial, sans-serif; font-size: 10px; mso-line-height-rule: exactly; line-height: 15px; color: #ffffff;text-decoration:none">birdiebands.com</a></p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="background-color: #000000; padding: 25px 25px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td align="center">
                                    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                      <tr>
                                        <td align="center" style="text-align: center;">
                                          <img mc:edit="LOGO_IMG" alt="Birdie Bands Logo" src="https://birdie-public-bucket.s3.us-east-1.amazonaws.com/LOGOS/BirdieBands+Brand+Logo+Transparent.png" width="226" style="max-width: 126px; display: block; border: 0; margin: 0 auto;" />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td id="bodyContainer" align="center" style="background-color: #000000; padding: 0 0 50px;">
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td align="center" style="padding: 25px 25px 20px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td align="center" style="text-align: center;">
                                    <h1 style="margin:0;background:none;border:0;display:block;font-family:RandoDisplay-Regular, Arial, sans-serif;font-size:24px; color:#FFD700;">Beat Sale 💸</h1>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 10px 25px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
                                <tr>
                                  <td style="font-family: Plaid, Arial, sans-serif; font-size: 18px; mso-line-height-rule: exactly; line-height: 21px; color: #ffffff; text-align: center;">
                                    <p mc:edit="S1_TXT" style="margin: 0;">
                                      Congratulations! You've made a new sale from ${customerName}!
                                    </p>
                                    <p mc:edit="S1_TXT" style="margin: 0;">You're making beats and money 🤑</p>
                                    <p style="font-size: 14px; color: #aaaaaa; margin-top: 15px;">Order ID: ${orderId}</p>
                                    <p style="font-size: 14px; color: #aaaaaa; margin-top: 5px;">Payment Type: ${
                                      paymentType || 'N/A'
                                    }</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 25px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td align="center" style="font-family: Plaid, Arial, sans-serif; font-size: 16px; mso-line-height-rule: exactly; line-height: 20px; color: #ffffff; text-align: left;">
                                    <p style="margin: 0 0 15px; font-size: 18px; color: #FFD700;">Order Details:</p>
                                    <ul style="margin: 0; padding: 0; list-style-type: none;">
                                      ${orderItems
                                        .map(
                                          (item) => `
                                        <li style="margin-bottom: 15px; background-color: #1f1f1f; padding: 15px; border-radius: 10px;">
                                          <p style="margin: 0; font-size: 16px; color: #f0f0f0;">${
                                            item.title
                                          } - $${item.price.toFixed(2)}</p>
                                          <p style="margin: 0px 0 0; font-size: 14px; color: #bbb;">${
                                            item.bpm || 'N/A'
                                          } BPM | Key: ${item.key || 'N/A'}</p>
                                          <p style="margin: 0px 0 0; font-size: 14px; color: #bbb;">License: ${
                                            item.licenseType
                                          }</p>
                                        </li>
                                      `
                                        )
                                        .join('')}
                                    </ul>
                                    <p style="margin: 20px 0 0; font-size: 18px; color: #FFD700; text-align: right;">Total Price: $${totalPrice}</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="padding: 50px 25px;">
                              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                  <td align="center">
                                    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0">
                                      <tr>
                                        <td mc:edit="S1_CTA" style="background-color: #FFD700;font-family: Plaid, Arial, sans-serif;font-size: 16px;mso-line-height-rule: exactly;line-height: 16px;text-decoration: none;padding: 20px 40px;mso-padding-alt: 20px 0;color: #121212; font-weight: bold;border-radius: 50px; text-transform: uppercase">
                                          <a class="button-a button-a-primary" href="${downloadLink}" style="background-color: #FFD700;font-family: Plaid, Arial, sans-serif;font-size: 16px;mso-line-height-rule: exactly;line-height: 16px;text-decoration: none;
                                             color: #121212; font-weight: bold;display: block;
                                             border-radius: 50px; text-transform: uppercase;">View Download Link
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" style="font-family: Plaid, Arial, sans-serif; font-size: 13px; mso-line-height-rule: exactly; line-height: 15px; color: #888; text-align: center; padding: 8px 0;"
                                    >
                                    <p style="margin: 0;">Valid for 7 days</p>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 25px 25px;" width="100%">
                              <table aria-hidden="true" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                                <tr>
                                  <td height="1" width="100%" style="font-size: 0; line-height: 0; border-top: 1px solid #ffffff;"> </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td id="footerContainer" align="center" style="font-size: 0; background-color: #000000;">
                        <div class="footer" style="font-family: Plaid, Arial, sans-serif; font-size: 14px; mso-line-height-rule: exactly; line-height: 18px; color: #ffffff; text-align: center; padding: 20px;">
                          © 2025 Birdie Bands<br>
                          <a href="https://birdiebands.com/" style="color: #FFD700; text-decoration: none;">Beat Store</a> |
                          <a href="https://www.instagram.com/birdiebands" style="color: #FFD700; text-decoration: none;">Instagram</a> |
                          <a href="https://www.youtube.com/@birdiebands?sub_confirmation=1" style="color: #FFD700; text-decoration: none;">YouTube</a> |
                          <a href="https://open.spotify.com/artist/44CuCf1NgVzB4fPiAgpNoQ" style="color: #FFD700; text-decoration: none;">Spotify</a>
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </body>
      </html>
    `;
  } catch (error) {
    console.error('Error generating sales confirmation email:', error);
    return null;
  }
};

// --- Your generateContractPdf function ---
async function generateContractPdf(item, customerName) {
  // console.log('item from generateContractPdf', item);
  // console.log('customerName from generateContractPdf', customerName);
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

  const beatName = item.title;
  const leaseType = item.licenseType;
  const pricePaidText = `${item.price.toFixed(2)}`;

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
    case 'Basic':
      contractTitlePrefix = 'Basic Lease';
      break;
    case 'Premium':
      contractTitlePrefix = 'Premium Lease';
      break;

    case 'Professional':
      contractTitlePrefix = 'Professional Lease';
      break;
    case 'Legacy':
      contractTitlePrefix = 'Legacy Lease';
      break;
    case 'Exclusive':
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
  // Ensure these field names match EXACTLY what you set in Adobe Acrobat Pro
  //   form.getTextField('effective_date_italic').setText(effectiveDate);
  form.getTextField('effective_date').setText(effectiveDate);
  form.getTextField('licensee_full_name').setText(customerName);
  form.getTextField('composition_title').setText(beatName);
  //   form.getTextField('licensor_name').setText('Rashaun Bennett'); // For Licensor name in intro and ownership split
  //   form.getTextField('producer_name').setText(producerName); // For credit section

  form.getTextField('license_fee').setText(`$${pricePaidText}`); // For License Fee in intro
  form.getTextField('license_writer').setText(`${customerName} (50%)`); // For License Fee in intro
  // If you have other price fields (e.g., in a "Consideration" section), ensure they are named and filled
  // For now, we'll assume 'license_fee' is the primary price field.

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
    const { email, subject, message, template, data } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_EMAIL_PASSWORD,
      },
    });

    let htmlContent;
    let htmlSaleConfirmationContent;
    const attachments = [];
    // for (const item of data.orderItems) {
    //   try {
    //     const pdfAttachment = await generateContractPdf(
    //       item,
    //       data.customerName
    //     );
    //     attachments.push(pdfAttachment);
    //   } catch (pdfError) {
    //     console.error(
    //       `Error generating PDF for item ${item.description} (${item.leaseType}):`,
    //       pdfError
    //     );
    //   }
    // }
    if (template === 'purchaseConfirmation' || subject.includes('Purchase')) {
      for (const item of data.orderItems) {
        try {
          const pdfAttachment = await generateContractPdf(
            item,
            data.customerName
          );
          attachments.push(pdfAttachment);
        } catch (pdfError) {
          console.error(
            `Error generating PDF for item ${item.description} (${item.leaseType}):`,
            pdfError
          );
        }
      }
    }
    if (template === 'purchaseConfirmation') {
      htmlContent = generatePurchaseConfirmationEmail(data);
      htmlSaleConfirmationContent = generateSaleConfirmationEmail(data);
    } else if (subject.includes('Purchase')) {
      // Fallback for older webhook requests (can remove this block once updated)
      htmlContent = `
        <div style="font-family:Arial,sans-serif; color:#333; line-height:1.6;">
          <h2>Thank You for Your Purchase!</h2>
          <p>Your order ID: ${
            message.match(/Your order ID: ([^ \n]+)/)?.[1] || 'N/A'
          }</p>
          <h3>Purchased Beats:</h3>
          <ul>
            ${message
              .split('\n')
              .filter((line) => line.startsWith('- '))
              .map((line) => `<li>${line.replace('- ', '')}</li>`)
              .join('')}
          </ul>
          <p>Download your files here: <a href="${
            message.match(/Download your files here: ([^\n]+)/)?.[1] || '#'
          }">${
        message.match(/Download your files here: ([^\n]+)/)?.[1] || 'Download'
      }</a></p>
          <p>This link is valid for 7 days.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ccc;" />
          <p style="font-size:15px;">
            🔗 <strong>Quick Links:</strong><br/>
            🎧 <a href="https://open.spotify.com/artist/44CuCf1NgVzB4fPiAgpNoQ" style="color:#1DB954;">Spotify Artist Page</a><br/>
            📺 <a href="https://www.youtube.com/@BIRDIEBANDS" style="color:#FF0000;">YouTube Channel</a><br/>
            🛒 <a href="https://www.birdiebands.com" style="color:#FFA500;">Beat Store</a><br/>
            📸 <a href="https://instagram.com/birdiebands" style="color:#C13584;">Instagram</a>
          </p>
        </div>
      `;
      htmlSaleConfirmationContent = `
        <div style="font-family:Arial,sans-serif; color:#333; line-height:1.6;">
          <h2>Congratulations, you made a sale 💸</h2>
          <p>Order ID: ${
            message.match(/Your order ID: ([^ \n]+)/)?.[1] || 'N/A'
          }</p>
          <h3>Purchased Beats:</h3>
          <ul>
            ${message
              .split('\n')
              .filter((line) => line.startsWith('- '))
              .map((line) => `<li>${line.replace('- ', '')}</li>`)
              .join('')}
          </ul>
          <p>Download Link: <a href="${
            message.match(/Download your files here: ([^\n]+)/)?.[1] || '#'
          }">${
        message.match(/Download your files here: ([^\n]+)/)?.[1] || 'Download'
      }</a></p>
          <p>This link is valid for 7 days.</p>
          <hr style="margin: 24px 0; border: none; border-top: 1px solid #ccc;" />
          <p style="font-size:15px;">
            🔗 <strong>Quick Links:</strong><br/>
            🎧 <a href="https://open.spotify.com/artist/44CuCf1NgVzB4fPiAgpNoQ" style="color:#1DB954;">Spotify Artist Page</a><br/>
            📺 <a href="https://www.youtube.com/@BIRDIEBANDS" style="color:#FF0000;">YouTube Channel</a><br/>
            🛒 <a href="https://www.birdiebands.com" style="color:#FFA500;">Beat Store</a><br/>
            📸 <a href="https://instagram.com/birdiebands" style="color:#C13584;">Instagram</a>
          </p>
        </div>
      `;
    } else {
      // Contact form emails using generateContactEmails
      const emails = generateContactEmails({ email, subject, message });

      if (!emails) {
        return res
          .status(500)
          .json({ error: 'Failed to generate contact emails' });
      }

      await transporter.sendMail(emails.mailToSelf);
      await transporter.sendMail(emails.mailToUser);
      return res.status(200).json({ message: 'Email(s) sent successfully' });
    }

    if (htmlContent) {
      const mailOptions = {
        from: `"Birdie Bands" <${process.env.GMAIL_EMAIL}>`,
        to: email,
        subject,
        html: htmlContent,
        attachments: attachments,
      };

      const mailOptionToSelf = {
        from: `"www.BirdieBands.com" <${process.env.GMAIL_EMAIL}>`,
        to: process.env.GMAIL_EMAIL,
        subject: `Beat Sale 💸 (Order #${data.orderId.slice(0, 4)}...)`,
        html: htmlSaleConfirmationContent,
        attachments: attachments,
      };
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(mailOptionToSelf);
    }

    res.status(200).json({ message: 'Email(s) sent successfully' });
  } catch (error) {
    console.error('Email send error:'.red, error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

export default router;
