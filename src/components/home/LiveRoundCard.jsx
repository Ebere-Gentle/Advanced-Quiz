import { ArrowRight, CheckCircle2, Clock3, Radio, Users, XCircle } from 'lucide-react'
import Panel from '../ui/Panel'

export default function LiveRoundCard({ round, activity, go }) {
  return (
    <Panel className="live-round">
      <div className="live-head">
        <span className="live-head-title"><i /> LIVE QUIZ STATUS</span>
        <span className="live-head-badge">
          <i /> {round?.status === 'live' ? 'LIVE' : 'UPCOMING'}
        </span>
      </div>

      <div className="live-hero">
        <span className="live-hero-label">CURRENT ROUND</span>
        <div className="live-hero-row">
          <strong>{round?.title || 'ROUND 3'}</strong>
          <span className="live-pill small"><i /> LIVE</span>
        </div>
        <span className="live-hero-sub">
          {round?.class_name ? `Class ${round.class_name}` : 'General Knowledge Blitz'}
        </span>

        <div className="live-meta">
          <span><Clock3 size={13} /> Time Left <strong>02:45</strong></span>
          <span><CheckCircle2 size={13} /> Questions <strong>15 / 20</strong></span>
          <span><Users size={13} /> Classes <strong>12</strong></span>
        </div>
      </div>

      <div className="live-activity">
        <div className="live-activity-head">
          <span>LIVE ACTIVITY FEED</span>
          <button className="link-btn small">View All</button>
        </div>

        <ul>
          {activity.map((a) => (
            <li key={a.id} className={a.ok ? 'ok' : 'bad'}>
              {a.ok ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
              <div>
                <strong>{a.who}</strong> {a.what}
              </div>
              <span className="live-activity-delta">{a.delta} pts</span>
              <span className="live-activity-when">{a.when}</span>
            </li>
          ))}
        </ul>
      </div>

      <button className="live-cta" onClick={() => go('master')}>
        View Live Dashboard <ArrowRight size={15} />
      </button>
    </Panel>
  )
}
