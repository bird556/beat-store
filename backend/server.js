import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import cors from 'cors';
import emailRouter from './api/email.js';

dotenv.config();
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Route for sending email
app.use('/api/email', emailRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
