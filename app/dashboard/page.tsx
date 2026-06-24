// Server Component Utama (Halaman Cashflow). Bertugas sebagai dirigen yang mengambil data finansial dari database,
// lalu mendistribusikannya ke kartu-kartu visual.
// Kanvas utama penyusun grid UI

const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
