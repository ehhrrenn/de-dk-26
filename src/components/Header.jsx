import SplitFlap from './SplitFlap'
import { dayStatus } from '../utils/helpers'
import { DAYS } from '../data/tripData'

export default function Header() {
  const status = dayStatus(DAYS)

  return (
    <header className="board">
      <div className="board-route">Munich → Rhine Valley → Berlin → Copenhagen</div>
      <SplitFlap text="DE + DK 2026" />
      <div className="board-status">{status.label}</div>
    </header>
  )
}
