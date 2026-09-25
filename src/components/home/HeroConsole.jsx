import { Clock3, Sparkles } from 'lucide-react'

export default function HeroConsole({ staff, assignedSubjects }) {
  const subjectsText =
    assignedSubjects.length === 0
      ? 'No subjects yet'
      : `${assignedSubjects.length} subject${assignedSubjects.length === 1 ? '' : 's'}`

  const firstSubject = assignedSubjects[0]?.name

  return (
    <div className="hero-console">
      <div className="console-top">
        <span><i /> LIVE CONTROL ROOM</span>
        <span>ADVANCED QUIZ</span>
      </div>

      <div className="console-title">
        <div>
          <small>AUTHENTICATED STAFF SESSION</small>
          <h3>{staff.full_name}</h3>
        </div>
        <span className="status-pill">READY</span>
      </div>

      <div className="console-question">
        <div className="question-label">STAGE 1 <span>• LIVE FOUNDATION</span></div>
        <h4>Prepare questions, create a session and bring the classroom online.</h4>

        <div className="answer-grid">
          <span><b>01</b> Question bank</span>
          <span><b>02</b> Session control</span>
          <span><b>03</b> Live lobby</span>
          <span><b>04</b> Leaderboard</span>
        </div>
      </div>

      <div className="console-footer">
        <span><Clock3 size={14} /> Realtime enabled</span>

        {assignedSubjects.length === 0 ? (
          <strong className="console-empty">
            <Sparkles size={13} /> Awaiting subject assignment
          </strong>
        ) : (
          <strong title={firstSubject}>
            {subjectsText}
          </strong>
        )}
      </div>
    </div>
  )
}
