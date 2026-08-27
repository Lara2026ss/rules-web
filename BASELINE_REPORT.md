# 📋 BASELINE REPORT — UMAS COMMUNITY RULES WEB v2.1.0

> **Fecha:** 2026-08-26
> **Commit Baseline:** `6bf6d9874213939775df5bb867172c0f7fd833ab`
> **Estado:** ✅ ESTABLE & VERIFICADO EN PRODUCCIÓN

---

## 1. Matriz de Estado de la Baseline

| Componente / Feature | Estado | Verificación |
| :--- | :--- | :--- |
| **Buscador Interactivo** | ✅ PASS | Command palette con lista de resultados modal, navegación por teclado (`↑`/`↓`/`Enter`), auto-scroll y resplandor esmeralda. |
| **Panel de Categorías** | ✅ PASS | Panel estructurado con conteos dinámicos en tiempo real y responsive sin recortes horizontales. |
| **Fichas de Reglas (20)** | ✅ PASS | Metadatos normalizados, insignias de severidad, ejemplos contrastados y botón de copiado Markdown. |
| **Simulador de Sanciones** | ✅ PASS | Determinista de 0 a 100 PTS con 3 factores (Reincidencia, Intencionalidad, Cooperación) y exportación de informe. |
| **Marco Jurídico LATAM** | ✅ PASS | Fichas de 10 países con persistencia en `localStorage`. |
| **FAQ Interactiva** | ✅ PASS | Acordeón con 5 respuestas formateadas. |
| **PWA & Favicon** | ✅ PASS | `manifest.webmanifest` y `favicon.svg` activos con tipos MIME en Express. |
| **Estilos de Impresión** | ✅ PASS | `@media print` optimizado para PDF en blanco y negro. |
| **Accesibilidad** | ✅ PASS | Atributos ARIA (`listbox`, `option`, `expanded`, `controls`, `live`) y soporte `prefers-reduced-motion`. |
| **Producción en Render** | ✅ LIVE | Endpoint `/api/health` en HTTP 200. |

---

## 2. Puntos de Extensión Segura hacia v3.0
1. **Extensión de `server.js`:** Incorporar middleware de seguridad, rate limiting y endpoints `/api/moderation/*`, `/api/events`, `/api/metrics/summary`.
2. **Dataset Unificado:** Centralizar todas las normas, traducciones (ES/EN/PT), casos de prueba del Quiz y metadatos en un único objeto maestro reutilizado por toda la aplicación.
3. **PWA Service Worker:** `sw.js` con cache versionado para capacidad offline total.
