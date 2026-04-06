/* ============================================================
   script.js  –  Portfolio for Pravachan D S
   • Particle canvas
   • Sticky navbar (scroll effect + active link highlighting)
   • Mobile hamburger menu
   • Scroll-reveal animations
   • Animated counter (hero stats)
   • Skill bar animations
   • Contact form handler (client-side demo)
============================================================ */

'use strict';

/* ─────────────────────────────────────────
   1.  PARTICLE CANVAS
───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];

  const CONFIG = {
    count:      70,
    maxRadius:  2,
    speed:      0.25,
    linkDist:   130,
    colors:     ['rgba(99,179,237,', 'rgba(167,139,250,', 'rgba(52,211,153,'],
    baseAlpha:  0.4,
  };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.r  = Math.random() * CONFIG.maxRadius + 0.5;
    this.vx = (Math.random() - 0.5) * CONFIG.speed;
    this.vy = (Math.random() - 0.5) * CONFIG.speed;
    this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    this.alpha = Math.random() * 0.5 + 0.2;
  }

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function spawn() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + p.alpha + ')';
      ctx.fill();
    });

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.linkDist) {
          const alpha = (1 - dist / CONFIG.linkDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(99,179,237,${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); spawn(); });
  resize();
  spawn();
  draw();
})();


/* ─────────────────────────────────────────
   2.  STICKY NAVBAR
───────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightNavLink();
  }, { passive: true });
})();


/* ─────────────────────────────────────────
   3.  ACTIVE NAV LINK HIGHLIGHT
───────────────────────────────────────── */
function highlightNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollY  = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Trigger once on load
highlightNavLink();


/* ─────────────────────────────────────────
   4.  MOBILE HAMBURGER MENU
───────────────────────────────────────── */
(function initHamburger() {
  const btn      = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!btn || !navLinks) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();


/* ─────────────────────────────────────────
   5.  SCROLL REVEAL ANIMATIONS
───────────────────────────────────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);   // animate only once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────
   6.  ANIMATED COUNTER (HERO STATS)
───────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1200;
      const step   = 16;
      const inc    = target / (dur / step);
      let current  = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────
   7.  SKILL BAR ANIMATIONS
───────────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar[data-width]');
  if (!bars.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      // Small delay so the CSS transition fires visibly
      requestAnimationFrame(() => {
        bar.style.width = bar.dataset.width + '%';
      });
      observer.unobserve(bar);
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
})();


/* ─────────────────────────────────────────
   8.  CONTACT FORM (client-side demo)
───────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const sendBtn = document.getElementById('btn-send-msg');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      shakeForm(form);
      return;
    }

    // Simulate async send
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
      form.reset();
      if (success) {
        success.classList.add('visible');
        setTimeout(() => success.classList.remove('visible'), 5000);
      }
    }, 1600);
  });

  function shakeForm(el) {
    el.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' },
    ], { duration: 380, easing: 'ease-in-out' });
  }
})();


/* ─────────────────────────────────────────
   9.  SMOOTH SCROLLING for nav / CTA links
───────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const selector = this.getAttribute('href');
      if (selector === '#') return;
      const target = document.querySelector(selector);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('navbar').offsetHeight + 12;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────
   10.  CURSOR GLOW EFFECT (desktop only)
───────────────────────────────────────── */
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;   // skip touch devices

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,179,237,0.07) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.08s ease, top 0.08s ease;
    z-index: 0;
  `;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
})();


/* ─────────────────────────────────────────
   11.  TYPING EFFECT for hero tagline
───────────────────────────────────────── */
(function initTypingEffect() {
  const target = document.querySelector('.hero-intro');
  if (!target) return;

  const baseText = 'I build ';
  const words    = ['intelligent systems', 'AI solutions', 'smart tech', 'real-world tools'];
  const suffix   = ' to solve real-world problems.';

  let wordIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const word    = words[wordIdx];
    const current = deleting
      ? word.substring(0, charIdx--)
      : word.substring(0, charIdx++);

    target.innerHTML = `${baseText}<span class="highlight">${current}</span>${suffix}`;

    let delay = deleting ? 60 : 90;

    if (!deleting && charIdx > word.length) {
      delay    = 2000;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      wordIdx  = (wordIdx + 1) % words.length;
      delay    = 400;
    }

    setTimeout(type, delay);
  }

  // Start after the reveal animation
  setTimeout(type, 1800);
})();
