/* ============================================================
   Le souffle — petite sphère qui respire, présente discrètement
   sur le site. Un effleurement → « Comment je me sens aujourd'hui ».
   Entièrement autonome (injecte ses propres styles). Se masque sur
   la carte intérieure elle-même et respecte prefers-reduced-motion.
   ============================================================ */
(function () {
  if (/\/pages\/echiquier\/meteo\/?/.test(location.pathname)) return; // pas de doublon sur la carte
  if (document.querySelector('.souffle')) return;

  var css = `
  .souffle{position:fixed;left:max(1rem,env(safe-area-inset-left));bottom:max(1.1rem,env(safe-area-inset-bottom));
    z-index:9000;display:flex;align-items:center;gap:.6rem;text-decoration:none;-webkit-tap-highlight-color:transparent;}
  .souffle__orb{position:relative;flex:0 0 auto;width:3.1rem;height:3.1rem;border-radius:50%;
    display:grid;place-items:center;
    background:radial-gradient(circle at 38% 32%, #f3e2b0, #cda24a 46%, #9d7a2e 100%);
    box-shadow:0 6px 20px rgba(120,90,20,.34), inset 0 1px 2px rgba(255,255,255,.55);
    animation:souffle-breath 5s ease-in-out infinite;}
  .souffle__halo{position:absolute;left:max(1rem,env(safe-area-inset-left));bottom:max(1.1rem,env(safe-area-inset-bottom));
    width:3.1rem;height:3.1rem;border-radius:50%;pointer-events:none;z-index:-1;
    background:radial-gradient(circle, rgba(205,162,74,.55), rgba(205,162,74,0) 70%);
    animation:souffle-halo 5s ease-in-out infinite;}
  .souffle__glyph{width:1.5rem;height:1.5rem;color:#fffaf0;opacity:.92;}
  .souffle__glyph svg{width:100%;height:100%;display:block;}
  .souffle__label{display:flex;flex-direction:column;line-height:1.1;max-width:0;opacity:0;overflow:hidden;white-space:nowrap;
    transition:max-width .45s cubic-bezier(.2,.8,.2,1),opacity .35s;
    background:rgba(251,247,238,.96);border:1px solid rgba(176,141,60,.5);border-radius:1.4rem;
    box-shadow:0 6px 20px rgba(120,90,20,.18);padding:0;}
  .souffle:hover .souffle__label,.souffle:focus-visible .souffle__label,.souffle.is-open .souffle__label{
    max-width:14rem;opacity:1;padding:.42rem .9rem .45rem;}
  .souffle__ar{font-family:'Amiri',serif;font-size:1.05rem;color:#8a6d28;}
  .souffle__fr{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:.95rem;color:#3a3326;}
  @keyframes souffle-breath{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
  @keyframes souffle-halo{0%,100%{transform:scale(1);opacity:.35}50%{transform:scale(1.7);opacity:0}}
  @media (prefers-color-scheme:dark){
    .souffle__label{background:rgba(28,24,16,.92);border-color:rgba(205,162,74,.55);}
    .souffle__fr{color:#e9dfc8;}.souffle__ar{color:#d9b863;}}
  @media (prefers-reduced-motion:reduce){
    .souffle__orb,.souffle__halo{animation:none}.souffle__halo{opacity:.28}}
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var _sfEN = document.documentElement.lang === 'en';
  var a = document.createElement('a');
  a.href = (_sfEN ? '/en' : '') + '/pages/echiquier/meteo/';
  a.className = 'souffle';
  a.setAttribute('aria-label', _sfEN ? 'How I feel today — inner map' : "Comment je me sens aujourd'hui — carte intérieure");
  a.innerHTML =
    '<span class="souffle__halo" aria-hidden="true"></span>' +
    '<span class="souffle__orb">' +
      '<span class="souffle__glyph" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3">' +
        '<circle cx="16" cy="16" r="12"/><circle cx="16" cy="16" r="6.5"/><circle cx="16" cy="16" r="1.6" fill="currentColor"/>' +
      '</svg></span>' +
    '</span>' +
    '<span class="souffle__label">' +
      '<span class="souffle__ar" lang="ar" dir="rtl">كيف حالُ قلبي؟</span>' +
      '<span class="souffle__fr">' + (_sfEN ? 'How I feel?' : 'Comment je me sens ?') + '</span>' +
    '</span>';

  // sur mobile (sans survol), un premier toucher déploie le murmure, le second ouvre la carte
  var coarse = window.matchMedia && window.matchMedia('(hover: none)').matches;
  if (coarse) {
    a.addEventListener('click', function (e) {
      if (!a.classList.contains('is-open')) { e.preventDefault(); a.classList.add('is-open'); }
    });
    document.addEventListener('click', function (e) { if (!a.contains(e.target)) a.classList.remove('is-open'); });
  }

  document.body.appendChild(a);
})();
