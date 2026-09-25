import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp } from 'lucide-react'
import { initials } from '../../lib/utils'
import { SkeletonRow } from '../ui/Skeleton'

const PAGE = 10

export default function LeaderboardTable({ rows, loading, subjects }) {
  const [sort, setSort] = useState({ key: 'total', dir: 'desc' })
  const [open, setOpen] = useState(null)
  const [page, setPage] = useState(1)

  const subjectName = (id) => subjects.find((s) => s.id === id)?.name || 'Subject'

  const sorted = useMemo(() => {
    const list = [...rows]
    list.sort((a, b) => {
      const av = a[sort.key]
      const bv = b[sort.key]
      const cmp = typeof av === 'string' ? av.localeCompare(bv) : (av || 0) - (bv || 0)
      return sort.dir === 'asc' ? cmp : -cmp
    })
    return list
  }, [rows, sort])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE))
  const current = sorted.slice((page - 1) * PAGE, page * PAGE)

  function toggleSort(key) {
    setSort((s) => ({ key, dir: s.key === key && s.dir === 'desc' ? 'asc' : 'desc' }))
  }

  function SortIcon({ k }) {
    if (sort.key !== k) return <ChevronDown size={12} className="dim" />
    return sort.dir === 'desc' ? <ArrowDown size={12} /> : <ArrowUp size={12} />
  }

  if (loading) {
    return (
      <div className="lb-table">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonRow key={i} columns={5} />
        ))}
      </div>
    )
  }

  if (!rows.length) {
    return (
      <div className="lb-empty">
        <strong>No results yet</strong>
        <span>Try adjusting filters or wait for the next competition.</span>
      </div>
    )
  }

  return (
    <>
      <div className="lb-table" role="table">
        <div className="lb-thead" role="row">
          <button onClick={() => toggleSort('name')}>Student <SortIcon k="name" /></button>
          <button onClick={() => toggleSort('class_name')}>Class <SortIcon k="class_name" /></button>
          <button onClick={() => toggleSort('sessions')}>Sessions <SortIcon k="sessions" /></button>
          <span>Weeks</span>
          <button onClick={() => toggleSort('total')}>Points <SortIcon k="total" /></button>
        </div>

        {current.map((r, i) => {
          const globalRank = (page - 1) * PAGE + i + 1
          const expanded = open === r.name + r.class_name

          return (
            <div key={r.name + r.class_name} className="lb-row-group">
              <div className="lb-row" role="row" onClick={() => setOpen(expanded ? null : r.name + r.class_name)}>
                <div className="lb-student">
                  <span className="lb-rank">{globalRank}</span>
                  <span className="person-avatar">{initials(r.name)}</span>
                  <div>
                    <strong>{r.name}</strong>
                    {r.admission_number && <small>#{r.admission_number}</small>}
                  </div>
                </div>

                <span className="lb-class">{r.class_name}</span>
                <span className="lb-sessions">{r.sessions}</span>

                <span className="lb-weeks">
                  {r.weeks.slice(0, 3).map((w) => <em key={w}>W{w}</em>)}
                  {r.weeks.length > 3 && <em>+{r.weeks.length - 3}</em>}
                </span>

                <div className="lb-points">
                  <strong>{r.total}</strong>
                  <span className="lb-trend up">
                    <ChevronUp size={11} /> {Math.max(1, Math.round(r.total / r.sessions))} / session
                  </span>
                </div>
              </div>

              {expanded && (
                <div className="lb-detail">
                  <div>
                    <span className="footer-title">Weeks participated</span>
                    <div className="lb-chips">
                      {r.weeks.map((w) => <em key={w}>Week {w}</em>)}
                    </div>
                  </div>

                  <div>
                    <span className="footer-title">Subjects</span>
                    <div className="lb-chips">
                      {r.subjects.length === 0
                        ? <em className="dim">Not recorded</em>
                        : r.subjects.map((id) => <em key={id}>{subjectName(id)}</em>)}
                    </div>
                  </div>

                  <div>
                    <span className="footer-title">Last competition</span>
                    <div className="lb-chips">
                      <em>{r.last || '—'}</em>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {totalPages > 1 && (
        <div className="lb-pager">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </>
  )
}
