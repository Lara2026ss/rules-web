/**
 * 🌿 App Engine — Umas Community Rules Web 3.1+
 * Main Client Application Modules
 */

// ==========================================
// 1. ENTER SCREEN MODULE (BULLETPROOF)
// ==========================================
const EnterScreenModule = {
  handleEnter() {
    const enterScreen = document.getElementById('enter-screen');
    const mainNav = document.getElementById('main-nav');
    const heroOverlay = document.getElementById('hero-text-overlay');
    const bgAudio = document.getElementById('bg-audio');

    try {
      AudioEngine.resumeContext();
      AudioEngine.playCrystal([523.25, 659.25, 783.99, 1046.5]);
    } catch (e) {}

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    if (enterScreen) {
      enterScreen.style.pointerEvents = 'none';
      enterScreen.classList.add('dismissed');
      enterScreen.style.opacity = '0';
    }

    if (mainNav) {
      mainNav.classList.add('nav-visible');
    }

    try {
      if (bgAudio && AudioEngine.enabled) {
        bgAudio.volume = 0.2;
        bgAudio.play().catch(() => {});
      }
    } catch (e) {}

    setTimeout(() => {
      if (heroOverlay) heroOverlay.classList.add('start-anim');
    }, 150);

    setTimeout(() => {
      if (enterScreen) {
        enterScreen.style.display = 'none';
        enterScreen.style.visibility = 'hidden';
      }
    }, 350);
  },

  init() {
    const enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
      enterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleEnter();
      });
      enterBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleEnter();
        }
      });
    }
  }
};
window.EnterScreenModule = EnterScreenModule;

// ==========================================
// 2. RULES ACCORDION MODULE
// ==========================================
const RulesModule = {
  init() {
    const ruleBoxes = document.querySelectorAll('.rule-box');
    ruleBoxes.forEach(box => {
      const headerBar = box.querySelector('.rule-header-bar');
      const toggleBtn = box.querySelector('.rule-toggle-btn');
      
      const toggleBox = (e) => {
        e?.stopPropagation();
        const isOpen = box.classList.contains('open');

        if (isOpen) {
          box.classList.remove('open');
          if (headerBar) headerBar.setAttribute('aria-expanded', 'false');
          if (toggleBtn) {
            const span = toggleBtn.querySelector('span:first-child');
            if (span) span.textContent = 'Detalles';
          }
          AudioEngine.playAccordionClose();
        } else {
          box.classList.add('open');
          if (headerBar) headerBar.setAttribute('aria-expanded', 'true');
          if (toggleBtn) {
            const span = toggleBtn.querySelector('span:first-child');
            if (span) span.textContent = 'Cerrar';
          }
          AudioEngine.playAccordionOpen();
        }
      };

      if (headerBar) {
        headerBar.addEventListener('click', toggleBox);
        headerBar.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleBox(e);
          }
        });
      }
      if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleBox(e);
        });
      }
    });
  }
};

// ==========================================
// 3. CARDS 3D SPOTLIGHT & TILT EFFECT
// ==========================================
const CardsEffectModule = {
  init() {
    const ruleBoxes = document.querySelectorAll('.rule-box');
    ruleBoxes.forEach(box => {
      box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        box.style.setProperty('--mouse-x', `${x}px`);
        box.style.setProperty('--mouse-y', `${y}px`);

        if (window.innerWidth >= 1024) {
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const tiltX = ((y - centerY) / centerY) * -3.5;
          const tiltY = ((x - centerX) / centerX) * 3.5;
          box.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(0)`;
        }
      });

      box.addEventListener('mouseleave', () => {
        box.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
      });
    });
  }
};

// ==========================================
// 4. BACKGROUND PARTICLES CANVAS MODULE
// ==========================================
const BackgroundModule = {
  init() {
    const canvas = document.getElementById('particles-canvas');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (canvas && !prefersReduced) {
      const ctx = canvas.getContext('2d');
      let particles = [];
      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 18 : 36;
      let mouseX = window.innerWidth / 2;
      let mouseY = window.innerHeight / 2;

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize, { passive: true });

      window.addEventListener('pointermove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }, { passive: true });

      class Spore {
        constructor() { this.reset(true); }
        reset(initial = false) {
          this.x = Math.random() * canvas.width;
          this.y = initial ? Math.random() * canvas.height : canvas.height + 15;
          this.r = Math.random() * 2.2 + 0.8;
          this.speedY = Math.random() * 0.45 + 0.15;
          this.speedX = (Math.random() - 0.5) * 0.3;
          this.alpha = Math.random() * 0.5 + 0.2;
          this.pulse = Math.random() * Math.PI;
          this.color = Math.random() > 0.35 ? '16, 185, 129' : '245, 158, 11';
        }
        update() {
          this.y -= this.speedY;
          this.x += this.speedX + Math.sin(this.pulse) * 0.25;
          this.pulse += 0.02;

          const dx = mouseX - this.x;
          const dy = mouseY - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }

          if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
            this.reset(false);
          }
        }
        draw() {
          ctx.save();
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `rgba(${this.color}, 0.8)`;
          ctx.fill();
          ctx.restore();
        }
      }

      for (let i = 0; i < count; i++) {
        particles.push(new Spore());
      }

      function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          p.update();
          p.draw();
        });
        requestAnimationFrame(loop);
      }
      loop();
    }
  }
};

// ==========================================
// 5. NAVIGATION & AUDIO TOGGLE MODULE
// ==========================================
const NavigationModule = {
  init() {
    const mainNav = document.getElementById('main-nav');
    const readingProgress = document.getElementById('nav-reading-progress');
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    const soundToggleBtn = document.getElementById('sound-toggle-btn');

    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', () => {
        AudioEngine.toggle();
      });
    }

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (readingProgress) {
        readingProgress.style.width = docHeight > 0 ? (scrollY / docHeight) * 100 + '%' : '0%';
      }
      if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', scrollY > 400);
      }
    }, { passive: true });

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        AudioEngine.playSoftTap(640, 0.035);
      });
    }
  }
};

// ==========================================
// 6. CENTRAL BOOTSTRAP (DOMContentLoaded)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  AudioEngine.init();
  EnterScreenModule.init();
  RulesModule.init();
  CardsEffectModule.init();
  BackgroundModule.init();
  NavigationModule.init();
  console.log('🌿 Umas Community Rules Web 3.1+ (Convivencia Modular Engine Active)');
});
