/* ============================================================
   PROMO SHAR — script.js
   ============================================================ */
(function () {
  'use strict';

  /* ── 1. HEADER SCROLL SHADOW ─────────────────────────────── */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          header.classList.toggle('scrolled', window.scrollY > 6);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── 2. MOBILE BURGER MENU ───────────────────────────────── */
  function initMobileMenu() {
    const btn = document.getElementById('burgerBtn');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    function close() {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }
    function open() {
      menu.classList.add('open');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
    }

    btn.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      isOpen ? close() : open();
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', close);
    });

    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) close();
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  /* ── 3. SMOOTH ANCHOR SCROLL ─────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const headerH = document.getElementById('header')?.offsetHeight ?? 56;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ── 4. SCROLL REVEAL ────────────────────────────────────── */
  function initReveal() {
    // Apply reveal attrs
    const selectors = [
      '.stats__item',
      '.svc-card',
      '.partners__item',
      '.why-card',
      '.why__cta',
      '.cta__content',
      '.cta__visual',
      '.map-section__info'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.setAttribute('data-reveal', '');
        el.setAttribute('data-d', String((i % 4) + 1));
      });
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
  }

  /* ── 5. COUNTER ANIMATION ────────────────────────────────── */
  function animateNum(el, from, to, duration, suffix, isDecimal) {
    const start = performance.now();
    function step(now) {
      const prog = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      const val = from + (to - from) * ease;
      el.textContent = isDecimal ? val.toFixed(1) : Math.round(val);
      if (prog < 1) requestAnimationFrame(step);
      else el.textContent = isDecimal ? to.toFixed(1) : to + suffix;
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const stats = document.querySelector('.stats');
    if (!stats) return;
    let fired = false;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !fired) {
        fired = true;
        const items = [
          { sel: '[data-count="24"]', to: 24, suffix: '' },
          { sel: '[data-count="500"]', to: 500, suffix: '+' },
          { sel: '[data-count="7"]', to: 7, suffix: '' },
        ];
        items.forEach(({ sel, to, suffix }) => {
          const el = stats.querySelector(sel);
          if (el) animateNum(el, 0, to, 1200, suffix, false);
        });
        // Rating decimal
        const ratingEl = stats.querySelector('[data-decimal="4.9"]');
        if (ratingEl) animateNum(ratingEl, 0, 4.9, 1200, '', true);
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(stats);
  }

  /* ── 6. PHONE MASK ───────────────────────────────────────── */
  function initPhoneMask() {
    const inputs = document.querySelectorAll('input[type="tel"]');
    inputs.forEach(phoneInput => {
      phoneInput.addEventListener('input', function () {
        let digits = this.value.replace(/\D/g, '');
        if (!digits) { this.value = ''; return; }
        if (digits[0] === '8') digits = '7' + digits.slice(1);
        if (digits[0] !== '7') digits = '7' + digits;
        const d = digits.slice(0, 11);
        let f = '+7';
        if (d.length > 1) f += ' (' + d.slice(1, 4);
        if (d.length >= 4) f += ')';
        if (d.length >= 4) f += ' ' + d.slice(4, 7);
        if (d.length >= 7) f += '-' + d.slice(7, 9);
        if (d.length >= 9) f += '-' + d.slice(9, 11);
        this.value = f;
      });
    });
  }

  /* ── 7. FORM HANDLING ────────────────────────────────────── */
  function initForm() {
    const form = document.getElementById('ctaForm');
    if (!form) return;
    const submitBtn = form.querySelector('.cta__submit');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = form.querySelector('input[name="name"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      let valid = true;

      if (!nameInput.value.trim()) {
        nameInput.classList.add('error');
        if (valid) nameInput.focus();
        valid = false;
      } else {
        nameInput.classList.remove('error');
      }

      const phoneDigits = phoneInput.value.replace(/\D/g, '');
      if (!phoneInput.value.trim() || phoneDigits.length < 11) {
        phoneInput.classList.add('error');
        if (valid) phoneInput.focus();
        valid = false;
      } else {
        phoneInput.classList.remove('error');
      }

      if (!valid) return;

      // Success
      const origText = submitBtn.textContent;
      submitBtn.textContent = '✓ Заявка принята!';
      submitBtn.classList.add('success');
      form.querySelectorAll('.cta__input').forEach(inp => {
        inp.value = '';
        inp.classList.remove('error');
      });
      setTimeout(() => {
        submitBtn.textContent = origText;
        submitBtn.classList.remove('success');
      }, 4000);
    });

    form.querySelectorAll('.cta__input').forEach(inp => {
      inp.addEventListener('input', () => inp.classList.remove('error'));
    });
  }

  /* ── 8. CATEGORIES ACTIVE ────────────────────────────────── */
  function initCategories() {
    document.querySelectorAll('.cat-item').forEach(item => {
      item.addEventListener('click', function () {
        document.querySelectorAll('.cat-item').forEach(i => i.classList.remove('cat-item--active'));
        this.classList.add('cat-item--active');
      });
    });
  }

  /* ── 9. BALLOON PARALLAX (desktop only) ──────────────────── */
  function initParallax() {
    if (window.matchMedia('(max-width: 960px)').matches || 'ontouchstart' in window) return;
    const hero = document.querySelector('.hero');
    const img = document.querySelector('.hero__balloons-img');
    if (!hero || !img) return;

    let rafId = null, tx = 0, ty = 0, cx = 0, cy = 0;

    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) - r.width / 2) / r.width;
      ty = ((e.clientY - r.top) - r.height / 2) / r.height;
      if (!rafId) rafId = requestAnimationFrame(tick);
    }, { passive: true });

    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; });

    function tick() {
      cx += (tx - cx) * 0.07;
      cy += (ty - cy) * 0.07;
      img.style.transform = `translateX(${cx * 16}px) translateY(${cy * 10}px)`;
      rafId = (Math.abs(cx - tx) > 0.001 || Math.abs(cy - ty) > 0.001)
        ? requestAnimationFrame(tick)
        : null;
    }
  }

  /* ── 10. MAP IFRAME FADE-IN ─────────────────────────────── */
  function initMap() {
    const iframe = document.getElementById('mapIframe');
    if (!iframe) return;
    // Fade in iframe when loaded; keep static SVG as fallback if blocked
    iframe.addEventListener('load', () => {
      try {
        // If iframe content is accessible (not blocked), fade it in
        iframe.style.opacity = '1';
      } catch (e) {
        // Cross-origin block — keep static map visible
      }
    });
    // Timeout fallback: if iframe doesn't load in 4s, keep SVG map
    setTimeout(() => {
      if (iframe.style.opacity !== '1') {
        iframe.style.display = 'none';
      }
    }, 4000);
  }

  /* ── INIT ─────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initReveal();
    initCounters();
    initPhoneMask();
    initForm();
    initCategories();
    initParallax();
    initMap();
  });
})();
