---
version: final-v2
name: SatuSaldo
description: Aplikasi keuangan multi-dompet personal untuk melacak arus kas di rekening bank, e-wallet, dan uang tunai. Menggunakan estetika "Frosty Mint" yang modern, memadukan gradien lime-ke-emerald terang (yang dilembutkan dengan putih), elemen glassmorphism premium, dan tata letak asimetris yang dinamis.
colors:
  primary: "#17C662" # Frosty Mint Green
  secondary: "#F5FF6C" # Soft Lime
  neutral: "#F9FEF6" # Putih dengan sentuhan sangat tipis lime/mint untuk latar belakang
  surface: "rgba(255, 255, 255, 0.4)" # Translucent white for frosted glass (tingkat transparansi tinggi)
  on-surface: "#064E3B" # Deep Forest Green untuk teks utama (WCAG AA compliance)
  on-surface-secondary: "#64748B" # Cool slate untuk detail/caption
  border: "rgba(255, 255, 255, 0.8)" # Batas putih solid untuk mendefinisikan tepi kaca
  success: "#17C662"
  error: "#F43F5E"
  warning: "#F59E0B"
  glow-primary: "rgba(23, 198, 98, 0.15)" # Ambient glow hijau
  glow-secondary: "rgba(245, 255, 108, 0.12)" # Ambient glow lime
typography:
  h1:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.02em
  h2:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: 600
  h3:
    fontFamily: Outfit
    fontSize: 18px
    fontWeight: 600
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: 400
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
rounded:
  sm: 8px
  md: 16px
  lg: 24px
  full: 9999px
spacing:
  base: 8px # base spacing unit — semua padding/margin/gap wajib kelipatan bulat dari nilai ini
components:
  card-glassmorphism:
    backgroundColor: "{colors.surface}"
    backdropFilter: "blur(24px)"
    border: "1px solid {colors.border}"
    boxShadow: "0 12px 40px rgba(23, 198, 98, 0.08)"
    rounded: "{rounded.lg}"
    padding: 24px
  hero-card:
    backgroundColor: "linear-gradient(135deg, {colors.secondary} 0%, {colors.primary} 100%)"
    textColor: "#064E3B"
    rounded: "{rounded.lg}"
    boxShadow: "0 16px 50px rgba(23, 198, 98, 0.2)"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.full}"
    padding: 12px 24px
    boxShadow: "0 8px 16px rgba(23, 198, 98, 0.25)"
  form-input:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.sm}"
    focusRing: "1px solid {colors.primary}"
states:
  empty:
    pattern: "Ilustrasi line-art minimal bertone hijau pucat, disertai copy singkat dan ramah (contoh: 'Belum ada transaksi bulan ini')."
  loading:
    pattern: "Skeleton shimmer dengan tone Surface translucent, bukan spinner generik — konsisten dengan estetika glassmorphism."
  error:
    pattern: "Inline validation berwarna {colors.error} di bawah field terkait, bukan toast, agar tidak mengganggu efek kaca."
---

## 1. Overview
SatuSaldo adalah aplikasi web keuangan personal (Dashboard & Landing Page) bergaya "Frosty Mint". Desain difokuskan pada kejelasan data riil dan kemudahan pencatatan (bank, e-wallet, tunai). Estetika memadukan latar belakang *mesh gradient* yang dilembutkan dengan UI *glassmorphism* tingkat lanjut.

## 2. Colors & Vibe
- **Mesh Gradient Latar Belakang:** Menggunakan gradien halus antara Primary (#17C662) dan Secondary (#F5FF6C) yang dilarutkan ke dalam warna latar belakang putih. Ini berfungsi sebagai kanvas berenergi tanpa membuat mata lelah.
- **Glassmorphism Premium:** Semua kartu komponen menggunakan latar belakang putih yang sangat transparan (opacity 40%-70%) dengan efek `backdrop-filter: blur(24px)`. Efek kaca ini wajib dipertegas dengan *border* putih solid 1px agar tidak terlihat buram/kotor.

## 3. Sistem Tata Letak Global (Layout System)
- **Eksplisit Asimetris:** **DILARANG** menggunakan tata letak grid yang dibagi rata sama besar secara simetris. Terapkan hierarki visual *Dominan vs. Sekunder* di seluruh halaman (misal: rasio pembagian ruang 70:30 atau 2/3 dan 1/3). Area dominan menampung data utama (Total Saldo, Tabel Riwayat), sementara area sekunder menampung widget (Tagihan, Aksi Cepat).
- **Bento Box Grid:** Pengelompokan fitur tidak boleh terlihat membosankan. Gunakan konsep tata letak kotak bervariasi ukuran (Bento Box) agar antarmuka terlihat modern dan *youthful*.
- **Floating Elements:** Komponen utama dibiarkan seolah "melayang" (*floating*) tidak beraturan di atas kanvas. Hindari penggunaan *container box* abu-abu solid sebagai pembungkus. Kedalaman diciptakan dari *drop shadow* halus berwarna hijau pucat, bukan abu-abu/hitam.
- **Base Spacing Unit:** 8px. Semua nilai padding/margin/gap wajib kelipatan bulat dari 8px (contoh: 8px, 16px, 24px, 32px) — hindari nilai desimal.

## 4. Tipografi
- **Display & Judul (Outfit):** Angka "Total Saldo" atau *headline* utama menggunakan font Outfit dengan bobot tebal (Bold/Extra Bold) dan spasi huruf (*letter-spacing*) minus untuk memberikan kesan padat dan modern ala Web3.
- **Data & Tabel (Plus Jakarta Sans):** Semua baris tabel riwayat transaksi, form input, dan rincian yang panjang menggunakan font **Plus Jakarta Sans** — geometris namun lebih membulat dan ramah dibanding Inter, tetap menjaga *readability* optimal untuk data/angka sambil membawa nuansa *fun* dan *powerful* yang selaras dengan vibe Web3 aplikasi.
  > **Catatan perubahan:** Versi final sebelumnya menggunakan Inter untuk peran ini. Diganti ke Plus Jakarta Sans atas permintaan eksplisit agar kesan body/data font lebih "powerful fun", bukan netral-korporat.

## 5. Komponen Inti & Aturan Style
- **Buttons (primary):** Bentuk pill/full-radius, background solid Primary (#17C662), teks putih, shadow hijau lembut `0 8px 16px rgba(23,198,98,0.25)`.
- **Cards:** Glassmorphism wajib — background Surface, `backdrop-filter: blur(24px)`, border solid putih 1px, shadow hijau pucat `0 12px 40px rgba(23,198,98,0.08)`, radius lg (24px).
- **Hero Card (Total Saldo):** Gradient diagonal 135° dari Secondary → Primary, teks Deep Forest Green, shadow lebih tebal `0 16px 50px rgba(23,198,98,0.2)`.
- **Forms/Inputs:** Background Surface translucent senada card, border 1px solid warna Border, focus state ring hijau Primary.
- **Tables (Riwayat Transaksi):** Font Plus Jakarta Sans untuk readability data, tanpa efek glass berat agar angka tetap jelas terbaca.

## 6. States Convention
- **Empty State:** Ilustrasi line-art minimal bertone hijau pucat + copy singkat ramah (contoh: "Belum ada transaksi bulan ini").
- **Loading State:** Skeleton shimmer dengan tone Surface translucent, bukan spinner generik.
- **Error State:** Inline validation warna Error (#F43F5E) di bawah field terkait, bukan toast.
