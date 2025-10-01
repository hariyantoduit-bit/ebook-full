# ebook-full

## Table of Contents
- [Overview](#overview)
- [Versions](#versions)
  - [v1.0.0 – Initial Release](#v100--initial-release)
  - [v1.1.0 – Refactored Release](#v110--refactored-release)
- [How to Use](#how-to-use)
- [Folder Structure](#folder-structure)
- [Notes](#notes)

---

## Overview
**ebook-full** adalah flipbook berbasis HTML, CSS, dan JavaScript untuk menampilkan halaman e-book dalam format A4 dengan navigasi interaktif.

---

## Versions

### v1.0.0 – Initial Release
Rilis pertama **ebook-full**, struktur folder flat.

**Features**
- Full A4 page view – setiap lembar ditampilkan penuh tanpa terpotong.
- Book-like navigation – klik/drag kiri-kanan seperti membaca buku fisik.
- Image-based content – halaman diambil dari folder `images/`.
- Cross-browser support – berjalan di browser modern.

---

### v1.1.0 – Refactored Release
Versi ini menekankan **struktur folder yang lebih rapi**. CSS dan JS dipindahkan ke subfolder.

**Changes**
- Folder restructure:
  - `style.css` → `css/style.css`
  - `script.js` → `js/script.js`
- Update paths di `index.html` sesuai folder baru.

---

## How to Use
1. Clone atau download ZIP dari repo atau [Releases](https://github.com/hariyantoduit-bit/ebook-full/releases).  
2. Ekstrak file (jika download dalam bentuk ZIP).  
3. Buka `index.html` di browser modern (Chrome, Firefox, Edge, dll).  
4. Navigasikan halaman dengan klik/drag kiri-kanan.

---

## Folder Structure

**v1.0.0**
ebook-full/
├── index.html
├── style.css
├── script.js
├── images/
│ ├── page1.jpg
│ ├── page2.jpg
│ └── ...
└── README.md


**v1.1.0**
ebook-full/
├── index.html
├── css/
│ └── style.css
├── js/
│ └── script.js
├── images/
│ ├── page1.jpg
│ ├── page2.jpg
│ └── ...
└── README.md


---

## Notes
- Semua fitur dari v1.0.0 tetap utuh.  
- Struktur baru mempermudah pemeliharaan dan pengembangan.  
- Disarankan menggunakan browser desktop untuk pengalaman terbaik.  
- Versi lama tetap tersedia untuk download bagi pengguna yang membutuhkan.
