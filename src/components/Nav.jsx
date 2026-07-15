const TABS = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'map', label: 'Map' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'travelers', label: 'Travelers' },
]

export default function Nav({ active, onChange }) {
  return (
    <nav className="tabs" role="tablist" aria-label="Trip sections">
      {TABS.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={`tab${active === t.id ? ' active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
