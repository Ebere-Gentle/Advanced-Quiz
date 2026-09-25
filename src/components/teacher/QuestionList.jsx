import { capitalize } from '../../lib/utils'
import Panel from '../ui/Panel'
import PanelTitle from '../ui/PanelTitle'
import InlineLoading from '../ui/InlineLoading'

export default function QuestionList({ questions, loading, onEdit, onDelete }) {
  return (
    <Panel className="question-list-panel">
      <PanelTitle left="QUESTION LIST" right={`${questions.length} TOTAL`} />

      {loading ? (
        <InlineLoading label="Loading questions…" />
      ) : questions.length === 0 ? (
        <div className="table-empty">
          No questions exist for the selected subject, class, term and week.
        </div>
      ) : (
        <div className="question-list">
          {questions.map((q, i) => (
            <article className="question-row" key={q.id}>
              <span className="question-number">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="question-content">
                <strong>{q.question_text}</strong>
                <small>
                  {q.points} pts · {capitalize(q.difficulty)} · Answer {q.correct_answer}
                </small>
              </div>

              <span className={`status-badge ${q.status}`}>{q.status}</span>

              <button className="row-action" onClick={() => onEdit(q)}>Edit</button>
              <button className="row-action danger" onClick={() => onDelete(q.id)}>Delete</button>
            </article>
          ))}
        </div>
      )}
    </Panel>
  )
}
