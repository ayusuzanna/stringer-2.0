# Stringer Claim Portal (Berita Harian / NSTP Media Prima)

[![Portal Rasmi - stringer.ai.studio](https://img.shields.io/badge/🌐_Buka_Portal_Rasmi-https%3A%2F%2Fstringer.ai.studio-0B2545?style=for-the-badge)](https://stringer.ai.studio)
[![Status Sistem](https://img.shields.io/badge/Status-Aktif_(Cloud_Firestore)-10B981?style=for-the-badge)](https://stringer.ai.studio)

> ### 🌐 Pautan Akses Umum (Buka Aplikasi Secara Langsung)
> **URL Rasmi Portal:** **[https://stringer.ai.studio](https://stringer.ai.studio)**  
> Klik pautan di atas untuk membuka **Stringer Claim Portal — Berita Harian (NSTP Media Prima)** secara terus dari pelayar web (komputer atau telefon pintar) bagi semua peranan (**Stringer**, **Ketua Jabatan / HOD**, dan **Pegawai HR**).

---

Sistem Pengurusan Editorial & Tuntutan Perjalanan Wartawan Sambilan (*Stringer*) rasmi bagi **Berita Harian** dan **The New Straits Times Press (Malaysia) Berhad (Media Prima Berhad)** disepadukan sepenuhnya dengan **Firebase Cloud Firestore & Authentication**.

Aplikasi ini mendigitalkan proses penyerahan elaun perbatuan lapangan, pengimbasan resit tol dan parkir berasaskan AI, pengesahan tandatangan digital Ketua Jabatan (HOD), cetakan memo audit dwi-format (A4 Potret & Landskap Rasmi), direktori pautan pekeliling berasaskan awan, serta konsolidasi lejar analitik pengurusan eksekutif.

---

## 📌 Ciri-Ciri Utama Sistem (Core Features)

### 1. Pengesahan Pengguna Pelbagai (*Multi-User Authentication & Roles*)
* **Pautan Log Masuk Awam:** Semua pengguna boleh mengakses sistem terus di **[https://stringer.ai.studio](https://stringer.ai.studio)**.
* **Akses Penuh Semua Peranan (*Super Admin / Master Access*):**
  * **`ayusuzanna7k@gmail.com`** — Kebenaran penuh log masuk & akses semua peranan (*Stringer, HOD, HR & Analitik*).
  * **`ayusuzanna@mediaprima.com.my`** — Kebenaran penuh log masuk & akses semua peranan (*Stringer, HOD, HR & Analitik*).
* **Skrin Pengesahan Utama (`AuthScreen.tsx`):**
  * Pengguna baharu atau lawatan kali pertama akan terus disambut oleh skrin **Log Masuk (*Sign In*)** & **Daftar Akaun (*Sign Up*)**.
  * **Log Masuk Google:** Disepadukan dengan *Firebase Auth Popup* menggunakan akaun Google / Media Prima Workspace.
  * **Log Masuk Emel & Kata Laluan:** Sokongan log masuk pantas bagi staf dan wartawan berdaftar.
  * **Pendaftaran Akaun Baharu (*Sign Up*):** Perekodan nama penuh, emel rasmi, kata laluan, peranan portal (*Stringer / HOD / HR*), biro bertugas, nombor kad pengenalan (NRIC), nombor plat kenderaan, dan nombor akaun bank EFT Maybank/lain-lain.
  * **Log Masuk Segera Mengikut Peranan (*Demo Profiles*):** Akses satu-klik untuk simulasi pelbagai peranan:
    * *Ahmad Faiz bin Razali* (Wartawan Sambilan - Biro Putrajaya & Parlimen)
    * *Puan Zaiton Ishak* (Ketua Jabatan / HOD - Editor Berita Tempatan)
    * *Encik Zulkifli Hassan* (Pegawai Sumber Manusia & Kewangan NSTP)
  * **Aliran Log Keluar Selamat (*Sign Out*):** Butang **"Log Keluar"** di bahagian pengepala memanggil `signOut(auth)`, membersihkan sesi secara selamat dan mengembalikan pengguna ke skrin log masuk.

### 2. Papan Pemuka & Tuntutan Bulanan (Stringer Module)
* **Kalkulator Automatik Perbatuan (RM0.35 / KM):** Pengiraan elaun serta-merta berdasarkan titik tolak dan destinasi tugasan liputan selaras Surat Pekeliling Kewangan MPB Bil 02/2024.
* **Pengimbas Resit AI (OCR - F03):** Pengesanan optikal pintar untuk penyata Touch 'n Go dan tiket parkir dengan padanan pantas amaun, tarikh/masa, nombor siri transaksi, dan nama pembekal/merchant.
* **Pad Tandatangan Digital & Perakuan Integriti (F04):** Kanvas interaktif sentuhan/tetikus (*HTML5 canvas*) dengan klausa pematuhan Seksyen 18 Akta SPRM 2009, cap masa sistem, dan janaan *SHA-256 Audit Hash*.
* **Penyegerakan Fail Tuntutan Awan:** Setiap perubahan log tugasan disimpan terus ke Cloud Firestore (`/claims/{claimId}`).

### 3. Direktori Pautan Rasmi Firebase (*System Links Module*)
* **Penyimpanan Pautan Awalan & Tersuai di Firestore (`/links`):**
  * Semua pautan rujukan disimpan secara langsung di Cloud Firestore melalui `linksService.ts`.
  * Termasuk pautan Surat Pekeliling Kewangan MPB Bil 02/2024, Portal e-Penyata Touch 'n Go, CMS Newsdesk Berita Harian, Maybank2e Corporate EFT, dan Portal Pematuhan Integriti SPRM.
  * Modal interaktif (`SystemLinksModal.tsx`) membolehkan pengguna menapis mengikut kategori (*Pekeliling, Resit & TNG, Editorial, Kewangan & Bank, HR*) dan menambah atau memadam pautan secara masa nyata.

### 4. Semakan & Kelulusan Ketua Jabatan (HOD Module)
* **Giliran Semakan (*Approval Queue*):** Pemantauan status fail tuntutan menunggu perakuan mengikut biro bertugas (cth: Biro Putrajaya & Parlimen, Shah Alam & Klang).
* **Pemeriksaan Fail Terperinci (F05):** Semakan silang resit digital, integriti IP, dan jarak kilometer yang dituntut.
* **Kad Tandatangan & Cop Digital HOD:** Pengesahan digital rasmi (*Media Prima Editorial Auth Seal*) beserta opsyen pemulangan draf bertulis sekiranya terdapat pembetulan.
* **Kelulusan Kelompok (*Batch Approval*):** Membolehkan HOD meluluskan semua tuntutan menunggu perakuan dengan sekali klik (dikemaskini terus ke Firestore).

### 5. Pengesahan & Cetakan HR (Human Resources & Finance)
* **Semakan Kelompok Pusat:** Penapisan status (*Sedia untuk Semakan HR*, *Disahkan & Sedia Dicetak*, *Dihantar ke Bahagian Kewangan*).
* **Modul Dwi-Format Cetakan Rasmi NSTP Media Prima:**
  * **Format F06 (Format Potret A4):** *Cetak Lampiran Terperinci Memo Kewangan (Itemized Claim Memo Attachment)* lengkap dengan kepala surat NSTP, butiran harian, imbasan resit, dan kedua-dua tandatangan digital (Stringer & HOD).
  * **Format F07 (Format Landskap Rasmi):** *STRINGER / PRACTICAL TRAINEE CLAIMS PROCESS IN THE MONTH OF : MAC 2025* (Cost Center 4120) untuk penyerahan kelompok ke Jabatan Akaun / Payroll Maybank Corporate.
* **Pemeriksaan Pematuhan Sumber Manusia:** Perakuan integriti fail selaras Pekeliling Kewangan NSTP/BH Bil. 4/2023.

### 6. Analitik & Laporan Pengurusan (Executive Reporting Dashboard)
* **Penapis Parameter Lejar Kewangan:** Penapisan mengikut Tahun Kewangan, Bulan/Tempoh, Cawangan/Biro (8 Cawangan), dan Kategori Wartawan Sambilan.
* **Metrik & KPI Prestasi:** Jumlah tuntutan bulanan vs peratusan bajet suku tahunan, jumlah kilometer perjalanan, dan purata masa kelulusan audit (-54% berbanding borang fizikal).
* **Graf Trend Perbelanjaan:** Carta bar bertingkat (*stacked bars*) membandingkan elaun kilometer (79.5%), tol & parkir (15.4%), dan peruntukan liputan khas.
* **Pecahan Mengikut Biro:** Taburan bajet antara Biro Putrajaya, Shah Alam, Meja Mahkamah KL, dan Meja Sukan.
* **Lejar Data Induk (42 Rekod):** Pengekstrakan jadual induk dengan paginasi, carian teks, eksport **CSV / Excel**, dan muat turun **JSON Audit Log** rasmi.

---

## 🗄️ Struktur Pangkalan Data Cloud Firestore

| Koleksi Firestore | Penerangan | Model Data Utama |
|---|---|---|
| `/claims/{claimId}` | Fail tuntutan bulanan wartawan sambilan, log tugasan, status aliran kerja, jumlah perbatuan & elaun, tandatangan digital dan audit hash. | `ClaimSubmission` |
| `/users/{userId}` | Profil pengguna pelbagai peranan (*Stringer, HOD, HR*), emel, penetapan biro, nombor kad pengenalan dan akaun bank EFT. | `UserProfile` |
| `/links/{linkId}` | Direktori pautan pekeliling rasmi, portal perbankan, portal TNG, dan sistem dalaman Media Prima. | `SystemLink` |
| `/test/connection` | Dokumen pengesahan integriti sambungan pelayan Firestore semasa aplikasi dimulakan (*boot-check*). | N/A |

---

## 🛠️ Senibina Teknologi (Tech Stack)

* **Frontend Framework:** [React 19](https://react.dev/)
* **Bahasa Pengaturcaraan:** [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Pangkalan Data & Pengesahan:** [Firebase Cloud Firestore](https://firebase.google.com/docs/firestore) & [Firebase Authentication](https://firebase.google.com/docs/auth) (Rantau: `asia-southeast1`)
* **Peraturan Keselamatan (*Security Rules*):** Firestore Zero-Trust Attribute-Based Access Control (ABAC) dideploy melalui `firestore.rules`
* **Gaya & Reka Bentuk UI:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Ikonografi:** [Lucide React](https://lucide.dev/)
* **Animasi:** [Motion](https://motion.dev/)
* **Tipografi:** Plus Jakarta Sans & Inter (*Tabular Figures*)

---

## 🚀 Panduan Akses & Pemasangan Projek (Getting Started)

### 🌐 Akses Terus Dalam Talian (Tanpa Pemasangan)
Anda boleh terus membuka dan menggunakan aplikasi ini melalui pautan rasmi berikut:
* **Pautan Utama:** **[https://stringer.ai.studio](https://stringer.ai.studio)**

### Prasyarat Pembangunan Tempatan (*Local Development*)
* [Node.js](https://nodejs.org/) versi 18 atau ke atas
* Pengurus pakej `npm` atau `bun`

### Langkah-langkah:

1. **Klon Repositori:**
   ```bash
   git clone https://github.com/<username>/<repository-name>.git
   cd <repository-name>
   ```

2. **Pasang Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Firebase:**
   Pastikan fail `firebase-applet-config.json` berada di direktori punca projek dengan konfigurasi projek Firebase yang betul:
   ```json
   {
     "projectId": "YOUR_PROJECT_ID",
     "appId": "YOUR_APP_ID",
     "apiKey": "YOUR_API_KEY",
     "authDomain": "YOUR_AUTH_DOMAIN",
     "firestoreDatabaseId": "YOUR_DATABASE_ID",
     "storageBucket": "YOUR_STORAGE_BUCKET"
   }
   ```

4. **Jalankan Pelayan Pembangunan (*Dev Server*):**
   ```bash
   npm run dev
   ```
   Aplikasi akan boleh diakses di pelayar melalui `http://localhost:3000`.

5. **Bina untuk Pengeluaran (*Production Build*):**
   ```bash
   npm run build
   ```

6. **Semakan Kod (*Linting*):**
   ```bash
   npm run lint
   ```

---

## 📁 Struktur Projek

```
├── public/                         # Aset statik (logo, favicon)
├── src/
│   ├── components/
│   │   ├── AccountSettingsModal.tsx  # Modal profil & tetapan akaun bank EFT
│   │   ├── AIReceiptScanner.tsx      # Pengimbas OCR resit Touch 'n Go & parkir
│   │   ├── AnalyticsReportingView.tsx# Papan pemuka analitik & lejar induk
│   │   ├── AuthScreen.tsx            # Skrin log masuk & pendaftaran pengguna (Multi-User)
│   │   ├── Header.tsx                # Pengepala utama portal, status Firestore & log keluar
│   │   ├── HODApprovalView.tsx       # Modul kelulusan Ketua Jabatan
│   │   ├── HRVerificationView.tsx    # Modul pengesahan Sumber Manusia & Kewangan
│   │   ├── NewClaimModal.tsx         # Modal pendaftaran folder bulan baharu
│   │   ├── NSTPLogo.tsx              # Komponen logo rasmi NSTP (a media prima company)
│   │   ├── PrintLedgerModal.tsx      # Format F07 (Cetak Lejar Landskap Rasmi)
│   │   ├── PrintMemoModal.tsx        # Format F06 (Cetak Lampiran Terperinci A4)
│   │   ├── RateGuideModal.tsx        # Garis panduan & SOP tuntutan RM0.35/km
│   │   ├── Sidebar.tsx               # Navigasi sisi biro & pintasan modul
│   │   ├── SignaturePad.tsx          # Kanvas pad tandatangan digital HTML5
│   │   ├── StringerDashboard.tsx     # Papan pemuka pengisian tuntutan stringer
│   │   └── SystemLinksModal.tsx      # Modal direktori pautan rasmi & rujukan Firebase
│   ├── data/
│   │   └── mockData.ts               # Data asal tuntutan, penugasan, dan contoh resit
│   ├── lib/
│   │   └── firestoreErrors.ts        # Pengendali ralat Firestore berpiawaian
│   ├── services/
│   │   ├── claimsService.ts          # Perkhidmatan CRUD & onSnapshot tuntutan Firestore
│   │   ├── linksService.ts           # Perkhidmatan pautan rasmi Firebase
│   │   └── userService.ts            # Perkhidmatan profil pengguna Firestore
│   ├── firebase.ts                   # Inisialisasi Firebase App, Auth & Firestore
│   ├── types.ts                      # Definisi jenis data TypeScript
│   ├── App.tsx                       # Titik integrasi utama aplikasi & pengurusan keadaan
│   ├── index.css                     # Gaya global Tailwind CSS
│   └── main.tsx                      # Titik masuk React DOM
├── firebase-applet-config.json       # Konfigurasi sambungan Firebase
├── firebase-blueprint.json           # Cetak biru skema Firestore IR
├── firestore.rules                   # Peraturan keselamatan Firestore (ABAC)
├── metadata.json
├── package.json
└── tsconfig.json
```

---

## 📄 Dasar & Pekeliling Kewangan Berkuatkuasa

* **Kadar Perbatuan Semenanjung:** **RM0.35 / KM** (Surat Pekeliling Kewangan MPB Bil 02/2024).
* **Pematuhan Resit:** Wajib memuat naik e-penyata Touch 'n Go atau tiket parkir rasmi mengikut tarikh penugasan editorial.
* **Perakuan Integriti:** Tertakluk kepada tindakan undang-undang di bawah Akta Suruhanjaya Pencegahan Rasuah Malaysia (SPRM) 2009.

---

## 🏢 Hak Cipta & Pelesenan

Hak Cipta Terpelihara © 2025 **The New Straits Times Press (Malaysia) Berhad / Media Prima Berhad**.  
Sistem Pengurusan Editorial & Tuntutan Stringer (Versi 5.0 Core Engine + Firebase Cloud Engine).
