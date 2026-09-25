import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const EMPTY_DRAFT = {
  question_text: '', option_a: '', option_b: '', option_c: '', option_d: '',
  correct_answer: 'A', explanation: '', points: 10, difficulty: 'medium', topic: '',
}

export function useQuestionBank(filters) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState(EMPTY_DRAFT)

  const loadQuestions = useCallback(async () => {
    if (!filters.subjectId) {
      setQuestions([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    const { data, error: queryError } = await supabase
      .from('quiz_question_bank')
      .select(`
        id, subject_id, class_name, term_name, week_number,
        question_text, option_a, option_b, option_c, option_d,
        correct_answer, explanation, points, difficulty, topic,
        status, created_by, approved_at, created_at
      `)
      .eq('subject_id', filters.subjectId)
      .eq('class_name', filters.className)
      .eq('term_name', filters.termName)
      .eq('week_number', Number(filters.weekNumber))
      .order('created_at', { ascending: false })

    if (queryError) setError(queryError.message)
    else setQuestions(data || [])
    setLoading(false)
  }, [filters.subjectId, filters.className, filters.termName, filters.weekNumber])

  useEffect(() => { loadQuestions() }, [loadQuestions])

  function resetDraft() {
    setEditingId(null)
    setDraft(EMPTY_DRAFT)
  }

  function editQuestion(q) {
    setEditingId(q.id)
    setDraft({
      question_text: q.question_text,
      option_a: q.option_a, option_b: q.option_b,
      option_c: q.option_c, option_d: q.option_d,
      correct_answer: q.correct_answer,
      explanation: q.explanation || '',
      points: q.points,
      difficulty: q.difficulty,
      topic: q.topic || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function saveQuestion(status) {
    setSaving(true)
    setError('')
    setMessage('')

    if (!filters.subjectId) {
      setError('Select a subject first.'); setSaving(false); return
    }

    const payload = {
      subject_id: filters.subjectId,
      class_name: filters.className,
      term_name: filters.termName,
      week_number: Number(filters.weekNumber),
      question_text: draft.question_text.trim(),
      option_a: draft.option_a.trim(),
      option_b: draft.option_b.trim(),
      option_c: draft.option_c.trim(),
      option_d: draft.option_d.trim(),
      correct_answer: draft.correct_answer,
      explanation: draft.explanation.trim() || null,
      points: Number(draft.points),
      difficulty: draft.difficulty,
      topic: draft.topic.trim() || null,
      status,
    }

    if (!payload.question_text || !payload.option_a || !payload.option_b ||
        !payload.option_c || !payload.option_d) {
      setError('Complete the question and all four options.')
      setSaving(false); return
    }

    let query
    if (editingId) {
      query = supabase.from('quiz_question_bank').update(payload).eq('id', editingId)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      query = supabase.from('quiz_question_bank').insert({ ...payload, created_by: user?.id || null })
    }

    const { error: saveError } = await query
    if (saveError) setError(saveError.message)
    else {
      setMessage(status === 'submitted' ? 'Question submitted for approval.' : 'Question draft saved.')
      resetDraft()
      await loadQuestions()
    }
    setSaving(false)
  }

  async function deleteQuestion(id) {
    if (!window.confirm('Delete this question?')) return
    const { error: deleteError } = await supabase.from('quiz_question_bank').delete().eq('id', id)
    if (deleteError) setError(deleteError.message)
    else { setMessage('Question deleted.'); await loadQuestions() }
  }

  return {
    questions, loading, saving, message, error,
    editingId, draft, setDraft,
    loadQuestions, resetDraft, editQuestion, saveQuestion, deleteQuestion,
    setError, setMessage,
  }
}
