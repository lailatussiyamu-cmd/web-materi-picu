# Materi Pelatihan PICU RSSA

Web statis (HTML/CSS/JS) tanpa backend. Data materi ada di `materi.js`.

## Preview lokal

```
cd ~/web-materi-picu
python3 -m http.server 8788
```
Lalu buka http://localhost:8788

## Isi folder
| File | Fungsi |
|---|---|
| `index.html` | Halaman depan (landing) |
| `materi.html` + `app.js` + `style.css` | Halaman materi (modul, slide, checklist) |
| `materi.js` | **Data materi** — satu-satunya file yang perlu diubah untuk memperbarui isi |
| `ruang3d.css` + `ruang3d.js` | Animasi ruang PICU 3D (seksi "Perjalanan pelatihan") |
| `img/` | Logo, foto galeri, favicon, gambar pratinjau WhatsApp (`og-image.jpg`) |

## Deploy ke Cloudflare Pages
Yang diunggah adalah **seluruh isi folder ini** (semua file di atas + folder `img/`).
Jangan hanya sebagian, nanti gambar atau animasi hilang.

**Cara A — upload langsung (tanpa Git):**
1. Masuk ke dash.cloudflare.com → Workers & Pages → Create → Pages → *Upload assets*.
2. Beri nama proyek `materi-picu-rssa`, lalu seret **folder** `web-materi-picu` (bukan file satu per satu).
3. Klik Deploy. Web tersedia di `https://materi-picu-rssa.pages.dev`.

**Cara B — lewat terminal (Wrangler):**
```
npx wrangler login
npx wrangler pages deploy . --project-name materi-picu-rssa
```

**Cara C — dari GitHub (disarankan):** hubungkan repo di Pages; *Framework preset*: None,
*Build command*: kosong, *Build output directory*: `/`. Setiap perubahan yang di-push otomatis ter-deploy.

Jika nama proyek atau domain berbeda, ganti juga alamat di tag `og:url` / `og:image`
pada `index.html` dan `materi.html` (supaya pratinjau link di WhatsApp tampil).

Untuk memperbarui materi: ubah `materi.js`, lalu deploy ulang.

## Riwayat perubahan (git)
Folder ini memakai git. Setelah mengubah file:
```
git add -A
git commit -m "Keterangan singkat perubahan"
```
Melihat riwayat: `git log --oneline`. Membatalkan perubahan yang belum di-commit pada satu file: `git checkout -- namafile`.

## Cek sebelum angkatan baru dimulai
- Buka beberapa materi dari HP: pastikan pratinjau Google Drive masih tampil (izin file belum berubah).
- Coba animasi "Perjalanan pelatihan" di HP peserta; pastikan gulirannya lancar.

## Format data (materi.js)
Setiap modul berisi daftar file per jenis: `modul`, `ppt`, `checklist` → `[{ judul, id, jenis, mb }]`
(`id` = ID FILE Google Drive). File dengan `mb` > 100 tidak dipratinjau di web; peserta diarahkan ke Drive/Unduh.

## Penting: izin Google Drive
Setiap file (atau folder induknya) harus dibagikan **"Siapa saja yang memiliki link — Pelihat"**, supaya pratinjau tampil di web.
