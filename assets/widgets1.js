/* Widget lab — pertemuan 1-6 */
let _uid = 0;
const uid = () => 'u' + (++_uid);
const num = (n, d = 1) => (Math.round(n * 10 ** d) / 10 ** d).toLocaleString('id-ID');
const lum = (hex) => {
  const c = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= .03928 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4);
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
};
const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + .05) / (Math.min(l1, l2) + .05); };

/* ---------- Minggu 1 ---------- */
W.grade = (b) => {
  b.innerHTML = `<p>Bobot penilaian: <b>40% Tugas</b> · <b>30% UTS</b> · <b>30% UAS</b>. Isi nilai perkiraanmu.</p>
  <div class="row">
    <div><label>Rata-rata tugas</label><input type="number" min="0" max="100" value="80" data-k="t"></div>
    <div><label>Nilai UTS</label><input type="number" min="0" max="100" value="75" data-k="u"></div>
    <div><label>Nilai UAS</label><input type="number" min="0" max="100" value="75" data-k="a"></div>
    <div><label>Target nilai akhir</label><input type="number" min="0" max="100" value="85" data-k="g"></div>
  </div><div class="out"></div>
  <p class="dim">Skala huruf di sini hanya contoh (A ≥ 85, B ≥ 70, C ≥ 55, D ≥ 40). Skala resmi mengikuti kesepakatan kontrak kuliah.</p>`;
  const f = (k) => clamp(+$(`[data-k=${k}]`, b).value || 0, 0, 100);
  const run = () => {
    const fin = .4 * f('t') + .3 * f('u') + .3 * f('a');
    const L = fin >= 85 ? 'A' : fin >= 70 ? 'B' : fin >= 55 ? 'C' : fin >= 40 ? 'D' : 'E';
    const need = (f('g') - .4 * f('t') - .3 * f('u')) / .3;
    $('.out', b).innerHTML = `Nilai akhir: <b>${num(fin)}</b> (${L})<br>Agar mencapai ${f('g')}, nilai UAS minimal: <b>${need > 100 ? 'mustahil (' + num(need, 0) + ') — naikkan tugas/UTS' : num(Math.max(need, 0), 0)}</b>`;
  };
  $$('input', b).forEach(i => i.oninput = run); run();
};

W.expect = (b) => {
  const sk = ['Mendesain dengan software', 'Memilih warna', 'Memilih font', 'Membuat konten media sosial'];
  b.innerHTML = `<p>Beri nilai dirimu SEKARANG (1 = belum pernah, 5 = mahir). Di akhir semester, isi lagi dan bandingkan.</p>` +
    sk.map((s, i) => `<div><label>${s}: <b data-o="${i}"></b></label><input type="range" min="1" max="5" data-i="${i}"><div class="bar"><i data-b="${i}"></i></div></div>`).join('') +
    `<label>Harapanku dari mata kuliah ini (1 kalimat)</label><textarea class="note" data-key="expect" placeholder="Contoh: Saya ingin bisa membuat poster promosi layanan RS sendiri."></textarea>`;
  sk.forEach((_, i) => {
    const r = $(`[data-i="${i}"]`, b), key = 'expect' + i;
    r.value = store.get(key, 1);
    const upd = () => { $(`[data-o="${i}"]`, b).textContent = r.value + '/5'; $(`[data-b="${i}"]`, b).style.width = r.value * 20 + '%'; store.set(key, +r.value); };
    r.oninput = upd; upd();
  });
  const t = $('textarea', b); t.value = store.get('note:1:expect', ''); t.oninput = () => store.set('note:1:expect', t.value);
};

W.principles = (b) => {
  const F = '#EAEAEA', R = '#E61919', D = '#555';
  const P = {
    'Keseimbangan simetris': [`<rect x="125" y="40" width="50" height="100" fill="${F}"/><circle cx="60" cy="90" r="28" fill="${D}"/><circle cx="240" cy="90" r="28" fill="${D}"/>`, 'Bobot visual sama di kiri dan kanan sumbu tengah. Terasa stabil, formal, tenang — cocok untuk dokumen resmi RS.'],
    'Keseimbangan asimetris': [`<circle cx="90" cy="90" r="55" fill="${F}"/><rect x="210" y="50" width="26" height="26" fill="${D}"/><rect x="240" y="95" width="18" height="18" fill="${D}"/><rect x="215" y="125" width="12" height="12" fill="${D}"/>`, 'Satu objek besar diimbangi beberapa objek kecil di sisi lain. Lebih dinamis, modern.'],
    'Kontras': [`${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect x="${20 + i * 34}" y="125" width="24" height="24" fill="${D}"/>`).join('')}<rect x="120" y="30" width="70" height="70" fill="${R}"/>`, 'Perbedaan ukuran/warna/bentuk yang tegas menarik mata pada satu titik dan membedakan informasi penting.'],
    'Hierarki': [`<rect x="40" y="25" width="220" height="34" fill="${F}"/><rect x="40" y="75" width="160" height="16" fill="${D}"/><rect x="40" y="104" width="230" height="8" fill="${D}"/><rect x="40" y="120" width="230" height="8" fill="${D}"/><rect x="40" y="136" width="180" height="8" fill="${D}"/>`, 'Urutan baca diatur lewat ukuran: judul → subjudul → isi. Mata tahu harus mulai dari mana.'],
    'Pengulangan (ritme)': [`${[0, 1, 2, 3, 4].map(i => `<circle cx="${40 + i * 55}" cy="90" r="${i === 2 ? 24 : 16}" fill="${i === 2 ? R : F}"/>`).join('')}`, 'Elemen yang sama diulang menciptakan pola dan kesatuan; satu variasi di tengah menjadi titik fokus.'],
    'Kedekatan (proximity)': [`${[0, 1, 2].map(i => `<rect x="${30 + i * 8}" y="${40 + i * 14}" width="30" height="10" fill="${F}"/>`).join('')}${[0, 1, 2].map(i => `<rect x="${190 + i * 8}" y="${40 + i * 14}" width="30" height="10" fill="${F}"/>`).join('')}<line x1="150" y1="30" x2="150" y2="150" stroke="${D}" stroke-dasharray="4 4"/>`, 'Info yang berhubungan didekatkan; yang tidak berhubungan dijauhkan. Dua kelompok jelas terlihat tanpa perlu garis.']
  };
  const keys = Object.keys(P);
  b.innerHTML = `<div class="row btns">${keys.map((k, i) => `<button data-k="${k}" class="${i ? '' : 'on'}">${k}</button>`).join('')}</div>
  <div class="stage"><svg viewBox="0 0 300 180" width="480" style="background:#0A0A0A;border:1px solid #2e2e2e"></svg></div><div class="out"></div>`;
  const show = (k) => { $('svg', b).innerHTML = P[k][0]; $('.out', b).innerHTML = `<b>${k}.</b> ${P[k][1]}`; $$('button', b).forEach(x => x.classList.toggle('on', x.dataset.k === k)); };
  $$('button', b).forEach(x => x.onclick = () => show(x.dataset.k)); show(keys[0]);
};

/* ---------- Minggu 2 ---------- */
W.corelmap = (b) => {
  const A = {
    menu: ['Menu Bar', 'File, Edit, View, Layout, Object, Effects, Bitmaps, Text, Table, Tools, Window, Help. Contoh: File > New (Ctrl+N) membuat dokumen baru; Layout > Page Setup mengatur halaman.'],
    prop: ['Property Bar', 'Berubah mengikuti objek/alat yang aktif. Di sini kamu mengetik ukuran (W/H), posisi, rotasi, ketebalan outline, dan memilih satuan (mm). Tombol Weld / Trim / Intersect muncul saat 2+ objek terpilih.'],
    tool: ['Toolbox', 'Kumpulan alat: Pick (panah), Shape, Crop, Zoom, Freehand/Pen, Rectangle (F6), Ellipse (F7), Text (F8), Fill, dll. Ikon dengan segitiga kecil berarti ada flyout alat lain.'],
    page: ['Drawing Page + Kanvas', 'Kotak berbingkai = area cetak (Drawing Page). Area abu di luarnya = kanvas/pasteboard; objek di luar halaman TIDAK tercetak. Penggaris (ruler) ada di tepi atas dan kiri; tarik dari ruler untuk membuat guideline.'],
    dock: ['Docker', 'Panel samping. Buka lewat Window > Dockers: Object Manager, Shaping, Color Styles, Align and Distribute, dll.'],
    pal: ['Color Palette', 'Klik kiri = warna isi (fill). Klik kanan = warna garis (outline). Perhatikan warna ini CMYK.'],
    stat: ['Status Bar', 'Menampilkan info objek terpilih: jenis, ukuran, jumlah node, warna fill/outline, dan koordinat kursor.']
  };
  b.innerHTML = `<p>Klik setiap bagian untuk mengenali fungsinya.</p>
  <div class="mock" style="grid-template-columns:70px 1fr 90px;grid-template-areas:'menu menu menu' 'prop prop prop' 'tool page dock' 'pal pal pal' 'stat stat stat';min-height:300px">
  ${Object.keys(A).map(k => `<button data-k="${k}" style="grid-area:${k}">${A[k][0]}</button>`).join('')}
  </div><div class="out"></div>`;
  const show = (k) => { $('.out', b).innerHTML = `<b>${A[k][0]}.</b> ${A[k][1]}`; $$('.mock button', b).forEach(x => x.classList.toggle('on', x.dataset.k === k)); };
  $$('.mock button', b).forEach(x => x.onclick = () => show(x.dataset.k)); show('page');
};

W.shapelab = (b) => {
  const id = uid();
  b.innerHTML = `<div class="row btns">${[['none', 'Dua objek'], ['weld', 'Weld'], ['trimA', 'Trim (kotak dipotong lingkaran)'], ['trimB', 'Trim (lingkaran dipotong kotak)'], ['int', 'Intersect']].map(([k, t], i) => `<button data-m="${k}" class="${i ? '' : 'on'}">${t}</button>`).join('')}</div>
  <div class="row"><div><label>Geser lingkaran (X)</label><input type="range" min="120" max="320" value="230" data-k="x"></div><div><label>Ukuran lingkaran</label><input type="range" min="30" max="95" value="70" data-k="r"></div></div>
  <div class="stage"><svg viewBox="0 0 400 220" width="520"></svg></div><div class="out"></div>`;
  let mode = 'none';
  const T = {
    none: 'Dua objek terpisah (kotak A dan lingkaran B). Belum ada operasi.',
    weld: '<b>Weld</b> melebur dua objek menjadi SATU bentuk baru; garis pertemuan di dalam hilang. Dipakai membuat ikon dari gabungan bentuk dasar.',
    trimA: '<b>Trim</b> memotong bagian yang beririsan dari objek sasaran. Di sini kotak kehilangan area yang tertimpa lingkaran; lingkaran tetap ada (garis putus-putus).',
    trimB: '<b>Trim</b> arah sebaliknya: lingkaran yang dipotong oleh kotak. Hasil tergantung objek mana yang menjadi sasaran dan mana yang sumber.',
    int: '<b>Intersect</b> membuat objek BARU dari area irisan saja. Objek asli tetap ada (garis putus-putus).'
  };
  const render = () => {
    const x = +$('[data-k=x]', b).value, r = +$('[data-k=r]', b).value, F = '#EAEAEA', R = '#E61919';
    const A = '<rect x="80" y="50" width="140" height="120"', C = `<circle cx="${x}" cy="110" r="${r}"`;
    const dash = (s) => s + ' fill="none" stroke="#8C8C8C" stroke-dasharray="5 4" stroke-width="2"/>';
    let s = `<defs>
      <mask id="${id}a"><rect width="400" height="220" fill="#fff"/>${C} fill="#000"/></mask>
      <mask id="${id}b"><rect width="400" height="220" fill="#fff"/>${A} fill="#000"/></mask>
      <clipPath id="${id}c">${C}/></clipPath></defs>`;
    if (mode === 'none') s += `${A} fill="${F}"/>${C} fill="${R}" fill-opacity=".85"/>`;
    if (mode === 'weld') s += `${A} fill="${R}"/>${C} fill="${R}"/>`;
    if (mode === 'trimA') s += `${A} fill="${F}" mask="url(#${id}a)"/>` + dash(C);
    if (mode === 'trimB') s += `${C} fill="${R}" mask="url(#${id}b)"/>` + dash(A);
    if (mode === 'int') s += dash(A) + dash(C) + `${A} fill="${R}" clip-path="url(#${id}c)"/>`;
    $('svg', b).innerHTML = s; $('.out', b).innerHTML = T[mode];
  };
  $$('[data-m]', b).forEach(btn => btn.onclick = () => { mode = btn.dataset.m; $$('[data-m]', b).forEach(x => x.classList.toggle('on', x === btn)); render(); });
  $$('input', b).forEach(i => i.oninput = render); render();
};

/* ---------- Minggu 3 ---------- */
W.anatomy = (b) => {
  b.innerHTML = `<div class="row">
    <div><label>Teks</label><input data-k="t" value="Hag" maxlength="6" size="6"></div>
    <div><label>Font</label><select data-k="f"><option>Georgia</option><option>Arial</option><option>Courier New</option><option>Playfair Display</option><option>Montserrat</option><option>Oswald</option></select></div>
    <div><label>Ukuran</label><input type="range" min="80" max="200" value="160" data-k="s"></div></div>
  <div class="row btns">${['Ascender', 'Cap height', 'x-height', 'Baseline', 'Descender'].map(x => `<label><input type="checkbox" checked data-g="${x}"> ${x}</label>`).join(' ')}</div>
  <div class="stage"><svg viewBox="0 0 560 280" width="560"></svg></div>
  <div class="out">Garis dihitung dari ukuran huruf asli (diukur browser). <b>x-height</b> besar = teks terbaca lebih jelas pada ukuran kecil.</div>`;
  const cv = document.createElement('canvas').getContext('2d');
  const render = () => {
    const t = $('[data-k=t]', b).value || 'Hag', f = $('[data-k=f]', b).value, s = +$('[data-k=s]', b).value;
    cv.font = `${s}px "${f}"`;
    const m = (c) => cv.measureText(c);
    const base = 200, xh = m('x').actualBoundingBoxAscent, cap = m('H').actualBoundingBoxAscent, asc = m('d').actualBoundingBoxAscent, desc = m('p').actualBoundingBoxDescent;
    const L = { 'Ascender': [base - asc, asc], 'Cap height': [base - cap, cap], 'x-height': [base - xh, xh], 'Baseline': [base, 0], 'Descender': [base + desc, desc] };
    let g = '', k = 0;
    for (const [n, [y]] of Object.entries(L)) {
      if (!$(`[data-g="${n}"]`, b).checked) continue;
      g += `<line x1="10" x2="400" y1="${y}" y2="${y}" stroke="#E61919" stroke-width="1"/><text x="410" y="${y + 4}" fill="#EAEAEA" font-size="12" font-family="JetBrains Mono,monospace">${n.toUpperCase()}</text>`;
      k++;
    }
    $('svg', b).innerHTML = `<text x="20" y="${base}" font-size="${s}" font-family="${f}" fill="#EAEAEA">${t.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</text>${g}`;
  };
  $$('input,select', b).forEach(i => i.oninput = render);
  render(); if (document.fonts) document.fonts.ready.then(render);
};

W.contrast = (b) => {
  const pre = [['Putih di biru RS', '#FFFFFF', '#0B5FA5'], ['Abu muda di putih', '#BBBBBB', '#FFFFFF'], ['Kuning di hitam', '#FFD400', '#111111'], ['Merah di hijau', '#E61919', '#1B9E3E'], ['Putih di merah', '#FFFFFF', '#C8102E'], ['Hitam di kuning', '#111111', '#FFD400']];
  b.innerHTML = `<div class="row"><div><label>Warna teks</label><input type="color" value="#ffffff" data-k="f"></div><div><label>Warna latar</label><input type="color" value="#0b5fa5" data-k="b"></div></div>
  <div class="row btns">${pre.map((p, i) => `<button data-p="${i}">${p[0]}</button>`).join('')}</div>
  <div class="stage" style="padding:0"><div data-pv style="width:100%;padding:22px"><div style="font:400 2.4rem/1 'Archivo Black',sans-serif;text-transform:uppercase">Cek kesehatan gratis</div><p style="margin:10px 0 0;font-size:14px">Sabtu, 14 Maret · Halaman parkir RS Sehat Sentosa · Pukul 08.00–12.00</p></div></div><div class="out"></div>`;
  const run = () => {
    const f = $('[data-k=f]', b).value, g = $('[data-k=b]', b).value, r = ratio(f, g);
    const pv = $('[data-pv]', b); pv.style.color = f; pv.style.background = g;
    $('.out', b).innerHTML = `Rasio kontras: <b>${num(r, 2)} : 1</b><br>Teks biasa (AA ≥ 4.5): ${r >= 4.5 ? 'LULUS' : '<b>GAGAL</b>'} · Teks besar (AA ≥ 3): ${r >= 3 ? 'LULUS' : '<b>GAGAL</b>'} · AAA (≥ 7): ${r >= 7 ? 'LULUS' : 'tidak'}`;
  };
  $$('[data-k]', b).forEach(i => i.oninput = run);
  $$('[data-p]', b).forEach(x => x.onclick = () => { const p = pre[+x.dataset.p]; $('[data-k=f]', b).value = p[1].toLowerCase(); $('[data-k=b]', b).value = p[2].toLowerCase(); run(); });
  run();
};

W.mm = (b) => {
  const P = { 'ID card (CR80) 85,6 × 54': [85.6, 54], 'Kartu nama Indonesia 90 × 55': [90, 55], 'Kartu nama 85 × 55': [85, 55], 'A6 105 × 148': [105, 148], 'A5 148 × 210': [148, 210], 'A4 210 × 297': [210, 297] };
  b.innerHTML = `<div class="row">
    <div><label>Ukuran</label><select data-k="p">${Object.keys(P).map(k => `<option>${k}</option>`).join('')}</select></div>
    <div><label>Orientasi</label><select data-k="o"><option>Landscape</option><option>Portrait</option></select></div>
    <div><label>Bleed (mm)</label><input type="number" value="3" min="0" max="10" step=".5" data-k="bl" style="width:80px"></div>
    <div><label>Safe margin (mm)</label><input type="number" value="3" min="0" max="15" step=".5" data-k="sf" style="width:80px"></div>
    <div><label>DPI</label><select data-k="d"><option>150</option><option selected>300</option><option>600</option></select></div></div>
  <div class="two"><div class="stage"><svg width="100%" viewBox="0 0 100 100" data-sv style="max-width:420px"></svg></div><div class="out" style="margin:0"></div></div>
  <hr><div class="row"><div><label>Konversi: nilai dalam mm</label><input type="number" value="25.4" step="any" data-k="c" style="width:120px"></div></div><div class="out" data-co></div>`;
  const run = () => {
    let [w, h] = P[$('[data-k=p]', b).value];
    const ls = $('[data-k=o]', b).value === 'Landscape'; if (ls !== (w > h)) [w, h] = [h, w];
    const bl = +$('[data-k=bl]', b).value, sf = +$('[data-k=sf]', b).value, dpi = +$('[data-k=d]', b).value;
    const pxs = (mm) => Math.round(mm / 25.4 * dpi);
    const pad = bl + 3;
    $('[data-sv]', b).setAttribute('viewBox', `${-pad} ${-pad} ${w + 2 * pad} ${h + 2 * pad}`);
    $('[data-sv]', b).innerHTML = `<rect x="${-bl}" y="${-bl}" width="${w + 2 * bl}" height="${h + 2 * bl}" fill="#E61919" fill-opacity=".35"/>
      <rect x="0" y="0" width="${w}" height="${h}" fill="#EAEAEA"/>
      <rect x="${sf}" y="${sf}" width="${w - 2 * sf}" height="${h - 2 * sf}" fill="none" stroke="#0A0A0A" stroke-dasharray="1.5 1" stroke-width=".4"/>
      <text x="${w / 2}" y="${h / 2}" text-anchor="middle" font-size="${Math.min(w, h) / 7}" font-family="Archivo Black" fill="#0A0A0A">NAMA PEGAWAI</text>
      <text x="${w / 2}" y="${h / 2 + Math.min(w, h) / 7}" text-anchor="middle" font-size="${Math.min(w, h) / 12}" font-family="JetBrains Mono" fill="#0A0A0A">NIP 1980 0000</text>`;
    $('.out', b).innerHTML = `<div class="kv"><span>Ukuran jadi</span><span>${w} × ${h} mm</span><span>Dengan bleed</span><span>${w + 2 * bl} × ${h + 2 * bl} mm</span><span>Area aman</span><span>${num(w - 2 * sf)} × ${num(h - 2 * sf)} mm</span><span>Piksel jadi</span><span>${pxs(w)} × ${pxs(h)} px @ ${dpi} dpi</span><span>Piksel + bleed</span><span>${pxs(w + 2 * bl)} × ${pxs(h + 2 * bl)} px</span></div>
      <p class="dim" style="margin-top:8px">Merah transparan = bleed (dipotong). Putus-putus = batas aman teks/logo.</p>`;
    const mm = +$('[data-k=c]', b).value || 0;
    $('[data-co]', b).innerHTML = `${num(mm, 2)} mm = <b>${num(mm / 10, 3)} cm</b> = <b>${num(mm / 25.4, 3)} inci</b> = <b>${num(mm / 25.4 * 72, 1)} pt</b> = <b>${pxs(mm)} px</b> @ ${dpi} dpi`;
  };
  $$('input,select', b).forEach(i => i.oninput = run); run();
};

W.pairing = (b) => {
  const F = { 'Playfair Display': 'serif', 'Lora': 'serif', 'Merriweather': 'serif', 'Montserrat': 'sans', 'Poppins': 'sans', 'Roboto': 'sans', 'Open Sans': 'sans', 'Oswald': 'cond' };
  const opts = Object.keys(F).map(k => `<option>${k}</option>`).join('');
  b.innerHTML = `<div class="row"><div><label>Font judul</label><select data-k="h">${opts}</select></div><div><label>Font isi</label><select data-k="p">${opts}</select></div><button data-r>Acak</button></div>
  <div class="stage" style="display:block;background:#f4f4f0;color:#111;padding:22px"><div data-h style="font-size:2rem;line-height:1.1;margin-bottom:8px">Ketahui Hak Anda sebagai Pasien</div><div data-p style="font-size:1rem;line-height:1.6;max-width:56ch">Setiap pasien berhak memperoleh informasi yang jelas tentang diagnosis, tindakan medis, dan biaya pelayanan. Tanyakan kepada petugas bila ada yang belum Anda pahami.</div></div><div class="out"></div>`;
  $('[data-h]', b).style.fontWeight = 700;
  const run = () => {
    const h = $('[data-k=h]', b).value, p = $('[data-k=p]', b).value;
    $('[data-h]', b).style.fontFamily = `"${h}"`; $('[data-p]', b).style.fontFamily = `"${p}"`;
    let m;
    if (h === p) m = 'Satu keluarga font: aman. Bedakan lewat <b>weight</b> (bold vs regular) dan ukuran.';
    else if (F[h] === F[p]) m = '<b>Terlalu mirip.</b> Dua font sejenis tetapi tidak sama terlihat seperti kesalahan, bukan kontras yang disengaja.';
    else if (F[h] === 'cond' || F[p] === 'cond') m = 'Condensed untuk judul pendek, font biasa untuk isi: kombinasi yang umum dan efektif. Jangan pakai condensed untuk paragraf panjang.';
    else m = '<b>Serif + sans-serif: kontras yang jelas</b> dan klasik. Pastikan salah satu mendominasi.';
    $('.out', b).innerHTML = m + '<br>Aturan praktis: maksimal 2 keluarga font per desain.';
  };
  $$('select', b).forEach(s => s.oninput = run);
  $('[data-r]', b).onclick = () => { const k = Object.keys(F); $('[data-k=h]', b).value = k[Math.random() * k.length | 0]; $('[data-k=p]', b).value = k[Math.random() * k.length | 0]; run(); };
  $('[data-k=h]', b).value = 'Playfair Display'; $('[data-k=p]', b).value = 'Open Sans'; run();
};

/* ---------- Minggu 4 ---------- */
W.bezier = (b) => {
  const T = {
    'Hati': 'M200 190 C 90 120 90 50 150 50 C 180 50 200 70 200 80 C 200 70 220 50 250 50 C 310 50 310 120 200 190Z',
    'Palang medis': 'M170 30h60v60h60v60h-60v60h-60v-60h-60v-60h60z',
    'Tetes darah': 'M200 30 C200 30 130 110 130 150 a70 70 0 0 0 140 0 C270 110 200 30 200 30z'
  };
  let pts = [], closed = false, drag = false;
  b.innerHTML = `<p>Latihan Pen Tool: <b>klik</b> = node sudut (garis lurus). <b>Klik-tahan lalu tarik</b> = node kurva (handle). Klik node pertama untuk menutup bentuk. Jiplak bentuk bayangan dengan node sesedikit mungkin.</p>
  <div class="row btns"><select data-t>${Object.keys(T).map(k => `<option>${k}</option>`).join('')}</select><label><input type="checkbox" data-h checked> Tampilkan handle</label><label><input type="checkbox" data-g checked> Bayangan</label><button data-u>Undo</button><button data-c>Hapus semua</button></div>
  <div class="stage"><svg viewBox="0 0 400 240" width="560" style="touch-action:none;cursor:crosshair;background:#0A0A0A"></svg></div><div class="out"></div>`;
  const svg = $('svg', b);
  const pt = (e) => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * 400 / r.width, (e.clientY - r.top) * 240 / r.height]; };
  const render = () => {
    const sh = $('[data-g]', b).checked ? `<path d="${T[$('[data-t]', b).value]}" fill="none" stroke="#555" stroke-width="3" stroke-dasharray="6 5"/>` : '';
    let d = '';
    if (pts.length) {
      d = `M${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], c = pts[i]; d += ` C${a.x + a.hx} ${a.y + a.hy} ${c.x - c.hx} ${c.y - c.hy} ${c.x} ${c.y}`; }
      if (closed && pts.length > 2) { const a = pts[pts.length - 1], c = pts[0]; d += ` C${a.x + a.hx} ${a.y + a.hy} ${c.x - c.hx} ${c.y - c.hy} ${c.x} ${c.y}Z`; }
    }
    let h = '';
    if ($('[data-h]', b).checked) pts.forEach(p => { if (p.hx || p.hy) h += `<line x1="${p.x - p.hx}" y1="${p.y - p.hy}" x2="${p.x + p.hx}" y2="${p.y + p.hy}" stroke="#E61919"/><circle cx="${p.x + p.hx}" cy="${p.y + p.hy}" r="3.5" fill="#E61919"/><circle cx="${p.x - p.hx}" cy="${p.y - p.hy}" r="3.5" fill="#E61919"/>`; });
    svg.innerHTML = sh + (d ? `<path d="${d}" fill="${closed ? 'rgba(234,234,234,.18)' : 'none'}" stroke="#EAEAEA" stroke-width="2.5"/>` : '') + h + pts.map((p, i) => `<rect x="${p.x - 4}" y="${p.y - 4}" width="8" height="8" fill="${i ? '#EAEAEA' : '#E61919'}"/>`).join('');
    const n = pts.length;
    $('.out', b).innerHTML = `Node: <b>${n}</b> ${closed ? '· bentuk tertutup' : ''}<br>${!n ? 'Mulai klik di kanvas.' : n > 14 ? 'Terlalu banyak node: kurva akan bergelombang dan sulit diedit. Coba lebih sedikit dengan handle lebih panjang.' : 'Jumlah node wajar. Target: node hanya di titik sudut dan titik balik kurva.'}`;
  };
  svg.onpointerdown = (e) => {
    const [x, y] = pt(e);
    if (closed) return;
    if (pts.length > 2 && Math.hypot(x - pts[0].x, y - pts[0].y) < 10) { closed = true; render(); return; }
    pts.push({ x: Math.round(x), y: Math.round(y), hx: 0, hy: 0 }); drag = true; svg.setPointerCapture(e.pointerId); render();
  };
  svg.onpointermove = (e) => { if (!drag) return; const [x, y] = pt(e), p = pts[pts.length - 1]; p.hx = Math.round(x - p.x); p.hy = Math.round(y - p.y); render(); };
  svg.onpointerup = () => { drag = false; };
  $('[data-u]', b).onclick = () => { if (closed) closed = false; else pts.pop(); render(); };
  $('[data-c]', b).onclick = () => { pts = []; closed = false; render(); };
  $$('select,input', b).forEach(i => i.oninput = render); render();
};

W.hierarchy = (b) => {
  b.innerHTML = `<div class="row"><div><label>Ukuran judul: <b data-o></b></label><input type="range" min="14" max="60" value="22" data-k="s"></div>
    <label><input type="checkbox" data-k="red"> Judul merah</label><label><input type="checkbox" data-k="sq"> Squint test (blur)</label><label><input type="checkbox" data-k="n"> Urutan baca</label></div>
  <div class="two"><div class="stage"><div data-poster style="width:300px;height:420px;background:#EAEAEA;color:#0A0A0A;position:relative;padding:18px;display:flex;flex-direction:column;gap:10px;font-family:'Open Sans',sans-serif">
    <div data-b1 style="font-family:'Archivo Black',sans-serif;text-transform:uppercase;line-height:1;letter-spacing:-.02em;position:relative">Cek kesehatan gratis</div>
    <div data-b2 style="font-size:12px;position:relative">Sabtu, 14 Maret 2026 · Pukul 08.00–12.00</div>
    <div data-b3 style="flex:1;background:#0A0A0A;display:flex;align-items:center;justify-content:center;position:relative"><svg viewBox="0 0 100 100" width="90"><path d="M35 10h30v25h25v30H65v25H35V65H10V35h25z" fill="#E61919"/></svg></div>
    <div data-b4 style="font-size:11px;position:relative">Tekanan darah · Gula darah · Kolesterol<br>RS Sehat Sentosa, Halaman Parkir Utama</div>
    <div data-b5 style="background:#0A0A0A;color:#EAEAEA;padding:6px;text-align:center;font-weight:700;font-size:12px;position:relative">DAFTAR: 0812-0000-0000</div></div></div>
  <div class="out" style="margin:0"></div></div>`;
  const run = () => {
    const s = +$('[data-k=s]', b).value, red = $('[data-k=red]', b).checked;
    const t = $('[data-b1]', b); t.style.fontSize = s + 'px'; t.style.color = red ? '#E61919' : '#0A0A0A';
    $('[data-poster]', b).style.filter = $('[data-k=sq]', b).checked ? 'blur(3.5px)' : 'none';
    $('[data-o]', b).textContent = s + 'px';
    $$('[data-nm]', b).forEach(x => x.remove());
    if ($('[data-k=n]', b).checked) ['b1', 'b3', 'b2', 'b4', 'b5'].forEach((k, i) => { const e = document.createElement('i'); e.dataset.nm = 1; e.textContent = i + 1; e.style.cssText = 'position:absolute;right:2px;top:2px;background:#E61919;color:#fff;font:700 11px JetBrains Mono;padding:0 5px;font-style:normal'; $(`[data-${k}]`, b).appendChild(e); });
    const r = s / 12;
    $('.out', b).innerHTML = `Rasio judul : teks info = <b>${num(r, 1)} : 1</b><br>${r < 2 ? 'Terlalu mirip: mata tidak tahu mulai dari mana.' : r < 3.5 ? 'Hierarki mulai terbentuk.' : 'Hierarki tegas: judul jelas jadi <b>focal point</b>.'}<br><br><b>Squint test:</b> aktifkan blur. Jika judul dan gambar utama masih terbaca sebagai blok dominan, hierarki kuat. Jika semua tampak sama, perbesar kontras ukuran.`;
  };
  $$('input', b).forEach(i => i.oninput = run); run();
};

/* ---------- Minggu 5 ---------- */
W.trifold = (b) => {
  b.innerHTML = `<div class="row">
    <div><label>Lebar kertas (mm)</label><input type="number" value="297" data-k="w" style="width:90px"></div>
    <div><label>Tinggi (mm)</label><input type="number" value="210" data-k="h" style="width:90px"></div>
    <div><label>Gutter (mm)</label><input type="number" value="6" data-k="g" style="width:70px"></div>
    <div><label>Margin (mm)</label><input type="number" value="8" data-k="m" style="width:70px"></div>
    <div><label>Flap lebih sempit (mm)</label><input type="number" value="2" data-k="d" style="width:70px"></div>
    <label><input type="checkbox" data-k="bl" checked> Tampilkan bleed 3 mm</label></div>
  <div class="stage" style="flex-direction:column;gap:14px"><svg data-s1 width="100%" style="max-width:640px"></svg><svg data-s2 width="100%" style="max-width:640px"></svg></div><div class="out"></div>`;
  const run = () => {
    const W_ = +$('[data-k=w]', b).value || 297, H = +$('[data-k=h]', b).value || 210, g = +$('[data-k=g]', b).value, m = +$('[data-k=m]', b).value, d = +$('[data-k=d]', b).value, bl = $('[data-k=bl]', b).checked ? 3 : 0;
    const flap = W_ / 3 - d, oth = (W_ - flap) / 2;
    const draw = (sel, ws, names, title) => {
      let x = 0, s = '';
      const pdg = 12;
      ws.forEach((w, i) => {
        const l = x + (i === 0 ? m : g / 2), r = x + w - (i === ws.length - 1 ? m : g / 2);
        s += `<rect x="${l}" y="${m}" width="${r - l}" height="${H - 2 * m}" fill="none" stroke="#8C8C8C" stroke-dasharray="3 2" stroke-width=".6"/>
          <text x="${x + w / 2}" y="${H / 2}" text-anchor="middle" font-size="7" font-family="JetBrains Mono" fill="#EAEAEA">${names[i]}</text>
          <text x="${x + w / 2}" y="${H / 2 + 10}" text-anchor="middle" font-size="6" font-family="JetBrains Mono" fill="#8C8C8C">${num(w, 1)} mm</text>`;
        x += w;
        if (i < ws.length - 1) s += `<line x1="${x}" x2="${x}" y1="${-5}" y2="${H + 5}" stroke="#E61919" stroke-width=".8" stroke-dasharray="4 2"/>`;
      });
      $(sel, b).setAttribute('viewBox', `${-bl - pdg} ${-bl - pdg} ${W_ + 2 * (bl + pdg)} ${H + 2 * (bl + pdg)}`);
      $(sel, b).innerHTML = `<rect x="${-bl}" y="${-bl}" width="${W_ + 2 * bl}" height="${H + 2 * bl}" fill="#E61919" fill-opacity=".25"/><rect x="0" y="0" width="${W_}" height="${H}" fill="#181818" stroke="#EAEAEA"/>${s}<text x="0" y="${-4}" font-size="6" font-family="JetBrains Mono" fill="#E61919">${title}</text>`;
    };
    draw('[data-s1]', [flap, oth, oth], ['FLAP (BELAKANG)', 'COVER BELAKANG', 'COVER DEPAN'], 'SISI LUAR');
    draw('[data-s2]', [oth, oth, flap], ['PANEL KIRI', 'PANEL TENGAH', 'FLAP DALAM'], 'SISI DALAM');
    $('.out', b).innerHTML = `Panel: <b>${num(oth, 1)} + ${num(oth, 1)} + ${num(flap, 1)} = ${num(2 * oth + flap, 1)} mm</b> (kertas ${W_} mm) ${Math.abs(2 * oth + flap - W_) < .01 ? '✓' : '✗'}<br>Flap yang dilipat ke dalam dibuat sedikit lebih sempit agar tidak menekuk/menonjol. Teks tidak boleh melewati garis lipat merah; sisakan gutter ${g} mm di sekitar lipatan.`;
  };
  $$('input', b).forEach(i => i.oninput = run); run();
};

W.cmyk = (b) => {
  const pre = [['Biru RS', 100, 60, 0, 0], ['Hijau sehat', 80, 0, 90, 0], ['Merah darurat', 0, 100, 90, 0], ['Hitam teks', 0, 0, 0, 100], ['Rich black', 60, 40, 40, 100], ['Registration (HINDARI)', 100, 100, 100, 100]];
  b.innerHTML = `<div class="two"><div>${['C', 'M', 'Y', 'K'].map(k => `<div><label>${k}: <b data-v="${k}">0</b>%</label><input type="range" min="0" max="100" value="0" data-k="${k}"></div>`).join('')}
    <div class="row btns" style="margin-top:12px">${pre.map((p, i) => `<button data-p="${i}">${p[0]}</button>`).join('')}</div></div>
    <div><div class="swatch" style="height:120px" data-sw></div><div class="out" style="margin-top:10px"></div></div></div>`;
  const run = () => {
    const v = {}; ['C', 'M', 'Y', 'K'].forEach(k => { v[k] = +$(`[data-k=${k}]`, b).value; $(`[data-v=${k}]`, b).textContent = v[k]; });
    const rgb = [v.C, v.M, v.Y].map(x => Math.round(255 * (1 - x / 100) * (1 - v.K / 100)));
    $('[data-sw]', b).style.background = `rgb(${rgb})`;
    const tac = v.C + v.M + v.Y + v.K;
    $('.out', b).innerHTML = `Total tinta: <b>${tac}%</b> ${tac > 300 ? '<br><b>PERINGATAN:</b> melebihi 300%. Tinta bisa basah/lengket, kertas bergelombang. Standar umum 240–300%.' : '(aman)'}<br>Tampilan layar ≈ <b>rgb(${rgb})</b> — perkiraan kasar; warna cetak bisa lebih kusam dari layar.${v.K === 100 && v.C + v.M + v.Y === 0 ? '<br>Hitam murni K100: pilihan terbaik untuk teks kecil.' : ''}`;
  };
  $$('input', b).forEach(i => i.oninput = run);
  $$('[data-p]', b).forEach(x => x.onclick = () => { const p = pre[+x.dataset.p]; ['C', 'M', 'Y', 'K'].forEach((k, i) => $(`[data-k=${k}]`, b).value = p[i + 1]); run(); });
  run();
};

/* ---------- Minggu 6 ---------- */
W.banner = (b) => {
  b.innerHTML = `<div class="row">
    <div><label>Lebar banner (m)</label><input type="number" value="3" step=".5" min=".5" data-k="w" style="width:90px"></div>
    <div><label>Tinggi (m)</label><input type="number" value="1" step=".5" min=".5" data-k="h" style="width:90px"></div>
    <div><label>Jarak baca (m)</label><input type="number" value="15" min="1" data-k="j" style="width:90px"></div>
    <div><label>DPI target (ukuran asli)</label><input type="number" value="72" min="10" max="300" data-k="d" style="width:90px"></div>
    <div><label>Foto: lebar px</label><input type="number" value="4000" data-k="fw" style="width:90px"></div></div>
  <div class="stage"><svg data-sv width="100%" style="max-width:640px"></svg></div><div class="out"></div>`;
  const run = () => {
    const w = +$('[data-k=w]', b).value || 1, h = +$('[data-k=h]', b).value || 1, j = +$('[data-k=j]', b).value || 1, d = +$('[data-k=d]', b).value || 72, fw = +$('[data-k=fw]', b).value || 1;
    const inW = w * 39.3701, inH = h * 39.3701;
    const pw = Math.round(inW * d), ph = Math.round(inH * d), mb = pw * ph * 3 / 1048576;
    const txt = j * .83, eff = fw / inW;
    const q = eff >= 100 ? 'tajam, aman untuk dilihat dari dekat' : eff >= 50 ? 'cukup untuk jarak baca ≥ 5 m' : eff >= 25 ? 'hanya untuk jarak jauh (≥ 15 m); tepi mulai lembut' : '<b>pecah</b> — cari foto lebih besar';
    const sc = 100, pad = 30, hm = 1.7;
    const VW = w * sc + 2 * pad + 60, VH = Math.max(h * sc, hm * sc) + 2 * pad;
    const by = VH - pad - h * sc;
    $('[data-sv]', b).setAttribute('viewBox', `0 0 ${VW} ${VH}`);
    $('[data-sv]', b).innerHTML = `<rect x="${pad}" y="${by}" width="${w * sc}" height="${h * sc}" fill="#E61919"/>
      <text x="${pad + 8}" y="${by + h * sc / 2 + (txt * 2) / 2}" font-size="${txt * 2 * sc / 100 * 1}" font-family="Archivo Black" fill="#fff">PENDAFTARAN DIBUKA</text>
      <rect x="${pad + w * sc + 20}" y="${VH - pad - hm * sc}" width="22" height="${hm * sc}" fill="#EAEAEA"/><circle cx="${pad + w * sc + 31}" cy="${VH - pad - hm * sc - 8}" r="8" fill="#EAEAEA"/>
      <text x="${pad + w * sc + 20}" y="${VH - 8}" font-size="10" font-family="JetBrains Mono" fill="#8C8C8C">1,7 m</text>
      <text x="${pad}" y="${by - 6}" font-size="10" font-family="JetBrains Mono" fill="#8C8C8C">${w} × ${h} m</text>`;
    $('.out', b).innerHTML = `<div class="kv"><span>Piksel @ ${d} dpi</span><span>${pw.toLocaleString('id-ID')} × ${ph.toLocaleString('id-ID')} px (${num(mb, 0)} MB tanpa kompresi)</span>
      <span>Kerja skala 1:10</span><span>${num(w * 10, 0)} × ${num(h * 10, 0)} cm → set <b>${d * 10} dpi</b> agar hasil sama</span>
      <span>Tinggi huruf min</span><span>≈ <b>${num(txt, 1)} cm</b> (rekomendasi ${num(txt * 2, 1)} cm) untuk jarak ${j} m</span>
      <span>DPI efektif foto</span><span><b>${num(eff, 0)} dpi</b> — ${q}</span></div>
      <p class="dim" style="margin-top:8px">Aturan kasar: 1 inci tinggi huruf per ±3 m jarak baca. Ukuran file besar ${mb > 250 ? '→ <b>turunkan DPI atau pakai skala 1:10</b>.' : 'masih wajar.'}</p>`;
  };
  $$('input', b).forEach(i => i.oninput = run); run();
};
