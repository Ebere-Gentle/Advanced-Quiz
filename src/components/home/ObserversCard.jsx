import { ExternalLink, Eye } from 'lucide-react'
import Panel from '../ui/Panel'

const AVATARS = [
  'https://i.pravatar.cc/80?img=15',
  'https://i.pravatar.cc/80?img=22',
  'https://i.pravatar.cc/80?img=36',
]

export default function ObserversCard({ go }) {
  return (
    <Panel className="observers">
      <div className="observers-head">
        <span className="observers-title">OBSERVERS / AUDIENCE</span>
        <span className="live-pill small"><i /> LIVE</span>
      </div>

      <div className="observers-count">
        <strong>342</strong>
        <span>People Watching Live</span>
      </div>

      <div className="observers-row">
        <div className="observers-avatars">
          {AVATARS.map((src, i) => <img key={i} src={src} alt="" />)}
          <span className="observers-more">+337</span>
        </div>
      </div>

      <button className="observers-cta" onClick={() => go('join')}>
        Watch Live Quiz <ExternalLink size={14} />
      </button>
    </Panel>
  )
}
