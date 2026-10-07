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
| `deploy.sh` + `wrangler.jsonc` | Deploy ke Cloudflare |
| `img/` | Logo, foto galeri, favicon, gambar pratinjau WhatsApp (`og-image.jpg`) |

## Deploy ke Cloudflare
Web online di **https://pelatihan.picu-rssa.workers.dev** (Cloudflare Workers, aset statis).

Cara memperbarui web:
```
git add -A
git commit -m "Keterangan singkat perubahan"
./deploy.sh
```
`deploy.sh` membangun folder `dist/` dari commit terakhir (tanpa `.git`, README, `index-lama.html`),
men-deploy-nya, lalu push ke GitHub. Perlu login sekali: `npx wrangler login`.

**Jangan** menjalankan `wrangler deploy` dengan konfigurasi lain atau meng-upload folder ini apa adanya:
folder `.git` ikut online dan riwayat commit bisa dibaca publik.

Jika alamat web berubah (mis. domain RS), ganti juga alamat di tag `og:url` / `og:image`
pada `index.html` dan `materi.html` (supaya pratinjau link di WhatsApp tampil).

Kode sumber: https://github.com/lailatussiyamu-cmd/web-materi-picu

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
