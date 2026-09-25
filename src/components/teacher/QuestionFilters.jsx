import { Settings2 } from 'lucide-react'
import { CLASSES, TERMS, WEEKS } from '../../constants/quiz'
import Panel from '../ui/Panel'
import PanelTitle from '../ui/PanelTitle'

export default function QuestionFilters({ filters, setFilters, assignedSubjects, questionCount, publishedCount }) {
  return (
    <Panel as="aside" className="filter-panel">
      <PanelTitle left="QUESTION POOL" right={null} />
      <Settings2 size={17} style={{ marginTop: -42, float: 'right' }} />

      <label>
        Subject
        <select value={filters.subjectId}
          onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}>
          {assignedSubjects.map((s) => (
            <option value={s.id} key={s.id}>{s.name}</option>
          ))}
        </select>
      </label>

      <label>
        Class
        <select value={filters.className}
          onChange={(e) => setFilters({ ...filters, className: e.target.value })}>
          {CLASSES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>

      <label>
        Term
        <select value={filters.termName}
          onChange={(e) => setFilters({ ...filters, termName: e.target.value })}>
          {TERMS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>

      <label>
        Week
        <select value={filters.weekNumber}
          onChange={(e) => setFilters({ ...filters, weekNumber: Number(e.target.value) })}>
          {WEEKS.map((w) => <option value={w} key={w}>Week {w}</option>)}
        </select>
      </label>

      <div className="pool-summary">
        <strong>{questionCount}</strong>
        <span>questions in this pool</span>
        <small>{publishedCount} published</small>
      </div>
    </Panel>
  )
}
