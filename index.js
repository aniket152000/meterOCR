const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');

const app = express();

const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/meter/read', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const result = await Tesseract.recognize(imagePath, 'eng', {
      tessedit_char_whitelist: '0123456789', // Specify the characters to recognize (numbers only)
    });
    //const meterReading = result.data.text.replace(/\s/g, ''); // Remove whitespace from the recognized text
    const meterReading = result.data.text.replace(/[^0-9]/g, '').substring(1,6);
    //meterReading=result.data.text.replace(/\s/g, '');

    res.json({ reading: meterReading });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

app.listen(port, "0.0.0.0", function () {
  console.log(`Server is running on port ${port}`);
});