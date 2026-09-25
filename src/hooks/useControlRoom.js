import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export function useControlRoom(session) {
  const [currentSession, setCurrentSession] = useState(session)
  const [round, setRound] = useState(null)
  const [questions, setQuestions] = useState([])
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  const loadRound = useCallback(async () => {
    const { data: rounds } = await supabase
      .from('quiz_rounds')
      .select('*')
      .eq('session_id', session.id)
      .order('round_number', { ascending: true })
      .limit(1)

    const current = rounds?.[0] || null
    setRound(current)

    if (!current) { setQuestions([]); return }

    const { data: rq } = await supabase
      .from('quiz_round_questions')
      .select(`
        id, question_order, points,
        quiz_question_bank (
          id, question_text, option_a, option_b, option_c, option_d,
          correct_answer, explanation
        )
      `)
      .eq('round_id', current.id)
      .order('question_order', { ascending: true })

    setQuestions(rq || [])
    setTimeLeft(Number(current.settings?.timer_seconds) || 30)
  }, [session.id])

  const loadParticipants = useCallback(async () => {
    const { data } = await supabase
      .from('quiz_participants')
      .select('*')
      .eq('session_id', session.id)
      .order('total_score', { ascending: false })
      .order('joined_at', { ascending: true })
    setParticipants(data || [])
  }, [session.id])

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      await Promise.all([loadRound(), loadParticipants()])
      if (mounted) setLoading(false)
    })()

    const channel = supabase
      .channel(`quiz-session-${session.id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'quiz_sessions', filter: `id=eq.${session.id}` },
        (payload) => payload.new && setCurrentSession(payload.new))
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'quiz_rounds', filter: `session_id=eq.${session.id}` },
        () => loadRound())
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'quiz_participants', filter: `session_id=eq.${session.id}` },
        () => loadParticipants())
      .subscribe()

    return () => { mounted = false; supabase.removeChannel(channel) }
  }, [session.id, loadRound, loadParticipants])

  useEffect(() => {
    if (round?.status !== 'live') return undefined
    const id = window.setInterval(
      () => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000)
    return () => window.clearInterval(id)
  }, [round?.status])

  async function updateSessionStatus(status) {
    setBusy(true)
    const { error } = await supabase
      .from('quiz_sessions')
      .update({
        status,
        started_at: status === 'live' ? new Date().toISOString() : currentSession.started_at,
        ended_at: status === 'completed' ? new Date().toISOString() : currentSession.ended_at,
      })
      .eq('id', session.id)
    if (!error) setCurrentSession((c) => ({ ...c, status }))
    setBusy(false)
  }

  async function updateRoundStatus(status) {
    if (!round) return
    setBusy(true)
    const { error } = await supabase
      .from('quiz_rounds')
      .update({
        status,
        started_at: status === 'live' ? new Date().toISOString() : round.started_at,
        ended_at: status === 'completed' ? new Date().toISOString() : round.ended_at,
      })
      .eq('id', round.id)
    if (!error) setRound((r) => ({ ...r, status }))
    setBusy(false)
  }

  async function changeQuestion(direction) {
    if (!round || !questions.length) return
    const current = Number(round.current_question_number || 1)
    const next = direction === 'next'
      ? Math.min(current + 1, questions.length)
      : Math.max(current - 1, 1)

    const { error } = await supabase
      .from('quiz_rounds')
      .update({ current_question_number: next })
      .eq('id', round.id)

    if (!error) {
      setRound((r) => ({ ...r, current_question_number: next }))
      setTimeLeft(Number(round.settings?.timer_seconds) || 30)
    }
  }

  const currentQuestion =
    questions[Math.max(0, Number(round?.current_question_number || 1) - 1)]?.quiz_question_bank

  return {
    currentSession, round, questions, participants, loading, busy, timeLeft,
    currentQuestion, updateSessionStatus, updateRoundStatus, changeQuestion,
  }
}
