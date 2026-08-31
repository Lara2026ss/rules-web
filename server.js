const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const app = express();
const PORT = process.env.PORT || 3000;

// Body parser with payload limit
app.use(express.json({ limit: '64kb' }));

// Set custom MIME types
express.static.mime.define({
  'application/manifest+json': ['webmanifest'],
  'image/svg+xml': ['svg']
});

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; media-src 'self'; connect-src 'self' https:;"
  );
  next();
});

// Static Assets Serving
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html') || filePath.endsWith('sw.js')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
    if (filePath.endsWith('.webmanifest')) {
      res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
    }
    if (filePath.endsWith('.svg')) {
      res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
    }
  }
}));

// In-Memory Rate Limiter
const rateLimitMap = new Map();
function checkRateLimit(ip, maxRequests = 30, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
  } else {
    record.count++;
  }
  rateLimitMap.set(ip, record);
  return record.count <= maxRequests;
}

// In-Memory Audit Log & Metrics Storage
const AUDIT_LOGS = [];
const METRICS = {
  totalSearches: 0,
  searchesByCategory: {},
  ruleViews: {},
  quizCompletions: 0,
  reportsSubmitted: 0
};

// Official Rules Master Dataset for Validation
const VALID_RULES = {
  '01': { title: 'Dignidad, Trato Digno y Respeto Incondicional', category: 'conducta', maxPts: 30, defaultLev: 3 },
  '02': { title: 'Prevención de Acoso, Hostigamiento y Asedio', category: 'conducta', maxPts: 40, defaultLev: 4 },
  '03': { title: 'Control de Spam, Flood y Ruido Visual', category: 'comunicacion', maxPts: 20, defaultLev: 2 },
  '04': { title: 'Publicidad, Autopromoción y Enlaces Externos', category: 'comunicacion', maxPts: 40, defaultLev: 3 },
  '05': { title: 'Igualdad Normativa y Cero Privilegios', category: 'comunidad', maxPts: 10, defaultLev: 1 },
  '06': { title: 'Uso Coherente de Canales Temáticos', category: 'comunicacion', maxPts: 10, defaultLev: 1 },
  '07': { title: 'Confort Auditivo y Etiqueta en Canales de Voz', category: 'comunicacion', maxPts: 40, defaultLev: 3 },
  '08': { title: 'Consentimiento en Grabaciones y Transmisiones', category: 'seguridad', maxPts: 50, defaultLev: 4 },
  '09': { title: 'Canalización Correcta de Comandos de Bots', category: 'comunicacion', maxPts: 10, defaultLev: 1 },
  '10': { title: 'Etiquetado Obligatorio y Protección de Spoilers', category: 'comunicacion', maxPts: 10, defaultLev: 1 },
  '11': { title: 'Doxxing y Filtración de Datos Privados (Tolerancia Cero)', category: 'seguridad', maxPts: 100, defaultLev: 5 },
  '12': { title: 'Estafas, Phishing, Malware y Enlaces Engañosos', category: 'seguridad', maxPts: 100, defaultLev: 5 },
  '13': { title: 'Protección de Menores y Contenido Ilícito', category: 'seguridad', maxPts: 100, defaultLev: 5 },
  '14': { title: 'Amenazas, Extorsión, Incursiones (Raids) y Sabotaje', category: 'seguridad', maxPts: 100, defaultLev: 5 },
  '15': { title: 'Evasión de Sanciones Mediante Cuentas Secundarias (Alts)', category: 'comunidad', maxPts: 100, defaultLev: 4 },
  'M1': { title: 'Mediación Formativa y Desescalada de Conflictos', category: 'moderacion', maxPts: 0, defaultLev: 1 },
  'M2': { title: 'Imparcialidad y Cero Conflicto de Interés', category: 'moderacion', maxPts: 0, defaultLev: 1 },
  'M3': { title: 'Preservación de Evidencias y Auditoría de Sanciones', category: 'moderacion', maxPts: 0, defaultLev: 1 },
  'M4': { title: 'Supervisión y Canal para Reportar Moderación', category: 'moderacion', maxPts: 0, defaultLev: 1 },
  'D1': { title: 'Presunción de Buena Fe y Revisión Imparcial', category: 'comunidad', maxPts: 0, defaultLev: 1 },
  'D2': { title: 'Privacidad Inviolable y No Intromisión', category: 'seguridad', maxPts: 0, defaultLev: 1 },
  'D3': { title: 'Derecho a Petición y Sugerencias Comunitarias', category: 'comunidad', maxPts: 0, defaultLev: 1 }
};

// ── API: Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    version: '3.0.0',
    service: 'rules-web',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ── API: Moderation Report (Staff Only) ──
app.post('/api/moderation/report', async (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  if (!checkRateLimit(clientIp, 10, 60000)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Espera un momento antes de volver a enviar un reporte.' });
  }

  const staffKey = req.headers['x-staff-key'] || req.headers['authorization'];
  const expectedKey = process.env.STAFF_API_KEY || 'umas-staff-2026';
  
  if (!staffKey || staffKey.replace('Bearer ', '').trim() !== expectedKey) {
    return res.status(401).json({ error: 'No autorizado. Se requiere clave de Staff válida.' });
  }

  const { targetUser, ruleId, severity, points, reason, moderatorTag } = req.body || {};

  // Strict Validation
  if (!targetUser || typeof targetUser !== 'string' || targetUser.trim().length < 2 || targetUser.trim().length > 64) {
    return res.status(400).json({ error: 'Usuario objetivo inválido (debe tener entre 2 y 64 caracteres).' });
  }

  const cleanRuleId = String(ruleId || '').replace('#', '').trim();
  const ruleData = VALID_RULES[cleanRuleId];
  if (!ruleData) {
    return res.status(400).json({ error: `Regla ID "${ruleId}" no existe en el catálogo oficial.` });
  }

  const numSev = parseInt(severity, 10);
  if (isNaN(numSev) || numSev < 1 || numSev > 5) {
    return res.status(400).json({ error: 'Nivel de severidad inválido (debe ser entre 1 y 5).' });
  }

  const numPts = parseInt(points, 10);
  if (isNaN(numPts) || numPts < 0 || numPts > 100) {
    return res.status(400).json({ error: 'Puntos inválidos (debe estar en el rango 0 a 100).' });
  }

  if (!reason || typeof reason !== 'string' || reason.trim().length < 8 || reason.trim().length > 1000) {
    return res.status(400).json({ error: 'El motivo es obligatorio (mínimo 8 caracteres, máximo 1000).' });
  }

  const modName = (moderatorTag && typeof moderatorTag === 'string') ? moderatorTag.slice(0, 50).trim() : 'Moderador Anónimo';

  // Compute Embed Color based on severity
  const severityColors = {
    1: 0x34d399, // Green
    2: 0x6ee7b7, // Mint
    3: 0xfbbf24, // Gold / Yellow
    4: 0xf97316, // Orange
    5: 0xef4444  // Red
  };

  const color = severityColors[numSev] || 0x10b981;

  const reportRecord = {
    id: `REP-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    targetUser: targetUser.trim(),
    ruleId: `#${cleanRuleId}`,
    ruleTitle: ruleData.title,
    severity: numSev,
    points: numPts,
    reason: reason.trim(),
    moderator: modName,
    status: 'recorded'
  };

  // Add to Audit Log (limit 500)
  AUDIT_LOGS.unshift(reportRecord);
  if (AUDIT_LOGS.length > 500) AUDIT_LOGS.pop();
  METRICS.reportsSubmitted++;

  // Dispatch Discord Webhook if configured
  const webhookUrl = process.env.DISCORD_MODERATION_WEBHOOK_URL;
  if (webhookUrl && webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
    try {
      const payload = JSON.stringify({
        username: 'Umas Moderation System',
        avatar_url: 'https://rules-web.onrender.com/favicon.svg',
        embeds: [{
          title: `🛡️ Informe Disciplinario Oficial · #${cleanRuleId}`,
          description: `**Regla Aplicada:** ${ruleData.title}\n**Motivo:**\n> ${reason.trim()}`,
          color: color,
          fields: [
            { name: '👤 Usuario Infractor', value: targetUser.trim(), inline: true },
            { name: '📊 Puntos / Severidad', value: `${numPts} PTS (Nivel ${numSev})`, inline: true },
            { name: '🧑⚖️ Moderador Responsable', value: modName, inline: true }
          ],
          footer: { text: `ID: ${reportRecord.id} • Umas Rules Web 3.0` },
          timestamp: new Date().toISOString()
        }]
      });

      const urlObj = new URL(webhookUrl);
      const reqDiscord = https.request({
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      });

      reqDiscord.on('error', (err) => {
        console.error('⚠️ Discord Webhook Delivery Failed:', err.message);
      });
      reqDiscord.write(payload);
      reqDiscord.end();
    } catch (err) {
      console.error('⚠️ Error building webhook request:', err.message);
    }
  }

  res.json({
    success: true,
    message: 'Informe de moderación registrado con éxito.',
    report: reportRecord
  });
});

// ── API: Moderation Audit Log (Staff Only) ──
app.get('/api/moderation/audit', (req, res) => {
  const staffKey = req.headers['x-staff-key'] || req.headers['authorization'];
  const expectedKey = process.env.STAFF_API_KEY || 'umas-staff-2026';
  
  if (!staffKey || staffKey.replace('Bearer ', '').trim() !== expectedKey) {
    return res.status(401).json({ error: 'No autorizado.' });
  }

  res.json({
    total: AUDIT_LOGS.length,
    reports: AUDIT_LOGS.slice(0, 50)
  });
});

// ── API: Anonymous Events Ingestion ──
app.post('/api/events', (req, res) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  if (!checkRateLimit(clientIp, 40, 60000)) {
    return res.status(429).json({ error: 'Rate limit exceeded.' });
  }

  const { event, data } = req.body || {};
  if (event === 'search') {
    METRICS.totalSearches++;
    if (data && data.category) {
      METRICS.searchesByCategory[data.category] = (METRICS.searchesByCategory[data.category] || 0) + 1;
    }
  } else if (event === 'rule_view' && data && data.ruleId) {
    METRICS.ruleViews[data.ruleId] = (METRICS.ruleViews[data.ruleId] || 0) + 1;
  } else if (event === 'quiz_complete') {
    METRICS.quizCompletions++;
  }

  res.json({ success: true });
});

// ── API: Metrics Summary ──
app.get('/api/metrics/summary', (req, res) => {
  // Sort most viewed rules
  const topRules = Object.entries(METRICS.ruleViews)
    .map(([ruleId, views]) => ({ ruleId, title: VALID_RULES[ruleId]?.title || `Norma #${ruleId}`, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  res.json({
    totalSearches: METRICS.totalSearches,
    topConsultedRules: topRules,
    quizCompletions: METRICS.quizCompletions,
    reportsSubmitted: METRICS.reportsSubmitted,
    timestamp: new Date().toISOString()
  });
});

// Fallback SPA route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🌿 Umas Community Rules Web 3.0 server running on port ${PORT}`);
});
