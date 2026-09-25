import { useMemo, useState } from 'react'
import { Award, RefreshCw, TrendingUp, Trophy, Users } from 'lucide-react'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import Eyebrow from '../ui/Eyebrow'
import Podium from './Podium'
import LeaderboardFilters from './LeaderboardFilters'
import LeaderboardTable from './LeaderboardTable'

export default function LeaderboardPage() {
  const [filters, setFilters] = useState({
    className: 'all',
    termName: 'all',
    week: 'all',
    subjectId: 'all',
  })
  const [search, setSearch] = useState('')

  const { rows, subjects, loading, reload, stats } = useLeaderboard(filters)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.admission_number || '').toLowerCase().includes(q),
    )
  }, [rows, search])

  return (
    <main className="workspace lb-page">
      <div className="page-heading">
        <div>
          <Eyebrow muted>HALL OF FAME</Eyebrow>
          <h1>Student Leaderboard</h1>
          <p>Track weekly competition results by class, subject and term.</p>
        </div>

        <button className="secondary-btn" onClick={reload}>
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="lb-stats">
        <div className="stat-card">
          <Trophy size={18} />
          <div>
            <strong>{stats.top ? stats.top.name : '—'}</strong>
            <span>Top performer</span>
          </div>
        </div>
        <div className="stat-card">
          <Users size={18} />
          <div>
            <strong>{stats.count}</strong>
            <span>Students ranked</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={18} />
          <div>
            <strong>{stats.total}</strong>
            <span>Total points</span>
          </div>
        </div>
        <div className="stat-card">
          <Award size={18} />
          <div>
            <strong>{stats.avg}</strong>
            <span>Average points</span>
          </div>
        </div>
      </div>

      <LeaderboardFilters
        filters={filters}
        setFilters={setFilters}
        subjects={subjects}
        search={search}
        setSearch={setSearch}
      />

      <Podium rows={filtered.slice(0, 3)} />

      <div className="panel lb-panel">
        <LeaderboardTable rows={filtered} loading={loading} subjects={subjects} />
      </div>
    </main>
  )
}
