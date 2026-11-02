// Robot simulation helpers + one mount() function per mission type.
// World units are pixels on an 800×500 canvas; 4 px = 1 cm.

const Sim = (() => {
  'use strict';
  const W = 800, H = 500, PX_CM = 4;
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const deg = (r) => (r * 180) / Math.PI;
  const rad = (d) => (d * Math.PI) / 180;
  const wrap = (a) => { while (a > Math.PI) a -= TAU; while (a < -Math.PI) a += TAU; return a; };

  function makeCanvas(host, w = W, h = H) {
    const c = document.createElement('canvas');
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    c.width = w * dpr; c.height = h * dpr;
    c.className = 'sim';
    c.style.aspectRatio = w + ' / ' + h;
    host.appendChild(c);
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    const toWorld = (e) => {
      const r = c.getBoundingClientRect();
      return { x: ((e.clientX - r.left) * w) / r.width, y: ((e.clientY - r.top) * h) / r.height };
    };
    return { c, g, w, h, toWorld };
  }

  function loop(fn) {
    let last = performance.now(), id, alive = true;
    const tick = (now) => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      fn(dt);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => { alive = false; cancelAnimationFrame(id); };
  }

  // ---------- robot ----------
  class Bot {
    constructor(x, y, th) { this.x = x; this.y = y; this.th = th; this.L = 0; this.R = 0; this.r = 22; this.base = 40; }
    // L/R in px/s. Positive th is clockwise on screen (y points down).
    step(dt) {
      const v = (this.L + this.R) / 2, w = (this.L - this.R) / this.base;
      this.th = wrap(this.th + w * dt);
      this.x += Math.cos(this.th) * v * dt;
      this.y += Math.sin(this.th) * v * dt;
    }
    // point relative to robot: fwd ahead, side to the robot's right
    pt(fwd, side) {
      const c = Math.cos(this.th), s = Math.sin(this.th);
      return { x: this.x + c * fwd - s * side, y: this.y + s * fwd + c * side };
    }
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }

  function drawBot(g, b, opt = {}) {
    g.save();
    g.translate(b.x, b.y);
    g.rotate(b.th);
    const r = b.r;
    g.shadowColor = '#0004'; g.shadowBlur = 6; g.shadowOffsetY = 3;
    // wheels (left wheel is at -y in robot space)
    const wheel = (side, power) => {
      g.fillStyle = '#1f2937';
      roundRect(g, -13, side * (r - 1) - 5, 26, 10, 4); g.fill();
      if (opt.showPower && power) {
        g.fillStyle = power > 0 ? '#22C55E' : '#EF4444';
        const len = (Math.abs(power) / 100) * 22;
        g.beginPath();
        const y0 = side * (r + 10);
        const dir = Math.sign(power);
        g.moveTo(-dir * len / 2, y0 - 3); g.lineTo(dir * len / 2, y0 - 3); g.lineTo(dir * (len / 2 + 6), y0);
        g.lineTo(dir * len / 2, y0 + 3); g.lineTo(-dir * len / 2, y0 + 3); g.closePath(); g.fill();
      }
    };
    wheel(-1, opt.powerL); wheel(1, opt.powerR);
    g.shadowColor = 'transparent';
    g.fillStyle = '#22D3EE'; g.strokeStyle = '#0A0D14'; g.lineWidth = 3;
    roundRect(g, -r, -r + 3, 2 * r, 2 * r - 6, 12); g.fill(); g.stroke();
    g.fillStyle = '#0A0D14'; roundRect(g, 4, -11, 13, 22, 6); g.fill();
    g.fillStyle = '#a5f3fc';
    g.beginPath(); g.arc(11, -5, 3, 0, TAU); g.arc(11, 5, 3, 0, TAU); g.fill();
    g.fillStyle = '#F26A1B';
    g.beginPath(); g.arc(-9, 0, 5, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(r + 9, 0); g.lineTo(r + 1, -7); g.lineTo(r + 1, 7); g.closePath();
    g.fill(); g.lineWidth = 2; g.stroke();
    g.restore();
  }

  function drawFloor(g, w = W, h = H) {
    g.fillStyle = '#EEF6F0'; g.fillRect(0, 0, w, h);
    g.strokeStyle = '#d7e7db'; g.lineWidth = 1;
    g.beginPath();
    for (let x = 40; x < w; x += 40) { g.moveTo(x, 0); g.lineTo(x, h); }
    for (let y = 40; y < h; y += 40) { g.moveTo(0, y); g.lineTo(w, y); }
    g.stroke();
  }
  function drawWalls(g, walls) {
    for (const r of walls) {
      g.fillStyle = '#C2410C'; g.fillRect(r.x, r.y, r.w, r.h);
      g.strokeStyle = '#7c2d12'; g.lineWidth = 2;
      g.beginPath();
      for (let y = r.y + 12; y < r.y + r.h; y += 12) { g.moveTo(r.x, y); g.lineTo(r.x + r.w, y); }
      g.stroke();
    }
  }
  function drawZone(g, x, y, rr, label) {
    g.fillStyle = '#22C55E33'; g.strokeStyle = '#16A34A'; g.lineWidth = 3; g.setLineDash([8, 6]);
    g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill(); g.stroke(); g.setLineDash([]);
    if (label) { g.fillStyle = '#166534'; g.font = 'bold 13px system-ui'; g.textAlign = 'center'; g.fillText(label, x, y + rr + 16); }
  }
  function emoji(g, ch, x, y, size = 28) {
    g.font = `${size}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(ch, x, y);
    g.textBaseline = 'alphabetic';
  }

  const inRect = (x, y, r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
  function hitsWall(b, walls, w = W, h = H) {
    if (b.x - b.r < 0 || b.y - b.r < 0 || b.x + b.r > w || b.y + b.r > h) return true;
    for (const r of walls) {
      const nx = clamp(b.x, r.x, r.x + r.w), ny = clamp(b.y, r.y, r.y + r.h);
      if ((b.x - nx) ** 2 + (b.y - ny) ** 2 < (b.r - 2) ** 2) return true;
    }
    return false;
  }
  function raycast(x, y, th, walls, max = 1200) {
    const c = Math.cos(th), s = Math.sin(th);
    for (let d = 0; d < max; d += 1) {
      const px = x + c * d, py = y + s * d;
      if (px < 0 || py < 0 || px > W || py > H) return d;
      for (const r of walls) if (inRect(px, py, r)) return d;
    }
    return max;
  }

  // ======================================================================
  // MISSION: parts sort
  // ======================================================================
  function mountParts(m, ctx) {
    const { t, L } = ctx;
    const bins = ['sense', 'think', 'act', 'power'];
    const binIcon = { sense: '👀', think: '🧠', act: '💪', power: '🔋' };
    const order = PARTS.slice().sort(() => Math.random() - 0.5);
    ctx.stage.innerHTML = `
      <div class="parts">
        <div class="bins">${bins.map((b) => `<button class="bin bin-${b}" data-bin="${b}">
          <span class="bin-h">${binIcon[b]} ${t(b)}</span><small>${t(b + 'D')}</small><div class="bin-items"></div></button>`).join('')}</div>
        <div class="pool">${order.map((p) => `<button class="part" data-part="${p.id}" draggable="true"><span>${p.icon}</span>${L(p.name)}</button>`).join('')}</div>
      </div>`;
    ctx.panel.innerHTML = `<p class="lead">${t('pickPart')}</p><div class="fact" id="fact"></div>`;
    let sel = null, placed = 0;
    const fact = ctx.panel.querySelector('#fact');
    const select = (el) => {
      ctx.stage.querySelectorAll('.part.sel').forEach((e) => e.classList.remove('sel'));
      sel = el; if (el) el.classList.add('sel');
    };
    const place = (partId, bin) => {
      const p = PARTS.find((x) => x.id === partId);
      const el = ctx.stage.querySelector(`[data-part="${partId}"]`);
      if (!p || !el || el.classList.contains('done')) return;
      if (p.bin === bin) {
        el.classList.add('done'); el.classList.remove('sel'); el.draggable = false;
        ctx.stage.querySelector(`[data-bin="${bin}"] .bin-items`).appendChild(el);
        fact.innerHTML = `<b>${p.icon} ${L(p.name)}</b><br>${L(p.fact)}`;
        fact.className = 'fact good';
        ctx.sfx.good(); placed++; sel = null;
        if (placed === PARTS.length) ctx.win();
      } else {
        el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake');
        fact.textContent = t('wrongBin'); fact.className = 'fact bad';
        ctx.sfx.bad(); ctx.mistake();
      }
    };
    ctx.stage.querySelectorAll('.part').forEach((el) => {
      el.onclick = () => { if (!el.classList.contains('done')) { select(el); ctx.sfx.tap(); } };
      el.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', el.dataset.part); });
    });
    ctx.stage.querySelectorAll('.bin').forEach((b) => {
      b.onclick = () => { if (sel) place(sel.dataset.part, b.dataset.bin); };
      b.addEventListener('dragover', (e) => { e.preventDefault(); b.classList.add('over'); });
      b.addEventListener('dragleave', () => b.classList.remove('over'));
      b.addEventListener('drop', (e) => { e.preventDefault(); b.classList.remove('over'); place(e.dataTransfer.getData('text/plain'), b.dataset.bin); });
    });
  }

  // ======================================================================
  // MISSION: drive with two motor sliders
  // ======================================================================
  function motorState(l, r) {
    if (!l && !r) return 'st_stop';
    if (l === r) return l > 0 ? 'st_fwd' : 'st_back';
    if (l === -r) return r > 0 ? 'st_spinL' : 'st_spinR';
    if (!l) return 'st_pivotL';
    if (!r) return 'st_pivotR';
    if (Math.sign(l) !== Math.sign(r)) return Math.abs(r) > Math.abs(l) ? 'st_spinL' : 'st_spinR';
    return Math.abs(r) > Math.abs(l) ? (l > 0 ? 'st_curveL' : 'st_curveR') : (l > 0 ? 'st_curveR' : 'st_curveL');
  }

  function motorPanel(ctx, linkedByDefault) {
    const { t } = ctx;
    const slider = (id, label) => `<div class="mslider"><label>${t(label)}</label><output id="${id}v">0</output>
      <input type="range" id="${id}" min="-100" max="100" step="10" value="0" orient="vertical">
      <div class="pm"><button class="pmb" data-for="${id}" data-d="-10" aria-label="minus">−</button><button class="pmb" data-for="${id}" data-d="10" aria-label="plus">+</button></div></div>`;
    ctx.panel.innerHTML = `
      <div class="motors" dir="ltr">${slider('lm', 'leftMotor')}<div class="mbot">${ROBOT_FACE}</div>${slider('rm', 'rightMotor')}</div>
      <label class="link"><input type="checkbox" id="link" ${linkedByDefault ? 'checked' : ''}> ${t('linkMotors')}</label>
      <div class="explain" id="explain"></div>
      <div class="row"><button class="btn run big" id="goM">${t('go')}</button><button class="btn" id="resetB">${t('resetBot')}</button></div>`;
    const q = (sel) => ctx.panel.querySelector(sel);
    const lm = q('#lm'), rm = q('#rm'), link = q('#link'), goB = q('#goM');
    const st = { l: 0, r: 0, running: false };
    const upd = () => {
      st.l = +lm.value; st.r = +rm.value;
      q('#lmv').textContent = st.l; q('#rmv').textContent = st.r;
      const what = t(motorState(st.l, st.r));
      q('#explain').textContent = st.running || (!st.l && !st.r) ? what : t('ready') + ' ' + what;
      goB.textContent = st.running ? t('stopGo') : t('go');
      goB.classList.toggle('stop', st.running);
    };
    const setFrom = (src) => { if (link.checked) (src === lm ? rm : lm).value = src.value; upd(); };
    lm.oninput = () => setFrom(lm); rm.oninput = () => setFrom(rm);
    ctx.panel.querySelectorAll('.pmb').forEach((b) => (b.onclick = () => {
      const el = q('#' + b.dataset.for);
      el.value = clamp(+el.value + +b.dataset.d, -100, 100);
      setFrom(el); ctx.sfx.tap();
    }));
    link.onchange = () => { if (link.checked) { rm.value = lm.value; upd(); } };
    st.halt = () => { st.running = false; upd(); };
    st.stop = () => { lm.value = 0; rm.value = 0; st.running = false; upd(); };
    goB.onclick = () => { st.running = !st.running; ctx.setMsg(''); upd(); };
    st.onReset = null;
    q('#resetB').onclick = () => { st.halt(); st.onReset && st.onReset(); ctx.setMsg(''); };
    upd();
    return st;
  }

  function mountDrive(m, ctx) {
    const { t } = ctx;
    const cv = makeCanvas(ctx.stage);
    const g = cv.g;
    const mp = motorPanel(ctx, m.variant === 'straight');
    const SPEED = 1.3; // px/s per motor unit
    let bot, walls = [], zone = null, lanterns = [], litIdx = 0, hold = 0, bumpT = 0, done = false;
    const center = { x: 400, y: 260, r: 46 };
    function reset() {
      if (m.variant === 'straight') { bot = new Bot(120, 250, 0); zone = { x: 640, y: 250, r: 42 }; walls = []; }
      if (m.variant === 'curve') { bot = new Bot(110, 400, 0); zone = { x: 680, y: 400, r: 42 }; walls = [{ x: 330, y: 190, w: 60, h: 310 }]; }
      if (m.variant === 'spin') {
        bot = new Bot(center.x, center.y, 0);
        if (!lanterns.length) lanterns = [100, 210, 320].map((a) => ({ a: rad(a), lit: false }));
      }
    }
    mp.onReset = reset;
    reset();
    debug.get = () => bot;
    const stop = loop((dt) => {
      if (done) { draw(); return; }
      bot.L = mp.running ? mp.l * SPEED : 0; bot.R = mp.running ? mp.r * SPEED : 0;
      for (let i = 0; i < 4; i++) {
        const px = bot.x, py = bot.y;
        bot.step(dt / 4);
        if (hitsWall(bot, walls)) {
          bot.x = px; bot.y = py;
          // stop on a bump so one crash counts as one mistake
          ctx.sfx.bad(); ctx.mistake(); ctx.setMsg(t('bump'), 'bad'); mp.halt();
          break;
        }
      }
      bumpT -= dt;
      if (m.variant === 'spin') {
        if (Math.hypot(bot.x - center.x, bot.y - center.y) > center.r) {
          ctx.sfx.bad(); ctx.mistake(); ctx.setMsg(t('leftCircle'), 'bad');
          mp.halt(); bot.x = center.x; bot.y = center.y;
        }
        const target = lanterns[litIdx];
        if (target) {
          const diff = Math.abs(wrap(bot.th - target.a));
          hold = diff < rad(9) ? hold + dt : 0;
          if (hold > 0.5) { target.lit = true; litIdx++; hold = 0; ctx.sfx.good(); if (litIdx === lanterns.length) { done = true; mp.halt(); ctx.win(); } }
        }
      } else if (Math.hypot(bot.x - zone.x, bot.y - zone.y) < zone.r - 6 && (!mp.running || (!mp.l && !mp.r))) {
        done = true; ctx.win();
      }
      draw();
    });
    function draw() {
      drawFloor(g);
      drawWalls(g, walls);
      if (zone) drawZone(g, zone.x, zone.y, zone.r, t('stopHere'));
      if (m.variant === 'spin') {
        g.strokeStyle = '#0A0D14'; g.lineWidth = 2; g.setLineDash([6, 6]);
        g.beginPath(); g.arc(center.x, center.y, center.r, 0, TAU); g.stroke(); g.setLineDash([]);
        lanterns.forEach((ln, i) => {
          const x = center.x + Math.cos(ln.a) * 190, y = center.y + Math.sin(ln.a) * 190;
          const active = i === litIdx;
          if (ln.lit || active) {
            g.fillStyle = ln.lit ? '#FACC1566' : '#FACC1522';
            g.beginPath(); g.arc(x, y, active ? 36 + Math.sin(performance.now() / 200) * 4 : 34, 0, TAU); g.fill();
          }
          g.globalAlpha = ln.lit || active ? 1 : 0.35;
          emoji(g, '🏮', x, y, 34);
          g.globalAlpha = 1;
        });
        // aim beam
        const p = bot.pt(bot.r + 8, 0);
        g.strokeStyle = '#F26A1B88'; g.lineWidth = 3; g.setLineDash([4, 8]);
        g.beginPath(); g.moveTo(p.x, p.y); const q = bot.pt(170, 0); g.lineTo(q.x, q.y); g.stroke(); g.setLineDash([]);
        if (hold > 0) { g.strokeStyle = '#F59E0B'; g.lineWidth = 5; g.beginPath(); g.arc(bot.x, bot.y, 32, -Math.PI / 2, -Math.PI / 2 + (hold / 0.5) * TAU); g.stroke(); }
      }
      drawBot(g, bot, { showPower: mp.running, powerL: mp.l, powerR: mp.r });
    }
    ctx.onCleanup(stop);
    if (m.variant === 'spin') ctx.setMsg(t('holdAim'), 'hint');
  }

  // ======================================================================
  // MISSION: servo launcher
  // ======================================================================
  function mountServo(m, ctx) {
    const { t } = ctx;
    const cv = makeCanvas(ctx.stage);
    const g = cv.g;
    const base = { x: 400, y: 470 };
    const balloons = [35, 125, 70].map((a, i) => ({ a, r: 300 + (i % 2) * 30, popped: false, wob: Math.random() * 6 }));
    balloons.forEach((b) => { b.x = base.x + Math.cos(rad(b.a)) * b.r; b.y = base.y - Math.sin(rad(b.a)) * b.r; });
    let cur = 90, want = 90, ball = null, done = false, pops = [];
    ctx.panel.innerHTML = `
      <label class="lbl">${t('servoAngle')}: <b id="av">90°</b></label>
      <input type="range" id="ang" min="0" max="180" step="1" value="90" dir="rtl" class="wide">
      <div class="row"><input type="number" id="angN" min="0" max="180" value="90" class="numbox"> °
        <button class="btn run" id="fire">${t('fire')}</button></div>
      <div class="monitor"><h4>${t('monitor')}</h4><div id="sv"></div></div>`;
    const ang = ctx.panel.querySelector('#ang'), angN = ctx.panel.querySelector('#angN');
    const setWant = (v) => { want = clamp(Math.round(+v || 0), 0, 180); ang.value = want; angN.value = want; ctx.panel.querySelector('#av').textContent = want + '°'; };
    ang.oninput = () => setWant(ang.value);
    angN.oninput = () => setWant(angN.value);
    ctx.panel.querySelector('#fire').onclick = () => {
      if (ball || done) return;
      const a = rad(cur);
      ball = { x: base.x + Math.cos(a) * 60, y: base.y - Math.sin(a) * 60, vx: Math.cos(a) * 650, vy: -Math.sin(a) * 650 };
      ctx.sfx.tap();
    };
    const stop = loop((dt) => {
      // servo moves toward target at limited speed (it has its own feedback loop)
      const d = want - cur;
      cur += clamp(d, -150 * dt, 150 * dt);
      ctx.panel.querySelector('#sv').textContent = t('servoNow', { a: Math.round(cur), b: want });
      if (ball) {
        ball.x += ball.vx * dt; ball.y += ball.vy * dt;
        for (const b of balloons) {
          if (!b.popped && Math.hypot(ball.x - b.x, ball.y - b.y) < 30) {
            b.popped = true; pops.push({ x: b.x, y: b.y, t: 0 }); ball = null; ctx.sfx.good();
            if (balloons.every((q) => q.popped)) { done = true; ctx.win(); }
            break;
          }
        }
        if (ball && (ball.x < -20 || ball.x > W + 20 || ball.y < -20)) { ball = null; ctx.sfx.bad(); ctx.mistake(); ctx.setMsg(t('miss'), 'bad'); }
      }
      draw(dt);
    });
    function draw(dt) {
      g.fillStyle = '#EAF6FF'; g.fillRect(0, 0, W, H);
      // protractor
      g.strokeStyle = '#94a3b8'; g.lineWidth = 2;
      g.beginPath(); g.arc(base.x, base.y, 360, Math.PI, 0); g.stroke();
      g.font = 'bold 13px system-ui'; g.textAlign = 'center'; g.fillStyle = '#475569';
      for (let a = 0; a <= 180; a += 10) {
        const c = Math.cos(rad(a)), s = Math.sin(rad(a));
        const long = a % 30 === 0;
        g.strokeStyle = long ? '#475569' : '#cbd5e1'; g.lineWidth = long ? 2 : 1;
        g.beginPath(); g.moveTo(base.x + c * 110, base.y - s * 110); g.lineTo(base.x + c * (long ? 380 : 372), base.y - s * (long ? 380 : 372)); g.stroke();
        if (long || a % 10 === 0) {
          g.fillStyle = long ? '#0A0D14' : '#94a3b8';
          g.font = (long ? 'bold 14px' : '11px') + ' system-ui';
          g.fillText(a + '°', base.x + c * 400, base.y - s * 400 + 5);
        }
      }
      // balloons
      for (const b of balloons) {
        if (b.popped) continue;
        b.wob += dt * 2;
        g.strokeStyle = '#64748b'; g.lineWidth = 1;
        g.beginPath(); g.moveTo(b.x, b.y + 18); g.quadraticCurveTo(b.x + 6, b.y + 32, b.x, b.y + 46); g.stroke();
        emoji(g, '🎈', b.x + Math.sin(b.wob) * 2, b.y, 44);
      }
      pops = pops.filter((p) => (p.t += dt) < 0.6);
      for (const p of pops) { g.globalAlpha = 1 - p.t / 0.6; emoji(g, '💥', p.x, p.y, 40 + p.t * 60); g.globalAlpha = 1; }
      // launcher
      const a = rad(cur);
      g.save(); g.translate(base.x, base.y); g.rotate(-a);
      g.fillStyle = '#7C3AED'; g.strokeStyle = '#0A0D14'; g.lineWidth = 3;
      roundRect(g, 0, -10, 70, 20, 8); g.fill(); g.stroke();
      g.restore();
      g.fillStyle = '#1f2937'; roundRect(g, base.x - 34, base.y - 18, 68, 40, 8); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(base.x, base.y, 12, 0, TAU); g.fill();
      g.fillStyle = '#0A0D14'; g.font = 'bold 15px system-ui'; g.textAlign = 'center';
      g.fillText(Math.round(cur) + '°', base.x, base.y - 30);
      if (ball) { g.fillStyle = '#F26A1B'; g.beginPath(); g.arc(ball.x, ball.y, 9, 0, TAU); g.fill(); g.strokeStyle = '#0A0D14'; g.lineWidth = 2; g.stroke(); }
    }
    ctx.onCleanup(stop);
  }

  // ======================================================================
  // MISSION: gears
  // ======================================================================
  function mountGears(m, ctx) {
    const { t, L } = ctx;
    const rounds = [
      { icon: '⛰️', name: { en: 'Steep hill', ar: 'تلّة شديدة' }, slope: 28, need: 2.5, limit: 30, desc: { en: 'Very steep! Fahim needs to be at least 2.5× stronger.', ar: 'شديدة الانحدار! يحتاج فهيم أن يكون أقوى 2.5 مرة على الأقل.' } },
      { icon: '🏁', name: { en: 'Race', ar: 'سباق' }, slope: 0, need: 0.3, limit: 3.5, desc: { en: 'Flat road. Finish in 3.5 seconds or less!', ar: 'طريق مستوٍ. أنهِ في 3.5 ثانية أو أقل!' } },
      { icon: '📦', name: { en: 'Heavy delivery', ar: 'توصيل ثقيل' }, slope: 12, need: 1.4, limit: 11, desc: { en: 'Heavy box up a small hill: at least 1.4× stronger AND finish within 11 seconds.', ar: 'صندوق ثقيل على تلّة صغيرة: أقوى 1.4 مرة على الأقل وأنهِ خلال 11 ثانية.' } },
    ];
    const BASE_TIME = 6; // seconds at ratio 1
    let ri = 0, drv = 16, drn = 16, anim = null, angle = 0;
    const cv = makeCanvas(ctx.stage);
    const g = cv.g;
    function renderPanel() {
      const r = rounds[ri];
      const ratio = drn / drv;
      // speed needed to finish inside the time limit
      const needSpd = (BASE_TIME * (1 + r.slope / 60)) / r.limit;
      const okStr = ratio >= r.need - 1e-9, okSpd = 1 / ratio >= needSpd - 1e-9;
      ctx.panel.innerHTML = `
        <div class="round"><b>${t('round', { n: ri + 1, m: rounds.length })}: ${r.icon} ${L(r.name)}</b><p>${L(r.desc)}</p></div>
        <label class="lbl">${t('motorGear')}</label>
        <div class="choices" id="drv">${[8, 16, 24].map((n) => `<button class="choice${n === drv ? ' on' : ''}" data-n="${n}">${t('teeth', { n })}</button>`).join('')}</div>
        <label class="lbl">${t('wheelGear')}</label>
        <div class="choices" id="drn">${[8, 16, 24, 40].map((n) => `<button class="choice${n === drn ? ' on' : ''}" data-n="${n}">${t('teeth', { n })}</button>`).join('')}</div>
        <div class="monitor"><h4>${t('ratio')}: ${drn} ÷ ${drv} = <b>${+ratio.toFixed(2)}</b></h4>
          <p class="gear-say">${gearSentence(ratio)}</p>
          <div class="bar"><span>${t('strength')}</span><i style="--v:${Math.min(100, ratio * 20)}%;--c:#DC2626"></i><b>×${+ratio.toFixed(2)}</b></div>
          <div class="bar"><span>${t('speed')}</span><i style="--v:${Math.min(100, (1 / ratio) * 20)}%;--c:#2563EB"></i><b>×${+(1 / ratio).toFixed(2)}</b></div>
        </div>
        <div class="needs"><b>${t('needs')}</b>
          <span class="${okStr ? 'ok' : 'no'}">${okStr ? '✅' : '❌'} 💪 ${t('strength')} ≥ ×${r.need}</span>
          <span class="${okSpd ? 'ok' : 'no'}">${okSpd ? '✅' : '❌'} ⚡ ${t('speed')} ≥ ×${+needSpd.toFixed(2)}</span></div>
        <button class="btn run" id="test">${t('test')}</button>`;
      ctx.panel.querySelectorAll('#drv .choice').forEach((b) => (b.onclick = () => { if (anim) return; drv = +b.dataset.n; ctx.sfx.tap(); renderPanel(); }));
      ctx.panel.querySelectorAll('#drn .choice').forEach((b) => (b.onclick = () => { if (anim) return; drn = +b.dataset.n; ctx.sfx.tap(); renderPanel(); }));
      ctx.panel.querySelector('#test').onclick = test;
    }
    function gearSentence(ratio) {
      const n = +(ratio >= 1 ? ratio : 1 / ratio).toFixed(2);
      if (Math.abs(ratio - 1) < 1e-9) return t('gearSame');
      return ratio > 1 ? t('gearStrong', { n }) : t('gearFast', { n });
    }
    function test() {
      if (anim) return;
      const r = rounds[ri], ratio = drn / drv;
      const strong = ratio >= r.need - 1e-9;
      const time = BASE_TIME * ratio * (1 + r.slope / 60);
      anim = { t: 0, strong, time, vis: Math.min(4, Math.max(1.2, time / 2)), result: null };
      ctx.setMsg('');
    }
    renderPanel();
    const stop = loop((dt) => {
      const ratio = drn / drv;
      angle += dt * (anim ? 4 : 1.2);
      if (anim) {
        anim.t += dt;
        const r = rounds[ri];
        if (!anim.strong && anim.t > 1.8 && !anim.result) {
          anim.result = 'weak'; ctx.sfx.bad(); ctx.mistake(); ctx.setMsg(t('notStrong'), 'bad');
        } else if (anim.strong && anim.t >= anim.vis && !anim.result) {
          if (anim.time > r.limit + 1e-9) { anim.result = 'slow'; ctx.sfx.bad(); ctx.mistake(); ctx.setMsg(t('tooSlow', { s: anim.time.toFixed(1), l: r.limit }), 'bad'); }
          else {
            anim.result = 'ok'; ctx.sfx.good();
            ctx.setMsg('✅ ' + t('timeLbl', { s: anim.time.toFixed(1) }), 'good');
            if (ri === rounds.length - 1) { ctx.win(); }
            else setTimeout(() => { ri++; anim = null; ctx.setMsg(''); renderPanel(); }, 1300);
          }
        }
        if (anim && anim.result && anim.result !== 'ok' && anim.t > (anim.strong ? anim.vis : 1.8) + 1.2) anim = null;
      }
      draw(ratio);
    });
    function gear(x, y, teeth, rot, color) {
      const rr = teeth * 3.2 + 8;
      g.save(); g.translate(x, y); g.rotate(rot);
      g.fillStyle = color; g.strokeStyle = '#0A0D14'; g.lineWidth = 2;
      g.beginPath();
      for (let i = 0; i < teeth; i++) {
        const a0 = (i / teeth) * TAU, a1 = ((i + 0.5) / teeth) * TAU;
        const am = (a0 + a1) / 2;
        g.lineTo(Math.cos(a0) * rr, Math.sin(a0) * rr);
        g.lineTo(Math.cos(am - 0.08) * (rr + 7), Math.sin(am - 0.08) * (rr + 7));
        g.lineTo(Math.cos(am + 0.08) * (rr + 7), Math.sin(am + 0.08) * (rr + 7));
        g.lineTo(Math.cos(a1) * rr, Math.sin(a1) * rr);
      }
      g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 7, 0, TAU); g.fill(); g.stroke();
      g.strokeStyle = '#0A0D1488'; g.beginPath(); g.moveTo(0, 0); g.lineTo(rr - 4, 0); g.stroke();
      g.restore();
      return rr;
    }
    function draw(ratio) {
      g.fillStyle = '#F8FAFC'; g.fillRect(0, 0, W, H);
      // gears (top)
      const r1 = drv * 3.2 + 8, r2 = drn * 3.2 + 8;
      const gx = 400 - (r1 + r2 + 4) / 2 + r1 / 2 - 40;
      const y = 140;
      gear(gx, y, drv, angle, '#F26A1B');
      gear(gx + r1 + r2 + 4, y, drn, -angle * (drv / drn) + Math.PI / drn, '#0EA5A4');
      g.fillStyle = '#0A0D14'; g.font = 'bold 14px system-ui'; g.textAlign = 'center';
      g.fillText('⚡ ' + t('motorGear').split('(')[0].trim(), gx, y - r1 - 16);
      g.fillText('🛞 ' + t('wheelGear'), gx + r1 + r2 + 4, y + r2 + 28);
      // track (bottom)
      const r = rounds[ri];
      const x0 = 60, x1 = 740, yb = 460;
      const sl = rad(r.slope) * 0.9;
      const yTop = yb - Math.tan(sl) * (x1 - x0) * 0.55;
      g.fillStyle = '#d6d3d1';
      g.beginPath(); g.moveTo(x0, yb); g.lineTo(x1, yTop); g.lineTo(x1, H); g.lineTo(x0, H); g.closePath(); g.fill();
      g.strokeStyle = '#57534e'; g.lineWidth = 4; g.beginPath(); g.moveTo(x0, yb); g.lineTo(x1, yTop); g.stroke();
      emoji(g, '🏁', x1 - 10, yTop - 26, 30);
      let p = 0;
      if (anim) {
        if (anim.strong) p = Math.min(1, anim.t / anim.vis);
        else p = anim.t < 1 ? anim.t * 0.22 : Math.max(0, 0.22 - (anim.t - 1) * 0.3);
      }
      const cx = x0 + 30 + p * (x1 - x0 - 80), cy = yb + ((yTop - yb) * (cx - x0)) / (x1 - x0);
      g.save(); g.translate(cx, cy); g.rotate(-Math.atan2(yb - yTop, x1 - x0));
      g.fillStyle = '#22D3EE'; g.strokeStyle = '#0A0D14'; g.lineWidth = 3;
      roundRect(g, -30, -36, 60, 26, 8); g.fill(); g.stroke();
      if (ri === 2) emoji(g, '📦', 0, -50, 26);
      g.fillStyle = '#1f2937';
      for (const wx of [-18, 18]) { g.beginPath(); g.arc(wx, -8, 9, 0, TAU); g.fill(); }
      g.restore();
      if (anim) {
        g.fillStyle = '#0A0D14'; g.font = 'bold 16px system-ui'; g.textAlign = 'left';
        const shown = anim.strong ? Math.min(anim.time, (anim.t / anim.vis) * anim.time) : 0;
        g.fillText('⏱ ' + t('timeLbl', { s: shown.toFixed(1) }), 20, 300);
      }
    }
    ctx.onCleanup(stop);
  }

  // ======================================================================
  // MISSION: parking with distance sensor
  // ======================================================================
  function sensorPing(g, x, y, th, phase) {
    g.strokeStyle = '#DC262688'; g.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const rr = ((phase + i / 3) % 1) * 60 + 6;
      g.globalAlpha = 1 - ((phase + i / 3) % 1);
      g.beginPath(); g.arc(x, y, rr, th - 0.35, th + 0.35); g.stroke();
    }
    g.globalAlpha = 1;
  }

  function distRulePanel(ctx, withTurn, defX) {
    const { t } = ctx;
    ctx.panel.innerHTML = `
      <div class="rule" dir="auto">
        <span class="kw">${t('ifDist')}</span>
        <input type="number" id="thr" class="numbox" min="1" max="80" value="${defX}">
        <span class="kw">${withTurn ? t('thenTurn') : t('thenStop')}</span>
        ${withTurn ? `<div class="choices" id="dir"><button class="choice" data-d="L">↺ ${t('left')}</button><button class="choice on" data-d="R">↻ ${t('right')}</button></div>` : ''}
      </div>
      <input type="range" id="thrR" min="1" max="80" value="${defX}" class="wide" dir="ltr">
      <div class="row"><button class="btn run" id="go">${t('run')}</button><button class="btn" id="rs">${t('reset')}</button></div>
      <div class="monitor"><h4>${t('monitor')}</h4><div class="big-read">📡 ${t('distance')}: <b id="dv">–</b> cm</div><div id="extra"></div></div>`;
    const thr = ctx.panel.querySelector('#thr'), thrR = ctx.panel.querySelector('#thrR');
    const st = { x: defX, dir: 'R' };
    thr.oninput = () => { st.x = clamp(+thr.value || 1, 1, 80); thrR.value = st.x; };
    thrR.oninput = () => { st.x = +thrR.value; thr.value = st.x; };
    ctx.panel.querySelectorAll('#dir .choice').forEach((b) => (b.onclick = () => {
      st.dir = b.dataset.d; ctx.panel.querySelectorAll('#dir .choice').forEach((c) => c.classList.toggle('on', c === b)); ctx.sfx.tap();
    }));
    return st;
  }

  function mountPark(m, ctx) {
    const { t } = ctx;
    const cv = makeCanvas(ctx.stage);
    const g = cv.g;
    const wallX = 720;
    const walls = [{ x: wallX, y: 0, w: 80, h: H }];
    const rounds = [{ v: 80, label: { en: 'slow · 20 cm/s', ar: 'بطيء · 20 سم/ث' } }, { v: 240, label: { en: 'fast · 60 cm/s', ar: 'سريع · 60 سم/ث' } }];
    const DECEL = 400;
    let ri = 0, bot, state = 'idle', v = 0, phase = 0;
    const st = distRulePanel(ctx, false, 30);
    const extra = ctx.panel.querySelector('#extra');
    const showRound = () => { extra.innerHTML = `<p><b>${t('round', { n: ri + 1, m: rounds.length })}</b>: ${ctx.L(rounds[ri].label)}</p><p class="small">${t('coastNote')}</p>`; };
    const reset = () => { bot = new Bot(110, 250, 0); state = 'idle'; v = 0; };
    reset(); showRound();
    debug.get = () => bot;
    const noseDist = () => (wallX - (bot.x + bot.r)) / PX_CM;
    ctx.panel.querySelector('#go').onclick = () => { if (state === 'idle' || state === 'done') { reset(); state = 'drive'; v = rounds[ri].v; ctx.setMsg(''); } };
    ctx.panel.querySelector('#rs').onclick = () => { reset(); ctx.setMsg(''); };
    const stop = loop((dt) => {
      phase = (phase + dt * 1.5) % 1;
      for (let i = 0; i < 4 && (state === 'drive' || state === 'brake'); i++) {
        const h = dt / 4;
        if (state === 'drive' && noseDist() < st.x) state = 'brake';
        if (state === 'brake') v = Math.max(0, v - DECEL * h);
        bot.x += v * h;
        if (noseDist() <= 0) {
          bot.x = wallX - bot.r; state = 'done'; ctx.sfx.bad(); ctx.mistake(); ctx.setMsg(t('crash'), 'bad');
        } else if (state === 'brake' && v === 0) {
          state = 'done';
          const d = noseDist();
          const dr = Math.round(d * 10) / 10;
          if (d >= 8 && d <= 14) {
            ctx.sfx.good();
            ctx.setMsg(t('parked', { d: dr }), 'good');
            if (ri === rounds.length - 1) ctx.win();
            else setTimeout(() => { ri++; reset(); showRound(); ctx.setMsg(''); }, 1400);
          } else { ctx.sfx.bad(); ctx.mistake(); ctx.setMsg(t('parkShort', { d: dr }), 'bad'); }
        }
      }
      ctx.panel.querySelector('#dv').textContent = Math.max(0, noseDist()).toFixed(0);
      draw();
    });
    function draw() {
      drawFloor(g);
      // ruler
      g.fillStyle = '#0A0D14'; g.font = '12px system-ui'; g.textAlign = 'center';
      for (let cm = 0; cm <= 150; cm += 10) {
        const x = wallX - cm * PX_CM;
        g.fillRect(x - 1, 300, 2, cm % 50 === 0 ? 18 : 10);
        if (cm % 20 === 0) g.fillText(cm + ' cm', x, 334);
      }
      g.fillStyle = '#22C55E44'; g.fillRect(wallX - 14 * PX_CM, 200, 6 * PX_CM, 100);
      g.strokeStyle = '#16A34A'; g.lineWidth = 2; g.strokeRect(wallX - 14 * PX_CM, 200, 6 * PX_CM, 100);
      g.fillStyle = '#166534'; g.font = 'bold 12px system-ui'; g.fillText('8–14', wallX - 11 * PX_CM, 194);
      // trigger line
      const tx = wallX - st.x * PX_CM;
      g.strokeStyle = '#DC2626'; g.setLineDash([5, 5]); g.beginPath(); g.moveTo(tx, 170); g.lineTo(tx, 300); g.stroke(); g.setLineDash([]);
      g.fillStyle = '#DC2626'; g.fillText(st.x + ' cm', tx, 164);
      drawWalls(g, walls);
      const n = bot.pt(bot.r + 4, 0);
      sensorPing(g, n.x, n.y, 0, phase);
      drawBot(g, bot);
    }
    ctx.onCleanup(stop);
  }

  // ======================================================================
  // MISSION: obstacle avoid in corridor
  // ======================================================================
  function mountAvoid(m, ctx) {
    const { t } = ctx;
    const cv = makeCanvas(ctx.stage);
    const g = cv.g;
    const walls = [{ x: 150, y: 150, w: 500, h: 350 }];
    const goal = { x: 725, y: 430, r: 45 };
    const SPEED = 120;
    let bot, state = 'idle', turnLeft = 0, turnDir = 1, time = 0, phase = 0, trail = [];
    const st = distRulePanel(ctx, true, 30);
    const reset = () => { bot = new Bot(75, 440, -Math.PI / 2); state = 'idle'; time = 0; trail = []; };
    reset();
    debug.get = () => bot;
    const sense = () => (raycast(bot.pt(bot.r, 0).x, bot.pt(bot.r, 0).y, bot.th, walls)) / PX_CM;
    ctx.panel.querySelector('#go').onclick = () => { reset(); state = 'drive'; ctx.setMsg(''); };
    ctx.panel.querySelector('#rs').onclick = () => { reset(); ctx.setMsg(''); };
    const stop = loop((dt) => {
      phase = (phase + dt * 1.5) % 1;
      if (state === 'drive' || state === 'turn') {
        time += dt;
        for (let i = 0; i < 4; i++) {
          const h = dt / 4;
          if (state === 'drive') {
            if (sense() < st.x) { state = 'turn'; turnLeft = Math.PI / 2; turnDir = st.dir === 'R' ? 1 : -1; }
            else {
              bot.x += Math.cos(bot.th) * SPEED * h; bot.y += Math.sin(bot.th) * SPEED * h;
              if (hitsWall(bot, walls)) { state = 'done'; ctx.sfx.bad(); ctx.mistake(); ctx.setMsg(t('crash'), 'bad'); break; }
            }
          }
          if (state === 'turn') {
            const step = Math.min(turnLeft, rad(200) * h);
            bot.th = wrap(bot.th + step * turnDir); turnLeft -= step;
            if (turnLeft <= 1e-6) state = 'drive';
          }
          if (Math.hypot(bot.x - goal.x, bot.y - goal.y) < goal.r - 10) { state = 'done'; ctx.win(); break; }
        }
        if (state !== 'done' && time > 40) { state = 'done'; ctx.sfx.bad(); ctx.mistake(); ctx.setMsg(t('timeout'), 'bad'); }
        if (trail.length === 0 || Math.hypot(trail[trail.length - 1].x - bot.x, trail[trail.length - 1].y - bot.y) > 6) trail.push({ x: bot.x, y: bot.y });
      }
      ctx.panel.querySelector('#dv').textContent = sense().toFixed(0);
      draw();
    });
    function draw() {
      drawFloor(g);
      drawWalls(g, walls);
      drawZone(g, goal.x, goal.y, goal.r);
      emoji(g, '🏁', goal.x, goal.y, 30);
      g.strokeStyle = '#F26A1B66'; g.lineWidth = 3; g.beginPath();
      trail.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.stroke();
      const n = bot.pt(bot.r, 0);
      const d = raycast(n.x, n.y, bot.th, walls);
      g.strokeStyle = '#DC2626'; g.setLineDash([4, 6]); g.lineWidth = 2;
      g.beginPath(); g.moveTo(n.x, n.y); const e = bot.pt(bot.r + d, 0); g.lineTo(e.x, e.y); g.stroke(); g.setLineDash([]);
      // threshold marker
      const tm = bot.pt(bot.r + st.x * PX_CM, 0);
      g.fillStyle = '#DC2626'; g.beginPath(); g.arc(tm.x, tm.y, 5, 0, TAU); g.fill();
      sensorPing(g, n.x, n.y, bot.th, phase);
      drawBot(g, bot);
    }
    ctx.onCleanup(stop);
  }

  // ======================================================================
  // MISSION: line following
  // ======================================================================
  function trackPoints(kind) {
    const pts = [], N = 600;
    for (let i = 0; i < N; i++) {
      const a = Math.PI / 2 - (i / N) * TAU;
      if (kind === 'oval') pts.push({ x: 400 + 300 * Math.cos(a), y: 250 + 175 * Math.sin(a) });
      else pts.push({ x: 400 + 310 * Math.cos(a), y: 250 + 150 * Math.sin(a) + 42 * Math.sin(5 * a) });
    }
    return pts;
  }

  function mountLine(m, ctx) {
    const { t } = ctx;
    const cv = makeCanvas(ctx.stage);
    const g = cv.g;
    const pts = trackPoints(m.track);
    const LINE_W = 24;
    // offscreen bitmap for sensor sampling
    const off = document.createElement('canvas'); off.width = W; off.height = H;
    const og = off.getContext('2d');
    og.fillStyle = '#fff'; og.fillRect(0, 0, W, H);
    og.strokeStyle = '#000'; og.lineWidth = LINE_W; og.lineJoin = 'round';
    og.beginPath(); pts.forEach((p, i) => (i ? og.lineTo(p.x, p.y) : og.moveTo(p.x, p.y))); og.closePath(); og.stroke();
    const px = og.getImageData(0, 0, W, H).data;
    const onLine = (p) => { const x = Math.round(p.x), y = Math.round(p.y); if (x < 0 || y < 0 || x >= W || y >= H) return false; return px[(y * W + x) * 4] < 128; };
    const N = pts.length;
    const checks = [Math.floor(N / 4), Math.floor(N / 2), Math.floor((3 * N) / 4), 0];
    const actions = ['fwd', 'left', 'right', 'spinL', 'spinR', 'stop'];
    const states = ['both', 'left', 'right', 'none'];
    const rules = { both: 'fwd', left: 'fwd', right: 'fwd', none: 'fwd' };
    let speed = m.fixedSpeed || 120;
    const icon = { both: '⚫⚫', left: '⚫⚪', right: '⚪⚫', none: '⚪⚪' };
    ctx.panel.innerHTML = `
      <h4 class="rt">${t('rulesTitle')}</h4>
      <div class="rules">${states.map((s) => `<div class="rrow"><span class="sens" dir="ltr">${icon[s]}</span><span class="sl">${t('s_' + s)}</span>
        <select data-s="${s}">${actions.map((a) => `<option value="${a}">${t('a_' + a)}</option>`).join('')}</select></div>`).join('')}</div>
      ${m.fixedSpeed ? '' : `<label class="lbl">${t('speed')}: <b id="spv">${speed}</b></label><input type="range" id="sp" min="60" max="300" step="10" value="${speed}" class="wide" dir="ltr">`}
      <div class="row"><button class="btn run" id="go">${t('run')}</button><button class="btn" id="rs">${t('reset')}</button></div>
      <div class="monitor"><h4>${t('monitor')}</h4><div id="lm"></div></div>`;
    ctx.panel.querySelectorAll('select[data-s]').forEach((s) => (s.onchange = () => { rules[s.dataset.s] = s.value; }));
    const sp = ctx.panel.querySelector('#sp');
    if (sp) sp.oninput = () => { speed = +sp.value; ctx.panel.querySelector('#spv').textContent = speed; };
    let acc = 0, bot, state = 'idle', time = 0, ci = 0, readT = 0, sensors = { l: true, r: true }, stillT = 0, offT = 0, trail = [];
    const start = () => {
      const p0 = pts[0], p1 = pts[3];
      bot = new Bot(p0.x, p0.y, Math.atan2(p1.y - p0.y, p1.x - p0.x));
      state = 'idle'; time = 0; ci = 0; readT = 0; acc = 0; stillT = 0; offT = 0; trail = [];
      read();
    };
    const sensorPts = () => [bot.pt(26, -9), bot.pt(26, 9)];
    const read = () => { const [a, b] = sensorPts(); sensors = { l: onLine(a), r: onLine(b) }; };
    const apply = () => {
      const s = sensors.l && sensors.r ? 'both' : sensors.l ? 'left' : sensors.r ? 'right' : 'none';
      const v = speed;
      const a = rules[s];
      // steering is a fixed correction, so a faster robot makes wider turns
      const D = 80;
      const map = { fwd: [v, v], left: [v - D, v + D], right: [v + D, v - D], spinL: [-0.5 * v, 0.5 * v], spinR: [0.5 * v, -0.5 * v], stop: [0, 0] };
      [bot.L, bot.R] = map[a];
      return s;
    };
    start();
    debug.get = () => bot;
    let cur = 'both';
    ctx.panel.querySelector('#go').onclick = () => { start(); state = 'run'; ctx.setMsg(''); cur = apply(); };
    ctx.panel.querySelector('#rs').onclick = () => { start(); ctx.setMsg(''); };
    const nearest = () => { let best = 1e9; for (let i = 0; i < N; i += 3) { const d = (pts[i].x - bot.x) ** 2 + (pts[i].y - bot.y) ** 2; if (d < best) best = d; } return Math.sqrt(best); };
    const fail = (key) => { state = 'done'; bot.L = bot.R = 0; ctx.sfx.bad(); ctx.mistake(); ctx.setMsg(t(key), 'bad'); };
    const stop = loop((dt) => {
      if (state === 'run') {
        // fixed time steps so every run with the same settings behaves the same
        acc += dt;
        const h = 1 / 240;
        while (acc >= h && state === 'run') {
          acc -= h;
          time += h; readT += h;
          // the brain reads the sensors 20× per second
          if (readT >= 0.05) { readT -= 0.05; read(); cur = apply(); }
          bot.step(h);
          const cp = pts[checks[ci]];
          if (Math.hypot(cp.x - bot.x, cp.y - bot.y) < 40 && (ci < 3 || time > 3)) {
            ci++; ctx.sfx.tap();
            if (ci === checks.length) { state = 'done'; bot.L = bot.R = 0; ctx.win(); }
          }
        }
        if (state === 'run') {
          stillT = !bot.L && !bot.R ? stillT + dt : 0;
          offT = nearest() > 34 ? offT + dt : 0;
          if (stillT > 1.5) fail('stopped');
          else if (offT > 0.6 || bot.x < -30 || bot.y < -30 || bot.x > W + 30 || bot.y > H + 30) fail('lost');
          else if (time > m.limit) fail('timeout');
        }
        if (!trail.length || Math.hypot(trail[trail.length - 1].x - bot.x, trail[trail.length - 1].y - bot.y) > 5) trail.push({ x: bot.x, y: bot.y });
      }
      ctx.panel.querySelector('#lm').innerHTML =
        `<div dir="ltr" class="big-read">L ${sensors.l ? '⚫' : '⚪'} · R ${sensors.r ? '⚫' : '⚪'} → <b>${t('a_' + rules[cur])}</b></div>
         <div>${t('checks', { n: ci, m: checks.length })} · ⏱ ${time.toFixed(1)}s ${m.fixedSpeed ? '' : '/ ' + m.limit + 's'}</div>`;
      draw();
    });
    function draw() {
      g.fillStyle = '#fff'; g.fillRect(0, 0, W, H);
      g.strokeStyle = '#111'; g.lineWidth = LINE_W; g.lineJoin = 'round';
      g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.closePath(); g.stroke();
      checks.forEach((k, i) => {
        const p = pts[k];
        g.fillStyle = i < ci ? '#22C55E' : '#FACC15'; g.strokeStyle = '#0A0D14'; g.lineWidth = 2;
        g.beginPath(); g.arc(p.x, p.y, 9, 0, TAU); g.fill(); g.stroke();
        g.fillStyle = '#0A0D14'; g.font = 'bold 11px system-ui'; g.textAlign = 'center'; g.fillText(i === 3 ? '🏁' : String(i + 1), p.x, p.y - 14);
      });
      g.strokeStyle = '#F26A1B88'; g.lineWidth = 2; g.beginPath();
      trail.forEach((p, i) => (i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y))); g.stroke();
      drawBot(g, bot);
      sensorPts().forEach((p, i) => {
        const on = i ? sensors.r : sensors.l;
        g.fillStyle = on ? '#EF4444' : '#fff'; g.strokeStyle = '#EF4444'; g.lineWidth = 2;
        g.beginPath(); g.arc(p.x, p.y, 5, 0, TAU); g.fill(); g.stroke();
      });
    }
    ctx.onCleanup(stop);
  }

  // ======================================================================
  // MISSION: light-seeking (Braitenberg vehicle)
  // ======================================================================
  function mountLight(m, ctx) {
    const { t } = ctx;
    const cv = makeCanvas(ctx.stage);
    const g = cv.g;
    const stars = [{ x: 650, y: 110 }, { x: 160, y: 110 }, { x: 660, y: 400 }].map((s) => ({ ...s, got: false }));
    let wiring = null, on = false, light = { x: 420, y: 250 }, drag = false, bot = new Bot(140, 400, 0), sL = 0, sR = 0, got = 0, done = false;
    const wireSVG = (crossed) => `<svg viewBox="0 0 120 70" class="wsvg">
      <circle cx="30" cy="12" r="8" fill="#FACC15" stroke="#0A0D14" stroke-width="2"/><circle cx="90" cy="12" r="8" fill="#FACC15" stroke="#0A0D14" stroke-width="2"/>
      <rect x="18" y="50" width="24" height="14" rx="4" fill="#1f2937"/><rect x="78" y="50" width="24" height="14" rx="4" fill="#1f2937"/>
      ${crossed
        ? '<path d="M30 20 L90 50 M90 20 L30 50" stroke="#F26A1B" stroke-width="4" fill="none"/>'
        : '<path d="M30 20 L30 50 M90 20 L90 50" stroke="#F26A1B" stroke-width="4" fill="none"/>'}
    </svg>`;
    ctx.panel.innerHTML = `
      <h4 class="rt">${t('wiring')}</h4>
      <div class="wires">
        <button class="wire" data-w="straight">${wireSVG(false)}<b>${t('straight')}</b><small>${t('straightD')}</small></button>
        <button class="wire" data-w="crossed">${wireSVG(true)}<b>${t('crossed')}</b><small>${t('crossedD')}</small></button>
      </div>
      <button class="btn run" id="pw" disabled>${t('powerOn')}</button>
      <p class="small">${t('dragLight')}</p>
      <div class="monitor"><h4>${t('monitor')}</h4><div id="lr"></div></div>`;
    debug.get = () => bot;
    const pw = ctx.panel.querySelector('#pw');
    ctx.panel.querySelectorAll('.wire').forEach((b) => (b.onclick = () => {
      wiring = b.dataset.w; ctx.sfx.tap(); pw.disabled = false;
      ctx.panel.querySelectorAll('.wire').forEach((c) => c.classList.toggle('on', c === b));
    }));
    pw.onclick = () => { on = !on; pw.textContent = on ? t('powerOff') : t('powerOn'); pw.classList.toggle('stop', on); };
    const moveLight = (e) => { const p = cv.toWorld(e); light.x = clamp(p.x, 10, W - 10); light.y = clamp(p.y, 10, H - 10); };
    cv.c.addEventListener('pointerdown', (e) => { drag = true; try { cv.c.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ } moveLight(e); });
    cv.c.addEventListener('pointermove', (e) => { if (drag) moveLight(e); });
    cv.c.addEventListener('pointerup', () => (drag = false));
    cv.c.style.touchAction = 'none';
    const sensorRead = (side) => {
      const p = bot.pt(20, side * 14);
      const dir = bot.th + side * rad(40);
      const dx = light.x - p.x, dy = light.y - p.y, d = Math.hypot(dx, dy);
      const facing = Math.max(0, Math.cos(wrap(Math.atan2(dy, dx) - dir)));
      return Math.round(100 * (0.15 + 0.85 * facing) / (1 + (d / 170) ** 2));
    };
    let lost = 0;
    const stop = loop((dt) => {
      sL = sensorRead(-1); sR = sensorRead(1);
      if (on && !done) {
        const k = 2.4, base = 18;
        if (wiring === 'crossed') { bot.L = base + k * sR; bot.R = base + k * sL; }
        else { bot.L = base + k * sL; bot.R = base + k * sR; }
        for (let i = 0; i < 4; i++) {
          const px = bot.x, py = bot.y;
          bot.step(dt / 4);
          if (hitsWall(bot, [])) { bot.x = clamp(px, bot.r, W - bot.r); bot.y = clamp(py, bot.r, H - bot.r); lost += dt / 4; }
        }
        for (const s of stars) if (!s.got && Math.hypot(s.x - bot.x, s.y - bot.y) < 34) { s.got = true; got++; ctx.sfx.good(); }
        if (got === stars.length) { done = true; on = false; ctx.win(); }
        if (lost > 1.5) { lost = 0; ctx.mistake(); ctx.setMsg(t('bump'), 'bad'); ctx.sfx.bad(); }
      } else { bot.L = bot.R = 0; }
      ctx.panel.querySelector('#lr').innerHTML = `<div class="bar"><span>${t('lightL')}</span><i style="--v:${sL}%;--c:#CA8A04"></i><b>${sL}</b></div>
        <div class="bar"><span>${t('lightR')}</span><i style="--v:${sR}%;--c:#CA8A04"></i><b>${sR}</b></div>`;
      draw();
    });
    function draw() {
      g.fillStyle = '#1e293b'; g.fillRect(0, 0, W, H);
      const grad = g.createRadialGradient(light.x, light.y, 5, light.x, light.y, 260);
      grad.addColorStop(0, '#fef9c3ee'); grad.addColorStop(0.35, '#fde04766'); grad.addColorStop(1, '#1e293b00');
      g.fillStyle = grad; g.fillRect(0, 0, W, H);
      for (const s of stars) { g.globalAlpha = s.got ? 0.25 : 1; emoji(g, '⭐', s.x, s.y, 32); g.globalAlpha = 1; }
      drawBot(g, bot, { showPower: on, powerL: bot.L / 2.6, powerR: bot.R / 2.6 });
      [-1, 1].forEach((side) => {
        const p = bot.pt(20, side * 14);
        const v = side < 0 ? sL : sR;
        g.fillStyle = `rgba(250,204,21,${0.25 + v / 130})`; g.strokeStyle = '#0A0D14'; g.lineWidth = 2;
        g.beginPath(); g.arc(p.x, p.y, 5, 0, TAU); g.fill(); g.stroke();
      });
      emoji(g, '🔦', light.x, light.y, 34);
    }
    ctx.onCleanup(stop);
  }

  const ROBOT_FACE = `<svg viewBox="0 0 100 100"><rect x="18" y="6" width="56" height="15" rx="6" fill="#1f2937"/><rect x="18" y="79" width="56" height="15" rx="6" fill="#1f2937"/><rect x="10" y="15" width="76" height="70" rx="24" fill="#22D3EE" stroke="#0A0D14" stroke-width="4"/><rect x="54" y="28" width="24" height="44" rx="11" fill="#0A0D14"/><circle cx="67" cy="40" r="5.5" fill="#a5f3fc"/><circle cx="67" cy="60" r="5.5" fill="#a5f3fc"/><polygon points="97,50 86,40 86,60" fill="#F26A1B" stroke="#0A0D14" stroke-width="3"/></svg>`;

  // read-only peek used by automated tests
  const debug = {};
  return {
    debug,
    mount: { parts: mountParts, drive: mountDrive, servo: mountServo, gears: mountGears, park: mountPark, avoid: mountAvoid, line: mountLine, light: mountLight },
  };
})();
