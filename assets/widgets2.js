/* Widget lab — pertemuan 7-15 */
const hsl2hex = (h, s, l) => {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
};
const hex2rgb = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgb2lab = ([r, g, b]) => {
  const c = [r, g, b].map(v => { v /= 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4; });
  const x = (c[0] * .4124 + c[1] * .3576 + c[2] * .1805) / .95047, y = c[0] * .2126 + c[1] * .7152 + c[2] * .0722, z = (c[0] * .0193 + c[1] * .1192 + c[2] * .9505) / 1.08883;
  const f = (t) => t > .008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
};
const dE = (a, b) => Math.hypot(...rgb2lab(a).map((v, i) => v - rgb2lab(b)[i]));
const cmyk2rgb = (c, m, y, k) => [c, m, y].map(v => Math.round(255 * (1 - v / 100) * (1 - k / 100)));
const rgb2hex = (r) => '#' + r.map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

/* ---------- Minggu 7 ---------- */
W.bleed = (b) => {
  b.innerHTML = `<div class="row">
    <div><label>Lebar (mm)</label><input type="number" value="90" data-k="w" style="width:80px"></div>
    <div><label>Tinggi (mm)</label><input type="number" value="55" data-k="h" style="width:80px"></div>
    <div><label>Bleed (mm)</label><input type="number" value="3" min="0" data-k="bl" style="width:70px"></div>
    <div><label>Posisi teks dari tepi (mm)</label><input type="number" value="5" min="0" step=".5" data-k="tx" style="width:80px"></div>
    <label><input type="checkbox" data-k="ext" checked> Latar diperluas ke bleed</label></div>
  <div class="row"><div style="min-width:280px"><label>Pergeseran mesin potong: <b data-o>0</b> mm</label><input type="range" min="-4" max="4" step=".5" value="0" data-k="s"></div></div>
  <div class="two"><div><h4>File desain</h4><div class="stage"><svg data-a width="100%" style="max-width:360px"></svg></div></div>
  <div><h4>Hasil setelah dipotong</h4><div class="stage"><svg data-r width="100%" style="max-width:360px"></svg></div></div></div><div class="out"></div>`;
  const run = () => {
    const w = +$('[data-k=w]', b).value || 90, h = +$('[data-k=h]', b).value || 55, bl = +$('[data-k=bl]', b).value, tx = +$('[data-k=tx]', b).value, ext = $('[data-k=ext]', b).checked, s = +$('[data-k=s]', b).value;
    $('[data-o]', b).textContent = s;
    const bw = ext ? bl : 0;
    const art = `<rect x="${-bw}" y="${-bw}" width="${w + 2 * bw}" height="${h + 2 * bw}" fill="#0B5FA5"/>
      <text x="${tx}" y="${h / 2 + 3}" font-size="9" font-family="Archivo Black" fill="#fff">RS SEHAT</text>
      <text x="${tx}" y="${h / 2 + 11}" font-size="5" font-family="JetBrains Mono" fill="#fff">Jl. Contoh No. 1</text>`;
    const pad = 8;
    const A = $('[data-a]', b); A.setAttribute('viewBox', `${-pad - bl} ${-pad - bl} ${w + 2 * (pad + bl)} ${h + 2 * (pad + bl)}`);
    A.innerHTML = `<rect x="${-pad - bl}" y="${-pad - bl}" width="${w + 2 * (pad + bl)}" height="${h + 2 * (pad + bl)}" fill="#fff"/>${art}
      <rect x="0" y="0" width="${w}" height="${h}" fill="none" stroke="#E61919" stroke-width=".5"/>
      <rect x="${-bl}" y="${-bl}" width="${w + 2 * bl}" height="${h + 2 * bl}" fill="none" stroke="#0A0A0A" stroke-dasharray="2 1.5" stroke-width=".4"/>`;
    const R = $('[data-r]', b); R.setAttribute('viewBox', `0 0 ${w} ${h}`);
    R.innerHTML = `<defs><clipPath id="cw"><rect width="${w}" height="${h}"/></clipPath></defs><rect width="${w}" height="${h}" fill="#fff"/><g clip-path="url(#cw)"><g transform="translate(${-s} 0)">${art}</g></g>`;
    const sliver = Math.abs(s) > bw, txtCut = tx - Math.max(s, 0) < 0 || (w - tx - 40) < 0;
    const near = tx - Math.abs(s) < 2;
    $('.out', b).innerHTML = `Garis <b>merah</b> = batas potong (trim). Garis putus-putus hitam = batas bleed.<br>` +
      (sliver ? `<b>GAGAL:</b> pergeseran ${Math.abs(s)} mm melebihi bleed ${bw} mm → muncul garis putih di tepi kartu.` : `<b>AMAN:</b> latar tetap penuh sampai tepi.`) + '<br>' +
      (near ? `<b>BERISIKO:</b> teks hanya ${num(tx - Math.abs(s), 1)} mm dari tepi setelah bergeser — hampir/sudah terpotong. Jauhkan teks (safe margin ≥ 3–5 mm).` : `Teks aman dari tepi (${num(tx - Math.abs(s), 1)} mm).`);
  };
  $$('input', b).forEach(i => i.oninput = run); run();
};

W.fontlost = (b) => {
  b.innerHTML = `<div class="row btns"><button data-m="ok" class="on">Font Oswald ADA di komputer</button><button data-m="lost">Font TIDAK ADA (diganti otomatis)</button><button data-m="curve">Sudah Convert to Curves</button></div>
  <div class="stage" style="display:block;background:#fff"><div data-box style="width:100%;max-width:520px;margin:auto;border:1px dashed #E61919;padding:14px;color:#111;overflow:hidden"><div data-t style="font-size:42px;white-space:nowrap;line-height:1.1">PENDAFTARAN PASIEN</div></div></div><div class="out"></div>`;
  const msg = {
    ok: 'Tampilan sesuai desain karena font terpasang. Tetapi komputer percetakan belum tentu memilikinya.',
    lost: '<b>Font hilang:</b> program mengganti dengan font lain. Lebar berubah, baris bisa pecah atau keluar bingkai, dan tata letak rusak. Inilah penyebab hasil cetak berbeda dari layar.',
    curve: '<b>Convert to Curves</b> (Ctrl+Q): huruf menjadi bentuk vektor. Tampilan terkunci di komputer mana pun. Konsekuensinya: teks tidak bisa lagi diedit sebagai teks, jadi <b>simpan salinan .cdr yang masih bisa diedit</b>.'
  };
  const set = (m) => {
    const t = $('[data-t]', b);
    t.style.cssText = 'font-size:42px;white-space:nowrap;line-height:1.1;' + ({ ok: "font-family:'Oswald'", lost: "font-family:'Times New Roman',serif;font-weight:400;letter-spacing:.06em", curve: "font-family:'Oswald';-webkit-text-stroke:1px #111;color:transparent" })[m];
    $('.out', b).innerHTML = msg[m];
    $$('button', b).forEach(x => x.classList.toggle('on', x.dataset.m === m));
  };
  $$('button', b).forEach(x => x.onclick = () => set(x.dataset.m)); set('ok');
};

/* ---------- Minggu 9 ---------- */
W.ratios = (b) => {
  const P = [['Instagram Feed persegi', 1080, 1080, '1:1'], ['Instagram Feed potret', 1080, 1350, '4:5'], ['Story / Reels / TikTok', 1080, 1920, '9:16'], ['YouTube / presentasi', 1920, 1080, '16:9'], ['Facebook / LinkedIn tautan', 1200, 630, '1.91:1'], ['Poster cetak A3 (referensi)', 297, 420, 'A-series']];
  b.innerHTML = `<div class="row btns">${P.map((p, i) => `<button data-i="${i}" class="${i === 1 ? 'on' : ''}">${p[0]}</button>`).join('')}</div>
  <div class="two"><div class="stage" style="min-height:360px"><svg data-sv width="100%" style="max-height:340px"></svg></div><div class="out" style="margin:0"></div></div>
  <p class="dim">Ukuran bisa berubah mengikuti kebijakan platform. Selalu cek panduan resmi terbaru sebelum produksi massal.</p>`;
  const show = (i) => {
    const [n, w, h, r] = P[i], s = 320 / Math.max(w, h);
    const el_ = $('[data-sv]', b); el_.setAttribute('viewBox', `0 0 ${w * s + 4} ${h * s + 4}`);
    el_.style.width = Math.min(w * s + 4, 320) + 'px';
    el_.innerHTML = `<rect x="2" y="2" width="${w * s}" height="${h * s}" fill="#141414" stroke="#EAEAEA" stroke-width="2"/><line x1="2" y1="2" x2="${w * s + 2}" y2="${h * s + 2}" stroke="#2e2e2e"/><line x1="${w * s + 2}" y1="2" x2="2" y2="${h * s + 2}" stroke="#2e2e2e"/><text x="${w * s / 2 + 2}" y="${h * s / 2 + 6}" text-anchor="middle" font-size="20" font-family="Archivo Black" fill="#E61919">${r}</text>`;
    $('.out', b).innerHTML = `<div class="kv"><span>Platform</span><span>${n}</span><span>Rasio</span><span>${r}</span><span>Ukuran kerja</span><span>${w} × ${h} px</span></div>
      <p style="margin-top:10px">${i === 1 ? 'Feed 4:5 memakai ruang layar paling banyak sehingga lebih menonjol dibanding 1:1.' : i === 2 ? 'Layar penuh vertikal. Hindari menaruh teks penting di area atas/bawah yang tertutup antarmuka aplikasi.' : i === 3 ? 'Horizontal, untuk layar lebar dan presentasi.' : i === 5 ? 'Rasio kertas cetak (mm), bukan piksel.' : 'Aman untuk grid profil.'}</p>`;
    $$('[data-i]', b).forEach(x => x.classList.toggle('on', +x.dataset.i === i));
  };
  $$('[data-i]', b).forEach(x => x.onclick = () => show(+x.dataset.i)); show(1);
};

W.brandkit = (b) => {
  const FN = ['Playfair Display', 'Lora', 'Merriweather', 'Montserrat', 'Poppins', 'Roboto', 'Open Sans', 'Oswald'];
  b.innerHTML = `<div class="row">
    <div><label>Nama brand</label><input data-k="n" value="Klinik Sehat Sentosa"></div>
    <div><label>Warna dasar (hue): <b data-o>210</b>°</label><input type="range" min="0" max="359" value="210" data-k="h" style="min-width:200px"></div>
    <div><label>Skema</label><select data-k="s"><option value="ana">Analogus (selaras)</option><option value="com">Komplementer (kontras)</option><option value="tri">Triadik (ramai)</option></select></div>
    <div><label>Font judul</label><select data-k="f1">${FN.map(f => `<option>${f}</option>`).join('')}</select></div>
    <div><label>Font isi</label><select data-k="f2">${FN.map(f => `<option>${f}</option>`).join('')}</select></div></div>
  <div class="grid" data-pal style="grid-template-columns:repeat(5,1fr)"></div>
  <div data-card style="padding:22px;margin-top:12px"></div><div class="out"></div>`;
  $('[data-k=f1]', b).value = 'Montserrat'; $('[data-k=f2]', b).value = 'Open Sans';
  const run = () => {
    const h = +$('[data-k=h]', b).value, sc = $('[data-k=s]', b).value, n = $('[data-k=n]', b).value;
    $('[data-o]', b).textContent = h;
    const second = sc === 'ana' ? h + 30 : sc === 'com' ? h + 180 : h + 120, accent = sc === 'ana' ? h - 30 : sc === 'com' ? h + 150 : h + 240;
    const C = [['Primer', hsl2hex(h, 70, 36)], ['Sekunder', hsl2hex(second, 60, 45)], ['Aksen', hsl2hex(accent, 85, 52)], ['Latar terang', hsl2hex(h, 30, 96)], ['Teks gelap', hsl2hex(h, 40, 10)]];
    $('[data-pal]', b).innerHTML = C.map(c => `<div style="padding:0"><div style="background:${c[1]};height:70px"></div><div style="padding:8px;font-size:11px"><b>${c[0]}</b><br><button data-cp="${c[1]}" style="padding:0 4px;margin-top:4px">${c[1]}</button></div></div>`).join('');
    $$('[data-cp]', b).forEach(x => x.onclick = () => { try { navigator.clipboard.writeText(x.dataset.cp); x.textContent = 'tersalin'; } catch (e) { /* ignore */ } });
    const f1 = $('[data-k=f1]', b).value, f2 = $('[data-k=f2]', b).value;
    const card = $('[data-card]', b); card.style.background = C[3][1]; card.style.color = C[4][1];
    card.innerHTML = `<div style="font:700 2rem/1.1 '${f1}';color:${C[0][1]}">${n}</div><p style="font-family:'${f2}';margin:8px 0 12px">Layanan kesehatan keluarga yang ramah, cepat, dan terpercaya.</p><span style="display:inline-block;background:${C[2][1]};color:${C[4][1]};padding:6px 14px;font:700 13px '${f2}'">DAFTAR SEKARANG</span> <span style="display:inline-block;background:${C[1][1]};color:#fff;padding:6px 14px;font:700 13px '${f2}'">LAYANAN KAMI</span>`;
    const r = ratio('#FFFFFF', C[0][1]);
    $('.out', b).innerHTML = `Kontras teks putih di warna primer: <b>${num(r, 1)}:1</b> ${r >= 4.5 ? '(terbaca)' : '(<b>kurang</b>, gelapkan warna primer)'}<br>Brand Kit minimal: 1 logo, 3–5 warna, 2 font, gaya foto, dan tone suara. Catat HEX agar semua anggota tim memakai warna yang sama.`;
  };
  $$('input,select', b).forEach(i => i.oninput = run); run();
};

/* ---------- Minggu 10 ---------- */
W.carousel = (b) => {
  b.innerHTML = `<div class="row"><div style="min-width:300px"><label>Geser slide (swipe): <b data-o>1</b></label><input type="range" min="0" max="4" step=".01" value="0" data-k="sw"></div><label><input type="checkbox" data-k="gd" checked> Garis batas slide</label><label><input type="checkbox" data-k="ln" checked> Elemen penyambung</label></div>
  <h4>Seluruh strip (5 slide × 1080 × 1350 px)</h4><div class="stage"><svg data-st viewBox="0 0 5400 1350" width="100%"></svg></div>
  <h4>Yang terlihat di HP</h4><div class="stage"><svg data-ph viewBox="0 0 1080 1350" width="270" style="border:2px solid #EAEAEA"></svg></div>
  <hr><div class="row"><div><label>Elemen mulai di X (px, dari tepi kiri slide 1)</label><input type="number" value="800" data-k="x" style="width:110px"></div><div><label>Lebar elemen (px)</label><input type="number" value="700" data-k="ew" style="width:110px"></div></div><div class="out"></div>`;
  const content = (link) => {
    let s = '<rect width="5400" height="1350" fill="#141414"/>';
    for (let i = 0; i < 5; i++) s += `<text x="${i * 1080 + 70}" y="170" font-size="80" font-family="Archivo Black" fill="#EAEAEA">SLIDE ${i + 1}</text><text x="${i * 1080 + 70}" y="1260" font-size="46" font-family="JetBrains Mono" fill="#8C8C8C">Judul / poin ${i + 1}</text>`;
    if (link) s += `<path d="M0 900 C 700 700 1100 1100 1800 880 S 3200 700 4000 940 S 5000 780 5400 900 V1000 C 5000 880 4600 1040 4000 1040 S 2800 820 1800 980 S 700 800 0 1000Z" fill="#E61919"/><circle cx="1080" cy="560" r="230" fill="#EAEAEA"/><circle cx="3240" cy="560" r="230" fill="#E61919"/>`;
    return s;
  };
  const run = () => {
    const sw = +$('[data-k=sw]', b).value, link = $('[data-k=ln]', b).checked, gd = $('[data-k=gd]', b).checked;
    $('[data-o]', b).textContent = num(sw + 1, 2);
    let g = ''; if (gd) for (let i = 1; i < 5; i++) g += `<line x1="${i * 1080}" x2="${i * 1080}" y1="0" y2="1350" stroke="#E61919" stroke-width="6" stroke-dasharray="30 18"/>`;
    $('[data-st]', b).innerHTML = content(link) + g + `<rect x="${sw * 1080}" y="3" width="1080" height="1344" fill="none" stroke="#fff" stroke-width="10"/>`;
    const ph = $('[data-ph]', b); ph.setAttribute('viewBox', `${sw * 1080} 0 1080 1350`); ph.innerHTML = content(link);
    const x = +$('[data-k=x]', b).value || 0, ew = +$('[data-k=ew]', b).value || 0;
    const rows = [];
    for (let i = 0; i < 5; i++) { const l = i * 1080, r = l + 1080; if (x < r && x + ew > l) rows.push(`Slide ${i + 1}: letakkan salinan elemen di X = <b>${x - l}</b> px (sebagian di luar slide ${x - l < 0 ? 'kiri' : x - l + ew > 1080 ? 'kanan' : ''} akan terpotong otomatis)`); }
    $('.out', b).innerHTML = `Elemen akan tampil di <b>${rows.length}</b> slide:<br>${rows.join('<br>') || 'Di luar area slide.'}<br><span class="dim">Di Canva: salin elemen, tempel di slide sebelah, lalu ubah posisi X lewat Position → Advanced. Elemen yang melewati tepi halaman tidak tercetak/terunduh di luar halaman.</span>`;
  };
  $$('input', b).forEach(i => i.oninput = run); run();
};

/* ---------- Minggu 11 ---------- */
W.timeline = (b) => {
  const cuts0 = [2.7, 5.1, 8.6, 11.3], TOTAL = 15;
  b.innerHTML = `<div class="row"><div><label>Tempo musik (BPM)</label><input type="number" value="120" min="60" max="180" data-k="bpm" style="width:90px"></div><button data-s class="pri">Snap potongan ke ketukan</button><button data-r>Reset</button></div>
  <div class="stage"><svg data-sv viewBox="0 0 660 190" width="100%"></svg></div><div class="out"></div>`;
  let cuts = [...cuts0];
  const run = () => {
    const bpm = +$('[data-k=bpm]', b).value || 120, bt = 60 / bpm, X = (t) => 40 + t / TOTAL * 600;
    let s = '';
    for (let t = 0; t <= TOTAL; t += bt) s += `<line x1="${X(t)}" x2="${X(t)}" y1="30" y2="150" stroke="#2e2e2e"/>`;
    const edges = [0, ...cuts, TOTAL];
    for (let i = 0; i < edges.length - 1; i++) s += `<rect x="${X(edges[i]) + 1}" y="40" width="${X(edges[i + 1]) - X(edges[i]) - 2}" height="36" fill="${i % 2 ? '#EAEAEA' : '#8C8C8C'}"/><text x="${X(edges[i]) + 6}" y="63" font-size="11" font-family="JetBrains Mono" fill="#0A0A0A">KLIP ${i + 1}</text>`;
    s += `<rect x="${X(0)}" y="84" width="${X(3) - X(0)}" height="26" fill="#E61919"/><text x="${X(0) + 6}" y="101" font-size="11" font-family="JetBrains Mono" fill="#fff">TEKS HOOK</text>`;
    s += `<rect x="${X(0)}" y="118" width="600" height="26" fill="#1d1d1d" stroke="#8C8C8C"/><text x="${X(0) + 6}" y="135" font-size="11" font-family="JetBrains Mono" fill="#EAEAEA">AUDIO ♪</text>`;
    cuts.forEach(c => { s += `<line x1="${X(c)}" x2="${X(c)}" y1="34" y2="82" stroke="#E61919" stroke-width="3"/>`; });
    for (let t = 0; t <= TOTAL; t += 3) s += `<text x="${X(t) - 8}" y="172" font-size="10" font-family="JetBrains Mono" fill="#8C8C8C">${t}s</text>`;
    $('[data-sv]', b).innerHTML = s;
    const off = cuts.map(c => Math.abs(c / bt - Math.round(c / bt)) * bt * 1000);
    $('.out', b).innerHTML = `1 ketukan = ${num(bt * 1000, 0)} ms. Selisih tiap potongan dari ketukan terdekat: ${off.map(o => `<b>${num(o, 0)} ms</b>`).join(' · ')}<br>${off.every(o => o < 30) ? 'Semua potongan jatuh tepat di ketukan: transisi terasa menyatu dengan musik.' : 'Potongan meleset dari ketukan; penonton merasakan tersendat walau tidak tahu sebabnya. Tekan Snap.'}`;
  };
  $('[data-s]', b).onclick = () => { const bt = 60 / (+$('[data-k=bpm]', b).value || 120); cuts = cuts.map(c => Math.round(c / bt) * bt); run(); };
  $('[data-r]', b).onclick = () => { cuts = [...cuts0]; run(); };
  $('[data-k=bpm]', b).oninput = run; run();
};

W.safezone = (b) => {
  const M = { 'Reels (perkiraan)': [14, 35, 6], 'Story (perkiraan)': [14, 14, 6], 'TikTok (perkiraan)': [10, 25, 10] };
  b.innerHTML = `<div class="row"><div><label>Platform</label><select data-k="m">${Object.keys(M).map(k => `<option>${k}</option>`).join('')}</select></div>
    <div style="min-width:240px"><label>Posisi judul (dari atas): <b data-o1></b>%</label><input type="range" min="0" max="92" value="8" data-k="a"></div>
    <div style="min-width:240px"><label>Posisi CTA (dari atas): <b data-o2></b>%</label><input type="range" min="0" max="92" value="85" data-k="c"></div></div>
  <div class="two"><div class="stage"><svg data-sv viewBox="0 0 270 480" width="270" style="border:2px solid #EAEAEA"></svg></div><div class="out" style="margin:0"></div></div>
  <p class="dim">Persentase adalah patokan umum dan bisa berubah. Jika ragu, beri jarak lebih besar dan tes di aplikasinya langsung.</p>`;
  const run = () => {
    const [t, bt, sd] = M[$('[data-k=m]', b).value], a = +$('[data-k=a]', b).value, c = +$('[data-k=c]', b).value;
    $('[data-o1]', b).textContent = a; $('[data-o2]', b).textContent = c;
    const H = 480, bad = (y) => y < t || y + 8 > 100 - bt;
    const z = `<rect x="0" y="0" width="270" height="${H * t / 100}" fill="#E61919" fill-opacity=".35"/><rect x="0" y="${H * (100 - bt) / 100}" width="270" height="${H * bt / 100}" fill="#E61919" fill-opacity=".35"/><rect x="0" y="0" width="${270 * sd / 100}" height="${H}" fill="#E61919" fill-opacity=".2"/><rect x="${270 * (100 - sd) / 100}" y="0" width="${270 * sd / 100}" height="${H}" fill="#E61919" fill-opacity=".2"/>`;
    const box = (y, txt) => `<rect x="${270 * sd / 100}" y="${H * y / 100}" width="${270 * (100 - 2 * sd) / 100}" height="${H * 8 / 100}" fill="${bad(y) ? '#fff' : '#EAEAEA'}" stroke="${bad(y) ? '#E61919' : '#EAEAEA'}" stroke-width="3"/><text x="135" y="${H * y / 100 + 24}" text-anchor="middle" font-size="14" font-family="Archivo Black" fill="#0A0A0A">${txt}</text>`;
    $('[data-sv]', b).innerHTML = `<rect width="270" height="${H}" fill="#141414"/>${z}${box(a, 'JUDUL VIDEO')}${box(c, 'DAFTAR SEKARANG')}`;
    $('.out', b).innerHTML = `Atas tertutup: ${t}% · Bawah tertutup: ${bt}% · Samping: ${sd}%<br>Judul: ${bad(a) ? '<b>TERTUTUP antarmuka</b>' : 'aman'}<br>CTA: ${bad(c) ? '<b>TERTUTUP antarmuka</b> (tombol, caption, nama akun)' : 'aman'}<br><br>Area merah = tempat ikon like/komentar, nama akun, caption, dan tombol aplikasi.`;
  };
  $$('input,select', b).forEach(i => i.oninput = run); run();
};

/* ---------- Minggu 12 ---------- */
W.chart = (b) => {
  const D0 = [['Poli Umum', 420], ['Poli Gigi', 180], ['Poli Anak', 260], ['Penyakit Dalam', 340], ['Poli KIA', 150]];
  b.innerHTML = `<div class="two"><div><div class="row"><div style="flex:1"><label>Judul grafik</label><input data-k="t" value="Kunjungan rawat jalan per poli (data fiktif)" style="width:100%"></div></div>
    ${D0.map((d, i) => `<div class="row" style="margin-bottom:4px"><input data-l="${i}" value="${d[0]}" style="width:150px"><input type="number" data-v="${i}" value="${d[1]}" style="width:90px"></div>`).join('')}
    <div class="row btns"><button data-c="bar" class="on">Batang</button><button data-c="hbar">Batang datar</button><button data-c="donut">Donat</button></div></div>
  <div><div class="stage"><svg data-sv viewBox="0 0 400 300" width="100%"></svg></div></div></div><div class="out"></div>`;
  let type = 'bar';
  const run = () => {
    const rows = D0.map((_, i) => [$(`[data-l="${i}"]`, b).value, Math.max(0, +$(`[data-v="${i}"]`, b).value || 0)]);
    const tot = rows.reduce((a, r) => a + r[1], 0) || 1, mx = Math.max(...rows.map(r => r[1]), 1), top = rows.findIndex(r => r[1] === mx);
    const col = (i) => i === top ? '#E61919' : '#8C8C8C';
    let s = `<text x="10" y="22" font-size="13" font-family="JetBrains Mono" font-weight="700" fill="#EAEAEA">${$('[data-k=t]', b).value.replace(/</g, '&lt;')}</text>`;
    if (type === 'bar') rows.forEach((r, i) => { const w = 60, x = 20 + i * 76, h = r[1] / mx * 190; s += `<rect x="${x}" y="${250 - h}" width="${w}" height="${h}" fill="${col(i)}"/><text x="${x + w / 2}" y="${244 - h}" text-anchor="middle" font-size="12" font-family="JetBrains Mono" fill="#EAEAEA">${r[1]}</text><text x="${x + w / 2}" y="270" text-anchor="middle" font-size="9" font-family="JetBrains Mono" fill="#8C8C8C">${r[0].slice(0, 11)}</text>`; });
    if (type === 'hbar') rows.forEach((r, i) => { const y = 44 + i * 48, w = r[1] / mx * 230; s += `<text x="10" y="${y + 20}" font-size="11" font-family="JetBrains Mono" fill="#EAEAEA">${r[0].slice(0, 14)}</text><rect x="120" y="${y}" width="${w}" height="30" fill="${col(i)}"/><text x="${126 + w}" y="${y + 20}" font-size="12" font-family="JetBrains Mono" fill="#EAEAEA">${r[1]}</text>`; });
    if (type === 'donut') { let a0 = -Math.PI / 2; rows.forEach((r, i) => { const a1 = a0 + r[1] / tot * 2 * Math.PI, R = 110, rr = 62, cx = 150, cy = 170, p = (a, q) => [cx + q * Math.cos(a), cy + q * Math.sin(a)], l = a1 - a0 > Math.PI ? 1 : 0; if (r[1] > 0) s += `<path d="M${p(a0, R)} A${R} ${R} 0 ${l} 1 ${p(a1, R)} L${p(a1, rr)} A${rr} ${rr} 0 ${l} 0 ${p(a0, rr)}Z" fill="${col(i)}" stroke="#0A0A0A" stroke-width="2"/>`; a0 = a1; s += `<text x="285" y="${80 + i * 26}" font-size="11" font-family="JetBrains Mono" fill="#EAEAEA">${num(r[1] / tot * 100, 0)}% ${r[0].slice(0, 11)}</text>`; }); }
    $('[data-sv]', b).innerHTML = s;
    $('.out', b).innerHTML = `<b>Kalimat wawasan otomatis:</b> “${rows[top][0]} menyumbang ${num(rows[top][1] / tot * 100, 0)}% dari ${tot.toLocaleString('id-ID')} kunjungan.”<br><span class="dim">Satu warna menonjol = satu pesan. Judul grafik sebaiknya berupa kesimpulan, bukan sekadar nama data.</span>`;
  };
  $$('input', b).forEach(i => i.oninput = run);
  $$('[data-c]', b).forEach(x => x.onclick = () => { type = x.dataset.c; $$('[data-c]', b).forEach(y => y.classList.toggle('on', y === x)); run(); });
  run();
};

W.story = (b) => {
  const ans = ['Judul / hook', 'Konteks singkat', 'Data utama', 'Makna / wawasan', 'Ajakan & sumber'];
  let list = ['Data utama', 'Ajakan & sumber', 'Judul / hook', 'Makna / wawasan', 'Konteks singkat'];
  b.innerHTML = `<p>Susun urutan infografis vertikal (atas → bawah) agar alur bercerita data benar.</p><div data-l></div><div class="row btns"><button data-c class="pri">Periksa urutan</button></div><div class="out"></div>`;
  const draw = () => {
    $('[data-l]', b).innerHTML = list.map((x, i) => `<div class="row btns" style="border:1px solid #2e2e2e;padding:6px 10px;margin:0 0 4px;background:#141414"><span class="red">${i + 1}</span><span style="flex:1">${x}</span><button data-u="${i}">▲</button><button data-d="${i}">▼</button></div>`).join('');
    $$('[data-u]', b).forEach(x => x.onclick = () => { const i = +x.dataset.u; if (i) { [list[i - 1], list[i]] = [list[i], list[i - 1]]; draw(); } });
    $$('[data-d]', b).forEach(x => x.onclick = () => { const i = +x.dataset.d; if (i < 4) { [list[i + 1], list[i]] = [list[i], list[i + 1]]; draw(); } });
  };
  $('[data-c]', b).onclick = () => { const ok = list.filter((x, i) => x === ans[i]).length; $('.out', b).innerHTML = ok === 5 ? '<b>Benar.</b> Hook menarik → konteks → data → makna → ajakan. Alur ini membuat pembaca tahu “mengapa ini penting” sebelum melihat angka.' : `${ok}/5 posisi tepat. Petunjuk: pembaca perlu tertarik dulu, lalu paham konteks, baru disuguhi data dan maknanya.`; };
  draw();
};

/* ---------- Minggu 13 ---------- */
W.slidelink = (b) => {
  const S = ['Menu utama', 'Profil RS', 'Layanan', 'Kontak'];
  const L = { m1: ['Tombol “Profil”', 2, 3], m2: ['Tombol “Layanan”', 3, 2], m3: ['Tombol “Kontak”', 4, 2], b2: ['“← Menu” di slide Profil', 1, 2], b3: ['“← Menu” di slide Layanan', 1, 3], b4: ['“← Menu” di slide Kontak', 1, 3] };
  const cur = {}; Object.keys(L).forEach(k => cur[k] = L[k][2]);
  let at = 1;
  b.innerHTML = `<p>Atur tujuan setiap tombol (seperti fitur <i>Link → Slide</i> di Canva), lalu uji di mode presentasi. Beberapa tautan sengaja salah awalnya.</p>
  <div class="two"><div>${Object.keys(L).map(k => `<div class="row btns" style="margin-bottom:6px"><span style="min-width:200px">${L[k][0]}</span><select data-l="${k}">${S.map((s, i) => `<option value="${i + 1}">→ Slide ${i + 1}: ${s}</option>`).join('')}</select></div>`).join('')}<button data-c class="pri">Periksa tautan</button><div class="out"></div></div>
  <div><div data-v style="aspect-ratio:16/9;background:#EAEAEA;color:#0A0A0A;padding:16px;display:flex;flex-direction:column;gap:8px;font-family:'Open Sans',sans-serif"></div><p class="dim">Mode presentasi: klik tombol di slide.</p></div></div>`;
  $$('[data-l]', b).forEach(s => { s.value = cur[s.dataset.l]; s.onchange = () => { cur[s.dataset.l] = +s.value; }; });
  const view = () => {
    const v = $('[data-v]', b), btn = (k, t) => `<button data-go="${k}" style="color:#0A0A0A;border-color:#0A0A0A;text-align:left">${t}</button>`;
    v.innerHTML = `<div style="font:400 1.2rem 'Archivo Black';text-transform:uppercase">${S[at - 1]}</div>` + (at === 1 ? btn('m1', 'Profil') + btn('m2', 'Layanan') + btn('m3', 'Kontak') : `<div style="flex:1;font-size:12px">${at === 2 ? 'Visi, misi, dan sejarah singkat rumah sakit.' : at === 3 ? 'Rawat jalan · IGD 24 jam · Laboratorium · Radiologi' : 'Telepon (021) 000-000 · Jl. Contoh No. 1'}</div>` + btn('b' + at, '← Menu'));
    $$('[data-go]', v).forEach(x => { x.style.cssText += ';padding:6px 10px;font-size:12px;border:1px solid #0A0A0A;cursor:pointer'; x.onclick = () => { at = cur[x.dataset.go]; view(); }; });
  };
  $('[data-c]', b).onclick = () => { const ok = Object.keys(L).filter(k => cur[k] === L[k][1]).length; $('.out', b).innerHTML = ok === 6 ? '<b>Semua benar.</b> Navigasi hub-and-spoke: satu menu, banyak halaman, selalu ada jalan kembali.' : `<b>${ok} / 6</b> benar. Uji klik tiap tombol di mode presentasi untuk menemukan tautan yang salah.`; };
  view();
};

/* ---------- Minggu 14 ---------- */
W.board = (b) => {
  const pages = ['1 Cover', '2 Masalah', '3 Data', '4 Solusi', '5 Visual produk', '6 Testimoni', '7 Jadwal', '8 Kontak & CTA'];
  b.innerHTML = `<div class="row">${['A', 'B', 'C', 'D'].map((n, i) => `<div><label>Anggota ${i + 1}</label><input data-m="${i}" value="${n}" style="width:100px"></div>`).join('')}</div>
  <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">${pages.map((p, i) => `<div><label>${p}</label><select data-p="${i}"></select></div>`).join('')}</div><div class="out"></div>`;
  const fill = () => {
    const names = $$('[data-m]', b).map(x => x.value || '?');
    $$('[data-p]', b).forEach((s, j) => { const old = s.value; s.innerHTML = `<option value="">— belum —</option>` + names.map((n, i) => `<option value="${i}">${n}</option>`).join(''); s.value = old || ''; });
    run();
  };
  const run = () => {
    const names = $$('[data-m]', b).map(x => x.value || '?'), c = names.map(() => 0); let un = 0;
    $$('[data-p]', b).forEach(s => { if (s.value === '') un++; else c[+s.value]++; });
    $('.out', b).innerHTML = names.map((n, i) => `${n}: <b>${c[i]}</b> halaman<div class="bar"><i style="width:${c[i] / 8 * 100}%"></i></div>`).join('') +
      (un ? `<b>${un}</b> halaman belum ada penanggung jawab.` : (Math.max(...c) - Math.min(...c) > 1 ? 'Beban belum seimbang: selisih lebih dari 1 halaman.' : 'Pembagian merata dan setiap halaman punya satu pemilik. Dua orang yang mengedit halaman sama akan saling menimpa.'));
  };
  $$('[data-m]', b).forEach(x => x.oninput = fill); $$('[data-p]', b).forEach(x => x.onchange = run); fill();
};

W.planner = (b) => {
  const T = ['', 'E', 'P', 'I', 'B'], N = { E: 'Edukasi', P: 'Promosi', I: 'Interaktif', B: 'Di balik layar' };
  const grid = store.get('planner', Array(28).fill(''));
  b.innerHTML = `<p>Klik tanggal untuk mengganti jenis konten (<b>E</b>dukasi · <b>P</b>romosi · <b>I</b>nteraktif · <b>B</b>ehind-the-scenes). Rencanakan 4 minggu.</p>
  <div class="mock" style="grid-template-columns:repeat(7,1fr)">${['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'].map(d => `<div style="background:#1d1d1d;text-align:center;padding:4px;font-size:11px">${d}</div>`).join('')}${grid.map((_, i) => `<button data-i="${i}" style="min-height:44px"></button>`).join('')}</div><div class="out"></div>`;
  const run = () => {
    $$('[data-i]', b).forEach(x => { const v = grid[+x.dataset.i]; x.textContent = (+x.dataset.i + 1) + (v ? ' ' + v : ''); x.classList.toggle('on', v === 'P'); });
    const c = { E: 0, P: 0, I: 0, B: 0 }; grid.forEach(v => v && c[v]++);
    const tot = Object.values(c).reduce((a, x) => a + x, 0), pr = tot ? c.P / tot : 0;
    $('.out', b).innerHTML = Object.keys(c).map(k => `${N[k]}: <b>${c[k]}</b>`).join(' · ') + `<br>${!tot ? 'Belum ada konten.' : pr > .3 ? '<b>Promosi terlalu dominan</b> (>30%). Audiens bosan; tambah konten edukasi dan interaktif.' : tot < 12 ? 'Jadwal masih jarang; target 3–4 unggahan per minggu.' : 'Campuran konten sehat. Tetap konsisten jam unggah.'}`;
    store.set('planner', grid);
  };
  $$('[data-i]', b).forEach(x => x.onclick = () => { const i = +x.dataset.i; grid[i] = T[(T.indexOf(grid[i]) + 1) % T.length]; run(); }); run();
};

/* ---------- Minggu 15 ---------- */
W.colorconv = (b) => {
  b.innerHTML = `<div class="two"><div><h4>Warna digital (Canva)</h4><div class="row"><div><label>HEX</label><input data-k="hex" value="#0B5FA5" style="width:110px"></div><input type="color" data-k="pick" value="#0b5fa5"></div></div>
  <div><h4>Warna cetak (CorelDRAW CMYK)</h4><div class="row">${['C', 'M', 'Y', 'K'].map((k, i) => `<div><label>${k}</label><input type="number" min="0" max="100" value="${[100, 60, 0, 10][i]}" data-c="${k}" style="width:64px"></div>`).join('')}</div></div></div>
  <div class="two"><div class="swatch" data-a style="height:80px"></div><div class="swatch" data-b style="height:80px"></div></div><div class="out"></div>`;
  const run = () => {
    let hx = $('[data-k=hex]', b).value.trim(); if (!/^#[0-9a-f]{6}$/i.test(hx)) { $('.out', b).textContent = 'Masukkan HEX 6 digit, contoh #0B5FA5.'; return; }
    hx = hx.toUpperCase();
    const c = ['C', 'M', 'Y', 'K'].map(k => clamp(+$(`[data-c=${k}]`, b).value || 0, 0, 100)), p = cmyk2rgb(...c), d = hex2rgb(hx), de = dE(p, d);
    $('[data-a]', b).style.background = hx; $('[data-b]', b).style.background = rgb2hex(p);
    $('.out', b).innerHTML = `Digital: <b>${hx}</b> = rgb(${d})<br>Cetak (konversi sederhana): <b>${rgb2hex(p)}</b> = rgb(${p})<br>Selisih persepsi ΔE = <b>${num(de, 1)}</b> → ${de < 3 ? 'nyaris tak terlihat berbeda' : de < 8 ? 'berbeda tipis, biasanya masih dapat diterima' : '<b>berbeda jelas</b> — sesuaikan nilai agar terlihat sepadan'}<br><span class="dim">Perhitungan ini hanya pendekatan matematis tanpa profil ICC. Hasil cetak nyata tetap harus dicek dengan proof/uji cetak.</span>`;
  };
  $('[data-k=pick]', b).oninput = (e) => { $('[data-k=hex]', b).value = e.target.value.toUpperCase(); run(); };
  $$('input', b).forEach(i => { if (i.dataset.k !== 'pick') i.oninput = run; }); run();
};

W.pitch = (b) => {
  const S = [['Masalah & konteks klien', 60], ['Ide besar / konsep', 60], ['Solusi visual: media cetak', 90], ['Solusi visual: media digital', 90], ['Bukti konsistensi brand', 60], ['Penutup & ajakan keputusan', 30]];
  const tot = S.reduce((a, s) => a + s[1], 0);
  b.innerHTML = `<p>Latih pitching ${num(tot / 60, 1)} menit. Tekan mulai, ikuti urutan, dan jangan melewati waktu tiap bagian.</p><div data-l></div><div class="row btns" style="margin-top:10px"><button data-s class="pri">▶ Mulai</button><button data-r>Reset</button><span class="score" data-t></span></div>`;
  let idx = -1, left = 0, iv = null;
  const draw = () => {
    $('[data-l]', b).innerHTML = S.map((s, i) => `<div class="row btns" style="margin:0 0 3px;padding:7px 10px;border:1px solid ${i === idx ? '#EAEAEA' : '#2e2e2e'};background:${i === idx ? '#E61919' : '#141414'};color:${i < idx ? '#8C8C8C' : '#EAEAEA'}"><span>${i + 1}</span><span style="flex:1">${s[0]}</span><b>${i === idx ? left : s[1]} dtk</b></div>`).join('');
    $('[data-t]', b).textContent = idx >= S.length ? 'SELESAI' : '';
  };
  const stop = () => { clearInterval(iv); iv = null; };
  $('[data-s]', b).onclick = () => { stop(); idx = 0; left = S[0][1]; draw(); iv = setInterval(() => { left--; if (left < 0) { idx++; if (idx >= S.length) { stop(); } else left = S[idx][1]; } draw(); }, 1000); };
  $('[data-r]', b).onclick = () => { stop(); idx = -1; draw(); };
  draw();
};
