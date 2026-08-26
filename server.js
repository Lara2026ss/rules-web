const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Proper MIME types
express.static.mime.define({
  'image/svg+xml': ['svg'],
  'application/manifest+json': ['webmanifest']
});

// Cache control and static serving
app.use(express.static(path.join(__dirname), {
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.webmanifest')) {
      res.setHeader('Content-Type', 'application/manifest+json');
    }
  }
}));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '2.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Umas Community Rules Web 2.0 active on port ${PORT}`);
});