import { ChevronRight } from 'lucide-react'
import Panel from '../ui/Panel'
import PanelTitle from '../ui/PanelTitle'

export default function SessionHistory({ sessions, onOpen }) {
  return (
    <Panel className="session-history">
      <PanelTitle left="RECENT SESSIONS" right={sessions.length} />

      {sessions.length === 0 ? (
        <div className="table-empty">
          No quiz sessions have been created yet.
        </div>
      ) : (
        <div className="session-list">
          {sessions.map((s) => (
            <button className="session-row" key={s.id} onClick={() => onOpen(s)}>
              <span className="session-status">{s.status}</span>
              <div>
                <strong>{s.title}</strong>
                <small>{s.class_name} · {s.term_name} · Week {s.week_number}</small>
              </div>
              <span className="session-code">{s.join_code}</span>
              <ChevronRight size={17} />
            </button>
          ))}
        </div>
      )}
    </Panel>
  )
}
