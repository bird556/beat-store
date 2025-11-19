// backend/generators/contactEmails.js

export const generateContactEmails = (data) => {
  try {
    const { email, subject, message } = data;

    // Email to business owner
    const mailToSelf = {
      from: `"Birdie Bands" <${process.env.GMAIL_EMAIL}>`,
      replyTo: email,
      to: process.env.GMAIL_EMAIL,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
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
  <title>Birdie Bands • New Contact Message</title>
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
    h2 { font-family: RandoDisplay-Regular, Arial, sans-serif; font-size: 50px; mso-line-height-rule: exactly; line-height: 70px; color: #ffffff; margin: 0; background: none; border: 0; }
    p, a { font-family: Plaid, Arial, sans-serif; color: #ffffff; }
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
    .button-td-primary:hover, .button-a-primary:hover { background: #d6b500 !important; border-color: #d6b500 !important; }
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
</head>
<body style="margin: 0 auto !important; padding: 0 !important; background-color: #000000;">
  <div role="article" aria-roledescription="email" aria-label="New Contact Message" lang="en" dir="ltr" style="width: 100%; background-color: #000000;">
    <div style="display:none; max-height:0; overflow:hidden">New Contact Form Submission</div>
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
                              <p style="margin: 0;">New Contact Submission</p>
                            </td>
                            <td mc:edit="HEADER_RIGHT" valign="top" style="font-family: Plaid, Arial, sans-serif; font-size: 10px; mso-line-height-rule: exactly; line-height: 15px; color: #ffffff; text-align: right;">
                              <p style="margin: 0;"><a href="http://www.birdiebands.com" style="font-family: Plaid, Arial, sans-serif; font-size: 10px; mso-line-height-rule: exactly; line-height: 15px; color: #ffffff; text-decoration: none;">birdiebands.com</a></p>
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
                              <h1 style="margin: 0; background: none; border: 0; display: block; font-family: RandoDisplay-Regular, Arial, sans-serif; font-size: 24px; color: #FFD700;">New Contact Message 💌</h1>
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
                              <p mc:edit="S1_TXT" style="margin: 0;">New message from ${email}</p>
                              <p style="font-size: 14px; color: #aaaaaa; margin-top: 15px;">Subject: ${subject}</p>
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
                              <p style="margin: 0 0 15px; font-size: 18px; color: #FFD700;">Message Details:</p>
                              <p style="margin: 0; background-color: #1f1f1f; padding: 15px; border-radius: 10px; color: #f0f0f0;">${message}</p>
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
      `,
    };

    // Email to customer
    const mailToUser = {
      from: `"Birdie Bands" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: 'Thanks For Contacting Birdie Bands ✨',
      html: `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Birdie Bands • Thanks for Reaching Out!</title>
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
    h2 { font-family: RandoDisplay-Regular, Arial, sans-serif; font-size: 50px; mso-line-height-rule: exactly; line-height: 70px; color: #ffffff; margin: 0; background: none; border: 0; }
    p, a { font-family: Plaid, Arial, sans-serif; color: #ffffff; }
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
    .button-td-primary:hover, .button-a-primary:hover { background: #d6b500 !important; border-color: #d6b500 !important; }
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
</head>
<body style="margin: 0 auto !important; padding: 0 !important; background-color: #000000;">
  <div role="article" aria-roledescription="email" aria-label="Thanks for Contacting Us" lang="en" dir="ltr" style="width: 100%; background-color: #000000;">
    <div style="display:none; max-height:0; overflow:hidden">Thanks for reaching out to Birdie Bands!</div>
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
                              
                            </td>
                            <td mc:edit="HEADER_RIGHT" valign="top" style="font-family: Plaid, Arial, sans-serif; font-size: 10px; mso-line-height-rule: exactly; line-height: 15px; color: #ffffff; text-align: right;">
                              <p style="margin: 0;"><a href="http://www.birdiebands.com" style="font-family: Plaid, Arial, sans-serif; font-size: 10px; mso-line-height-rule: exactly; line-height: 15px; color: #ffffff; text-decoration: none;">birdiebands.com</a></p>
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
                              <h1 style="margin: 0; background: none; border: 0; display: block; font-family: RandoDisplay-Regular, Arial, sans-serif; font-size: 24px; color: #FFD700;">Thanks for Reaching Out! 💌</h1>
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
                              <p mc:edit="S1_TXT" style="margin: 0;">Hey there,</p>
                              <p mc:edit="S1_TXT" style="margin: 0;">Thanks for getting in touch with Birdie Bands!</p>
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
                              <p style="margin: 0 0 15px;">We've received your message and will get back to you as soon as possible. We're looking forward to connecting with you.</p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 200px 25px 0px 25px;" width="100%">
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
                  <div class="footer" style="font-family: Plaid, Arial, sans-serif; font-size: 14px; mso-line-height-rule: exactly; line-height: 18px; color: #ffffff; text-align: center; padding: 0px 20px 20px 20px;">
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
</html>`,
    };

    return { mailToSelf, mailToUser };
  } catch (error) {
    console.error('Error generating contact emails:', error);
    return null;
  }
};

// Usage in your contact form handler
const sendContactEmails = async (req, res) => {
  const { email, subject, message } = req.body;
  const emails = generateContactEmails({ email, subject, message });

  if (!emails) {
    return res.status(500).json({ message: 'Error generating emails' });
  }

  try {
    await transporter.sendMail(emails.mailToSelf);
    await transporter.sendMail(emails.mailToUser);
    return res.status(200).json({ message: 'Email(s) sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    return res.status(500).json({ message: 'Error sending emails' });
  }
};

// module.exports = { generateContactEmails, sendContactEmails };
