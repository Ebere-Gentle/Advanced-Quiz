import { capitalize } from '../../lib/utils'
import Panel from '../ui/Panel'
import PanelTitle from '../ui/PanelTitle'
import InlineLoading from '../ui/InlineLoading'

export default function QuestionSelector({ questions, selected, loading, onToggle }) {
  return (
    <Panel as="aside" className="question-selector">
      <PanelTitle left="PUBLISHED QUESTIONS" right={`${selected.length} SELECTED`} />

      {loading ? (
        <InlineLoading label="Loading…" />
      ) : questions.length === 0 ? (
        <div className="small-empty">
          No approved/published questions match the selected filters.
        </div>
      ) : (
        <div className="selection-list">
          {questions.map((q, i) => (
            <label className="question-check" key={q.id}>
              <input type="checkbox"
                checked={selected.includes(q.id)}
                onChange={() => onToggle(q.id)} />
              <span>
                <strong>
                  {String(i + 1).padStart(2, '0')}. {q.question_text}
                </strong>
                <small>{q.points} pts · {capitalize(q.difficulty)}</small>
              </span>
            </label>
          ))}
        </div>
      )}
    </Panel>
  )
}
