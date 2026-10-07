/* Ruang PICU 3D — seksi "Perjalanan pelatihan" di index.html.
   Ruangan dibangun dari bidang-bidang CSS 3D; kamera bergerak mengikuti gulir halaman. */
(function () {
  const sec = document.getElementById('perjalanan');
  if (!sec) return;
  const view = sec.querySelector('.r3-view');
  const world = sec.querySelector('.r3-world');
  const sticky = sec.querySelector('.r3-sticky');
  const P = 900; // sama dengan perspective di CSS
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- helper bangun ruangan ---------- */
  const T = (x, y, z) => `translate3d(${x}px,${y}px,${z}px)`;
  function face(cls, w, h, tf, html) {
    const d = document.createElement('div');
    d.className = 'r3-f ' + (cls || '');
    d.style.cssText = `width:${w}px;height:${h}px;margin:${-h / 2}px 0 0 ${-w / 2}px;transform:${tf}`;
    if (html) d.innerHTML = html;
    world.appendChild(d);
    return d;
  }
  // y = sisi bawah benda (lantai = 0, ke atas negatif)
  function box(x, y, z, w, h, d, c, o) {
    o = o || {};
    const cy = y - h / 2, k = o.cls || '';
    const fs = [
      face(k + ' sh0', w, h, T(x, cy, z + d / 2), o.front),
      face(k + ' sh1', d, h, T(x - w / 2, cy, z) + ' rotateY(-90deg)'),
      face(k + ' sh1', d, h, T(x + w / 2, cy, z) + ' rotateY(90deg)'),
      face(k + ' shT', w, d, T(x, y - h, z) + ' rotateX(90deg)', o.top)
    ];
    if (!o.noBack) fs.push(face(k + ' sh2', w, h, T(x, cy, z - d / 2) + ' rotateY(180deg)'));
    fs.forEach(f => f.style.setProperty('--c', c));
    return fs;
  }
  // gambar tegak menghadap kamera (orang, label)
  function stand(cls, x, y, z, w, h, rot, html) {
    if (/r3-who/.test(cls)) { w *= 1.35; h *= 1.35; } // orang dibuat proporsional dengan tempat tidur
    return face('r3-bb ' + cls, w, h, T(x, y - h / 2, z) + ` rotateY(${rot || 0}deg)`, html);
  }

  /* ---------- gambar SVG ---------- */
  const skin = ['#F2CBA8', '#E2AF86', '#D9A27A'];
  function person(o) {
    const s = o.skin || skin[0], sc = o.scrub || '#2F5FB3', dk = o.dark || '#1F4690';
    let head = '';
    if (o.head === 'hijab') {
      head = `<path d="M50 14c-17 0-27 13-27 30 0 9 2 16 6 21-6 4-9 9-10 15h62c-1-6-4-11-10-15 4-5 6-12 6-21 0-17-10-30-27-30z" fill="${o.hc}"/>
              <ellipse cx="50" cy="45" rx="16" ry="19" fill="${s}"/>`;
    } else if (o.head === 'cap') {
      head = `<ellipse cx="50" cy="45" rx="17" ry="20" fill="${s}"/>
              <path d="M32 40c0-15 8-24 18-24s18 9 18 24c-6-3-12-4-18-4s-12 1-18 4z" fill="${o.hc}"/>`;
    } else {
      head = `<path d="M31 46c-2-19 7-30 19-30s21 11 19 30c-4-9-11-13-19-13s-15 4-19 13z" fill="${o.hc || '#2B1D16'}"/>
              <ellipse cx="50" cy="47" rx="17" ry="20" fill="${s}"/>
              <path d="M33 40c2-12 9-18 17-18s15 6 17 18c-5-6-11-9-17-9s-12 3-17 9z" fill="${o.hc || '#2B1D16'}"/>`;
    }
    const mask = o.mask === false ? `<path d="M44 56q6 5 12 0" stroke="#7A3E2B" stroke-width="2" fill="none" stroke-linecap="round"/>`
      : `<rect x="37" y="49" width="26" height="15" rx="6" fill="#BFE3F2"/><path d="M38 53h24M38 58h24" stroke="#9CCDE3" stroke-width="1.2"/>`;
    let item = '';
    if (o.item === 'clip') item = `<rect x="56" y="98" width="30" height="38" rx="3" fill="#8B5E3C"/><rect x="59" y="103" width="24" height="30" fill="#fff"/><path d="M62 110h16M62 117h16M62 124h12" stroke="#9AA9B8" stroke-width="2"/><path d="M61 109l2 2 4-4M61 116l2 2 4-4" stroke="#14B8A6" stroke-width="2" fill="none"/><rect x="66" y="96" width="10" height="5" rx="2" fill="#C9CED4"/>`;
    if (o.item === 'book') item = `<rect x="55" y="100" width="32" height="36" rx="3" fill="#E0A93B"/><rect x="58" y="104" width="26" height="6" fill="#fff" opacity=".85"/><text x="71" y="127" font-size="7" font-weight="800" text-anchor="middle" fill="#5A3A06">LOG</text>`;
    if (o.item === 'remote') item = `<rect x="64" y="104" width="10" height="20" rx="3" fill="#33414F"/><circle cx="69" cy="109" r="2" fill="#F05A5A"/>`;
    return `<svg viewBox="0 0 100 220" aria-hidden="true">
      <ellipse cx="50" cy="214" rx="30" ry="5" fill="#000" opacity=".12"/>
      <rect x="35" y="148" width="13" height="58" rx="5" fill="${dk}"/><rect x="52" y="148" width="13" height="58" rx="5" fill="${dk}"/>
      <rect x="32" y="202" width="17" height="9" rx="4" fill="#E9EEF3"/><rect x="51" y="202" width="17" height="9" rx="4" fill="#E9EEF3"/>
      <path d="M26 86c0-10 9-16 24-16s24 6 24 16v68H26z" fill="${sc}"/>
      <path d="M42 72l8 12 8-12" fill="none" stroke="${dk}" stroke-width="3"/>
      <rect x="18" y="80" width="12" height="52" rx="6" fill="${sc}"/><rect x="70" y="80" width="12" height="52" rx="6" fill="${sc}"/>
      <circle cx="24" cy="134" r="6" fill="#EAF2FB"/><circle cx="76" cy="134" r="6" fill="#EAF2FB"/>
      ${o.tag ? `<text x="38" y="104" font-size="7" font-weight="800" fill="#fff" opacity=".9">${o.tag}</text>` : ''}
      ${head}
      <ellipse cx="43" cy="44" rx="2.6" ry="3.2" fill="#2B1D16"/><ellipse cx="57" cy="44" rx="2.6" ry="3.2" fill="#2B1D16"/>
      <circle cx="44" cy="43" r=".9" fill="#fff"/><circle cx="58" cy="43" r=".9" fill="#fff"/>
      ${mask}${item}
    </svg>`;
  }
  function childHead(o) {
    const tube = o.vent ? `<path d="M70 70 q-30 6 -70 2" stroke="#4FA3E0" stroke-width="7" fill="none"/><path d="M70 70 q-30 6 -70 2" stroke="#9FD3F5" stroke-width="2.5" stroke-dasharray="2 3" fill="none"/><rect x="62" y="64" width="16" height="7" rx="2" fill="#FBE7B5"/>`
      : `<path d="M62 70q8 5 16 0" stroke="#B5574A" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    return `<svg viewBox="0 0 140 100" aria-hidden="true">
      <rect x="8" y="6" width="124" height="90" rx="22" fill="#FFFFFF"/><rect x="8" y="6" width="124" height="90" rx="22" fill="none" stroke="#E2E6F0" stroke-width="3"/>
      <ellipse cx="70" cy="56" rx="26" ry="28" fill="${o.skin || skin[0]}"/>
      <path d="M44 52c-1-20 12-28 26-28s27 8 26 28c-6-9-15-13-26-13s-20 4-26 13z" fill="${o.hair || '#3A271C'}"/>
      <path d="M56 58q4 3 8 0M76 58q4 3 8 0" stroke="#3A271C" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <circle cx="54" cy="66" r="4.5" fill="#F4A6A0" opacity=".6"/><circle cx="86" cy="66" r="4.5" fill="#F4A6A0" opacity=".6"/>
      ${tube}
    </svg>`;
  }
  function blanket(o) {
    let fl = '';
    const pts = [[25, 40], [70, 30], [112, 46], [40, 92], [96, 100], [24, 146], [70, 136], [116, 150], [48, 178], [102, 176]];
    pts.forEach(([x, y], i) => {
      const c = ['#FFD36E', '#8FD3C1', '#F7A8C4', '#9DB8F5'][i % 4];
      fl += `<g transform="translate(${x} ${y})"><circle r="6" fill="${c}"/><circle r="2.5" fill="#fff"/></g>`;
    });
    const bear = o.bear ? `<g transform="translate(98 64)"><circle cx="-9" cy="-12" r="6" fill="#C98B52"/><circle cx="9" cy="-12" r="6" fill="#C98B52"/><circle r="14" fill="#D9A06A"/><circle cx="-5" cy="-2" r="1.8" fill="#3A271C"/><circle cx="5" cy="-2" r="1.8" fill="#3A271C"/><ellipse cy="5" rx="5" ry="4" fill="#F1D3B0"/></g>` : '';
    return `<svg viewBox="0 0 140 190" aria-hidden="true">
      <rect x="0" y="0" width="140" height="190" rx="10" fill="#C9B8F0"/>
      <rect x="0" y="0" width="140" height="26" rx="8" fill="#B4A0EA"/>${fl}
      <ellipse cx="36" cy="22" rx="10" ry="8" fill="${o.skin || skin[0]}"/><ellipse cx="104" cy="22" rx="10" ry="8" fill="${o.skin || skin[0]}"/>
      ${bear}
    </svg>`;
  }
  const ecg = `<svg class="r3-ecg" viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 26h18l4-4 4 4h8l3 8 5-30 5 26 3-4h20l4-4 4 4h8l3 8 5-30 5 26 3-4h20l4-4 4 4h8l3 8 5-30 5 26 3-4h22" fill="none" stroke="#3BF07A" stroke-width="2"/></svg>`;
  const pleth = `<svg class="r3-ecg r3-slow" viewBox="0 0 200 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0 22c10 0 12-16 22-16s10 14 18 14 8-4 12-4 8 8 14 8 12-16 22-16 10 14 18 14 8-4 12-4 8 8 14 8 12-16 22-16 10 14 18 14 8-4 12-4 4 4 4 4" fill="none" stroke="#3CC8F0" stroke-width="2"/></svg>`;
  function monitor(hr, sp) {
    return `<div class="r3-mon">${ecg}${pleth}<b class="hr">${hr}</b><b class="sp">${sp}</b><i class="dot"></i></div>`;
  }
  const sunflower = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0v60" stroke="#5E9E4A" stroke-width="4"/><path d="M0 34q-14-6-18 4 10 4 18-4zM0 44q14-6 18 4-10 4-18-4z" fill="#6FB352"/>${Array.from({ length: 12 }, (_, i) => `<ellipse rx="5" ry="12" transform="rotate(${i * 30}) translate(0 -13)" fill="#F7C531"/>`).join('')}<circle r="9" fill="#8A5A2B"/></g>`;
  const cloud = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity=".9"><circle cx="0" cy="0" r="14"/><circle cx="16" cy="-6" r="18"/><circle cx="34" cy="0" r="13"/><rect x="0" y="0" width="34" height="13"/></g>`;
  const fly = (x, y, c) => `<g class="r3-fly" transform="translate(${x} ${y})"><ellipse cx="-6" cy="0" rx="7" ry="9" fill="${c}"/><ellipse cx="6" cy="0" rx="7" ry="9" fill="${c}"/><rect x="-1.2" y="-8" width="2.4" height="16" rx="1" fill="#2E3A46"/></g>`;
  const giraffe = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 120v-40q0-14 14-14h40q14 0 14 14v40" fill="#F5C24C"/><rect x="-26" y="100" width="8" height="40" fill="#F5C24C"/><rect x="18" y="100" width="8" height="40" fill="#F5C24C"/><path d="M18 70l14-80h14l-8 82z" fill="#F5C24C"/><ellipse cx="44" cy="-14" rx="20" ry="12" fill="#F5C24C"/><circle cx="48" cy="-18" r="2.5" fill="#3A271C"/><path d="M36 -26v-10M44 -26v-10" stroke="#B67B2C" stroke-width="3"/><circle cx="36" cy="-38" r="3" fill="#B67B2C"/><circle cx="44" cy="-38" r="3" fill="#B67B2C"/>${[[-14, 80], [6, 86], [-4, 104], [30, 40], [36, 10], [14, 74]].map(([a, b]) => `<circle cx="${a}" cy="${b}" r="6" fill="#D98E2B" opacity=".8"/>`).join('')}</g>`;

  /* ---------- dinding, lantai, plafon ---------- */
  const W = 1000, H = 460, Z0 = -1000, Z1 = 400, D = Z1 - Z0, ZC = (Z0 + Z1) / 2;
  face('r3-floor', W, D, T(0, 0, ZC) + ' rotateX(90deg)', '<i class="r3-spot" data-s="1" style="left:40px;top:620px"></i><i class="r3-spot" data-s="2 4" style="left:670px;top:620px"></i><i class="r3-spot" data-s="3" style="left:170px;top:110px"></i>');
  face('r3-ceil', W, D, T(0, -H, ZC) + ' rotateX(-90deg)', '<i style="left:180px;top:300px"></i><i style="left:620px;top:300px"></i><i style="left:180px;top:800px"></i><i style="left:620px;top:800px"></i>');

  const backHTML = `
    <svg class="r3-mural" viewBox="0 0 1000 460" preserveAspectRatio="none" aria-hidden="true">
      ${cloud(450, 70, 1.2)}${cloud(80, 300, .9)}${cloud(880, 290, .9)}
      ${fly(500, 140, '#F7A8C4')}${fly(60, 120, '#9DB8F5')}${fly(940, 160, '#FFD36E')}
      ${sunflower(30, 390, .9)}${sunflower(970, 395, .8)}${sunflower(500, 395, .7)}
    </svg>
    <div class="r3-win" style="left:120px"><span class="r3-bed">BED<b>11</b></span></div>
    <div class="r3-win" style="left:640px"><span class="r3-bed">BED<b>12</b></span></div>
    <div class="r3-ac" style="left:150px"></div>
    <div class="r3-sign">PICU</div>
    <div class="r3-gas"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>`;
  face('r3-wall', W, H, T(0, -H / 2, Z0), backHTML);

  const leftHTML = `
    <svg class="r3-mural" viewBox="0 0 1400 460" preserveAspectRatio="none" aria-hidden="true">
      ${cloud(140, 80, 1)}${cloud(1180, 60, 1.1)}${fly(320, 120, '#F7A8C4')}${fly(1040, 180, '#8FD3C1')}
      ${giraffe(1180, 270, 1.05)}
      ${sunflower(60, 390, .9)}${sunflower(330, 395, .75)}${sunflower(1020, 392, .85)}${sunflower(1340, 396, .7)}
    </svg>
    <div class="r3-screen" style="left:520px">
      <div class="r3-slide">
        <p class="r3-sk">Materi pelatihan</p>
        <div class="r3-roll"><span>Bantuan hidup lanjut</span><span>Intubasi &amp; ekstubasi</span><span>Ventilasi mekanik</span><span>Terapi oksigen</span><span>Cairan &amp; hemodinamik</span><span>Nutrisi anak kritis</span><span>Patient &amp; family</span><span>Bantuan hidup lanjut</span></div>
        <div class="r3-bars"><i style="--w:70%;--c:#1E63B5">Dasar</i><i style="--w:92%;--c:#E0A93B">Inti</i><i style="--w:55%;--c:#14B8A6">Penunjang</i></div>
      </div>
    </div>`;
  face('r3-wall', D, H, T(-W / 2, -H / 2, ZC) + ' rotateY(90deg)', leftHTML);

  const rightHTML = `
    <svg class="r3-mural" viewBox="0 0 1400 460" preserveAspectRatio="none" aria-hidden="true">
      ${cloud(200, 70, 1.1)}${cloud(900, 90, 1)}${fly(560, 110, '#FFD36E')}${fly(1200, 150, '#F7A8C4')}
      ${Array.from({ length: 11 }, (_, i) => sunflower(70 + i * 125, 385 + (i % 2) * 8, .75 + (i % 3) * .08)).join('')}
    </svg>
    <div class="r3-letters" style="left:420px"><b style="--c:#1E63B5">P</b><b style="--c:#E0A93B">I</b><b style="--c:#14B8A6">C</b><b style="--c:#F06A8A">U</b></div>
    <div class="r3-ac" style="left:980px"></div>`;
  face('r3-wall', D, H, T(W / 2, -H / 2, ZC) + ' rotateY(-90deg)', rightHTML);

  // dinding depan dengan pintu masuk
  face('r3-wall r3-front', 1000, 760, T(-700, -380, Z1), `<svg class="r3-mural" viewBox="0 0 1000 760" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">${sunflower(760, 690, .9)}${sunflower(900, 696, .75)}${sunflower(560, 694, .8)}${cloud(780, 390, 1)}${fly(640, 430, '#F7A8C4')}</svg>`);
  face('r3-wall r3-front', 1000, 760, T(700, -380, Z1), `<svg class="r3-mural" viewBox="0 0 1000 760" preserveAspectRatio="xMinYMax meet" aria-hidden="true">${sunflower(110, 692, .85)}${sunflower(250, 696, .7)}${sunflower(430, 690, .9)}${fly(150, 420, '#9DB8F5')}${cloud(300, 380, .9)}</svg>`);
  face('r3-wall r3-front', 400, 300, T(0, -610, Z1));
  face('r3-wall r3-front r3-lintel', 400, 160, T(0, -H + 80, Z1), '<div class="r3-door">Ruang Intensif Anak<b>PICU</b></div>');

  /* ---------- tempat tidur pasien ---------- */
  function bed(x, o) {
    const zc = -830, frame = '#ECE5D4', rail = '#D8D1C0';
    [[-75, -965], [75, -965], [-75, -695], [75, -695]].forEach(([dx, dz]) => box(x + dx, 0, dz, 8, 40, 8, '#9AA5B1'));
    box(x, -40, zc, 170, 28, 300, frame);
    box(x, -68, zc, 160, 28, 290, '#F6F7FB');
    box(x, -40, -982, 170, 100, 10, frame);
    box(x, -40, -680, 170, 64, 8, frame, { front: '<div class="r3-foot">⚠</div>' });
    box(x - 86, -96, zc + 30, 6, 30, 190, rail);
    box(x + 86, -96, zc + 30, 6, 30, 190, rail);
    // kepala tempat tidur sedikit ditinggikan (30°)
    face('r3-pt', 150, 100, T(x, -97 - 25, -880 - 43) + ' rotateX(60deg)', childHead(o));
    face('r3-pt', 150, 190, T(x, -97, -785) + ' rotateX(90deg)', blanket(o));
  }
  bed(-260, { vent: true, skin: skin[1], hair: '#2B1D16' });
  bed(260, { bear: true, skin: skin[0], hair: '#4A2F20' });

  // monitor dinding
  box(-90, -250, -992, 104, 72, 12, '#1B2633', { front: monitor(128, 97), cls: 'r3-dev' });
  box(90, -250, -992, 104, 72, 12, '#1B2633', { front: monitor(112, 99), cls: 'r3-dev' });
  // ventilator di samping bed 11
  box(-408, -22, -890, 74, 104, 64, '#E6ECF1', { front: '<div class="r3-vent"><div class="scr"><svg class="r3-ecg r3-slow" viewBox="0 0 200 30" preserveAspectRatio="none"><path d="M0 26h10l8-20h20l6 20h16l8-20h20l6 20h16l8-20h20l6 20h16l8-20h20l6 20h12" fill="none" stroke="#FFD36E" stroke-width="2"/></svg><b>PC</b></div><i></i><i></i><i></i></div>' });
  [[-430, -870], [-386, -870], [-430, -910], [-386, -910]].forEach(([x, z]) => box(x, 0, z, 6, 22, 6, '#9AA5B1'));
  // tiang infus & syringe pump di bed 12
  box(388, 0, -900, 5, 330, 5, '#B7C0CA');
  box(388, -2, -900, 60, 4, 60, '#9AA5B1');
  stand('r3-iv', 388, -270, -900, 34, 54, 0, '<svg viewBox="0 0 34 54"><path d="M17 0v6" stroke="#B7C0CA" stroke-width="3"/><rect x="5" y="6" width="24" height="32" rx="7" fill="#EAF6FF" stroke="#9CC5E8" stroke-width="2"/><rect x="5" y="20" width="24" height="18" rx="6" fill="#BFE3F2"/><path d="M17 38v16" stroke="#9CC5E8" stroke-width="2"/></svg><i class="r3-drip"></i>');
  box(388, -150, -888, 48, 30, 24, '#F2F5F8', { front: '<div class="r3-pump"><b>2.4</b><i></i></div>', cls: 'r3-dev' });

  /* ---------- stasiun 1: kelas teori ---------- */
  stand('r3-who', -400, 0, -110, 64, 141, 55, person({ head: 'hair', mask: false, scrub: '#FFFFFF', dark: '#55677F', item: 'remote', skin: skin[1] }));
  stand('r3-who', -230, 0, -60, 60, 132, 45, person({ head: 'hijab', hc: '#6B4FA3', tag: 'RSSA' }));
  stand('r3-who', -160, 0, -150, 60, 132, 50, person({ head: 'cap', hc: '#2F5FB3', tag: 'RSSA', skin: skin[2] }));

  /* ---------- stasiun 2 & 4: skill lab ---------- */
  box(300, -96, -250, 230, 8, 130, '#DDE6EE');
  [[195, -305], [405, -305], [195, -195], [405, -195]].forEach(([x, z]) => box(x, 0, z, 8, 96, 8, '#9AA5B1'));
  box(300, -104, -265, 170, 6, 100, '#2E8B57');
  face('r3-pt', 70, 100, T(285, -111, -265) + ' rotateX(90deg)', `<svg viewBox="0 0 70 100"><ellipse cx="35" cy="22" rx="17" ry="18" fill="#F3D2BA"/><path d="M27 20q3 2 6 0M37 20q3 2 6 0" stroke="#7A5A4A" stroke-width="1.6" fill="none"/><rect x="18" y="38" width="34" height="40" rx="14" fill="#F3D2BA"/><rect x="18" y="52" width="34" height="26" rx="6" fill="#9DB8F5"/><rect x="6" y="42" width="12" height="28" rx="6" fill="#F3D2BA"/><rect x="52" y="42" width="12" height="28" rx="6" fill="#F3D2BA"/><rect x="22" y="76" width="10" height="22" rx="5" fill="#F3D2BA"/><rect x="38" y="76" width="10" height="22" rx="5" fill="#F3D2BA"/></svg>`);
  face('r3-pt r3-check', 60, 78, T(360, -111, -240) + ' rotateX(90deg) rotateZ(-12deg)', '<div class="r3-cl"><b>CHECKLIST</b><i></i><i></i><i></i><i></i><i></i></div>');
  box(225, -104, -230, 36, 20, 30, '#F2F5F8', { front: '<div class="r3-pump"><b>5.0</b><i></i></div>', cls: 'r3-dev' });
  stand('r3-who', 440, 0, -250, 60, 132, -40, person({ head: 'hijab', hc: '#0B8576', tag: 'RSSA' }));
  stand('r3-who r3-penguji', 190, 0, -400, 64, 141, -40, person({ head: 'hair', mask: true, scrub: '#13406E', dark: '#0B2545', item: 'clip', hc: '#1A1210' }));
  stand('r3-ticks', 320, -175, -260, 240, 60, -40, '<span>✓</span><span>✓</span><span>✓</span><span>✓</span><span>✓</span>');

  /* ---------- stasiun 3: praktik klinik ---------- */
  stand('r3-who', -100, 0, -700, 60, 132, 20, person({ head: 'hijab', hc: '#1E2A44', tag: 'RSSA', item: 'book' }));
  stand('r3-who', -60, 0, -800, 64, 141, 15, person({ head: 'cap', hc: '#14B8A6', scrub: '#1E63B5', item: 'clip', skin: skin[1] }));
  stand('r3-who r3-fam', 120, 0, -760, 60, 132, -10, person({ head: 'hijab', hc: '#C0563F', scrub: '#8A6E5A', dark: '#5B4636', tag: '', skin: skin[0] }));

  /* ---------- stasiun 5: kompeten ---------- */
  stand('r3-badge', 0, -190, -420, 230, 230, 0, `<div class="r3-medal"><svg viewBox="0 0 120 120" aria-hidden="true"><path d="M38 70 26 116l22-10 12 14 6-44zM82 70l12 46-22-10-12 14-6-44z" fill="#1E63B5"/><circle cx="60" cy="52" r="42" fill="#E0A93B"/><circle cx="60" cy="52" r="33" fill="#FCF1DA"/><path d="M44 52l11 11 21-23" fill="none" stroke="#0B8576" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg><b>Perawat PICU</b><span>Kompeten</span></div>`);
  const conf = sec.querySelector('.r3-confetti');
  if (conf) conf.innerHTML = Array.from({ length: 28 }, (_, i) => `<i style="--x:${(i * 37) % 100}%;--d:${(i % 7) * .35}s;--c:${['#1E63B5', '#E0A93B', '#14B8A6', '#F06A8A'][i % 4]}"></i>`).join('');

  // label stasiun yang melayang
  [[1, -470, -430, -300, 48, 'Kelas teori'], [2, 300, -250, -250, -25, 'Latihan skill'],
   [3, -260, -300, -830, 22, 'Praktik klinik'], [4, 300, -250, -250, -46, 'Ujian skill']].forEach(([s, x, y, z, r, t]) => {
    const n = stand('r3-tag', x, y, z, 170, 40, r, `<span>${s}</span>${t}`);
    n.dataset.s = s;
  });

  /* ---------- kamera ---------- */
  // [x, y, z, yaw, pitch] — yaw positif = menoleh kanan, pitch negatif = menunduk
  const CAM = [
    [0, -265, 1150, 0, 1],
    [120, -255, 250, -48, -5],
    [70, -300, 130, 25, -24],
    [40, -320, -330, -22, -20],
    [-40, -280, 160, 40, -19],
    [0, -330, 330, 0, -9]
  ];
  const N = CAM.length;
  const steps = [...sec.querySelectorAll('.r3-step')];
  const dots = [...sec.querySelectorAll('.r3-dots button')];
  const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  // Kamera selalu berjalan di sepanjang jalur antar tahap (tidak memotong lewat dinding/benda),
  // dengan kecepatan dibatasi, sehingga gulir cepat tidak membuat tampilan berantakan.
  const MAX_STEP = .07; // tahap per frame
  let pCur = 0, pTarget = 0, stage = -1, mx = 0, my = 0, ox = 0, oy = 0;

  function progress() {
    const r = sec.getBoundingClientRect();
    const total = sec.offsetHeight - sticky.offsetHeight;
    return Math.min(1, Math.max(0, -r.top / total)) * (N - 1);
  }
  const pin = new URLSearchParams(location.search).get('r3'); // ?r3=N mengunci tahap (untuk pengecekan)
  function readTarget() {
    pTarget = pin !== null ? Math.min(N - 1, Math.max(0, +pin || 0)) : progress();
  }
  function camAt(p) {
    const i = Math.min(N - 2, Math.floor(p));
    let f = p - i;
    f = reduce ? Math.round(f) : ease(Math.min(1, Math.max(0, (f - .2) / .6)));
    return CAM[i].map((v, k) => v + (CAM[i + 1][k] - v) * f);
  }
  function setStage(s) {
    if (s === stage) return;
    stage = s;
    sec.dataset.st = s;
    steps.forEach((el, k) => { el.classList.toggle('on', k === s); el.setAttribute('aria-hidden', k === s ? 'false' : 'true'); });
    dots.forEach((el, k) => el.setAttribute('aria-current', k === s ? 'step' : 'false'));
    world.querySelectorAll('[data-s]').forEach(el => el.classList.toggle('on', el.dataset.s.split(' ').includes(String(s))));
  }
  function apply() {
    const [x, y, z, yaw, pitch] = camAt(pCur);
    world.style.transform = `translateZ(${P}px) rotateX(${pitch + oy}deg) rotateY(${yaw + ox}deg) translate3d(${-x}px,${-y}px,${-z}px)`;
    setStage(Math.round(pCur));
  }
  function fit() {
    const w = sticky.clientWidth, h = sticky.clientHeight;
    const s = Math.max(w / 1200, h / 700) * (w < 700 ? 1.05 : 1);
    view.style.setProperty('--s', s.toFixed(3));
    view.style.setProperty('--dy', (w < 700 ? -h * .14 : 0) + 'px');
    // geser pusat pandang ke kanan agar tidak tertutup kartu teks
    view.style.setProperty('--dx', (w < 700 ? 0 : Math.min(260, w * .16)) + 'px');
  }
  let raf = 0;
  function loop() {
    const d = pTarget - pCur;
    if (reduce || Math.abs(d) < .002) pCur = pTarget;
    else pCur += Math.sign(d) * Math.min(Math.abs(d) * .12 + .002, MAX_STEP);
    ox += (mx - ox) * .1; oy += (my - oy) * .1;
    apply();
    const moving = pCur !== pTarget || Math.abs(mx - ox) > .01 || Math.abs(my - oy) > .01;
    sec.classList.toggle('r3-moving', moving && Math.abs(d) > .05);
    raf = moving ? requestAnimationFrame(loop) : 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  addEventListener('scroll', () => { readTarget(); kick(); }, { passive: true });
  addEventListener('resize', () => { fit(); readTarget(); kick(); });
  if (!reduce && matchMedia('(pointer:fine)').matches) {
    sticky.addEventListener('pointermove', e => {
      const r = sticky.getBoundingClientRect();
      mx = ((e.clientX - r.left) / r.width - .5) * 4;
      my = -((e.clientY - r.top) / r.height - .5) * 2.5;
      kick();
    });
    sticky.addEventListener('pointerleave', () => { mx = my = 0; kick(); });
  }
  // titik navigasi: lompat ke stasiun
  dots.forEach((b, k) => b.addEventListener('click', () => {
    const total = sec.offsetHeight - sticky.offsetHeight;
    const top = sec.getBoundingClientRect().top + scrollY + Math.min(total * k / (N - 1) + 2, total - 2);
    scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
  }));

  fit(); readTarget(); pCur = pTarget; apply();
  sec.r3snap = () => { readTarget(); pCur = pTarget; apply(); };
})();
