const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '64kb' }));

express.static.mime.define({
  'application/manifest+json': ['webmanifest'],
  'image/svg+xml': ['svg']
});

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src * 'unsafe-inline' 'unsafe-eval'; style-src * 'unsafe-inline'; font-src * data:; img-src * data: blob:; media-src * data: blob:; connect-src *;"
  );
  next();
});

app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

const VALID_RULES = {
  '01': { title: 'Dignidad, Trato Digno y Respeto Incondicional', category: 'conducta', maxPts: 30, defaultLev: 3 },
  '02': { title: 'Prevención de Acoso, Hostigamiento y Asedio', category: 'conducta', maxPts: 40, defaultLev: 4 },
  '03': { title: 'Control de Spam, Flood y Ruido Visual', category: 'comunicacion', maxPts: 20, defaultLev: 2 },
  '04': { title: 'Publicidad, Autopromoción y Enlaces Externos', category: 'comunicacion', maxPts: 40, defaultLev: 3 },
  '05': { title: 'Igualdad Normativa y Cero Privilegios', category: 'comunidad', maxPts: 10, defaultLev: 1 }
};

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    rulesCount: Object.keys(VALID_RULES).length
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌸 Sakura Paradise Rules Web running on port ${PORT}`);
  });
}

module.exports = app;
