require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// CORS Middleware
app.use(cors({
  origin: process.env.FRONT_END_URL,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Manually handle preflight OPTIONS requests (Vercel needs this)
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONT_END_URL);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST route
app.post('/message', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: 'Message from your website',
      html: `
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
        <p>Message: ${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');
    return res.json({ message: 'Email sent successfully.' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to send email" });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).send('Hello from PortFolio API');
});

module.exports = app;  // <-- for Vercel

