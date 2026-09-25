import { ArrowDown, ArrowRight, ArrowUp, Minus } from 'lucide-react'
import Panel from '../ui/Panel'

const TRENDS = ['up', 'down', 'up', 'down', 'flat']

export default function LeaderboardPreview({ rows, go }) {
  const [first, second, third, ...rest] = rows

  return (
    <Panel className="lb-preview">
      <div className="lb-preview-head">
        <span className="lb-preview-title">LEADERBOARD</span>
        <span className="live-pill small"><i /> Live</span>
        <button className="link-btn small" onClick={() => go('leaderboard')}>
          View Full Leaderboard
        </button>
      </div>

      <div className="lb-podium">
        {[
          { rank: 2, row: second, cls: 'silver' },
          { rank: 1, row: first,  cls: 'gold' },
          { rank: 3, row: third,  cls: 'bronze' },
        ].map(({ rank, row, cls }) => row && (
          <div key={rank} className={`lb-podium-slot ${cls}`}>
            <span className="lb-podium-rank">{rank}</span>
            <div className={`lb-podium-crest ${cls}`}>
              <span>{row.className}</span>
            </div>
            <strong>{row.points}</strong>
            <small>pts</small>
          </div>
        ))}
      </div>

      <ul className="lb-preview-list">
        {rest.map((r, i) => {
          const trend = TRENDS[i % TRENDS.length]
          return (
            <li key={r.className}>
              <span className="lb-list-rank">{i + 4}</span>
              <span className="lb-list-name">{r.className}</span>
              <strong>{r.points} pts</strong>
              <span className={`lb-list-trend ${trend}`}>
                {trend === 'up'   && <ArrowUp size={12} />}
                {trend === 'down' && <ArrowDown size={12} />}
                {trend === 'flat' && <Minus size={12} />}
              </span>
            </li>
          )
        })}
      </ul>

      <span className="lb-preview-updated">Last updated: Just now</span>
    </Panel>
  )
}
