import { useState } from 'react'
import { formatDate, formatUSD } from '../utils/helpers'
import { CITIES, cityFor } from '../data/cities'

export default function DayCard({ day }) {
  const [open, setOpen] = useState(false)
  const city = CITIES[cityFor(day.isTravelDay ? day.cityNight : day.cityDay)]
  const headline = day.isTravelDay ? `${day.cityDay} → ${day.cityNight}` : day.cityDay
  const sub = day.activity ? `${day.activity.emoji ?? ''} ${day.activity.name}`.trim() : day.notes || 'Open day'

  return (
    <article className="day-card" style={{ '--city-color': city.color }}>
      <button className="day-card-head" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <span className="day-number">{String(day.dayNumber).padStart(2, '0')}</span>
        <span className="day-headline">
          <div className="day-date">{formatDate(day.date)}</div>
          <div className="day-title">{headline}</div>
          <div className="day-sub">{sub}</div>
        </span>
      </button>

      {open && (
        <div className="day-card-body">
          {day.travel && (
            <div className="info-row">
              <span className="info-label">Travel</span>
              <span>
                {day.travel.mode ?? 'Mode TBD'}
                {day.travel.time ? ` · ${day.travel.time}` : ''}
                {day.travel.cost ? ` · ${formatUSD(day.travel.cost)}` : ''}
              </span>
            </div>
          )}

          {day.lodging && (
            <div className="info-row">
              <span className="info-label">Lodging</span>
              <span>
                {day.lodging.provider}
                {day.lodging.cost ? ` · ${formatUSD(day.lodging.cost)}` : ''}
                {day.lodging.checkIn ? ` · Check-in ${day.lodging.checkIn}` : ''}
                {day.lodging.checkOut ? ` · Check-out ${day.lodging.checkOut}` : ''}
                {day.lodging.link && (
                  <>
                    {' · '}
                    <a href={day.lodging.link} target="_blank" rel="noreferrer">reservation</a>
                  </>
                )}
              </span>
            </div>
          )}

          {day.activity?.cost != null && (
            <div className="info-row">
              <span className="info-label">Activity $</span>
              <span>{formatUSD(day.activity.cost)}</span>
            </div>
          )}

          {day.notes && !day.events.length && (
            <div className="info-row">
              <span className="info-label">Notes</span>
              <span>{day.notes}</span>
            </div>
          )}

          {day.events.length > 0 && (
            <div className="event-list">
              {day.events.map((e, i) => (
                <div className="event" key={i}>
                  <span className="event-time mono">{e.time}</span>
                  <span>
                    <div className="event-title">{e.title}</div>
                    <div className="event-desc">{e.description}</div>
                  </span>
                </div>
              ))}
            </div>
          )}

          {day.tips.map((t, i) => (
            <p className="tip" key={i}>{t}</p>
          ))}
        </div>
      )}
    </article>
  )
}
