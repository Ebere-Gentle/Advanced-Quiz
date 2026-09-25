import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { CLASSES, MODES, TERMS, TIMER_OPTIONS, WEEKS } from '../../constants/quiz'
import { generateJoinCode } from '../../lib/utils'
import Panel from '../ui/Panel'
import PanelTitle from '../ui/PanelTitle'
import QuestionSelector from './QuestionSelector'

export default function SessionBuilder({ subjects, onCreate }) {
  const [filters, setFilters] = useState({
    className: 'SS 2',
    termName: 'First Term',
    weekNumber: 1,
    subjectId: subjects[0]?.id || '',
  })
  const [questions, setQuestions] = useState([])
  const [selected, setSelected] = useState([])
  const [mode, setMode] = useState('buzzer')
  const [timerSeconds, setTimerSeconds] = useState(30)
  const [title, setTitle] = useState('Thursday Challenge')
  const [roundName, setRoundName] = useState('Round 1')
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!filters.subjectId && subjects.length) {
      setFilters((c) => ({ ...c, subjectId: subjects[0].id }))
    }
  }, [subjects, filters.subjectId])

  useEffect(() => {
    if (!filters.subjectId) return
    let cancelled = false
    ;(async () => {
      setLoadingQuestions(true); setError(''); setSelected([])
      const { data, error: queryError } = await supabase
        .from('quiz_question_bank')
        .select('id, question_text, points, difficulty, status')
        .eq('subject_id', filters.subjectId)
        .eq('class_name', filters.className)
        .eq('term_name', filters.termName)
        .eq('week_number', Number(filters.weekNumber))
        .in('status', ['approved', 'published'])
        .order('created_at', { ascending: true })
      if (!cancelled) {
        if (queryError) setError(queryError.message)
        else setQuestions(data || [])
        setLoadingQuestions(false)
      }
    })()
    return () => { cancelled = true }
  }, [filters.subjectId, filters.className, filters.termName, filters.weekNumber])

  function toggleQuestion(id) {
    setSelected((cur) => cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id])
  }

  async function submit(event) {
    event.preventDefault(); setError('')
    if (!filters.subjectId) return setError('Select a subject.')
    if (!selected.length) return setError('Select at least one published question.')

    setSaving(true)
    try {
      await onCreate({
        title: title.trim() || 'Thursday Challenge',
        roundName: roundName.trim() || 'Round 1',
        className: filters.className,
        termName: filters.termName,
        weekNumber: Number(filters.weekNumber),
        subjectId: filters.subjectId,
        mode, timerSeconds: Number(timerSeconds),
        questionIds: selected,
        points: 10,
        joinCode: generateJoinCode(),
      })
    } catch (e) { setError(e.message) }
    setSaving(false)
  }

  return (
    <form className="setup-grid" onSubmit={submit}>
      <Panel className="setup-main">
        <PanelTitle left="SESSION DETAILS" right="STAGE 1" />

        {error && <div className="error-box">{error}</div>}

        <div className="field-grid">
          <label>Class
            <select value={filters.className}
              onChange={(e) => setFilters({ ...filters, className: e.target.value })}>
              {CLASSES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Subject
            <select value={filters.subjectId}
              onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}>
              {subjects.map((s) => <option value={s.id} key={s.id}>{s.name}</option>)}
            </select>
          </label>
          <label>Term
            <select value={filters.termName}
              onChange={(e) => setFilters({ ...filters, termName: e.target.value })}>
              {TERMS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <label>Week
            <select value={filters.weekNumber}
              onChange={(e) => setFilters({ ...filters, weekNumber: Number(e.target.value) })}>
              {WEEKS.map((w) => <option value={w} key={w}>Week {w}</option>)}
            </select>
          </label>
        </div>

        <div className="field-grid">
          <label>Session title
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>First round name
            <input value={roundName} onChange={(e) => setRoundName(e.target.value)} />
          </label>
        </div>

        <div className="panel-subheading">
          <span>GAME MODE</span>
          <small>Stage 1 foundation</small>
        </div>

        <div className="mode-picker">
          {MODES.map((m) => {
            const Icon = m.icon
            return (
              <button type="button" key={m.value}
                className={mode === m.value ? 'selected' : ''}
                onClick={() => setMode(m.value)}>
                <Icon size={20} />
                <strong>{m.name}</strong>
                <small>{m.description}</small>
              </button>
            )
          })}
        </div>

        <div className="timer-picker">
          <span>QUESTION TIMER</span>
          <div>
            {TIMER_OPTIONS.map((s) => (
              <button type="button" key={s}
                className={timerSeconds === s ? 'selected' : ''}
                onClick={() => setTimerSeconds(s)}>{s}s</button>
            ))}
          </div>
        </div>

        <button className="primary-btn wide" type="submit" disabled={saving}>
          {saving ? 'Creating session…' : 'Create session'}
          <ArrowRight size={17} />
        </button>
      </Panel>

      <QuestionSelector
        questions={questions}
        selected={selected}
        loading={loadingQuestions}
        onToggle={toggleQuestion}
      />
    </form>
  )
}
