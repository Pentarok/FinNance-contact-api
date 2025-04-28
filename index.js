require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// CORS Middleware
app.use(cors({
  origin: process.env.FRONT_END_URL,   // e.g., http://localhost:5173
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST route to send message
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

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
