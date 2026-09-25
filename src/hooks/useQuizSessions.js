import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useQuizSessions(staff) {
  const [subjects, setSubjects] = useState([])
  const [sessions, setSessions] = useState([])

  async function loadSubjects() {
    const { data } = await supabase
      .from('quiz_subjects')
      .select('id, name, is_active')
      .eq('is_active', true)
      .order('name')
    setSubjects(data || [])
  }

  async function loadSessions() {
    const { data } = await supabase
      .from('quiz_sessions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    setSessions(data || [])
  }

  async function createSession(payload) {
    const { data: sessionData, error: sessionError } = await supabase
      .from('quiz_sessions')
      .insert({
        title: payload.title,
        class_name: payload.className,
        term_name: payload.termName,
        week_number: payload.weekNumber,
        session_date: new Date().toISOString().slice(0, 10),
        join_code: payload.joinCode,
        status: 'lobby',
        quiz_master_id: staff.user_id,
        settings: {
          timer_seconds: payload.timerSeconds,
          subject_id: payload.subjectId,
        },
      })
      .select()
      .single()

    if (sessionError) throw sessionError

    const { data: roundData, error: roundError } = await supabase
      .from('quiz_rounds')
      .insert({
        session_id: sessionData.id,
        round_number: 1,
        name: payload.roundName,
        mode: payload.mode,
        status: 'ready',
        settings: {
          timer_seconds: payload.timerSeconds,
          subject_id: payload.subjectId,
        },
        current_question_number: 1,
      })
      .select()
      .single()

    if (roundError) {
      await supabase.from('quiz_sessions').delete().eq('id', sessionData.id)
      throw roundError
    }

    if (payload.questionIds.length) {
      const rows = payload.questionIds.map((qid, i) => ({
        round_id: roundData.id,
        question_id: qid,
        question_order: i + 1,
        points: payload.points,
      }))
      const { error: questionError } = await supabase
        .from('quiz_round_questions').insert(rows)
      if (questionError) throw questionError
    }

    await loadSessions()
    return sessionData
  }

  useEffect(() => {
    loadSubjects()
    loadSessions()
  }, [])

  return { subjects, sessions, loadSessions, createSession }
}
