// Data materi Pelatihan PICU RSSA 2026
// Setiap link mengarah ke FOLDER Google Drive, jadi file baru yang ditambahkan ke folder
// otomatis ikut muncul di web tanpa perlu mengubah file ini.
// Judul yang kosong ("") belum diketahui — silakan isi.

const FOLDER_INDUK = "114o1HkEXGYEpf66aC4O59jTmY6qcpKQd"; // MATERI PELATIHAN PICU 2026

const MATERI = [
  // ===== MPD =====
  { kode: "MPD 1", kelompok: "MPD", judul: "Kebijakan Pelayanan Keperawatan Intensif Anak",
    modul: "1SAr3sEvJ9GROykjsYDkEsid1klCIkMId", ppt: "1LiCdA7lq9Mbuiy6WMQYIn8yDduJLpmBK", checklist: null },
  { kode: "MPD 2", kelompok: "MPD", judul: "",
    modul: null, ppt: "1R8e-QLzpeIQt6ULeksZZ4BJZdSPjmZib", checklist: null },
  { kode: "MPD 3", kelompok: "MPD", judul: "",
    modul: "15JF4O27G1iD0O3LbRqf0WGZdsH7RXN8f", ppt: "1Uu-OviFeWuczL-B4GyM5znkffLnZeOSI", checklist: null },
  { kode: "MPD 4", kelompok: "MPD", judul: "Keselamatan Pasien dalam Keperawatan Kritis",
    modul: "1vWnHrVC6xk6i_kHXQcqhZxf3si0Jr24u", ppt: "1w8bZxEfoEkV3qoKiNz6Y4nCJrQrZf2Jl", checklist: null },
  { kode: "MPD 5", kelompok: "MPD", judul: "Patient and Family Centered Care (PFCC)",
    modul: "143UyRKEdGstAvRfWqaC5T82pYJPTxSrK", ppt: "1fUo2YMqmcj5WM8QICGLbHAXM_gcEmoWi", checklist: null },

  // ===== MPI =====
  { kode: "MPI 1", kelompok: "MPI", judul: "",
    modul: "1JnmXYKnmNgjEFnLNzx-r9PS75eYdWnT4", ppt: "1Sqn3hXzUSRnW9q4poPdyCb2v1inKN3zB", checklist: "1g8mkhFC-EBP3f_KPSe8wXEqZz1ctKQgs" },
  { kode: "MPI 2", kelompok: "MPI", judul: "Tatalaksana Kegawatdaruratan pada Anak Sakit Kritis",
    modul: "18WPCiZIdvDRSOONqhbn6EE5Jguftm99i", ppt: "1qiV2E4eiFQ7V3KMmw46HTeivSb1rQR5u", checklist: "1xTQmzW1be6ivEnR7KxiWuE-Y5gcpE2ou" },
  { kode: "MPI 3", kelompok: "MPI", judul: "",
    modul: "1i1vA0qogB4JUNagsTUNkDs7K4jf7cSqh", ppt: "1R0t0bzrWqy4PGWA2z5fU_a3pmzDtjs8t", checklist: "1OQmiFKuqLZ9rmltdUTxozcVaqmaQeiD-" },
  { kode: "MPI 4", kelompok: "MPI", judul: "Manajemen Ventilasi Mekanik",
    modul: "1YBHYuWzbZX1Q2mvIE8RqrqE2-6TKCP7K", ppt: "1DN1dp5wy9CFctKCm8chjm0ev3TCfH_2X", checklist: "17Lif7izRzMgraIbkQDjTQ10zeGFqMBdG" },
  { kode: "MPI 5", kelompok: "MPI", judul: "Manajemen Gangguan Asam Basa dan Elektrolit pada Anak Sakit Kritis",
    modul: "1kJZ71WmuTcpScmc2PQKj59uQuEcVsbCR", ppt: "1vxS8i0fOBf8lpbnpSp36kb9cp9g3LaKZ", checklist: null },
  { kode: "MPI 6", kelompok: "MPI", judul: "Pemberian Cairan dan Pemantauan Hemodinamik pada Anak Sakit Kritis",
    modul: "1Q6QOSoML-kA-z4-W1jQRy4CwhdsLTsnT", ppt: "1EvlzAKMU5DN7aRpMa4CzIY7_Pmnq-8Jr", checklist: "14eomLKSkin4HGWaDr0NiLrJlwCaUPZLR" },
  { kode: "MPI 7", kelompok: "MPI", judul: "Pemberian Nutrisi pada Anak Sakit Kritis",
    modul: "1JujkgUZme_I3jc5kV0Abj6ba6aQInIda", ppt: "1SjZM0rVGG9w1bwQgwYNUxfM04ygAQMVq", checklist: "1RjbJdkiIamUt8YCWWfe9MGAgcoCLl-Ha" },
  { kode: "MPI 8", kelompok: "MPI", judul: "Manajemen Perawatan Gangguan Integritas Kulit pada Anak Sakit Kritis",
    modul: "1-wz-kIpSrHLSBBydUnTnjof5tjqXPbAO", ppt: "1oXPlM7yM4puabxK7AqvoBvXdjeOIUaCz", checklist: null },
  { kode: "MPI 9", kelompok: "MPI", judul: "Stabilisasi dan Transportasi Anak Sakit Kritis",
    modul: "1EIBLnTD7Vg8d6iN57ApQelPDaI5idmqv", ppt: "1WqmmS_xGbkL8ZSp6IGawFsabC7EF90Jw", checklist: "1iO36vMx4L4kLL7Vswhvzt100NtQrOSPX" },
  { kode: "MPI 10", kelompok: "MPI", judul: "Pendokumentasian di Ruang Intensif Anak",
    modul: "1k3UBhj8ak9Tv1rsE9ZuvZgusnDApdu_X", ppt: "1VuE4-L9W51aNc0SM-LS_fJUOvf9dNTDL", checklist: null },

  // ===== MPP =====
  { kode: "MPP 1", kelompok: "MPP", judul: "",
    modul: null, ppt: "1jMakizs0T_zSsZNEcBWV3pW73IL_4n4r", checklist: null },
  { kode: "MPP 2", kelompok: "MPP", judul: "",
    modul: null, ppt: "1RXGj4G4jRufsY8U43jayhi5xefmBi4vM", checklist: null },
  { kode: "MPP 3", kelompok: "MPP", judul: "",
    modul: "1oPZBDRaia-8pjN8Y_zTTVCCusGzAYGW1", ppt: "112a6yiw5Boaz8YeV1Gpbf6UugpEfzbtu", checklist: null },
];

// Cara menampilkan isi folder di web (folder harus "Siapa saja yang memiliki link"):
//   https://drive.google.com/embeddedfolderview?id=<ID_FOLDER>#list
// Link buka di Drive:
//   https://drive.google.com/drive/folders/<ID_FOLDER>
