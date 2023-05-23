const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const Tesseract = require('tesseract.js');

const app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

app.post('/ocr', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');
    const result = await Tesseract.recognize(imageBuffer, 'eng');
    const ocrText = result.data.text.replace(/[^0-9]/g, '').substring(0, 6);

    res.status(200).json({ ocrText });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(port, "0.0.0.0", function () {
  console.log(`Server is running on port ${port}`);
});


