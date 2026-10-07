(function () {
  "use strict";

  // ---------- Membaca data dari materi.js ----------
  // materi.js tidak diubah; di sini datanya dibaca apa adanya lalu diseragamkan.
  // Tiap modul berisi daftar file per jenis: modul / ppt / checklist → [{ judul, id, jenis, mb }].
  var DATA_NAMES = ["MATERI", "materi", "DATA_MATERI", "dataMateri", "DATA", "data", "modules", "MODULES"];
  var KATEGORI = ["MPD", "MPI", "MPP"];
  var JENIS = {
    modul: { label: "Modul", icon: "book" },
    ppt: { label: "PPT", icon: "slides" },
    checklist: { label: "Checklist Skill", icon: "check" }
  };
  var BATAS_MB = 100; // di atas ini file tidak dipratinjau di iframe

  function findRawData() {
    for (var i = 0; i < DATA_NAMES.length; i++) {
      try {
        var v = new Function("return typeof " + DATA_NAMES[i] + " !== 'undefined' ? " + DATA_NAMES[i] + " : undefined")();
        if (v && typeof v === "object") return v;
      } catch (e) { /* abaikan */ }
    }
    return [];
  }

  // Mendukung array item, atau objek yang dikelompokkan per kategori (mis. { MPD: [...], MPI: [...] }).
  function flatten(raw) {
    if (Array.isArray(raw)) return raw.map(function (it) { return { item: it, group: null }; });
    var out = [];
    Object.keys(raw).forEach(function (key) {
      var val = raw[key];
      if (Array.isArray(val)) val.forEach(function (it) { out.push({ item: it, group: key }); });
      else if (val && typeof val === "object") out.push({ item: Object.assign({ kode: key }, val), group: null });
    });
    return out;
  }

  function keyName(k) { return String(k).toLowerCase().replace(/[^a-z]/g, ""); }

  function pick(item, test) {
    var keys = Object.keys(item);
    for (var i = 0; i < keys.length; i++) if (test(keyName(keys[i]))) return item[keys[i]];
    return undefined;
  }

  // Menerima ID file atau URL Drive lengkap; mengembalikan ID atau null.
  function toFileId(v) {
    if (v == null) return null;
    v = String(v).trim();
    if (!v || v.toLowerCase() === "null" || v === "-") return null;
    var m = v.match(/\/d\/([\w-]+)/) || v.match(/[?&#]id=([\w-]+)/);
    return m ? m[1] : v;
  }

  function toNumber(v) {
    if (v == null || v === "") return null;
    var n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
    return isFinite(n) ? n : null;
  }

  // Daftar file satu jenis → [{ judul, id, jenis, mb }]. null / [] → [].
  function toFileList(v) {
    if (v == null) return [];
    if (!Array.isArray(v)) v = [v];
    return v.map(function (f) {
      if (f == null) return null;
      if (typeof f !== "object") f = { id: f };
      var id = toFileId(pick(f, function (k) { return k === "id" || k === "fileid" || k === "url" || k === "link"; }));
      if (!id) return null;
      var judul = pick(f, function (k) { return k === "judul" || k === "title" || k === "nama" || k === "name"; });
      return {
        id: id,
        judul: judul == null || String(judul).trim() === "" ? "Tanpa judul" : String(judul).trim(),
        jenis: String(pick(f, function (k) { return k === "jenis" || k === "type" || k === "tipe" || k === "format" || k === "ext"; }) || ""),
        mb: toNumber(pick(f, function (k) { return k === "mb" || k === "ukuran" || k === "size" || k === "sizemb"; }))
      };
    }).filter(Boolean);
  }

  function normalize(entry, index, used) {
    var it = entry.item || {};
    var src = it;
    // Jika daftar file disimpan di objek bersarang (mis. files: { modul: [...] }), gabungkan.
    ["files", "file", "berkas", "drive"].forEach(function (k) {
      if (it[k] && typeof it[k] === "object" && !Array.isArray(it[k])) src = Object.assign({}, src, it[k]);
    });

    var kode = pick(it, function (k) { return k === "kode" || k === "code" || k === "kd" || k === "nomor" || k === "no"; });
    var judul = pick(it, function (k) { return k === "judul" || k === "title" || k === "nama" || k === "name" || k === "materi" || k === "topik"; });
    var kat = pick(it, function (k) { return k === "kategori" || k === "jenis" || k === "kelompok" || k === "tipe" || k === "type" || k === "group" || k === "category"; });

    var modul = pick(src, function (k) { return k.indexOf("modul") !== -1 || k === "module"; });
    var ppt = pick(src, function (k) { return k.indexOf("ppt") !== -1 || k.indexOf("slide") !== -1; });
    var cek = pick(src, function (k) { return k.indexOf("checklist") !== -1 || k.indexOf("ceklis") !== -1 || k.indexOf("cheklist") !== -1 || k.indexOf("ceklist") !== -1; });

    kode = kode == null ? "" : String(kode).trim();
    judul = judul == null || typeof judul === "object" ? "" : String(judul).trim();

    var kategori = "";
    [kat, entry.group, kode].some(function (c) {
      var m = c == null || typeof c === "object" ? null : String(c).toUpperCase().match(/MP\s*([DIP])/);
      if (m) { kategori = "MP" + m[1]; return true; }
      return false;
    });

    // Slug dari kode (mis. "MPI 4" → "mpi-4") agar alamat halaman mudah dibaca.
    var base = (kode || "materi-" + (index + 1)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "materi-" + (index + 1);
    var slug = base, n = 2;
    while (used[slug]) slug = base + "-" + n++;
    used[slug] = true;

    return {
      slug: slug,
      kode: kode || ("Materi " + (index + 1)),
      judul: judul,
      kategori: kategori,
      files: { modul: toFileList(modul), ppt: toFileList(ppt), checklist: toFileList(cek) }
    };
  }

  var USED = {};
  var ITEMS = flatten(findRawData()).map(function (e, i) { return normalize(e, i, USED); });

  // ---------- Util ----------
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function previewUrl(id) { return "https://drive.google.com/file/d/" + encodeURIComponent(id) + "/preview"; }
  function viewUrl(id) { return "https://drive.google.com/file/d/" + encodeURIComponent(id) + "/view"; }
  function downloadUrl(id) { return "https://drive.google.com/uc?export=download&id=" + encodeURIComponent(id); }
  function displayTitle(it) { return it.judul || it.kode; }
  function hasFiles(it, j) { return it.files[j].length > 0; }
  function isBig(f) { return f.mb != null && f.mb > BATAS_MB; }

  function formatMb(mb) {
    if (mb == null) return "";
    if (mb < 1) return Math.max(1, Math.round(mb * 1024)) + " KB";
    return (mb < 10 ? mb.toFixed(1) : String(Math.round(mb))).replace(".", ",") + " MB";
  }

  // Jenis file → label & warna ikon. Diambil dari kolom jenis, atau ekstensi di judul.
  var FILE_TYPES = [
    { key: "pdf", label: "PDF", test: /pdf/ },
    { key: "ppt", label: "PPT", test: /ppt|slide|presentation|powerpoint|key/ },
    { key: "doc", label: "DOC", test: /doc|word|rtf|odt|document/ },
    { key: "xls", label: "XLS", test: /xls|sheet|excel|csv|spreadsheet/ },
    { key: "vid", label: "VIDEO", test: /video|mp4|mov|mkv|avi|webm/ },
    { key: "img", label: "GAMBAR", test: /image|gambar|foto|jpe?g|png|gif|webp|heic/ },
    { key: "aud", label: "AUDIO", test: /audio|mp3|wav|m4a/ },
    { key: "zip", label: "ZIP", test: /zip|rar|7z/ }
  ];
  function fileType(f) {
    var s = (f.jenis || "").toLowerCase();
    var ext = (f.judul.match(/\.([a-z0-9]{2,5})$/i) || [])[1] || "";
    for (var i = 0; i < FILE_TYPES.length; i++) {
      if (FILE_TYPES[i].test.test(s) || (ext && FILE_TYPES[i].test.test(ext.toLowerCase()))) return FILE_TYPES[i];
    }
    return { key: "etc", label: (s || ext || "FILE").toUpperCase().slice(0, 5) };
  }

  var ICONS = {
    book: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/></svg>',
    slides: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M12 16v4M8 20h8"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 12l3 3 5-6"/></svg>',
    external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    next: '<svg class="go" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    image: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 17l-5-5-9 8"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
    rules: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M9 11h7M9 15h7M9 7h3"/></svg>',
    upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg>',
    file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>'
  };

  function fileRowHtml(href, f, extra) {
    var t = fileType(f);
    var meta = [t.label, formatMb(f.mb)].filter(Boolean).join(" · ");
    return '<a class="file-row" href="' + href + '">' +
      '<span class="ficon ficon-' + t.key + '">' + ICONS.file + "<b>" + esc(t.label) + "</b></span>" +
      '<span class="fmain"><span class="fname">' + esc(f.judul) + "</span>" +
      '<span class="fmeta">' + esc(meta) + (isBig(f) ? ' · <span class="big">File besar</span>' : "") + (extra || "") + "</span></span>" +
      ICONS.next + "</a>";
  }

  function fileActionsHtml(f) {
    return '<a class="btn btn-primary" href="' + viewUrl(f.id) + '" target="_blank" rel="noopener">' + ICONS.external + "Buka di Drive</a>" +
      '<a class="btn btn-outline" href="' + downloadUrl(f.id) + '" target="_blank" rel="noopener">' + ICONS.download + "Unduh</a>";
  }

  // ---------- Tautan pelatihan (sama dengan halaman s.id/pelatihanpicudasar) ----------
  // Urutan mengikuti s.id. Tombol PARTICIPANT sengaja tidak dimasukkan (berisi data peserta).
  var TAUTAN = [
    { label: "Flyer Pelatihan PICU", ket: "Poster informasi pelatihan", icon: "image", url: "https://drive.google.com/file/d/18LOMCiJCpRe2vmJ6tjjKfHxw1ngAEznI/view" },
    { label: "Rundown", ket: "Jadwal kegiatan pelatihan", icon: "calendar", url: null }, // menyusul: isi url bila sudah ada
    { label: "Learning Material", ket: "Folder materi di Google Drive", icon: "folder", url: "https://drive.google.com/drive/folders/114o1HkEXGYEpf66aC4O59jTmY6qcpKQd" },
    { label: "The Rule's", ket: "Tata tertib peserta", icon: "rules", url: "https://docs.google.com/document/d/1qo_6Ev1tSy_HrG76OXGsbei8VzB_5rEP/edit?rtpof=true&sd=true" },
    { label: "Galery", ket: "Dokumentasi kegiatan", icon: "image", url: "https://drive.google.com/drive/folders/195nv7GPYctWEFG_WqL-TyiLIgoAMhKdj" },
    { label: "Kumpulan Tugas", ket: "Folder pengumpulan tugas", icon: "upload", url: "https://drive.google.com/drive/folders/1Im69XRbSpnI7DvYzk8kRVm8HxJFtHE6x" }
  ];
  var SOSMED = [
    { label: "TikTok", url: "https://www.tiktok.com/@pelatihanpicurssa" },
    { label: "Instagram", url: "https://www.instagram.com/picu_rssa" },
    { label: "YouTube", url: "https://www.youtube.com/@PelatihanPICURSSA" }
  ];

  function tautanHtml() {
    return '<div class="section-head"><h2>Tautan Pelatihan</h2><span class="meta">Buka di tab baru</span></div>' +
      '<div class="links">' + TAUTAN.map(function (t) {
        if (!t.url) return '<div class="link-card soon" aria-disabled="true"><span class="link-ic">' + ICONS[t.icon] + "</span>" +
          '<span class="fmain"><span class="fname">' + esc(t.label) + '</span><span class="fmeta">' + esc(t.ket) + '</span></span><em>Menyusul</em></div>';
        return '<a class="link-card" href="' + esc(t.url) + '" target="_blank" rel="noopener">' +
          '<span class="link-ic">' + ICONS[t.icon] + "</span>" +
          '<span class="fmain"><span class="fname">' + esc(t.label) + '</span><span class="fmeta">' + esc(t.ket) + "</span></span>" +
          ICONS.external + "</a>";
      }).join("") + "</div>" +
      '<div class="sosmed"><span>Ikuti kami:</span>' + SOSMED.map(function (m) {
        return '<a href="' + esc(m.url) + '" target="_blank" rel="noopener">' + esc(m.label) + "</a>";
      }).join("") + "</div>";
  }

  // Pencarian & filter disimpan selama sesi agar tidak hilang saat kembali ke beranda.
  var state = { q: "", kat: "SEMUA", cq: "", ckat: "SEMUA" };

  function matches(it, q, kat, extra) {
    if (kat !== "SEMUA" && it.kategori !== kat) return false;
    if (!q) return true;
    var hay = (it.kode + " " + it.judul + " " + it.kategori + " " + (extra || "")).toLowerCase();
    return q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function chipsHtml(list, active, attr) {
    var opts = ["SEMUA"].concat(KATEGORI.filter(function (k) { return list.some(function (i) { return i.kategori === k; }); }));
    return opts.map(function (k) {
      var n = k === "SEMUA" ? list.length : list.filter(function (i) { return i.kategori === k; }).length;
      return '<button type="button" class="chip" ' + attr + '="' + k + '" aria-pressed="' + (k === active) + '">' +
        (k === "SEMUA" ? "Semua" : k) + '<span class="count">' + n + "</span></button>";
    }).join("");
  }

  function bindFilter(app, inputSel, chipAttr, qKey, katKey, update) {
    app.querySelector(inputSel).addEventListener("input", function (e) { state[qKey] = e.target.value.trim(); update(); });
    app.querySelectorAll("[" + chipAttr + "]").forEach(function (b) {
      b.addEventListener("click", function () {
        state[katKey] = b.getAttribute(chipAttr);
        app.querySelectorAll("[" + chipAttr + "]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        update();
      });
    });
  }

  function findItem(slug) { return ITEMS.filter(function (x) { return x.slug === slug; })[0]; }

  // ---------- Halaman: Beranda ----------
  function cardHtml(it) {
    var btns = Object.keys(JENIS).filter(function (j) { return hasFiles(it, j); }).map(function (j, i) {
      return '<a class="btn ' + (i === 0 ? "btn-primary" : "btn-soft") + '" href="#/materi/' + it.slug + "/" + j + '">' +
        ICONS[JENIS[j].icon] + JENIS[j].label + '<span class="n">' + it.files[j].length + "</span></a>";
    }).join("");
    return '<article class="card">' +
      '<div class="card-top"><span class="code">' + esc(it.kode) + "</span>" +
      (it.kategori ? '<span class="tag tag-' + it.kategori + '">' + it.kategori + "</span>" : "") + "</div>" +
      "<h3>" + esc(displayTitle(it)) + "</h3>" +
      (btns ? '<div class="actions">' + btns + "</div>" : '<p class="no-files">Belum ada berkas.</p>') +
      "</article>";
  }

  function renderHome(app) {
    app.innerHTML =
      '<section class="hero"><div class="container">' +
        '<p class="eyebrow">Materi Online Peserta</p>' +
        "<h1>Pelatihan PICU RSSA</h1>" +
        '<p class="lead">Kumpulan modul, bahan presentasi (PPT), dan checklist ujian skill untuk peserta pelatihan. ' +
        "Cari materi berdasarkan kode atau judul, lalu buka berkasnya langsung di halaman ini.</p>" +
      "</div></section>" +
      '<div class="container">' +
        '<div class="toolbar">' +
          '<label class="search">' + ICONS.search +
            '<input id="q" type="search" placeholder="Cari kode atau judul materi…" autocomplete="off" aria-label="Cari materi" value="' + esc(state.q) + '">' +
          "</label>" +
          '<div class="chips" role="group" aria-label="Filter kategori">' + chipsHtml(ITEMS, state.kat, "data-kat") + "</div>" +
        "</div>" +
        tautanHtml() +
        '<div class="section-head"><h2>Daftar Materi</h2><span class="meta" id="count"></span></div>' +
        '<div class="grid" id="grid"></div>' +
      "</div>";

    var grid = app.querySelector("#grid");
    var count = app.querySelector("#count");
    function update() {
      var list = ITEMS.filter(function (it) { return matches(it, state.q, state.kat); });
      grid.innerHTML = list.length ? list.map(cardHtml).join("") :
        '<div class="empty">' + (ITEMS.length ? "Tidak ada materi yang cocok dengan pencarian." : "Data materi belum tersedia.") + "</div>";
      count.textContent = list.length + " dari " + ITEMS.length + " materi";
    }
    bindFilter(app, "#q", "data-kat", "q", "kat", update);
    update();
  }

  function pageHeadHtml(it, crumbs, title, sub, jenisAktif) {
    var tabs = jenisAktif ? '<nav class="tabs" aria-label="Jenis berkas">' +
      Object.keys(JENIS).filter(function (j) { return hasFiles(it, j); }).map(function (j) {
        return '<a class="tab" href="#/materi/' + it.slug + "/" + j + '"' + (j === jenisAktif ? ' aria-current="page"' : "") + ">" +
          JENIS[j].label + " (" + it.files[j].length + ")</a>";
      }).join("") + "</nav>" : "";
    return '<section class="page-head"><div class="container">' +
      '<p class="crumbs">' + crumbs.join("<span>›</span>") + "</p>" +
      "<h1>" + esc(title) + "</h1>" + (sub ? '<p class="sub">' + sub + "</p>" : "") + tabs +
      "</div></section>";
  }

  // ---------- Halaman: Daftar file satu jenis ----------
  function renderFileList(app, it, jenis) {
    var files = it.files[jenis];
    app.innerHTML =
      pageHeadHtml(it,
        ['<a href="#/">Materi</a>', "<span>" + esc(it.kode) + "</span>", "<span>" + JENIS[jenis].label + "</span>"],
        displayTitle(it), it.judul ? esc(it.kode) + (it.kategori ? " · " + it.kategori : "") : "", jenis) +
      '<div class="container">' +
        '<div class="section-head"><h2>' + JENIS[jenis].label + '</h2><span class="meta">' + files.length + " file</span></div>" +
        '<div class="file-list">' + files.map(function (f, i) {
          return fileRowHtml("#/materi/" + it.slug + "/" + jenis + "/" + (i + 1), f);
        }).join("") + "</div>" +
      "</div>";
  }

  // ---------- Halaman: Pratinjau satu file ----------
  function renderFile(app, it, jenis, no) {
    var files = it.files[jenis];
    var f = files[no - 1];
    if (!f) return renderNotFound(app);
    var t = fileType(f);
    var listHref = "#/materi/" + it.slug + "/" + jenis;
    var prev = no > 1 ? listHref + "/" + (no - 1) : null;
    var next = no < files.length ? listHref + "/" + (no + 1) : null;

    var viewer = isBig(f)
      ? '<div class="fallback"><p class="fallback-title">File besar, buka di Drive</p>' +
        "<p>Ukuran file " + esc(formatMb(f.mb)) + " terlalu besar untuk ditampilkan di halaman ini.</p>" +
        '<div class="actions">' + fileActionsHtml(f) + "</div></div>"
      : '<div class="frame-wrap"><iframe src="' + previewUrl(f.id) + '" title="' + esc(f.judul) + '" allow="autoplay; fullscreen" allowfullscreen></iframe></div>';

    app.innerHTML =
      pageHeadHtml(it,
        ['<a href="#/">Materi</a>', '<a href="' + listHref + '">' + esc(it.kode) + " · " + JENIS[jenis].label + "</a>", "<span>File " + no + " dari " + files.length + "</span>"],
        f.judul, esc([t.label, formatMb(f.mb)].filter(Boolean).join(" · ")) + " · " + esc(displayTitle(it)), null) +
      '<section class="viewer"><div class="container">' +
        (isBig(f) ? "" : '<div class="viewer-bar"><div class="actions">' + fileActionsHtml(f) + "</div></div>") +
        viewer +
        '<nav class="pager" aria-label="File lain">' +
          (prev ? '<a class="btn btn-soft" href="' + prev + '">‹ Sebelumnya</a>' : "<span></span>") +
          '<a class="btn btn-outline" href="' + listHref + '">Daftar ' + JENIS[jenis].label + "</a>" +
          (next ? '<a class="btn btn-soft" href="' + next + '">Berikutnya ›</a>' : "<span></span>") +
        "</nav>" +
      "</div></section>";
  }

  // ---------- Halaman: Checklist Ujian Skill ----------
  function renderChecklist(app) {
    var all = ITEMS.filter(function (it) { return hasFiles(it, "checklist"); });
    var total = all.reduce(function (n, it) { return n + it.files.checklist.length; }, 0);
    app.innerHTML =
      '<section class="page-head"><div class="container">' +
        '<p class="crumbs"><a href="#/">Materi</a><span>›</span><span>Checklist Ujian Skill</span></p>' +
        "<h1>Checklist Ujian Skill</h1>" +
        '<p class="sub">Semua checklist ujian skill dari seluruh modul (' + total + " file). Buka salah satu untuk membaca dan mempelajarinya.</p>" +
      "</div></section>" +
      '<div class="container">' +
        '<div class="toolbar" style="margin-top:16px">' +
          '<label class="search">' + ICONS.search +
            '<input id="cq" type="search" placeholder="Cari checklist…" autocomplete="off" aria-label="Cari checklist" value="' + esc(state.cq) + '">' +
          "</label>" +
          '<div class="chips" role="group" aria-label="Filter kategori">' + chipsHtml(all, state.ckat, "data-ckat") + "</div>" +
        "</div>" +
        '<div id="cl"></div>' +
      "</div>";

    var box = app.querySelector("#cl");
    function update() {
      var html = "";
      all.forEach(function (it) {
        var q = state.cq;
        var modOk = matches(it, q, state.ckat);
        var files = it.files.checklist.map(function (f, i) { return { f: f, no: i + 1 }; }).filter(function (x) {
          return modOk || matches(it, q, state.ckat, x.f.judul);
        });
        if (!files.length) return;
        html += '<section class="group"><div class="group-head"><span class="code">' + esc(it.kode) + "</span>" +
          (it.judul ? '<span class="ttl">' + esc(it.judul) + "</span>" : "") +
          (it.kategori ? '<span class="tag tag-' + it.kategori + '">' + it.kategori + "</span>" : "") + "</div>" +
          '<div class="file-list">' + files.map(function (x) {
            return fileRowHtml("#/materi/" + it.slug + "/checklist/" + x.no, x.f);
          }).join("") + "</div></section>";
      });
      box.innerHTML = html || '<div class="empty" style="margin-top:20px">' + (all.length ? "Tidak ada checklist yang cocok." : "Belum ada checklist ujian skill.") + "</div>";
    }
    bindFilter(app, "#cq", "data-ckat", "cq", "ckat", update);
    update();
  }

  function renderNotFound(app) {
    app.innerHTML = '<div class="container" style="padding:40px 16px">' +
      '<div class="empty"><p>Halaman tidak ditemukan.</p><a class="btn btn-primary" href="#/">Kembali ke Daftar Materi</a></div></div>';
  }

  // ---------- Router ----------
  // #/  ·  #/checklist  ·  #/materi/<slug>/<jenis>  ·  #/materi/<slug>/<jenis>/<nomor file>
  var app = document.getElementById("app");
  var backBtn = document.getElementById("backBtn");
  var depth = 0; // jumlah navigasi di dalam web, untuk tombol Kembali

  function route() {
    var parts = (location.hash.replace(/^#\/?/, "") || "").split("/").filter(Boolean).map(decodeURIComponent);
    var page = parts[0] || "home";
    var title = "Materi Pelatihan PICU RSSA";

    if (page === "home") renderHome(app);
    else if (page === "checklist") { renderChecklist(app); title = "Checklist Ujian Skill · PICU RSSA"; }
    else if (page === "materi") {
      var it = findItem(parts[1]), jenis = parts[2];
      // #/materi/<slug> tanpa jenis (tautan dari halaman depan) → jenis pertama yang punya file.
      var first = it && Object.keys(JENIS).filter(function (j) { return hasFiles(it, j); })[0];
      if (it && !jenis && first) { location.replace("#/materi/" + it.slug + "/" + first); return; }
      if (!it || !JENIS[jenis] || !hasFiles(it, jenis)) renderNotFound(app);
      else if (parts[3]) {
        var no = parseInt(parts[3], 10);
        renderFile(app, it, jenis, no);
        var f = it.files[jenis][no - 1];
        if (f) title = f.judul + " · " + it.kode;
      } else { renderFileList(app, it, jenis); title = JENIS[jenis].label + " " + it.kode + " · PICU RSSA"; }
    }
    else renderNotFound(app);

    document.title = title;
    backBtn.hidden = page === "home";
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      a.classList.toggle("active", a.getAttribute("data-nav") === (page === "checklist" ? "checklist" : page === "home" ? "home" : ""));
    });
    window.scrollTo(0, 0);
  }

  backBtn.addEventListener("click", function () {
    if (depth > 0) history.back();
    else location.hash = "#/";
  });
  window.addEventListener("hashchange", function () {
    // Entri riwayat baru belum punya state; entri lama (saat Kembali/Maju) menyimpan kedalamannya.
    if (history.state && history.state.d != null) depth = history.state.d;
    else { depth++; history.replaceState({ d: depth }, ""); }
    route();
  });
  history.replaceState({ d: 0 }, "");
  route();
})();
