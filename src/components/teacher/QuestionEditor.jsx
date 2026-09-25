import { ArrowRight } from 'lucide-react'
import { DIFFICULTIES } from '../../constants/quiz'
import { capitalize } from '../../lib/utils'
import Panel from '../ui/Panel'
import PanelTitle from '../ui/PanelTitle'

const LETTERS = ['a', 'b', 'c', 'd']

export default function QuestionEditor({
  draft, setDraft, editingId, saving, error, message,
  onSave, onReset,
}) {
  function update(key, value) { setDraft({ ...draft, [key]: value }) }

  return (
    <Panel className="question-editor">
      <PanelTitle
        left={editingId ? 'EDIT QUESTION' : 'NEW QUESTION'}
        right={<span className="draft-tag">{editingId ? 'EDITING' : 'DRAFT'}</span>}
      />

      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      <label>
        Question
        <textarea rows="4" value={draft.question_text}
          onChange={(e) => update('question_text', e.target.value)}
          placeholder="Type the question students will see..." />
      </label>

      <div className="option-grid">
        {LETTERS.map((l) => (
          <label key={l}>
            Option {l.toUpperCase()}
            <input value={draft[`option_${l}`]}
              onChange={(e) => update(`option_${l}`, e.target.value)}
              placeholder={`Enter option ${l.toUpperCase()}`} />
          </label>
        ))}
      </div>

      <div className="editor-row">
        <label>
          Correct answer
          <select value={draft.correct_answer}
            onChange={(e) => update('correct_answer', e.target.value)}>
            {['A', 'B', 'C', 'D'].map((x) => <option key={x}>{x}</option>)}
          </select>
        </label>

        <label>
          Points
          <input type="number" min="0" value={draft.points}
            onChange={(e) => update('points', e.target.value)} />
        </label>

        <label>
          Difficulty
          <select value={draft.difficulty}
            onChange={(e) => update('difficulty', e.target.value)}>
            {DIFFICULTIES.map((d) => <option key={d}>{capitalize(d)}</option>)}
          </select>
        </label>
      </div>

      <label>
        Topic
        <input value={draft.topic}
          onChange={(e) => update('topic', e.target.value)}
          placeholder="e.g. Mechanics" />
      </label>

      <label>
        Explanation
        <textarea rows="3" value={draft.explanation}
          onChange={(e) => update('explanation', e.target.value)}
          placeholder="Optional explanation..." />
      </label>

      <div className="form-actions">
        {editingId && (
          <button className="secondary-btn" onClick={onReset}>Cancel</button>
        )}
        <button className="secondary-btn" disabled={saving}
          onClick={() => onSave('draft')}>Save draft</button>
        <button className="primary-btn" disabled={saving}
          onClick={() => onSave('submitted')}>
          {saving ? 'Saving…' : 'Submit for approval'}
          <ArrowRight size={16} />
        </button>
      </div>
    </Panel>
  )
}
