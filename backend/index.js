require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors());
app.use(express.json());

app.post('/api/analyze', upload.single('audio'), async (req, res) => {
  const audioPath = req.file.path;
  const transcript = req.body.transcript;

  const geminiPrompt = `
Bạn là giáo viên phát âm. Đây là đoạn văn gốc:\n\n"${transcript}"\n\n
Đây là phần học viên đọc lại, bạn hãy đánh giá phát âm, ngữ điệu, tốc độ. 
Đưa ra phản hồi trong 3-5 câu gọn gàng.
`;

  const geminiRes = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`,
    {
      contents: [{ parts: [{ text: geminiPrompt }] }]
    }
  );

  const feedbackText = geminiRes.data.candidates[0].content.parts[0].text;

  const elevenRes = await axios.post(
    'https://api.elevenlabs.io/v1/text-to-speech/matthew/stream',
    { text: feedbackText },
    {
      headers: {
        'xi-api-key': process.env.ELEVENLABS_API_KEY,
        'Content-Type': 'application/json'
      },
      responseType: 'arraybuffer'
    }
  );

  const audioBase64 = Buffer.from(elevenRes.data, 'binary').toString('base64');

  res.json({
    feedback: feedbackText,
    feedbackAudio: `data:audio/mpeg;base64,${audioBase64}`
  });

  fs.unlinkSync(audioPath); // cleanup
});

app.listen(3001, () => console.log('Backend listening on port 3001'));
    
