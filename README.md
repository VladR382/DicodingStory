# Dicoding Story - Submission Belajar Pengembangan Web Intermediate

**Dicoding Story** adalah sebuah platform Progressive Web App (PWA) yang memungkinkan pengguna untuk berbagi cerita dan pengalaman mereka. Aplikasi ini dibuat sebagai proyek submission untuk kelas "Belajar Pengembangan Web Intermediate" di Dicoding. Proyek ini dikembangkan menggunakan Vanilla JavaScript dengan Vite sebagai *build tool* dan menerapkan arsitektur MVP (*Model-View-Presenter*).

**Live Demo:** [https://vladr382.github.io/DicodingStory/](https://vladr382.github.io/DicodingStory/)

## ✨ Fitur Utama

Aplikasi ini dilengkapi dengan berbagai fitur modern untuk memberikan pengalaman pengguna yang kaya dan interaktif:

  * **Autentikasi Pengguna**:

      * Sistem registrasi dan login untuk pengguna baru dan yang sudah ada.
      * Manajemen sesi pengguna menggunakan token yang disimpan di Local Storage.

  * **Manajemen Cerita**:

      * **Beranda**: Menampilkan daftar cerita terbaru dari para pengguna.
      * **Jelajahi Cerita**: Halaman untuk melihat semua cerita dengan fitur "muat lebih banyak" (*infinite scroll*), pencarian, dan pengurutan berdasarkan waktu.
      * **Tambah Cerita**: Pengguna yang sudah login dapat membagikan cerita baru melalui form khusus.

  * **Fungsionalitas Lanjutan pada Form Tambah Cerita**:

      * **Kamera**: Mengambil foto secara langsung menggunakan kamera depan atau belakang perangkat.
      * **Unggah Gambar**: Opsi untuk mengunggah gambar dari galeri perangkat.
      * **Geolokasi**: Menambahkan lokasi pada cerita dengan memilih titik di peta interaktif (Leaflet.js) atau menggunakan lokasi GPS saat ini.

  * **Detail Cerita**:

      * Halaman detail untuk setiap cerita yang menampilkan gambar, deskripsi lengkap, nama pengguna, dan tanggal pembuatan.
      * Menampilkan lokasi cerita di peta jika tersedia.
      * Fitur untuk membagikan cerita ke WhatsApp dan Facebook, atau menyalin tautan.

  * **Progressive Web App (PWA)**:

      * **Dapat Di-install**: Aplikasi dapat di-install ke layar utama perangkat seperti aplikasi native.
      * **Akses Offline**: Cerita yang pernah diakses akan di-cache menggunakan Service Worker, memungkinkan akses saat tidak ada koneksi internet.
      * **Cerita Tersimpan**: Fitur untuk menyimpan cerita favorit ke dalam IndexedDB untuk dibaca kembali kapan saja, bahkan saat offline.
      * **Push Notification**: Sistem notifikasi untuk memberikan pembaruan kepada pengguna yang berlangganan.

  * **Map View**:

      * Halaman khusus yang menampilkan semua cerita dengan lokasi dalam satu peta interaktif.
      * Pengguna dapat mengklik *marker* pada peta untuk melihat pratinjau cerita.

  * **Desain Responsif**:

      * Antarmuka pengguna yang dirancang agar dapat beradaptasi dengan baik di berbagai ukuran layar, mulai dari perangkat seluler hingga desktop.

## 🛠️ Teknologi yang Digunakan

  * **Frontend**: Vanilla JavaScript (ESM)
  * **Build Tool**: Vite
  * **Peta Interaktif**: Leaflet.js
  * **Penyimpanan Lokal**: IndexedDB dengan *wrapper* `idb`
  * **API**: Dicoding Story API (`https://story-api.dicoding.dev/v1`)
  * **Styling**: CSS3
  * **Ikon**: Font Awesome

## 🏗️ Struktur & Arsitektur Proyek

Proyek ini dibangun dengan mengadopsi pola arsitektur **Model-View-Presenter (MVP)** untuk memisahkan logika aplikasi dari manipulasi DOM, sehingga membuat kode lebih terstruktur dan mudah dikelola.

  * `src/scripts/pages/`: Bertindak sebagai **View**. Direktori ini berisi kelas-kelas yang bertanggung jawab untuk me-render komponen UI dan menangani *event listener* dari pengguna. Contoh: `home-page.js`, `add-story-page.js`.
  * `src/scripts/presenters/`: Bertindak sebagai **Presenter**. Direktori ini berisi logika bisnis untuk setiap halaman. Presenter mengambil data dari Model, memprosesnya, dan meneruskannya ke View untuk ditampilkan. Contoh: `home-presenter.js`, `detail-presenter.js`.
  * `src/scripts/data/`: Bertindak sebagai **Model**. Terdiri dari `api-service.js` yang berinteraksi dengan API eksternal dan `database.js` yang mengelola data di IndexedDB.
  * `src/scripts/utils/`: Berisi modul-modul pembantu (*helper*) untuk fungsionalitas umum seperti autentikasi, akses kamera, interaksi peta, dan utilitas UI.
  * `src/scripts/routes/`: Mengelola *client-side routing* untuk navigasi antar halaman tanpa perlu me-reload seluruh halaman.
  * `public/service-worker.js`: Mengimplementasikan fungsionalitas PWA seperti *caching* untuk akses offline dan *push notification*.

## 🚀 Instalasi dan Konfigurasi

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repositori ini:**

    ```bash
    git clone https://github.com/vladr382/DicodingStory.git
    cd DicodingStory
    ```

2.  **Install dependensi:**

    ```bash
    npm install
    ```

3.  **Jalankan development server:**

    ```bash
    npm run dev
    ```

    Aplikasi akan tersedia di `http://localhost:5173`.

4.  **Build untuk produksi:**

    ```bash
    npm run build
    ```

    Hasil *build* akan tersedia di direktori `docs/`, yang dikonfigurasi untuk deployment di GitHub Pages.

## 👨‍💻 Author

  * **Nama**: Muhammad Rafli
  * **Dicoding Profile**: [vladr382](https://www.google.com/search?q=https://www.dicoding.com/users/vladr382)
