/* DMP-501 core: header, hero, tabs, checklist, task timer, quiz, progress */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const store = {
  get(k, d) { try { const v = localStorage.getItem('dmp:' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('dmp:' + k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
};
window.W = {};

const WEEKS = [
  [1, 'Pengenalan & Kontrak Kuliah', 'T', '45 mnt teori'],
  [2, 'Eksplorasi CorelDRAW & Vektor', 'TP', '45 mnt teori + 50 mnt praktik'],
  [3, 'Tipografi & Presisi Ukuran', 'TP', '45 mnt teori + 50 mnt praktik'],
  [4, 'Desain Poster & Tracing Vektor', 'TP', '45 mnt teori + 50 mnt praktik'],
  [5, 'Desain Brosur Lipat Tiga', 'TP', '45 mnt teori + 50 mnt praktik'],
  [6, 'Desain Spanduk / Baliho', 'TP', '45 mnt teori + 50 mnt praktik'],
  [7, 'Teknis Pracetak di CorelDRAW', 'T', '50 mnt teori'],
  [8, 'UTS — Presentasi Proyek', 'X', '120 mnt'],
  [9, 'Pengantar Publikasi Digital', 'T', '50 mnt teori'],
  [10, 'Canva & Desain Carousel', 'TP', '50 mnt teori + 120 mnt praktik'],
  [11, 'Publikasi Video Pendek', 'TP', '50 mnt teori + 120 mnt praktik'],
  [12, 'Infografis Digital Kilat', 'TP', '50 mnt teori + 120 mnt praktik'],
  [13, 'Presentasi Bisnis Interaktif', 'TP', '50 mnt teori + 120 mnt praktik'],
  [14, 'Kolaborasi Online & Penjadwalan', 'TP', '50 mnt teori + 120 mnt praktik'],
  [15, 'Final Project — Integrasi Media', 'T', '50 mnt teori'],
  [16, 'UAS — Presentasi Proyek Akhir', 'X', '170 mnt']
];
const pad = (n) => String(n).padStart(2, '0');
const pageOf = (n) => `pertemuan-${pad(n)}.html`;
const teachable = WEEKS.filter(w => w[2] !== 'X');

function loadFonts() {
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Archivo+Black&family=JetBrains+Mono:wght@400;700&family=Playfair+Display:wght@700&family=Montserrat:wght@400;700&family=Poppins:wght@400;700&family=Lora:wght@400;700&family=Oswald:wght@500&family=Merriweather:wght@400;700&family=Open+Sans:wght@400;700&family=Roboto:wght@400;700&display=swap';
  document.head.appendChild(l);
}

function buildChrome() {
  const b = document.body, wk = +b.dataset.week;
  if (!wk) return;
  const info = WEEKS.find(w => w[0] === wk);
  const idx = teachable.findIndex(w => w[0] === wk);
  const prev = teachable[idx - 1], next = teachable[idx + 1];
  document.title = `Pertemuan ${pad(wk)} — ${info[1]} // DMP-501`;
  const top = el(`<header class="top"><div class="wrap">
    <a href="index.html"><b>[ DMP-501 ]</b></a>
    <span class="dim">PERTEMUAN ${pad(wk)} / 16</span>
    <span class="sp"></span>
    <span>PROGRES <output id="pg">0%</output></span>
    <span><i class="led"></i>SYS ONLINE</span>
    <button id="crt" title="Matikan efek scanline bila mengganggu">CRT</button>
  </div></header>`);
  b.prepend(top);
  const hero = el(`<div class="hero"><div class="wrap">
    <div class="num">${pad(wk)}<span>.</span></div>
    <h1>${info[1]}</h1>
    <div class="meta">
      <div><b>TIPE</b> ${info[2] === 'T' ? 'TEORI' : 'TEORI + PRAKTIKUM'}</div>
      <div><b>WAKTU</b> ${info[3]}</div>
      <div><b>CPMK</b> ${b.dataset.cpmk || '-'}</div>
    </div></div></div>`);
  top.after(hero);
  if (b.dataset.goal) {
    hero.querySelector('.wrap').after(el(`<div class="wrap"><div class="goal"><b class="red">KEMAMPUAN AKHIR //</b> ${b.dataset.goal}</div></div>`));
  }
  const main = $('main');
  main.classList.add('wrap');
  // tabs
  const secs = $$('main > section[data-tab]');
  const tabs = el('<nav class="tabs" role="tablist"></nav>');
  secs.forEach((s, i) => {
    s.id = s.id || 'tab' + i;
    const t = el(`<button role="tab" data-t="${s.id}">${pad(i + 1)} · ${s.dataset.tab}</button>`);
    t.onclick = () => showTab(s.id);
    tabs.appendChild(t);
  });
  hero.after(tabs);
  window.showTab = (id) => {
    secs.forEach(s => s.classList.toggle('on', s.id === id));
    $$('button', tabs).forEach(t => t.classList.toggle('on', t.dataset.t === id));
    history.replaceState(null, '', '#' + id);
    window.scrollTo({ top: tabs.offsetTop - 46, behavior: 'smooth' });
  };
  const start = secs.find(s => '#' + s.id === location.hash) || secs[0];
  secs.forEach(s => s.classList.toggle('on', s === start));
  $$('button', tabs).forEach(t => t.classList.toggle('on', t.dataset.t === start.id));
  // footer nav
  const pn = el(`<div class="pn">
    ${prev ? `<a href="${pageOf(prev[0])}">← SEBELUMNYA<b>${pad(prev[0])} ${prev[1]}</b></a>` : '<a href="index.html">← INDEKS<b>DAFTAR PERTEMUAN</b></a>'}
    ${next ? `<a href="${pageOf(next[0])}">BERIKUTNYA →<b>${pad(next[0])} ${next[1]}</b></a>` : '<a href="index.html">INDEKS →<b>DAFTAR PERTEMUAN</b></a>'}
  </div>`);
  const foot = el('<footer><div class="wrap">DESIGN MEDIA PUBLIKASI · ADMINISTRASI RS · SEMESTER 5 · DOSEN: IBNU AMRI THAHER</div></footer>');
  b.appendChild(pn); b.appendChild(foot);
  $('#crt').onclick = () => { b.classList.toggle('nocrt'); store.set('nocrt', b.classList.contains('nocrt')); };
  if (store.get('nocrt', false)) b.classList.add('nocrt');
}

function initChecks() {
  const wk = document.body.dataset.week || 'x';
  $$('.steps, .check').forEach((ul, g) => {
    $$('li', ul).forEach((li, i) => {
      const key = `chk:${wk}:${g}:${i}`;
      const cb = el('<input type="checkbox" aria-label="selesai">');
      cb.checked = store.get(key, false);
      li.classList.toggle('done', cb.checked);
      cb.onchange = () => { store.set(key, cb.checked); li.classList.toggle('done', cb.checked); };
      const span = el('<span></span>');
      while (li.firstChild) span.appendChild(li.firstChild);
      li.append(cb, span);
    });
  });
  $$('textarea.note').forEach((t, i) => {
    const key = `note:${wk}:${t.dataset.key || i}`;
    t.value = store.get(key, '');
    t.oninput = () => store.set(key, t.value);
  });
}

function initTasks() {
  const wk = document.body.dataset.week || 'x';
  $$('.task').forEach((t, i) => {
    const key = `task:${wk}:${t.dataset.id || i}`;
    const min = +t.dataset.min || 0;
    const foot = el(`<div class="tfoot">
      ${min ? `<button class="tm">▶ MULAI TIMER</button><span class="clock">${pad(min)}:00</span>` : ''}
      <label><input type="checkbox"> TANDAI SELESAI</label>
      <span class="dim">${min ? 'Target ' + min + ' menit' : ''}</span></div>`);
    t.appendChild(foot);
    const cb = $('input', foot);
    cb.checked = store.get(key, false);
    t.classList.toggle('done', cb.checked);
    cb.onchange = () => { store.set(key, cb.checked); t.classList.toggle('done', cb.checked); progress(); };
    if (min) {
      let left = min * 60, iv = null;
      const clk = $('.clock', foot), btn = $('.tm', foot);
      const draw = () => { clk.textContent = `${pad(Math.floor(left / 60))}:${pad(left % 60)}`; };
      btn.onclick = () => {
        if (iv) { clearInterval(iv); iv = null; btn.textContent = '▶ LANJUT'; return; }
        btn.textContent = '❚❚ JEDA';
        iv = setInterval(() => {
          left--; draw();
          if (left <= 0) { clearInterval(iv); iv = null; clk.style.color = 'var(--red)'; btn.textContent = '▶ ULANGI'; left = min * 60; }
        }, 1000);
      };
    }
  });
}

function initQuiz() {
  const wk = document.body.dataset.week || 'x';
  $$('.quiz').forEach((box, qi) => {
    let data = [];
    try { data = JSON.parse($('script', box).textContent); } catch (e) { box.textContent = 'Data kuis rusak.'; return; }
    const key = `quiz:${wk}:${qi}`;
    let got = 0, done = 0;
    const score = el('<div class="score"></div>');
    const upd = () => {
      score.textContent = done ? `SKOR ${got} / ${data.length}` : `${data.length} SOAL`;
      if (done === data.length) store.set(key, got);
      progress();
    };
    data.forEach((q) => {
      const qb = el(`<div class="q"><p>${q.q}</p><div class="opts"></div><div class="ex"></div></div>`);
      const opts = $('.opts', qb);
      q.o.forEach((o, oi) => {
        const b = el(`<button>${String.fromCharCode(65 + oi)}. ${o}</button>`);
        b.onclick = () => {
          if (qb.classList.contains('ans')) return;
          qb.classList.add('ans'); done++;
          const ok = oi === q.a; if (ok) got++;
          b.classList.add(ok ? 'ok' : 'bad');
          if (!ok) opts.children[q.a].classList.add('ok');
          $('.ex', qb).innerHTML = (ok ? '<b>BENAR.</b> ' : '<b class="red">KURANG TEPAT.</b> ') + (q.e || '');
          upd();
        };
        opts.appendChild(b);
      });
      box.appendChild(qb);
    });
    const reset = el('<button>ULANGI KUIS</button>');
    reset.onclick = () => { store.set(key, 0); location.reload(); };
    box.append(score, reset);
    upd();
  });
}

function progress() {
  const wk = document.body.dataset.week || 'x';
  const tasks = $$('.task'), quizzes = $$('.quiz');
  const total = tasks.length + quizzes.length;
  if (!total) return;
  const d = tasks.filter(t => t.classList.contains('done')).length +
    quizzes.filter((_, i) => store.get(`quiz:${wk}:${i}`, 0) > 0).length;
  const pct = Math.round(d / total * 100);
  const o = $('#pg'); if (o) o.textContent = pct + '%';
  store.set('prog:' + wk, pct);
}

function initWidgets() {
  $$('.widget').forEach((w) => {
    const fn = window.W[w.dataset.w];
    if (!fn) { w.innerHTML = `<div class="wb">Widget "${w.dataset.w}" tidak ditemukan.</div>`; return; }
    const body = el('<div class="wb"></div>');
    w.prepend(el(`<div class="wt"><span>[ LAB // ${w.dataset.title || w.dataset.w} ]</span><span>INTERAKTIF</span></div>`));
    w.appendChild(body);
    fn(body, w);
  });
}

function buildIndex() {
  const box = $('#weeks');
  if (!box) return;
  WEEKS.forEach(([n, t, k, d]) => {
    const exam = k === 'X';
    const tag = exam ? 'UJIAN' : (k === 'T' ? 'TEORI' : 'TEORI + PRAKTIKUM');
    const pct = store.get('prog:' + n, 0);
    const html = `<span class="n">${pad(n)}</span><span class="k">${tag}${exam ? '' : ' · ' + pct + '%'}</span><span class="t">${t}</span><span class="d">${d}</span>`;
    box.appendChild(el(exam ? `<div class="exam" style="background:var(--bg);padding:16px 18px;display:grid;grid-template-columns:auto 1fr;gap:4px 16px;min-height:120px;border-top:2px solid var(--red);opacity:.75">${html}</div>`
      : `<a href="${pageOf(n)}">${html}</a>`));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadFonts();
  buildChrome();
  initChecks();
  initTasks();
  initQuiz();
  initWidgets();
  buildIndex();
  progress();
});
