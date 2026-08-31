/**
 * 🌿 AudioEngine — ASMR Synthetic Web Audio Engine
 * Umas Community Rules Web 3.1+
 */
const AudioEngine = {
  ctx: null,
  enabled: true,

  init() {
    const saved = localStorage.getItem('umas_rules_sound_v3');
    this.enabled = saved !== null ? JSON.parse(saved) : true;
    this.updateUI();
  },

  getContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  },

  resumeContext() {
    this.getContext();
  },

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('umas_rules_sound_v3', JSON.stringify(this.enabled));
    this.updateUI();
    if (this.enabled) {
      this.playSoftTap(600, 0.04);
    }
  },

  updateUI() {
    const icon = document.getElementById('sound-icon');
    const text = document.getElementById('sound-text');
    if (icon) icon.textContent = this.enabled ? '🔊' : '🔇';
    if (text) text.textContent = this.enabled ? 'ASMR: ON' : 'ASMR: OFF';
  },

  playSoftTap(freq = 520, duration = 0.035) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.7, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  },

  playCrystal(notes = [523.25, 659.25, 783.99, 1046.5]) {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.04, ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.06 + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.06);
        osc.stop(ctx.currentTime + idx * 0.06 + 0.45);
      });
    } catch (e) {}
  },

  playAccordionOpen() {
    this.playCrystal([440, 554.37, 659.25]);
  },

  playAccordionClose() {
    this.playCrystal([520, 440, 349.23]);
  }
};

window.AudioEngine = AudioEngine;
