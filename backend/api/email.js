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
      text: `You have a new message from:\n\n${email}\n\nMessage:\n${message}`,
    };

    const mailToUser = {
      from: `"Birdie Bands" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: 'Thank you for reaching out!',
      text: `Hi there,\n\nThank you for your message. I'll get back to you soon!\n\nBest,\nRashaun`,
    };

    await transporter.sendMail(mailToSelf);
    // await transporter.sendMail(mailToUser);

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

export default router;
