import { Search } from 'lucide-react'
import { CLASSES, TERMS, WEEKS } from '../../constants/quiz'

export default function LeaderboardFilters({ filters, setFilters, subjects, search, setSearch }) {
  return (
    <div className="lb-filters">
      <label className="lb-search">
        <Search size={15} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search student by name or admission number…"
        />
      </label>

      <label>
        Class
        <select value={filters.className} onChange={(e) => setFilters({ ...filters, className: e.target.value })}>
          <option value="all">All classes</option>
          {CLASSES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </label>

      <label>
        Term
        <select value={filters.termName} onChange={(e) => setFilters({ ...filters, termName: e.target.value })}>
          <option value="all">All terms</option>
          {TERMS.map((t) => <option key={t}>{t}</option>)}
        </select>
      </label>

      <label>
        Week
        <select value={filters.week} onChange={(e) => setFilters({ ...filters, week: e.target.value })}>
          <option value="all">All weeks</option>
          {WEEKS.map((w) => <option value={w} key={w}>Week {w}</option>)}
        </select>
      </label>

      <label>
        Subject
        <select value={filters.subjectId} onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}>
          <option value="all">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
