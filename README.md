# Materi Pelatihan PICU RSSA

Web statis (HTML/CSS/JS) tanpa backend. Data materi ada di `materi.js`.

## Preview lokal

```
cd ~/web-materi-picu
python3 -m http.server 8788
```
Lalu buka http://localhost:8788

## Deploy ke Cloudflare Pages

**Cara A — upload langsung (tanpa Git):**
1. Masuk ke dash.cloudflare.com → Workers & Pages → Create → Pages → *Upload assets*.
2. Beri nama proyek, lalu upload isi folder ini (`index.html`, `style.css`, `app.js`, `materi.js`).
3. Klik Deploy. Web tersedia di `https://<nama-proyek>.pages.dev`.

**Cara B — lewat terminal (Wrangler):**
```
npx wrangler login
npx wrangler pages deploy . --project-name materi-picu-rssa
```

**Cara C — dari GitHub:** hubungkan repo di Pages; *Framework preset*: None, *Build command*: kosong, *Build output directory*: `/`.

Untuk memperbarui materi: ubah `materi.js`, lalu deploy ulang.

## Format data (materi.js)
Setiap modul berisi daftar file per jenis: `modul`, `ppt`, `checklist` → `[{ judul, id, jenis, mb }]`
(`id` = ID FILE Google Drive). File dengan `mb` > 100 tidak dipratinjau di web; peserta diarahkan ke Drive/Unduh.

## Penting: izin Google Drive
Setiap file (atau folder induknya) harus dibagikan **"Siapa saja yang memiliki link — Pelihat"**, supaya pratinjau tampil di web.
