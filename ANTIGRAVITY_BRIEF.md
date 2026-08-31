# BRIEF DE TRABAJO — Rules Web 3.0+ (Umas Community)
**Destinatario:** Antigravity (agente ejecutor)
**Revisores:** Mauricio + Claude (diagnóstico conjunto, NO ejecutan código)
**Archivo objetivo:** `C:\Users\mauri\OneDrive\Documents\FLUX-MCP-DOC\windows-doc\webs\Rules\index.html`
**Fecha:** 2026-08-28

---

## 0. CONTEXTO OBLIGATORIO ANTES DE EMPEZAR

Este archivo ya existe con 5284 líneas. NO es un proyecto nuevo. Antes de escribir una sola línea:

1. Localiza los bloques `.rule-box` existentes (`data-rule="01"` a `data-rule="15"`, más si existen `M1`-`M4`). Actualmente solo tienen `.rule-expandable-body` completo las reglas **01, 02, 03, 04, 06, 07, 11**. El resto (05, 08, 09, 10, 12, 13, 14, 15, M1-M4) necesitan la tarjeta completa creada desde cero.
2. Lee `server.js` → objeto `VALID_RULES`. Ahí está la fuente de verdad de: título oficial de cada regla, categoría (`conducta`/`comunicacion`/`seguridad`/`comunidad`/`moderacion`), `maxPts` y `defaultLev`. **No inventes títulos ni puntajes que contradigan ese objeto** — si hay discrepancia, repórtala en vez de sobreescribir silenciosamente.
3. Usa búsqueda de archivo con match exacto de texto (no reescribas el archivo completo). Cada tarjeta se edita/crea con reemplazo quirúrgico del bloque `<div class="rule-box" data-rule="XX">...</div>` correspondiente.

---

## 1. ALCANCE DE CONTENIDO — 22 NORMAS TOTALES

- **15 Reglas Comunitarias** (#01–#15)
- **4 Reglas de Ética y Moderación Staff** (#M1–#M4)
- **3 Derechos y Garantías del Usuario** (#D1–#D3) — **estos NO existen aún en ningún archivo del proyecto.** Ver sección 4.

---

## 2. ESTRUCTURA POR TARJETA — 4 SECCIONES (reducido de 6, por decisión de producto: la versión de 6 secciones se consideró demasiado larga y aburrida de leer para los usuarios finales de un servidor de Discord, no para abogados)

Cada una de las 22 tarjetas debe tener **exactamente estas 4 secciones**, en este orden, dentro de `.rule-expandable-body`:

1. **🌿 Qué significa** — 1-2 frases. Qué protege esta regla y por qué existe (causa raíz fusionada aquí, en una sola frase, no como sección aparte).
2. **❌ Prohibido / ✅ Permitido** — bloque doble compacto (ya existe el patrón `.rule-section-block` con `danger`/`good` en las tarjetas actuales; reusar ese patrón, NO crear una sección nueva para "causa raíz" separada).
3. **💬 Ejemplo en Discord** — **UN SOLO par** incorrecto/correcto (`.rule-example-card.bad` + `.rule-example-card.good`), no varios. Cada ejemplo con máximo 2 líneas de texto + 1 línea de "¿por qué?".
4. **⚖️ Sanción** — la matriz de puntos ya existente en `.rule-section-heading.sanc`, con el rango de PTS tomado de `VALID_RULES` en `server.js`.

**Justificación del recorte:** las tarjetas actuales (#01, #02) ya usan 5 bloques y funcionan bien visualmente; fusionar "causa raíz" dentro de "Qué significa" y limitar ejemplos a 1 par evita que el acordeón se sienta como un ensayo legal. Mantener el tono conversacional que ya tiene la regla #01 (revisar esa tarjeta como plantilla de tono/longitud).

---

## 3. FUENTES REALES OBLIGATORIAS — NO INVENTAR CONTENIDO

Antigravity debe **buscar en la web activamente** y basar el contenido en fuentes oficiales verificables antes de redactar cada regla. Fuentes ya confirmadas como vigentes (2026) que debe consultar como mínimo:

- **Discord Community Guidelines** — https://discord.com/guidelines (27 reglas numeradas oficiales, incorporadas al ToS). Punto de partida obligatorio para TODAS las reglas de seguridad/conducta.
- **Discord Doxxing Policy Explainer** — https://discord.com/safety/doxxing-policy-explainer (define PII = Personally Identifiable Information: nombre, dirección, SSN, datos bancarios, licencia de conducir, etc. — usar esta terminología exacta en la regla de anti-doxxing).
- **Discord Teen and Child Safety Policy Explainer** — https://discord.com/safety/child-safety-policy-explainer (base para cualquier regla de protección de menores).
- **Discord Policies and Guidelines (Platform vs Community Moderation)** — https://discord.com/safety/360043709612-our-policies (distingue moderación de plataforma vs. moderación de comunidad — útil para explicar por qué el servidor tiene reglas propias además de las de Discord).
- **Discord Confidentiality in Moderation** — https://discord.com/safety/confidentiality-in-moderation (buena referencia para las reglas M1-M4 de ética del Staff, específicamente manejo confidencial de reportes).

**Regla de oro de copyright:** NO copiar/pegar texto literal de Discord (son citas de <15 palabras máximo, una por fuente, si acaso). Todo el contenido de las 22 reglas debe ser **redacción propia del servidor**, inspirada y alineada con esas políticas, tal como ya hace la regla #01 actual. Si Antigravity no está seguro de esto, debe preguntar antes de proceder, no asumir.

Para reglas que no tienen equivalente directo en Discord ToS (ej. reglas de canales temáticos, spoilers, comandos de bots — más operativas que legales), puede usar como apoyo (sin citar textual) fuentes secundarias de buenas prácticas de comunidades gaming como Accord.gg o BuildMyDiscord, ya confirmadas como vigentes en 2026.

---

## 4. REGLAS M1–M4 Y D1–D3 — INSTRUCCIÓN ESPECÍFICA

### M1–M4 (Ética y Moderación Staff)
Ya existen definidas conceptualmente en `server.js` (`VALID_RULES`) y en `.agents/AGENTS.md`:
- M1: Mediación Formativa y Desescalada de Conflictos
- M2: Imparcialidad y Cero Conflicto de Interés
- M3: Preservación de Evidencias y Auditoría de Sanciones
- M4: Supervisión y Canal para Reportar Moderación

Antigravity debe expandir estas 4 con el mismo formato de 4 secciones, usando como base real el archivo `.agents/AGENTS.md` (ya contiene lineamientos reales de cómo debe comportarse el staff/bot Novarito) y la fuente de Discord sobre confidencialidad en moderación citada arriba.

### D1–D3 (Derechos y Garantías del Usuario) — **NO ESTÁN DEFINIDOS, Antigravity debe proponerlos**
Estos tres derechos no existen en ningún archivo del proyecto. Antigravity debe:
1. Investigar en la web qué derechos básicos suelen otorgarse a usuarios en comunidades bien moderadas (presunción de inocencia ante sanciones ambiguas, derecho a apelación, privacidad de DMs/datos, trato igualitario incluyendo al Staff — hay un precedente ya escrito en `add_rights.py` con una sección "§09 Derechos del Usuario" de 5 puntos que puede servir de inspiración, pero **no es definitivo**, solo referencia de tono).
2. Redactar un **borrador de 3 derechos** (D1, D2, D3) con el mismo formato de 4 secciones.
3. **No marcarlos como finales.** Deben quedar claramente señalados en el resultado (ej. comentario HTML `<!-- BORRADOR: pendiente aprobación Mauricio -->`) para que se revisen antes de darlos por definitivos.

---

## 5. PARTE VISUAL — SEPARADA DEL CONTENIDO (no mezclar en el mismo pase)

Esto se ejecuta en una fase aparte, después de que el contenido de las 22 reglas esté aprobado, para no arriesgar romper el layout mientras se redacta texto:

- **Partículas ambientales:** luces/esporas esmeralda flotantes con movimiento orgánico + reacción sutil al cursor (no intrusivo, debe respetar `prefers-reduced-motion`, que el sitio ya soporta según `UX_REGRESSION_REPORT.md`).
- **Spotlight 3D en tarjetas:** `radial-gradient` que sigue `clientX/clientY` del mouse relativo a cada `.rule-box`, con tilt sutil (no exagerado, evitar mareo).
- **Acordeón:** transición de apertura ya existe (`.rule-box.open .rule-expandable-body`) — solo pulir con easing más suave y un pequeño glow en el borde al abrir.
- **Motor de audio:** el `AudioEngine` de la referencia `src/audio/audio-engine.js` (Web Audio API, osciladores sintéticos, sin archivos externos) es el patrón correcto a replicar aquí — sonidos cortos y sutiles para: clic, apertura de acordeón, copiar al portapapeles, abrir buscador, acierto en quiz.

**Restricción dura:** ningún efecto visual debe romper el ARIA existente (`aria-expanded`, `aria-controls`, `role="listbox"/"option"` del buscador) ni el soporte de impresión (`@media print`) ya documentado en `TEST_REPORT.md`.

---

## 6. VERIFICACIÓN — QUÉ CLAUDE Y MAURICIO VAMOS A REVISAR AL FINAL

Antes de dar por cerrado el trabajo, Antigravity debe entregar un resumen con:

1. Lista de las 22 reglas con su rango de PTS, confirmando que coincide con `VALID_RULES` en `server.js` (sin discrepancias silenciosas).
2. Confirmación de que las 22 tarjetas tienen las 4 secciones completas (no 6, no 3).
3. Lista explícita de qué fuentes reales se usaron para redactar contenido (URLs), especialmente para las reglas de seguridad (doxxing, phishing, protección de menores) y para el borrador D1-D3.
4. Confirmación de que no hay texto citado literal de Discord ToS/Guidelines más allá de fragmentos triviales.
5. Que el HTML sigue siendo válido (sin tags rotos) y que `server.js` levanta sin warnings.

Nosotros (Mauricio + Claude) hacemos el diagnóstico final leyendo el archivo resultante directamente — Antigravity no necesita ejecutar tests automatizados propios más allá de un chequeo de sintaxis básico.
