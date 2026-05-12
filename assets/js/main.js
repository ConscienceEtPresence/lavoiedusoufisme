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

  // On préserve le texte du label sans toucher au point doré (.seuil__dot)
  const labelEl = seuil.querySelector('.seuil__label');
  const dotEl = labelEl ? labelEl.querySelector('.seuil__dot') : null;
  const setLabelText = (txt) => {
    if (!labelEl) return;
    labelEl.textContent = txt;
    if (dotEl) labelEl.appendChild(dotEl);
  };

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
      setLabelText('Voici les trois chemins');
      setTimeout(() => doorsReveal.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 700);
    } else {
      setLabelText('Franchir le seuil');
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
