// Horoquest - moteur de quete (Phase 1) : rubis et maitrise, en localStorage.
// Pas de framework, pas de build. A charger avant le script de la page.
window.HQ = (function () {
  const RUBIS_KEY = 'hq_rubis';
  const MASTERY_KEY = 'hq_mastery';
  const POINCON_CAP = 20;

  function getRubis() {
    return parseInt(localStorage.getItem(RUBIS_KEY) || '0', 10) || 0;
  }
  function addRubis(n) {
    const total = getRubis() + (n || 0);
    localStorage.setItem(RUBIS_KEY, String(total));
    return total;
  }

  // difficulty est une echelle 1 a 5 : 1-2 facile (+0), 3 moyen (+5), 4-5 difficile (+10)
  function diffBonus(d) {
    const n = parseInt(d, 10);
    if (n >= 4) return 10;
    if (n === 3) return 5;
    return 0;
  }

  // correctQs : questions reussies (avec .difficulty) ; total : nb de questions du quiz
  function computeRubis(correctQs, total) {
    let r = 0;
    (correctQs || []).forEach(function (q) { r += 10 + diffBonus(q && q.difficulty); });
    if (total > 0 && correctQs && correctQs.length === total) r += 50; // sans-faute
    return r;
  }

  function getMastery() {
    try { return JSON.parse(localStorage.getItem(MASTERY_KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  // enregistre les ids de questions reussies pour une collection ; renvoie le nb distinct maitrise
  function recordMastery(themeSlug, correctIds) {
    if (!themeSlug) return 0;
    const m = getMastery();
    const set = {};
    (m[themeSlug] || []).forEach(function (id) { set[id] = 1; });
    (correctIds || []).forEach(function (id) { if (id != null) set[id] = 1; });
    m[themeSlug] = Object.keys(set);
    localStorage.setItem(MASTERY_KEY, JSON.stringify(m));
    return m[themeSlug].length;
  }
  // objectif de poincon pour une collection de poolSize questions : min(20, taille)
  function poinconTarget(poolSize) {
    return Math.min(POINCON_CAP, poolSize || POINCON_CAP);
  }

  // Le rubis = une pierre percee d'horlogerie (hole jewel) : disque rouge, contre-percage, trou central, reflet de polissage.
  var GEM =
    '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="16" cy="16" r="14" fill="#e23457"/>' +
      '<circle cx="16" cy="16" r="9" fill="#c2243f"/>' +
      '<circle cx="16" cy="16" r="3.3" fill="#ffffff"/>' +
    '</svg>';

  // Rangs (brique 2) : seuils de rubis cumules. Initie a Spiral Breguet ; Gardien du Temps = 20 poincons (Phase 2).
  var RANKS = [
    { name: 'Initié', min: 0,
      line: '« Bienvenue dans l\'Ordre du Spiral. Votre quête commence. »',
      line_en: '"Welcome to the Order of the Spiral. Your quest begins."' },
    { name: 'Remontoir', min: 150,
      line: '« On vous a remonté. Sentez l\'énergie qui monte ? Vous voilà Remontoir. »',
      line_en: '"You\'ve been wound. Feel the energy rising? You are now Remontoir."' },
    { name: 'Rouage', min: 450,
      line: '« Vous tournez juste, à présent. Un rouage de l\'Ordre, et pas le moindre. »',
      line_en: '"You\'re running true now. A cog in the Order, and not the least of them."' },
    { name: 'Échappement', min: 1000,
      line: '« Tic. Tac. C\'est vous qui donnez le tempo, désormais. Échappement. »',
      line_en: '"Tick. Tock. You set the tempo from here on. Échappement."' },
    { name: 'Balancier', min: 2000,
      line: '« Vous tenez la cadence sans trembler. Un vrai Balancier. »',
      line_en: '"You hold the cadence without a tremor. A true Balancier."' },
    { name: 'Spiral Breguet', min: 4000,
      line: '« Le spiral, mon ami : le cœur même de l\'Ordre. Peu y parviennent. Vous voici Spiral Breguet. »',
      line_en: '"The hairspring, my friend: the very heart of the Order. Few reach it. You are now Spiral Breguet."' }
  ];
  function rankIndexFor(total) {
    var idx = 0;
    for (var i = 0; i < RANKS.length; i++) { if (total >= RANKS[i].min) idx = i; }
    return idx;
  }
  function rankInfo(total) {
    var i = rankIndexFor(total);
    var next = RANKS[i + 1] || null;
    return {
      index: i, name: RANKS[i].name, min: RANKS[i].min,
      next: next ? next.name : null, nextMin: next ? next.min : null,
      toNext: next ? (next.min - total) : 0, isMax: !next
    };
  }
  // renvoie le rang atteint si on vient de monter, sinon null
  function rankUp(oldTotal, newTotal) {
    var a = rankIndexFor(oldTotal), b = rankIndexFor(newTotal);
    return b > a ? RANKS[b] : null;
  }

  return {
    getRubis: getRubis, addRubis: addRubis,
    diffBonus: diffBonus, computeRubis: computeRubis,
    getMastery: getMastery, recordMastery: recordMastery,
    poinconTarget: poinconTarget, gem: GEM,
    ranks: RANKS, rankInfo: rankInfo, rankUp: rankUp
  };
})();
