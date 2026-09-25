import { Users } from 'lucide-react'
import { initials } from '../../../lib/utils'
import Panel from '../../ui/Panel'
import PanelTitle from '../../ui/PanelTitle'

export default function Leaderboard({ participants, joinCode }) {
  return (
    <Panel as="aside" className="leaderboard">
      <PanelTitle left="LIVE SCOREBOARD" right={`${participants.length} PLAYERS`} />

      {participants.length === 0 ? (
        <div className="leaderboard-empty">
          <Users size={24} />
          <strong>Waiting for students</strong>
          <span>Display code <b>{joinCode}</b></span>
        </div>
      ) : (
        participants.map((p, i) => (
          <div className="contestant" key={p.id}>
            <span className="rank">{i + 1}</span>
            <span className="person-avatar">{initials(p.display_name)}</span>
            <div>
              <strong>{p.display_name}</strong>
              <small>{p.connected ? 'Connected' : 'Away'}</small>
            </div>
            <b>{Number(p.total_score || 0)}</b>
          </div>
        ))
      )}
    </Panel>
  )
}
