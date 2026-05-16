/* ============================================================
   MAIN — Interactions globales
   ============================================================ */

// 1. Menu mobile
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
if (navToggle && siteNav) {
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
}

// 1bis. Seuil contemplatif — révèle les 3 portes au clic
const seuil = document.getElementById('seuil-button');
const seuilStage = document.getElementById('seuil-stage');
const doorsReveal = document.getElementById('doors-reveal');
if (seuil && doorsReveal) {
  const doorLinks = doorsReveal.querySelectorAll('a');
  doorLinks.forEach(link => link.setAttribute('tabindex', '-1'));

  const labelEl = seuil.querySelector('.seuil__label');

  seuil.addEventListener('click', () => {
    const isOpen = seuil.classList.toggle('is-open');
    if (seuilStage) seuilStage.classList.toggle('is-open', isOpen);
    doorsReveal.classList.toggle('is-open', isOpen);
    seuil.setAttribute('aria-expanded', isOpen);
    doorsReveal.setAttribute('aria-hidden', !isOpen);
    doorLinks.forEach(link => {
      if (isOpen) {
        link.removeAttribute('tabindex');
      } else {
        link.setAttribute('tabindex', '-1');
      }
    });
    if (isOpen) {
      // Le seuil disparaît complètement après le clic (on est déjà entré)
      seuil.style.display = 'none';
      setTimeout(() => doorsReveal.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 400);
    }
  });
}

// 2. Citation tournante sur l'accueil
async function rotateQuote() {
  const quoteBlock = document.getElementById('rotating-quote');
  if (!quoteBlock) return;
  try {
    const res = await fetch('data/citations.json');
    const data = await res.json();
    const quotes = data.homepage;
    let idx = 0;
    const textEl = quoteBlock.querySelector('.quote-text');
    const citeEl = quoteBlock.querySelector('.quote-cite');

    const swap = () => {
      idx = (idx + 1) % quotes.length;
      quoteBlock.style.opacity = 0;
      setTimeout(() => {
        textEl.textContent = quotes[idx].text;
        citeEl.textContent = quotes[idx].author;
        quoteBlock.style.opacity = 1;
      }, 600);
    };

    // Initial — pick random
    idx = Math.floor(Math.random() * quotes.length);
    textEl.textContent = quotes[idx].text;
    citeEl.textContent = quotes[idx].author;

    quoteBlock.style.transition = 'opacity 0.6s ease';
    setInterval(swap, 8000);
  } catch (err) {
    console.warn('Citations non chargées', err);
  }
}
rotateQuote();

// 3. Apparition douce des éléments au scroll (frise)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Active marker de la frise au passage
      if (entry.target.classList.contains('period')) {
        document.querySelectorAll('.period').forEach(p => p.classList.remove('active'));
        entry.target.classList.add('active');
      }
    }
  });
}, { threshold: 0.2, rootMargin: '-80px 0px -80px 0px' });

document.querySelectorAll('.period').forEach(el => observer.observe(el));

// 4. Mode nuit — bouton flottant + persistance + préférence OS
(function() {
  // base href pour les ressources globales (depuis n'importe quelle profondeur)
  const scripts = document.querySelectorAll('script[src*="main.js"]');
  const baseHref = scripts.length ? scripts[scripts.length-1].src.replace(/assets\/js\/main\.js.*$/, '') : '/';

  // a) Injecter le CSS du mode nuit + palette (un seul include partout)
  if (!document.querySelector('link[data-darkmode]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.dataset.darkmode = '1';
    link.href = baseHref + 'assets/css/dark-mode.css?v=2';
    document.head.appendChild(link);
  }

  // a-bis) Injecter search.js (palette globale, Cmd+K)
  if (!document.querySelector('script[data-search]')) {
    const s = document.createElement('script');
    s.src = baseHref + 'assets/js/search.js?v=2';
    s.dataset.search = '1';
    document.head.appendChild(s);
  }

  // b) Déterminer le thème initial : localStorage > OS > clair
  const stored = (() => { try { return localStorage.getItem('lvdd-theme'); } catch(e) { return null; } })();
  const osDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = stored || (osDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', initialTheme);

  // c) Bouton flottant
  function buildToggle() {
    if (document.querySelector('.theme-toggle')) return;
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Basculer mode jour / mode nuit');
    btn.setAttribute('title', 'Mode jour / nuit');
    btn.innerHTML = '<span class="theme-toggle__icon"></span>';
    document.body.appendChild(btn);

    function syncIcon() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      btn.querySelector('.theme-toggle__icon').textContent = isDark ? '☀' : '☾';
    }
    syncIcon();

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('lvdd-theme', next); } catch(e) {}
      syncIcon();
    });
  }

  if (document.body) buildToggle();
  else document.addEventListener('DOMContentLoaded', buildToggle);
})();

// 5. Service Worker — mode offline + PWA installable
(function() {
  if (!('serviceWorker' in navigator)) return;
  // Enregistre uniquement en production (lavoiedudedans.fr ou GitHub Pages), pas en local dev
  const isProd = location.hostname.endsWith('lavoiedudedans.fr')
              || location.hostname.endsWith('lavoiedudedans.com')
              || location.hostname.endsWith('github.io');
  if (!isProd) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch(err => console.warn('SW registration failed:', err));
  });
})();
