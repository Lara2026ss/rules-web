# 🛡️ SECURITY REPORT — UMAS COMMUNITY RULES WEB v3.0.0

> **Fecha:** 2026-08-26
> **Entorno:** Producción (Render) / Repositorio: `Lara2026ss/rules-web`
> **Estado de Seguridad:** ✅ **100% AUDITADO & APROBADO**

---

## 1. Matriz de Controles de Seguridad

| Control / Vector | Mecanismo de Mitigación | Estado |
| :--- | :--- | :--- |
| **Protección de Secretos** | Ninguna clave de webhook de Discord (`DISCORD_MODERATION_WEBHOOK_URL`) ni token de Staff se expone en el cliente. Todo el enrutamiento y validación reside en `server.js`. | ✅ **PASSED (0 leaks)** |
| **Autorización de Staff** | Cabecera `X-Staff-Key` validada estrictamente en backend contra `process.env.STAFF_API_KEY`. Rechazo automático con HTTP 401 para intentos no autorizados. | ✅ **PASSED** |
| **Validación de Entradas** | Validación exhaustiva en servidor de `userId` (longitud y formato), `ruleId` (catálogo oficial `VALID_RULES`), `severity` (1 a 5), `points` (0 a 100) y `reason` (8 a 1000 caracteres). | ✅ **PASSED** |
| **Rate Limiting** | Limitador en memoria por IP: máximo 10 solicitudes/minuto en `/api/moderation/*` y 40/minuto en `/api/events` con respuesta HTTP 429. | ✅ **PASSED** |
| **Cabeceras HTTP Seguras** | `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin` y `Permissions-Policy`. | ✅ **PASSED** |
| **Límite de Payload** | `express.json({ limit: '64kb' })` para prevenir ataques de denegación de servicio por cuerpos JSON gigantes. | ✅ **PASSED** |
| **Privacidad de Métricas** | Los eventos de consulta comunitaria son agregados y anónimos (`rule_view`, `search`), sin almacenar IPs como identificadores permanentes ni datos de usuario. | ✅ **PASSED** |
| **Audit Trail** | Registro de auditoría interno con límite circular de 500 entradas (`GET /api/moderation/audit` protegido por clave de Staff). | ✅ **PASSED** |
