import { Crown } from 'lucide-react'
import { initials } from '../../lib/utils'

export default function Podium({ rows }) {
  if (!rows.length) return null

  const [first, second, third] = rows
  const places = [
    { row: second, rank: 2, cls: 'silver' },
    { row: first,  rank: 1, cls: 'gold' },
    { row: third,  rank: 3, cls: 'bronze' },
  ].filter((p) => p.row)

  return (
    <div className="podium">
      {places.map(({ row, rank, cls }) => (
        <div key={row.name + row.class_name} className={`podium-slot ${cls}`}>
          {rank === 1 && <Crown size={22} className="podium-crown" />}
          <span className={`podium-avatar ${cls}`}>{initials(row.name)}</span>
          <strong>{row.name}</strong>
          <small>{row.class_name}</small>
          <div className={`podium-base rank-${rank}`}>
            <span className="podium-rank">#{rank}</span>
            <span className="podium-score">{row.total}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
