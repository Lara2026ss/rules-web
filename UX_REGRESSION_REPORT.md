# 🛡️ UX REGRESSION REPORT — UMAS COMMUNITY RULES WEB

> **Objetivo:** Verificar que las correcciones en el buscador y categorías no generen efectos secundarios en el resto de la aplicación.

---

## Módulos Verificados

| Módulo | Característica | Estado | Notas |
| :--- | :--- | :--- | :--- |
| **PWA & Favicon** | `manifest.webmanifest` & `favicon.svg` | ✅ **PASS** | Cargados con MIME types válidos en Express |
| **Banner 30 Segundos** | 6 Principios esenciales | ✅ **PASS** | Grid responsive limpio y legible |
| **Acordeones de Fases** | Expansión/colapso de 19 normas | ✅ **PASS** | Transición suave `max-height` con ARIA |
| **Copiar Norma Discord** | Botón `[ 📋 Copiar ]` | ✅ **PASS** | Copia formato enriquecido Markdown con enlace |
| **Simulador de Sanciones** | Slider 0-100 PTS + 3 Factores | ✅ **PASS** | Determinista con exportación de informe |
| **Marco Jurídico LATAM** | Selector de 10 países | ✅ **PASS** | Persistencia en `localStorage` |
| **FAQ Interactiva** | 5 preguntas frecuentes | ✅ **PASS** | Acordeón exclusivo con flecha animada |
| **Estilos de Impresión** | `@media print` | ✅ **PASS** | Exporta reglamento formal en blanco y negro |
| **Audio ASMR** | Sintetizador Web Audio API | ✅ **PASS** | Sonidos sutiles de cristal y switch ON/OFF |
| **Ahorro de Datos** | `Save-Data` / `reduced-motion` | ✅ **PASS** | Pausa video de fondo y canvas de partículas |
