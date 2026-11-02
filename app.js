(() => {
  'use strict';
  const store = {
    get(k, d) { try { const v = localStorage.getItem('frl:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('frl:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  };
  let lang = store.get('lang', 'en');
  let progress = store.get('progress', {});
  let seen = store.get('seen', {});
  let muted = store.get('muted', false);

  const $ = (s, el = document) => el.querySelector(s);
  const app = $('#app');
  const t = (k, vars) => {
    let s = (STRINGS[lang] && STRINGS[lang][k]) || STRINGS.en[k] || k;
    if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]);
    return s;
  };
  const L = (o) => (o ? o[lang] || o.en : '');
  const chapterOf = (id) => CHAPTERS.find((c) => c.id === id);

  function applyLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = t('title');
  }

  // ---------- sound ----------
  let actx = null;
  function tone(f, d = 0.12, type = 'sine', when = 0, vol = 0.13) {
    if (muted) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = f;
      const t0 = actx.currentTime + when;
      g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.001, t0 + d);
      o.connect(g).connect(actx.destination); o.start(t0); o.stop(t0 + d + 0.02);
    } catch (e) { /* no audio */ }
  }
  const sfx = {
    good() { tone(880, 0.1, 'triangle'); tone(1320, 0.15, 'triangle', 0.08); },
    bad() { tone(200, 0.25, 'sawtooth', 0, 0.07); },
    tap() { tone(620, 0.05, 'square', 0, 0.04); },
    win() { [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.18, 'triangle', i * 0.11)); },
  };

  const FACE = `<svg viewBox="0 0 120 120" aria-hidden="true">
    <line x1="60" y1="8" x2="60" y2="24" stroke="#0A0D14" stroke-width="5" stroke-linecap="round"/>
    <circle cx="60" cy="8" r="7" fill="#F26A1B" stroke="#0A0D14" stroke-width="3"/>
    <rect x="14" y="24" width="92" height="78" rx="26" fill="#22D3EE" stroke="#0A0D14" stroke-width="5"/>
    <rect x="26" y="40" width="68" height="34" rx="16" fill="#0A0D14"/>
    <circle cx="45" cy="57" r="8" fill="#a5f3fc"/><circle cx="75" cy="57" r="8" fill="#a5f3fc"/>
    <path d="M46 86 Q60 96 74 86" stroke="#0A0D14" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="4" y="50" width="12" height="24" rx="5" fill="#7C3AED" stroke="#0A0D14" stroke-width="3"/>
    <rect x="104" y="50" width="12" height="24" rx="5" fill="#7C3AED" stroke="#0A0D14" stroke-width="3"/>
    <circle cx="96" cy="100" r="12" fill="#FACC15" stroke="#0A0D14" stroke-width="3"/><path d="M90 100h12M96 94v12" stroke="#0A0D14" stroke-width="3"/>
  </svg>`;

  let cleanups = [], current = -1;
  function teardown() { cleanups.forEach((f) => { try { f(); } catch (e) { /* ignore */ } }); cleanups = []; }

  function topButtons() {
    return `<button class="btn ghost" id="langBtn">${t('langBtn')}</button>
      <button class="btn ghost icon" id="muteBtn">${muted ? '🔇' : '🔊'}</button>`;
  }
  function wireTop() {
    $('#langBtn').onclick = () => { lang = lang === 'en' ? 'ar' : 'en'; store.set('lang', lang); current >= 0 ? openMission(current, true) : renderHome(); };
    $('#muteBtn').onclick = (e) => { muted = !muted; store.set('muted', muted); e.currentTarget.textContent = muted ? '🔇' : '🔊'; };
  }

  // ---------- home ----------
  function renderHome() {
    teardown(); current = -1; applyLang();
    const firstOpen = MISSIONS.findIndex((m) => !progress[m.id]);
    const anyDone = MISSIONS.some((m) => progress[m.id]);
    let n = 0;
    app.innerHTML = `
      <header class="topbar"><div class="brand"><span class="mini">${FACE}</span><b>${t('title')}</b></div><div class="top-actions">${topButtons()}</div></header>
      <section class="hero">
        <div class="hero-face">${FACE}</div>
        <div><h1>${t('title')}</h1><p>${t('subtitle')}</p>
          <button class="btn big run" id="startBtn">${anyDone ? t('continue') : t('start')}</button>
          ${firstOpen === -1 ? `<p class="done-note">${t('allDone')}</p>` : ''}</div>
      </section>
      <section class="chapters">${CHAPTERS.map((c, ci) => {
        const ms = MISSIONS.filter((m) => m.chapter === c.id);
        return `<article class="ccard" style="--c:${c.color}">
          <div class="ccard-head"><span class="cicon">${c.icon}</span><div><small>${ci + 1}</small><h2>${L(c.name)}</h2></div>
            <button class="btn ghost sm" data-learn="${c.id}">${t('learn')}</button></div>
          <p>${L(c.what).split('. ')[0]}.</p>
          <div class="lv-row">${ms.map((m) => {
            n++; const s = progress[m.id] || 0;
            return `<button class="lv" data-m="${MISSIONS.indexOf(m)}"><span class="lv-n">${n}</span><span class="lv-t">${L(m.title)}</span>
              <span class="lv-s">${'★'.repeat(s)}<i>${'★'.repeat(3 - s)}</i></span></button>`;
          }).join('')}</div></article>`;
      }).join('')}</section>`;
    wireTop();
    $('#startBtn').onclick = () => openMission(firstOpen === -1 ? 0 : firstOpen);
    app.querySelectorAll('[data-m]').forEach((b) => (b.onclick = () => openMission(+b.dataset.m)));
    app.querySelectorAll('[data-learn]').forEach((b) => (b.onclick = () => showChapter(chapterOf(b.dataset.learn))));
  }

  // ---------- modal ----------
  const modal = $('#modal'), card = $('#modalCard');
  const openModal = (html, wire) => { card.innerHTML = html; modal.classList.remove('hidden'); wire && wire(card); };
  const closeModal = () => modal.classList.add('hidden');
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  function showChapter(c) {
    openModal(`<div class="concept-modal" style="--c:${c.color}">
      <div class="cm-icon">${c.icon}</div><h2>${L(c.name)}</h2><p class="cm-what">${L(c.what)}</p>
      <div class="cm-grid"><div><h4>🌍 ${t('inLife')}</h4><p>${L(c.life)}</p></div><div><h4>🧰 ${t('inKit')}</h4><p>${L(c.kit)}</p></div></div>
      <details class="tip"><summary>${t('teacherTip')}</summary><p>${L(c.tip)}</p></details>
      <button class="btn big run" id="goBtn">${t('letsGo')}</button></div>`, (m) => { $('#goBtn', m).onclick = closeModal; });
  }

  // ---------- mission ----------
  function openMission(i, keepSeen) {
    teardown(); closeModal();
    current = i; applyLang();
    const m = MISSIONS[i], c = chapterOf(m.chapter);
    let mistakes = 0, won = false, fails = 0;
    app.innerHTML = `
      <header class="topbar" style="--c:${c.color}">
        <button class="btn ghost" id="backBtn">${t('map')}</button>
        <div class="lvl-title"><button class="chip" id="chapBtn">${c.icon} ${L(c.name)}</button><h1>${i + 1}. ${L(m.title)}</h1></div>
        <div class="top-actions">${topButtons()}</div>
      </header>
      <main class="mission-screen" style="--c:${c.color}">
        <section class="left">
          <div class="mission"><span>🎯</span><p>${L(m.goal)}</p></div>
          <div id="stage" class="stage"></div>
          <div id="msg" class="msg" role="status"></div>
        </section>
        <section class="right">
          <div class="card panel" id="panel"></div>
          <div class="row"><button class="btn" id="hintBtn">${t('hint')}</button><button class="btn" id="restart">${t('reset')}</button>
            <span class="mist" id="mist">${t('mistakes', { n: 0 })}</span></div>
        </section>
      </main>`;
    wireTop();
    $('#backBtn').onclick = renderHome;
    $('#chapBtn').onclick = () => showChapter(c);
    $('#restart').onclick = () => openMission(i, true);
    const setMsg = (text, kind = '') => { const el = $('#msg'); if (el) { el.className = 'msg ' + kind; el.textContent = text; } };
    $('#hintBtn').onclick = () => setMsg('💡 ' + L(m.hint), 'hint');
    const ctx = {
      t, L, sfx, setMsg,
      stage: $('#stage'), panel: $('#panel'),
      onCleanup: (f) => cleanups.push(f),
      mistake: () => {
        mistakes++; fails++;
        const el = $('#mist'); if (el) el.textContent = t('mistakes', { n: mistakes });
        if (fails >= 2) $('#hintBtn').classList.add('glow');
      },
      win: () => { if (!won) { won = true; onWin(i, mistakes); } },
    };
    Sim.mount[m.type](m, ctx);
    if (!seen[m.chapter] && !keepSeen) { seen[m.chapter] = true; store.set('seen', seen); showChapter(c); }
  }

  function onWin(i, mistakes) {
    const m = MISSIONS[i], c = chapterOf(m.chapter);
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    progress[m.id] = Math.max(progress[m.id] || 0, stars);
    store.set('progress', progress);
    sfx.win(); confetti();
    const next = MISSIONS[i + 1];
    const last = !next || next.chapter !== m.chapter;
    setTimeout(() => openModal(`
      <div class="win-modal" style="--c:${c.color}">
        <div class="win-face">${FACE}</div><h2>${t('win')}</h2>
        <div class="stars">${[1, 2, 3].map((k) => `<span class="${k <= stars ? 'on' : ''}" style="animation-delay:${k * 0.15}s">★</span>`).join('')}</div>
        <p class="small">${t('mistakes', { n: mistakes })}</p>
        ${last ? `<div class="learned"><b>${c.icon} ${t('learned', { c: L(c.name) })}</b><p>${L(c.what)}</p></div>` : ''}
        <div class="win-actions"><button class="btn" id="wR">${t('replay')}</button><button class="btn" id="wM">${t('toMap')}</button>
          ${next ? `<button class="btn run" id="wN">${t('next')}</button>` : ''}</div>
      </div>`, (el) => {
      $('#wR', el).onclick = () => openMission(i, true);
      $('#wM', el).onclick = () => { closeModal(); renderHome(); };
      if (next) $('#wN', el).onclick = () => openMission(i + 1);
    }), 800);
  }

  function confetti() {
    const box = $('#confetti');
    const colors = ['#F26A1B', '#22D3EE', '#7C3AED', '#FACC15', '#22C55E', '#EC4899'];
    for (let k = 0; k < 70; k++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + 'vw';
      p.style.background = colors[k % colors.length];
      p.style.animationDelay = Math.random() * 0.5 + 's';
      p.style.animationDuration = 1.6 + Math.random() * 1.4 + 's';
      box.appendChild(p);
      setTimeout(() => p.remove(), 3600);
    }
  }

  renderHome();
})();
