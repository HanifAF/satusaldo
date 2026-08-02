/**
 * Composable: Format Rupiah & Tanggal
 */

export function useFormatRupiah() {
  function formatRupiah(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0'
    return 'Rp ' + Number(amount).toLocaleString('id-ID')
  }

  function parseRupiah(str) {
    if (!str) return 0
    return parseInt(String(str).replace(/\./g, '').replace(/[^0-9]/g, ''), 10) || 0
  }

  return { formatRupiah, parseRupiah }
}

export function useFormatDate() {
  const months = [
    'Januari','Februari','Maret','April','Mei','Juni',
    'Juli','Agustus','September','Oktober','November','Desember'
  ]

  function formatDate(dateStr) {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)

    if (d.toDateString() === today.toDateString()) return 'Hari ini'
    if (d.toDateString() === yesterday.toDateString()) return 'Kemarin'
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  function formatMonthYear(year, month) {
    return `${months[month - 1]} ${year}`
  }

  return { months, formatDate, formatMonthYear }
}
