export function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function dayStatus(days) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const first = new Date(days[0].date + 'T00:00:00')
  const last = new Date(days[days.length - 1].date + 'T00:00:00')

  if (today < first) {
    const diffDays = Math.ceil((first - today) / 86400000)
    return { phase: 'before', label: `T-MINUS ${diffDays} DAY${diffDays === 1 ? '' : 'S'}` }
  }
  if (today > last) {
    return { phase: 'after', label: 'TRIP COMPLETE' }
  }
  const current = days.find((d) => d.date === today.toISOString().slice(0, 10))
  if (current) {
    return { phase: 'during', label: `DAY ${current.dayNumber} · ${current.cityDay.toUpperCase()}`, current }
  }
  return { phase: 'during', label: 'ON THE ROAD' }
}

export function formatUSD(n) {
  if (n == null) return '—'
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

// Derived (never stored) so it can't drift from the address it's built from.
export function mapsDirectionsUrl(address) {
  if (!address) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`
}
