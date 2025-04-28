require("dotenv").config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 5000;

// Middleware
app.use(cors({
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    credentials: true
}));
app.use(express.json())
app.use(bodyParser.json());  // To parse JSON payloads

// Google Sheets API or Apps Script URL
const googleSheetApiUrl = 'https://script.google.com/macros/s/AKfycbx_ehmjx5rXI4Z14wMGpFgubOyc2dT89FbYYTxfSkUiZ5IJaEXMCSMya9EhDvNwk6xB/exec';
// Endpoint to handle contact form submissions
app.post('/api/v1/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Check if the required fields are present
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Prepare data to be sent to Google Sheets
    const formData = {
        name: name,
        email: email,
        message: message,
    };

    try {
        // Send the data to Google Sheets using Google Apps Script
        const response = await axios.post(googleSheetApiUrl, formData);

        // Check if Google Apps Script responded with success
        console.log(response)
        if (response.data.success) {
            return res.status(200).json({ success: true, message: 'Data successfully submitted' });
        } else {
            return res.status(500).json({ success: false, error: 'Failed to submit data' });
        }
    } catch (error) {
        console.error('Error sending data to Google Sheets:', error);
        return res.status(500).json({ success: false, error: 'Error submitting data' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is up and  running `);
});

