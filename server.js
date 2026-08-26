const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set custom MIME types
express.static.mime.define({
  'application/manifest+json': ['webmanifest'],
  'image/svg+xml': ['svg']
});

app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
    if (filePath.endsWith('.webmanifest')) {
      res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    }
    if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    }
  }
}));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    service: 'rules-web',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌿 Umas Community Rules Web 2.0 server running on port ${PORT}`);
});