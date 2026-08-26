# 📝 CHANGELOG — UMAS COMMUNITY RULES WEB

## [2.0.0] - 2026-08-26

### 🚀 Nuevas Funcionalidades
- **Filtro por Categorías:** Barra superior interactiva con 5 categorías (`Conducta`, `Comunicación`, `Seguridad`, `Comunidad`, `Moderación`).
- **Motor de Búsqueda con Ranking:** Pipeline de búsqueda con normalización Unicode NFD, diccionario semántico de sinónimos y puntuación ponderada.
- **Simulador Determinista:** Integración de 3 selectores de graduación (Reincidencia, Intencionalidad, Cooperación) con cálculo determinista y exportación de informe de moderación.
- **PWA & Favicon SVG:** `manifest.webmanifest` y `favicon.svg` oficiales para instalación en dispositivos móviles y PC.
- **Estilos de Impresión (@media print):** Diagramación para exportar o imprimir el reglamento completo en PDF.

### 🛡️ Mantenibilidad y Calidad
- **Bootstrap Modular:** 12 namespaces en JavaScript que previenen conflictos y errores en consola.
- **MIME Types en Servidor:** Configuración en Express para servir `.webmanifest` y `.svg` correctamente.
- **Persistencia Versionada:** Almacenamiento seguro de preferencias de sonido, país y categoría en `localStorage`.
