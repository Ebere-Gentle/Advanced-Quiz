import { ArrowRight, Clock3, MonitorPlay } from 'lucide-react'
import { formatTime } from '../../../lib/utils'

export default function QuestionStage({
  round, questions, currentQuestion, timeLeft, busy,
  sessionStatus, onToggleRound, onNext,
}) {
  const isLive = round?.status === 'live'

  return (
    <div className="question-stage">
      <div className="stage-meta">
        <span>QUESTION {round?.current_question_number || 1} / {questions.length}</span>
        <span>{currentQuestion?.correct_answer ? 'LIVE' : ''}</span>
      </div>

      {currentQuestion ? (
        <>
          <h2>{currentQuestion.question_text}</h2>
          <div className="stage-options">
            <span><b>A</b> {currentQuestion.option_a}</span>
            <span><b>B</b> {currentQuestion.option_b}</span>
            <span><b>C</b> {currentQuestion.option_c}</span>
            <span><b>D</b> {currentQuestion.option_d}</span>
          </div>
        </>
      ) : (
        <div className="stage-empty">
          <MonitorPlay size={34} />
          <h2>No questions have been attached to this round.</h2>
          <p>Return to the session builder and select published questions.</p>
        </div>
      )}

      <div className="stage-bottom">
        <div className="timer-block">
          <Clock3 size={17} />
          <span>{formatTime(timeLeft)}</span>
        </div>

        <div className="stage-actions">
          {sessionStatus !== 'completed' && (
            <>
              <button className="secondary-btn" disabled={busy} onClick={onToggleRound}>
                {isLive ? 'Pause round' : 'Start round'}
              </button>
              <button className="primary-btn" disabled={busy || !currentQuestion} onClick={onNext}>
                Next question <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
