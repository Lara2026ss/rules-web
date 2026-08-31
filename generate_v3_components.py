
import os
import sys
import re

ws = r'c:\Users\mauri\OneDrive\Documents\FLUX-MCP-DOC\windows-doc\webs'
index_path = os.path.join(ws, 'index.html')

with open(index_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Title & Version
html = html.replace('Reglamento Oficial & Convivencia Comunitaria 2.0', 'Reglamento Oficial & Convivencia Comunitaria 3.0')
html = html.replace('REGLAMENTO OFICIAL 2.0', 'REGLAMENTO OFICIAL 3.0')
html = html.replace('Rules Web 2.0', 'Rules Web 3.0')

# 2. Add New CSS Styles for Language Switcher, Staff Modal, Quiz, and Offline Badge
extra_css = """
    /* ─── v3.0 Navigation Extensions ─── */
    .lang-select-btn {
      background: var(--surface2);
      border: 1px solid var(--border-hi);
      color: var(--mint);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 100px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.2s;
    }
    .lang-select-btn:hover {
      background: var(--surface3);
      border-color: var(--emerald-lt);
    }
    .staff-nav-btn {
      background: rgba(192, 132, 252, 0.15);
      border: 1px solid rgba(192, 132, 252, 0.4);
      color: var(--purple);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      font-weight: 800;
      padding: 6px 12px;
      border-radius: 100px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s;
    }
    .staff-nav-btn:hover {
      background: rgba(192, 132, 252, 0.28);
      border-color: var(--purple);
      transform: scale(1.03);
    }
    .network-badge {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 100px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .network-badge.online { color: #86efac; background: rgba(34, 197, 94, 0.12); border: 1px solid rgba(34, 197, 94, 0.3); }
    .network-badge.offline { color: #fde047; background: rgba(234, 179, 8, 0.15); border: 1px solid rgba(234, 179, 8, 0.35); }

    /* ─── v3.0 Quiz Interactivo (Onboarding) ─── */
    .quiz-container {
      background: linear-gradient(135deg, rgba(6, 28, 18, 0.75) 0%, rgba(2, 12, 7, 0.9) 100%);
      border: 1px solid var(--border-hi);
      border-radius: var(--radius-xl);
      padding: clamp(20px, 4vw, 32px);
      margin-top: 24px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.5);
    }
    .quiz-progress-bar {
      height: 6px;
      background: var(--surface3);
      border-radius: 100px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .quiz-progress-fill {
      height: 100%;
      width: 20%;
      background: linear-gradient(90deg, #10b981, #34d399);
      transition: width 0.3s ease;
    }
    .quiz-q-title {
      font-size: clamp(1rem, 2.2vw, 1.2rem);
      font-weight: 800;
      color: var(--white);
      margin-bottom: 16px;
    }
    .quiz-options-grid {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 20px;
    }
    .quiz-option-btn {
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 14px 18px;
      color: var(--text);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.88rem;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      transition: all 0.2s;
    }
    .quiz-option-btn:hover:not(:disabled) {
      background: var(--surface3);
      border-color: var(--border-hi);
      transform: translateX(4px);
    }
    .quiz-option-btn.correct {
      background: rgba(34, 197, 94, 0.2) !important;
      border-color: #22c55e !important;
      color: #86efac !important;
    }
    .quiz-option-btn.wrong {
      background: rgba(239, 68, 68, 0.2) !important;
      border-color: #ef4444 !important;
      color: #fca5a5 !important;
    }
    .quiz-feedback-box {
      background: var(--surface2);
      border-left: 4px solid var(--emerald);
      border-radius: 0 var(--radius) var(--radius) 0;
      padding: 14px 18px;
      font-size: 0.84rem;
      line-height: 1.55;
      margin-bottom: 18px;
      display: none;
    }
    .quiz-certificate {
      background: radial-gradient(circle at 50% 30%, rgba(16, 185, 129, 0.25) 0%, rgba(4, 20, 12, 0.95) 100%);
      border: 2px solid var(--emerald-lt);
      border-radius: var(--radius-xl);
      padding: 32px 24px;
      text-align: center;
      box-shadow: 0 0 35px rgba(16, 185, 129, 0.35);
    }

    /* ─── v3.0 Modal Staff Moderación ─── */
    .staff-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(1, 6, 3, 0.88);
      backdrop-filter: blur(18px);
      z-index: 2100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
      transition: all 0.28s var(--ease-spring);
    }
    .staff-modal-overlay.open {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
    }
    .staff-modal-box {
      width: 100%;
      max-width: 580px;
      background: rgba(8, 24, 16, 0.96);
      border: 1px solid rgba(192, 132, 252, 0.45);
      border-radius: var(--radius-xl);
      padding: clamp(20px, 4vw, 30px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(192, 132, 252, 0.25);
    }
    .staff-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 14px;
    }
    .staff-form-group label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--purple);
      text-transform: uppercase;
    }
    .staff-form-group input, .staff-form-group select, .staff-form-group textarea {
      background: var(--surface2);
      border: 1px solid var(--border);
      color: var(--white);
      padding: 10px 14px;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      font-family: 'Plus Jakarta Sans', sans-serif;
      outline: none;
    }
    .staff-form-group input:focus, .staff-form-group select:focus, .staff-form-group textarea:focus {
      border-color: var(--purple);
      box-shadow: 0 0 14px rgba(192, 132, 252, 0.35);
    }
"""

html = html.replace('</style>', extra_css + '\n  </style>')

# 3. Add Language Switcher, Staff Button & Network Badge to Main Nav
nav_controls_target = '<div class="nav-controls">'
nav_controls_replacement = """<div class="nav-controls">
    <div class="network-badge online" id="network-badge"><span>●</span> <span id="network-status-text">Online</span></div>
    <button class="lang-select-btn" id="lang-select-btn" type="button" title="Cambiar idioma (Language)">
      <span>🌐</span> <span id="current-lang-text">ES</span>
    </button>
    <button class="staff-nav-btn" id="staff-nav-btn" type="button" title="Panel de moderación para Staff">
      <span>🛡️</span> <span>Staff</span>
    </button>"""
html = html.replace(nav_controls_target, nav_controls_replacement)

# 4. Add Onboarding Knowledge Test Section before FAQ
faq_target = '<div class="section-gap" id="fase-8"></div>'
quiz_section_html = """
      <!-- ========================================== -->
      <!-- TEST DE CONVIVENCIA Y ONBOARDING (v3.0) 🏆 -->
      <!-- ========================================== -->
      <div class="section-gap" id="fase-quiz"></div>
      <div class="phase-header">
        <span class="phase-badge">TEST COMUNITARIO</span>
        <h2 class="phase-title">Test de Convivencia & Comprensión 🏆</h2>
        <div class="phase-line"></div>
      </div>

      <div class="card">
        <div class="card-head">
          <div class="card-icon">🧠</div>
          <div>
            <div class="card-title">UMAS Community Knowledge Test</div>
            <div class="card-sub">Pon a prueba tu conocimiento de las normas con 5 casos prácticos y obtén tu Constancia Comunitaria Oficial.</div>
          </div>
        </div>

        <div class="quiz-container" id="quiz-container">
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" id="quiz-progress-fill"></div>
          </div>
          <div id="quiz-step-header" style="font-family:'JetBrains Mono',monospace; font-size:0.75rem; color:var(--mint); margin-bottom:8px; font-weight:800;">
            PREGUNTA 1 DE 5
          </div>
          <div class="quiz-q-title" id="quiz-question-text">
            Un usuario en el chat general comienza a enviar reiterados mensajes molestos hacia otro miembro. ¿Cuál es el procedimiento correcto?
          </div>
          <div class="quiz-options-grid" id="quiz-options-grid">
            <!-- Renderizado dinámico -->
          </div>
          <div class="quiz-feedback-box" id="quiz-feedback-box">
            <!-- Feedback pedagógico -->
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button class="hero-cta-btn" id="quiz-next-btn" type="button" style="display:none;">
              <span>Siguiente Pregunta</span> ➔
            </button>
          </div>
        </div>
      </div>
"""
html = html.replace(faq_target, quiz_section_html + '\n' + faq_target)

# 5. Add Staff Modal to DOM before </body>
staff_modal_html = """
<!-- ── Modal Staff de Moderación (v3.0) ── -->
<div class="staff-modal-overlay" id="staff-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="staff-modal-title">
  <div class="staff-modal-box">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 id="staff-modal-title" style="font-family:'Playfair Display',serif; color:var(--white); font-size:1.3rem; display:flex; align-items:center; gap:8px;">
        <span>🛡️</span> Panel de Moderación Oficial
      </h3>
      <button id="staff-close-btn" type="button" style="background:none; border:none; color:var(--text-muted); font-size:1.2rem; cursor:pointer;">✕</button>
    </div>

    <form id="staff-report-form">
      <div class="staff-form-group">
        <label for="staff-user-id">👤 Usuario Objetivo (Nombre o ID)</label>
        <input type="text" id="staff-user-id" required placeholder="Ej: @usuario o 1493288927388369139" />
      </div>

      <div class="staff-form-group">
        <label for="staff-rule-id">📜 Regla Infringida</label>
        <select id="staff-rule-id" required>
          <option value="01">#01 Dignidad y Respeto Incondicional</option>
          <option value="02" selected>#02 Prevención de Acoso y Hostigamiento</option>
          <option value="03">#03 Control de Spam y Flood</option>
          <option value="04">#04 Publicidad y Autopromoción</option>
          <option value="07">#07 Confort Auditivo en Canales de Voz</option>
          <option value="08">#08 Grabaciones y Transmisiones</option>
          <option value="11">#11 Doxxing y Datos Privados</option>
          <option value="12">#12 Estafas y Phishing</option>
          <option value="13">#13 Protección de Menores</option>
          <option value="14">#14 Amenazas y Raids</option>
          <option value="15">#15 Evasión con Multicuentas</option>
        </select>
      </div>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div class="staff-form-group">
          <label for="staff-severity">📊 Severidad</label>
          <select id="staff-severity" required>
            <option value="1">Nivel 1 · Informativo</option>
            <option value="2">Nivel 2 · Leve</option>
            <option value="3">Nivel 3 · Moderado</option>
            <option value="4" selected>Nivel 4 · Grave</option>
            <option value="5">Nivel 5 · Crítico (Ban)</option>
          </select>
        </div>
        <div class="staff-form-group">
          <label for="staff-points">🔢 Puntos (0-100)</label>
          <input type="number" id="staff-points" min="0" max="100" value="40" required />
        </div>
      </div>

      <div class="staff-form-group">
        <label for="staff-reason">📝 Motivo y Contexto del Incidente</label>
        <textarea id="staff-reason" rows="3" required placeholder="Describe brevemente lo ocurrido (mínimo 8 caracteres)..."></textarea>
      </div>

      <div class="staff-form-group">
        <label for="staff-key">🔐 Clave de Autorización Staff</label>
        <input type="password" id="staff-key" required placeholder="Ingresa clave de Staff..." />
      </div>

      <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:18px;">
        <button id="staff-cancel-btn" type="button" class="sim-preset-btn">Cancelar</button>
        <button type="submit" class="hero-cta-btn" id="staff-submit-btn"><span>Enviar Reporte Oficial</span> ➔</button>
      </div>
    </form>
  </div>
</div>
"""
html = html.replace('</body>', staff_modal_html + '\n</body>')

# Write back
with open(index_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("SUCCESS: index.html updated with v3.0 UI components!")
