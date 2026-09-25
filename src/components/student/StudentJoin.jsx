import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, Radio, ShieldCheck } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { CLASSES } from '../../constants/quiz'
import Eyebrow from '../ui/Eyebrow'

export default function StudentJoin({ go }) {
  const [code, setCode] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [admissionNumber, setAdmissionNumber] = useState('')
  const [className, setClassName] = useState('SS 2')
  const [participant, setParticipant] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!participant) return undefined

    const channel = supabase
      .channel(`student-participant-${participant.id}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'quiz_participants',
          filter: `id=eq.${participant.id}` },
        (payload) => payload.new && setParticipant(payload.new))
      .subscribe()

    const heartbeat = window.setInterval(async () => {
      await supabase.rpc('quiz_update_presence', { p_participant_id: participant.id })
    }, 15000)

    return () => {
      window.clearInterval(heartbeat)
      supabase.removeChannel(channel)
    }
  }, [participant?.id])

  async function join(event) {
    event.preventDefault()
    setLoading(true); setError('')

    const { data, error: joinError } = await supabase.rpc('quiz_join_session', {
      p_join_code: code.trim().toUpperCase(),
      p_display_name: displayName.trim(),
      p_class_name: className,
      p_admission_number: admissionNumber.trim() || null,
    })

    if (joinError) setError(joinError.message)
    else setParticipant(data)

    setLoading(false)
  }

  if (participant) {
    return (
      <main className="join-page">
        <div className="join-card lobby-card">
          <div className="join-icon"><CheckCircle2 size={25} /></div>
          <Eyebrow muted>COMPETITOR LOBBY</Eyebrow>
          <h1>You are in.</h1>
          <p>
            Welcome, <strong>{participant.display_name}</strong>. Stay on this
            screen until the Quiz Master starts the competition.
          </p>

          <div className="lobby-code">
            <span>JOIN CODE</span>
            <strong>{code.toUpperCase()}</strong>
          </div>

          <div className="lobby-status">
            <i /> Connected to live competition
          </div>

          <div className="join-note">
            <ShieldCheck size={15} />
            Your authenticated account is attached to this participant.
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="join-page">
      <form className="join-card" onSubmit={join}>
        <div className="join-icon"><Radio size={25} /></div>
        <Eyebrow muted>STUDENT ENTRY</Eyebrow>
        <h1>Join the competition.</h1>
        <p>
          Enter the code shown on the classroom screen. You must be
          authenticated to participate.
        </p>

        <label>Competition code
          <input autoFocus value={code} maxLength="10" required
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="AQ-4821" />
        </label>

        <label>Your name
          <input value={displayName} required
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Student name" />
        </label>

        <label>Admission number
          <input value={admissionNumber}
            onChange={(e) => setAdmissionNumber(e.target.value)}
            placeholder="Optional" />
        </label>

        <label>Class
          <select value={className} onChange={(e) => setClassName(e.target.value)}>
            {CLASSES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>

        {error && <div className="error-box">{error}</div>}

        <button className="primary-btn wide" disabled={loading}>
          {loading ? 'Joining…' : 'Enter lobby'}
          {!loading && <ArrowRight size={17} />}
        </button>

        <button type="button" className="text-button" onClick={() => go('home')}>
          Return to overview
        </button>

        <div className="join-note">
          <ShieldCheck size={15} />
          Your authenticated account is your competition identity.
        </div>
      </form>
    </main>
  )
}
