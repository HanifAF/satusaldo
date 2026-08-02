# DOKUMEN PERSYARATAN PRODUK (PRD)
## Nama Aplikasi: Dompetku (Manajemen Keuangan Multi-Dompet)

---

### 1. Tujuan Produk (Product Goals)
Membantu pengguna mengelola dan memantau uang mereka yang tersebar di berbagai tempat penyimpanan dalam satu dashboard terintegrasi. Aplikasi ini berfokus pada keakuratan pencatatan saldo riil dengan memperhitungkan biaya admin transaksi, mutasi antar dompet, pengeluaran tunai skala kecil, utang, serta tagihan bulanan.

### 2. Fitur Utama (Core Features)

#### A. Autentikasi & Akun
*   **Login Google (Gmail):** Pengguna masuk menggunakan akun Gmail untuk keamanan dan kemudahan akses.
*   **Setup Awal (Pengguna Baru):** Pengguna baru wajib memasukkan saldo awal untuk 3 dompet default sebelum masuk ke dashboard.
*   **Pemisahan Data:** Data saldo dan transaksi antar-pengguna terisolasi dengan aman menggunakan ID pengguna (`user_id`).

#### B. Sistem Tiga Dompet Utama (Wallets)
Sistem memiliki 3 dompet default dengan perilaku sebagai berikut:
1.  **Dompet Bank:** Tempat penyimpanan uang di rekening bank (misal: BCA, Mandiri).
2.  **Dompet E-Wallet:** Tempat penyimpanan uang digital (misal: GoPay, OVO, ShopeePay).
3.  **Dompet Tunai:** Tempat penyimpanan uang fisik (cash di dompet atau saku). 
    *   *Desain Khusus:* Menyediakan antarmuka (UI) input cepat untuk transaksi bernominal kecil (misal: bayar parkir, beli bensin, tips, jajan) agar pengguna mudah mencatat tanpa malas.

#### C. Aliran & Logika Transaksi (Transaction Logic)
Aplikasi mendukung 3 jenis pencatatan uang:

1.  **Pemasukan (Income):** Uang masuk dari luar sistem ke salah satu dompet.
    *   *Contoh:* Gaji masuk ke Bank, atau menerima gaji tunai (cash) langsung ke Dompet Tunai.
    *   *Logika Saldo:* Menambah saldo dompet tujuan.
2.  **Pengeluaran (Expense):** Uang keluar dari salah satu dompet untuk belanja atau kebutuhan.
    *   *Contoh:* Beli makanan pakai E-Wallet, beli bensin pakai Tunai.
    *   *Logika Saldo:* Mengurangi saldo dompet asal.
3.  **Transfer / Mutasi Antar Dompet:** Memindahkan uang dari satu dompet ke dompet lainnya.
    *   *Skenario 1 (Tarik Tunai):* Dari Bank ke Dompet Tunai.
    *   *Skenario 2 (Setor Tunai):* Dari Dompet Tunai ke Bank.
    *   *Skenario 3 (Top Up E-Wallet):* Dari Bank ke E-Wallet, atau dari Dompet Tunai ke E-Wallet (via minimarket).
    *   *Logika Saldo & Biaya Admin:* 
        *   Saldo dompet asal berkurang sebesar **(Nominal Transfer + Biaya Admin)**.
        *   Saldo dompet tujuan bertambah sebesar **Nominal Transfer**.
        *   Biaya admin (jika ada) otomatis dicatat sebagai transaksi Pengeluaran dengan kategori **"Biaya Admin"** agar total saldo keseluruhan tetap akurat.

#### D. Manajemen Utang (Debts)
*   Mencatat uang yang dipinjam dari orang lain (Utang) or dipinjamkan ke orang lain (Piutang).
*   *Menerima Utang:* Saldo dompet bertambah, sistem mencatat sisa utang yang harus dibayar.
*   *Membayar Utang:* Saldo dompet berkurang, sisa utang yang tercatat berkurang/lunas.

#### E. Pengingat Tagihan Bulanan (Recurring Bills)
*   Pengguna dapat mendaftarkan daftar tagihan rutin bulanan (misal: uang kos, kuota internet, langganan Netflix) lengkap dengan tanggal jatuh tempo.
*   Terdapat widget "Tagihan Mendatang" di dashboard yang akan memberikan peringatan jika mendekati tanggal bayar.
*   Terdapat tombol "Bayar" instan untuk langsung memotong saldo dompet yang dipilih dan mencatatnya sebagai pengeluaran bulan tersebut.

---

### 3. Alur Halaman Website (User Flow)
1.  **Landing Page:** Halaman informasi produk dengan tombol "Mulai Sekarang" untuk mengarahkan pengguna ke login.
2.  **Login Page:** Form login cepat menggunakan akun Google (Gmail).
3.  **Setup Page (Hanya Sekali):** Form input saldo awal untuk Bank, E-Wallet, dan Tunai.
4.  **Dashboard (Halaman Utama):** 
    *   Menampilkan **Total Saldo** (gabungan 3 dompet) di bagian paling atas.
    *   Rincian saldo masing-masing dompet (Bank: Rp X, E-Wallet: Rp Y, Tunai: Rp Z).
    *   Widget daftar tagihan bulanan terdekat.
    *   Daftar riwayat transaksi terbaru.
    *   Tombol aksi cepat untuk "Catat Transaksi" dan "Transfer Saldo".

---

### 4. Rencana Teknologi (Tech Stack)
*   **Frontend:** Vue.js (Vue 3) dengan Tailwind CSS untuk tampilan yang responsif dan rapi.
*   **Backend & Database:** Supabase (menggunakan database PostgreSQL bawaannya, sistem keamanan Row Level Security/RLS, serta integrasi Auth Google secara instan).
