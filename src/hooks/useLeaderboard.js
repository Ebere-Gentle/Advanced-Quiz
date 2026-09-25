import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useLeaderboard({ week = 'all', className = 'all', subjectId = 'all', termName = 'all' } = {}) {
  const [rows, setRows] = useState([])
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSubjects = useCallback(async () => {
    const { data } = await supabase
      .from('quiz_subjects')
      .select('id, name')
      .eq('is_active', true)
      .order('name')
    setSubjects(data || [])
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')

    let query = supabase
      .from('quiz_participants')
      .select(`
        id,
        display_name,
        admission_number,
        class_name,
        total_score,
        joined_at,
        session_id,
        quiz_sessions!inner (
          id,
          title,
          class_name,
          term_name,
          week_number,
          session_date,
          settings
        )
      `)

    if (className !== 'all') query = query.eq('class_name', className)
    if (week !== 'all')      query = query.eq('quiz_sessions.week_number', Number(week))
    if (termName !== 'all')  query = query.eq('quiz_sessions.term_name', termName)
    if (subjectId !== 'all') query = query.eq('quiz_sessions.settings->>subject_id', subjectId)

    const { data, error: qErr } = await query.order('total_score', { ascending: false })

    if (qErr) {
      setError(qErr.message)
      setRows([])
    } else {
      const map = new Map()
      for (const p of data || []) {
        const key = `${(p.display_name || '').toLowerCase()}::${p.class_name}`
        const session = p.quiz_sessions || {}
        const entry = map.get(key) || {
          name: p.display_name,
          class_name: p.class_name,
          admission_number: p.admission_number || '',
          total: 0,
          sessions: 0,
          weeks: new Set(),
          subjects: new Set(),
          last: session.session_date || null,
        }
        entry.total += Number(p.total_score || 0)
        entry.sessions += 1
        if (session.week_number) entry.weeks.add(session.week_number)
        if (session.settings?.subject_id) entry.subjects.add(session.settings.subject_id)
        if (session.session_date && (!entry.last || session.session_date > entry.last)) {
          entry.last = session.session_date
        }
        map.set(key, entry)
      }

      const list = Array.from(map.values())
        .map((e) => ({
          ...e,
          weeks: Array.from(e.weeks).sort((a, b) => a - b),
          subjects: Array.from(e.subjects),
        }))
        .sort((a, b) => b.total - a.total)

      setRows(list)
    }

    setLoading(false)
  }, [week, className, subjectId, termName])

  useEffect(() => { loadSubjects() }, [loadSubjects])
  useEffect(() => { load() }, [load])

  const stats = useMemo(() => {
    const total = rows.reduce((sum, r) => sum + r.total, 0)
    const top = rows[0] || null
    const avg = rows.length ? Math.round(total / rows.length) : 0
    return { total, top, avg, count: rows.length }
  }, [rows])

  return { rows, subjects, loading, error, reload: load, stats }
}
