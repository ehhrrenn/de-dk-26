import { useEffect, useState } from 'react'

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 →'

// Renders `text` as a row of departure-board tiles that cycle through
// random characters before landing on the real one, left to right.
export default function SplitFlap({ text }) {
  const chars = text.toUpperCase().split('')
  const [display, setDisplay] = useState(chars.map(() => ' '))

  useEffect(() => {
    let cancelled = false
    const timers = []

    chars.forEach((target, i) => {
      const settleAt = 220 + i * 55
      const ticks = 4
      for (let t = 0; t < ticks; t++) {
        timers.push(
          setTimeout(() => {
            if (cancelled) return
            setDisplay((prev) => {
              const next = [...prev]
              next[i] = target === ' ' ? ' ' : CHARSET[Math.floor(Math.random() * CHARSET.length)]
              return next
            })
          }, (settleAt / ticks) * t)
        )
      }
      timers.push(
        setTimeout(() => {
          if (cancelled) return
          setDisplay((prev) => {
            const next = [...prev]
            next[i] = target
            return next
          })
        }, settleAt)
      )
    })

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  return (
    <div className="flap-row" aria-label={text}>
      {display.map((c, i) => (
        <span key={i} className={`flap-tile${c === ' ' ? ' is-space' : ''}`} aria-hidden="true">
          {c === ' ' ? '\u00A0' : c}
        </span>
      ))}
    </div>
  )
}
