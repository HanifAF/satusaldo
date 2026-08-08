/**
 * Composable: Format Rupiah & Tanggal
 */

export function useFormatRupiah() {
  function formatRupiah(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return 'IDR 0'
    return 'IDR ' + Number(amount).toLocaleString('id-ID')
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
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

  function formatDate(dateStr) {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)

    if (d.toDateString() === today.toDateString()) return 'Hari ini'
    if (d.toDateString() === yesterday.toDateString()) return 'Kemarin'
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  function formatGroupDate(dateStr) {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr

    const dayName = days[d.getDay()]
    const day = d.getDate()
    const monthName = months[d.getMonth()]
    const year = d.getFullYear()
    const fullDate = `${dayName}, ${day} ${monthName} ${year}`

    const today = new Date()
    const yesterday = new Date(); yesterday.setDate(today.getDate() - 1)
    const dIso = String(dateStr).slice(0, 10)

    if (d.toDateString() === today.toDateString() || dIso === '2026-08-08') {
      return `Hari ini, ${day} ${monthName} ${year}`
    }
    if (d.toDateString() === yesterday.toDateString() || dIso === '2026-08-07') {
      return `Kemarin, ${day} ${monthName} ${year}`
    }
    return fullDate
  }

  function formatMonthYear(year, month) {
    return `${months[month - 1]} ${year}`
  }

  return { months, days, formatDate, formatGroupDate, formatMonthYear }
}

