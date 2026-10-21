/* Widget tambahan — pertemuan 1 & 3 */
const hsl2h = (h, s, l) => {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return '#' + [f(0), f(8), f(4)].map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
};

W.colorwheel = (b) => {
  const MEAN = ['Merah: darurat, energi, peringatan', 'Oranye: ramah, hangat, semangat', 'Kuning: waspada, ceria, perhatian', 'Hijau: sehat, alam, tenang', 'Biru: tepercaya, bersih, profesional', 'Ungu: kreatif, premium, tenang'];
  b.innerHTML = `<div class="row"><div style="min-width:240px"><label>Warna dasar (hue): <b data-o>210</b>°</label><input type="range" min="0" max="359" value="210" data-k="h"></div>
    <div><label>Skema warna</label><select data-k="s"><option value="ana">Analogus (bertetangga)</option><option value="com">Komplementer (berseberangan)</option><option value="tri">Triadik (segitiga)</option><option value="mono">Monokromatik</option></select></div></div>
  <div class="two"><div class="stage"><svg data-sv viewBox="0 0 280 280" width="280"></svg></div><div><div data-chips></div><div class="out"></div></div></div>`;
  const run = () => {
    const h = +$('[data-k=h]', b).value, s = $('[data-k=s]', b).value;
    $('[data-o]', b).textContent = h;
    const hs = s === 'ana' ? [h - 30, h, h + 30] : s === 'com' ? [h, h + 180] : s === 'tri' ? [h, h + 120, h + 240] : [h];
    let svg = '';
    for (let i = 0; i < 24; i++) {
      const a0 = (i * 15 - 90) * Math.PI / 180, a1 = ((i + 1) * 15 - 90) * Math.PI / 180, R = 130, r = 70, c = (a, q) => `${140 + q * Math.cos(a)} ${140 + q * Math.sin(a)}`;
      svg += `<path d="M${c(a0, R)} A${R} ${R} 0 0 1 ${c(a1, R)} L${c(a1, r)} A${r} ${r} 0 0 0 ${c(a0, r)}Z" fill="${hsl2h(i * 15 + 7.5, 75, 50)}"/>`;
    }
    const pts = hs.map(x => { const a = ((((x % 360) + 360) % 360) - 90) * Math.PI / 180; return [140 + 100 * Math.cos(a), 140 + 100 * Math.sin(a)]; });
    svg += pts.map((p, i) => `<circle cx="${p[0]}" cy="${p[1]}" r="9" fill="#0A0A0A" stroke="#fff" stroke-width="3"/>${i ? `<line x1="${pts[i - 1][0]}" y1="${pts[i - 1][1]}" x2="${p[0]}" y2="${p[1]}" stroke="#fff" stroke-width="2"/>` : ''}`).join('');
    if (pts.length > 2) svg += `<line x1="${pts[0][0]}" y1="${pts[0][1]}" x2="${pts[2][0]}" y2="${pts[2][1]}" stroke="#fff" stroke-width="2"/>`;
    $('[data-sv]', b).innerHTML = svg;
    const cols = s === 'mono' ? [hsl2h(h, 70, 25), hsl2h(h, 70, 40), hsl2h(h, 70, 55), hsl2h(h, 70, 75), hsl2h(h, 40, 92)] : hs.map(x => hsl2h(x, 70, 45)).concat([hsl2h(h, 25, 95), hsl2h(h, 40, 10)]);
    $('[data-chips]', b).innerHTML = `<div style="display:flex;flex-wrap:wrap;gap:6px">${cols.map(c => `<div style="width:84px"><div style="height:54px;background:${c};border:1px solid #8C8C8C"></div><div style="font-size:11px">${c}</div></div>`).join('')}</div>`;
    const idx = h < 20 || h >= 340 ? 0 : h < 45 ? 1 : h < 70 ? 2 : h < 170 ? 3 : h < 260 ? 4 : 5;
    $('.out', b).innerHTML = `<b>Makna umum:</b> ${MEAN[idx]}.<br><span class="dim">Makna warna berbeda antar budaya. Pada media RS, biru dan hijau sering dipilih karena kesan bersih dan tenang; merah dicadangkan untuk peringatan/darurat.</span>`;
  };
  $$('input,select', b).forEach(i => i.oninput = run); run();
};

W.typesetter = (b) => {
  const TXT = 'Setiap pasien berhak memperoleh informasi yang jelas mengenai diagnosis, tindakan medis, risiko, dan biaya pelayanan. Petugas wajib menjelaskan dengan bahasa yang mudah dipahami. Bila ada hal yang belum jelas, jangan ragu bertanya sebelum menandatangani persetujuan tindakan. Rumah sakit menjaga kerahasiaan data medis setiap pasien.';
  b.innerHTML = `<div class="row">
    <div><label>Font</label><select data-k="f"><option>Open Sans</option><option>Lora</option><option>Montserrat</option><option>Merriweather</option><option>Oswald</option></select></div>
    <div><label>Ukuran: <b data-o="s"></b></label><input type="range" min="10" max="26" value="16" data-k="s"></div>
    <div><label>Leading: <b data-o="l"></b></label><input type="range" min="10" max="22" value="15" data-k="l"></div>
    <div><label>Tracking: <b data-o="t"></b></label><input type="range" min="-5" max="20" value="0" data-k="t"></div>
    <div><label>Lebar baris: <b data-o="w"></b></label><input type="range" min="180" max="760" value="460" step="10" data-k="w"></div>
    <div><label>Perataan</label><select data-k="a"><option value="left">Rata kiri</option><option value="justify">Rata kiri-kanan</option><option value="center">Tengah</option><option value="right">Rata kanan</option></select></div></div>
  <div class="stage" style="display:block;background:#f4f4f0;color:#111;overflow:auto"><p data-p style="margin:0 auto"></p></div><div class="out"></div>`;
  const run = () => {
    const g = (k) => $(`[data-k=${k}]`, b).value, s = +g('s'), l = +g('l') / 10, t = +g('t') / 100, w = +g('w');
    const p = $('[data-p]', b); p.textContent = TXT;
    p.style.cssText = `margin:0 auto;font-family:'${g('f')}';font-size:${s}px;line-height:${l};letter-spacing:${t}em;width:${w}px;text-align:${g('a')};max-width:100%`;
    $('[data-o=s]', b).textContent = s + 'px'; $('[data-o=l]', b).textContent = num(l, 1) + '×'; $('[data-o=t]', b).textContent = num(t, 2) + 'em'; $('[data-o=w]', b).textContent = w + 'px';
    const cpl = Math.round(w / (s * (.5 + t))), notes = [];
    notes.push(cpl < 45 ? `Baris sekitar <b>${cpl}</b> karakter: terlalu pendek, mata sering melompat.` : cpl > 75 ? `Baris sekitar <b>${cpl}</b> karakter: terlalu panjang, mata sulit menemukan awal baris berikutnya.` : `Baris sekitar <b>${cpl}</b> karakter: nyaman (ideal 45–75).`);
    notes.push(l < 1.2 ? 'Leading terlalu rapat: baris saling menempel.' : l > 1.7 ? 'Leading terlalu renggang: baris terasa terpisah.' : 'Leading nyaman (±1,2–1,6×).');
    notes.push(t > .08 ? 'Tracking terlalu lebar untuk paragraf; cocok hanya untuk label huruf kapital kecil.' : t < -.02 ? 'Tracking terlalu rapat; huruf bertabrakan.' : 'Tracking wajar.');
    if (g('a') === 'justify') notes.push('Rata kiri-kanan bisa menimbulkan celah kata yang besar pada baris pendek.');
    if (g('a') === 'center') notes.push('Rata tengah hanya baik untuk teks pendek (judul), bukan paragraf.');
    $('.out', b).innerHTML = notes.join('<br>');
  };
  $$('input,select', b).forEach(i => i.oninput = run); run();
  if (document.fonts) document.fonts.ready.then(run);
};
