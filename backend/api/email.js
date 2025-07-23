import { Router } from 'express';
import nodemailer from 'nodemailer';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_EMAIL_PASSWORD,
      },
    });

    const mailToSelf = {
      from: `"www.BirdieBands.com" <${process.env.GMAIL_EMAIL}>`,
      replyTo: email,
      to: process.env.GMAIL_EMAIL,
      subject: `${subject}`,
      text: `You have a new message from:\n${email}\n\nMessage:\n${message}`,
    };

    const mailToUser = {
      from: `"Birdie Bands" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: 'Thanks For Contacting Birdie Bands ✨🎶',
      html: `
  <p>Hey there,</p>

  <p>Thank you for reaching out! I appreciate your interest in my work — whether it's about purchasing a beat, collaborating on a project, or anything in between.</p>

  <p>I’ll review your message and get back to you as soon as possible.</p>

  <p>In the meantime, feel free to check out more of my catalog, stay connected on socials, or hit reply if you’ve got more details to share.</p>

  <p>Looking forward to building something dope together.</p>

  <br/>
  <p>Respect,<br/>Birdie Bands</p>

  <hr style="margin: 24px 0; border: none; border-top: 1px solid #ccc;" />

  <p>
    🔗 <strong>Quick Links:</strong><br/>
    🎧 <a href="https://open.spotify.com/artist/44CuCf1NgVzB4fPiAgpNoQ" target="_blank" rel="noopener noreferrer">Spotify Artist Page</a><br/>
    📺 <a href="https://www.youtube.com/@birdiebands" target="_blank" rel="noopener noreferrer">YouTube Channel</a><br/>
    🛒 <a href="https://www.birdiebands.com" target="_blank" rel="noopener noreferrer">Beat Store</a>
  </p>
`,
    };

    await transporter.sendMail(mailToSelf);
    await transporter.sendMail(mailToUser);

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

export default router;
