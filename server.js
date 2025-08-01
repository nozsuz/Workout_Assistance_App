// server.js
const express = require('express');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// .envファイルから環境変数を読み込む
dotenv.config();

const app = express();
const port = 3000;

// JSONリクエストボディをパースするためのミドルウェア
app.use(express.json());
// 静的ファイル (index.html) を提供するためのミドルウェア
app.use(express.static(__dirname));

// Gemini APIの初期化
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// APIリクエストを処理するエンドポイント
app.post('/api/gemini', async (req, res) => {
    try {
        const { history, message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        
        res.json({ text });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to call Gemini API' });
    }
});

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
//     console.log('Please open your browser and navigate to this address.');
// });
module.exports = app;
