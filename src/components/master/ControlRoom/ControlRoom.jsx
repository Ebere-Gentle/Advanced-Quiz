import { Radio } from 'lucide-react'
import { useControlRoom } from '../../../hooks/useControlRoom'
import Eyebrow from '../../ui/Eyebrow'
import InlineLoading from '../../ui/InlineLoading'
import Panel from '../../ui/Panel'
import RoundTabs from './RoundTabs'
import QuestionStage from './QuestionStage'
import Leaderboard from './Leaderboard'

export default function ControlRoom({ session, onBack }) {
  const room = useControlRoom(session)

  if (room.loading) {
    return <InlineLoading large spinnerSize="large" label="Loading control room…" />
  }

  const { currentSession, round, questions, participants,
    busy, timeLeft, currentQuestion } = room

  return (
    <>
      <div className="page-heading">
        <div>
          <button className="back-button" onClick={onBack}>← Back to sessions</button>
          <Eyebrow muted>LIVE CONTROL ROOM</Eyebrow>
          <h1>{currentSession.title}</h1>
          <p>
            {currentSession.class_name} · {currentSession.term_name} · Week {currentSession.week_number}
          </p>
        </div>

        <div className="control-heading-actions">
          <span className="join-code-large">{currentSession.join_code}</span>
          <span className="live-pill"><i />{currentSession.status}</span>
        </div>
      </div>

      <div className="control-grid">
        <Panel className="control-main">
          <div className="control-bar">
            <span>
              <span className="live-pill"><i />{round?.status || 'READY'}</span>
            </span>
            <span>
              {participants.length} participant{participants.length === 1 ? '' : 's'} online
            </span>
          </div>

          <RoundTabs round={round} />

          <QuestionStage
            round={round}
            questions={questions}
            currentQuestion={currentQuestion}
            timeLeft={timeLeft}
            busy={busy}
            sessionStatus={currentSession.status}
            onToggleRound={() =>
              room.updateRoundStatus(round?.status === 'live' ? 'paused' : 'live')}
            onNext={() => room.changeQuestion('next')}
          />

          <div className="control-footer-actions">
            <button className="secondary-btn" disabled={busy}
              onClick={() =>
                room.updateSessionStatus(currentSession.status === 'live' ? 'paused' : 'live')}>
              <Radio size={15} />
              {currentSession.status === 'live' ? 'Pause session' : 'Open session'}
            </button>
            <button className="danger-btn" disabled={busy}
              onClick={() => room.updateSessionStatus('completed')}>
              End competition
            </button>
          </div>
        </Panel>

        <Leaderboard participants={participants} joinCode={currentSession.join_code} />
      </div>
    </>
  )
}
