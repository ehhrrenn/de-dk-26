import { dayStatus } from '../utils/helpers'

// Slim countdown/status line, shown on every page, sitting above the
// sticky timeline header.
export default function StatusBar({ days }) {
  if (!days || days.length === 0) return null
  const status = dayStatus(days)
  return <div className="status-bar">{status.label}</div>
}
