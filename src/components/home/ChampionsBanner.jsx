import { ArrowRight, Trophy } from 'lucide-react'

export default function ChampionsBanner({ go }) {
  return (
    <section className="champions">
      <span className="champions-trophy"><Trophy size={34} /></span>

      <div>
        <strong>CHAMPIONS ARE MADE HERE!</strong>
        <span>Every question brings you closer to glory.</span>
      </div>

      <button className="champions-cta" onClick={() => go('leaderboard')}>
        View Hall of Fame <ArrowRight size={15} />
      </button>
    </section>
  )
}
