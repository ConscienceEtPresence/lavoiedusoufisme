/* Bouton 🔊 sur la page d'un Nom — synthèse vocale arabe */
(function () {
  var btn = document.getElementById('nd-listen');
  if (!btn) return;
  if (!('speechSynthesis' in window)) { btn.style.display = 'none'; return; }
  var article = document.querySelector('.nd-nom');
  var ar = article ? article.getAttribute('data-ar') : null;
  if (!ar) { btn.style.display = 'none'; return; }
  btn.addEventListener('click', function () {
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(ar);
      u.lang = 'ar-SA'; u.rate = 0.78;
      var vs = window.speechSynthesis.getVoices() || [];
      for (var i = 0; i < vs.length; i++) if ((vs[i].lang || '').toLowerCase().indexOf('ar') === 0) { u.voice = vs[i]; break; }
      window.speechSynthesis.speak(u);
    } catch (e) {}
  });
})();
