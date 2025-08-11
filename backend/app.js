const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// // API 예시
app.get('/api/ping', (req, res) => {
    console.log(99, req)
  res.json({ message: 'Hello from Express!' });
});

app.get('/api/{*splat}', async (req, res) => {
    res.status(500).json({ 
        url: req.originalUrl,
    });
});


// Svelte 정적 파일 서빙
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// SPA 라우팅 처리 (404 방지)
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
