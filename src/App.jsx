import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LogOut,
  MonitorPlay,
  Plus,
  Radio,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import { supabase } from './lib/supabase'
import './App.css'

const MODES = [
  {
    value: 'buzzer',
    name: 'Buzzer',
    icon: Zap,
    description: 'Fast-response competition.',
  },
  {
    value: 'spark',
    name: 'Spark',
    icon: Sparkles,
    description: 'Individual timed questions.',
  },
  {
    value: 'olympiad',
    name: 'Olympiad',
    icon: Trophy,
    description: 'Strategic question selection.',
  },
  {
    value: 'duel',
    name: 'Duel',
    icon: Users,
    description: 'Head-to-head questions.',
  },
  {
    value: 'survival',
    name: 'Survival',
    icon: ShieldCheck,
    description: 'Lives and elimination.',
  },
  {
    value: 'rapid_fire',
    name: 'Rapid Fire',
    icon: Radio,
    description: 'Continuous quick questions.',
  },
]

const CLASSES = ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3']

const TERMS = ['First Term', 'Second Term', 'Third Term']

const DIFFICULTIES = ['easy', 'medium', 'hard']

const TIMER_OPTIONS = [10, 15, 20, 30, 45, 60]

function App() {
  const [session, setSession] = useState(null)
  const [staff, setStaff] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    let mounted = true

    async function initialise() {
      if (!supabase) {
        setLoading(false)
        return
      }

      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (!mounted) return

      setSession(currentSession)

      if (currentSession?.user) {
        await loadStaff(currentSession.user.id)
      }

      setLoading(false)
    }

    initialise()

    if (!supabase) return undefined

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession)

      if (nextSession?.user) {
        await loadStaff(nextSession.user.id)
      } else {
        setStaff(null)
      }

      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function loadStaff(userId) {
    const { data, error } = await supabase
      .from('quiz_staff')
      .select(`
        id,
        user_id,
        full_name,
        email,
        role,
        is_active,
        avatar_url,
        quiz_staff_subjects (
          subject_id,
          quiz_subjects (
            id,
            name,
            is_active
          )
        )
      `)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      setAuthError(error.message)
      setStaff(null)
      return
    }

    setStaff(data)
  }

  async function signOut() {
    if (supabase) {
      await supabase.auth.signOut()
    }

    setSession(null)
    setStaff(null)
  }

  if (!supabase) {
    return (
      <div className="setup-screen">
        <div className="setup-card">
          <Zap size={28} />
          <h1>Supabase configuration required</h1>
          <p>
            Add <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> to the project environment.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <span>Loading Advanced Quiz…</span>
      </div>
    )
  }

  if (!session) {
    return <AuthScreen onAuth={setSession} />
  }

  if (!staff) {
    return (
      <div className="setup-screen">
        <div className="setup-card">
          <ShieldCheck size={28} />
          <span className="eyebrow muted">ACCOUNT NOT PROVISIONED</span>
          <h1>Staff access is not configured.</h1>
          <p>
            This authenticated account does not have an active record in
            <code>quiz_staff</code>.
          </p>

          {authError && <div className="error-box">{authError}</div>}

          <button className="secondary-btn" onClick={signOut}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    )
  }

  if (!staff.is_active) {
    return (
      <div className="setup-screen">
        <div className="setup-card">
          <ShieldCheck size={28} />
          <span className="eyebrow muted">ACCOUNT DISABLED</span>
          <h1>Your quiz account is inactive.</h1>
          <p>Contact the Quiz Master or administrator.</p>
          <button className="secondary-btn" onClick={signOut}>
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <AuthenticatedApp
      staff={staff}
      session={session}
      onSignOut={signOut}
    />
  )
}

function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function submit(event) {
    event.preventDefault()

    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'signin') {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        })

      if (signInError) {
        setError(signInError.message)
      } else {
        onAuth(data.session)
      }
    } else {
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setMessage(
          'Account created. An administrator must provision the quiz staff profile before access is granted.',
        )
        setMode('signin')
      }
    }

    setLoading(false)
  }

  return (
    <div className="auth-screen">
      <div className="auth-brand">
        <span className="brand-mark">
          <Zap size={18} fill="currentColor" />
        </span>
        <div>
          <strong>Advanced Quiz</strong>
          <small>Ebenezer International School</small>
        </div>
      </div>

      <div className="auth-card">
        <span className="eyebrow">
          <span />
          STAFF CONTROL CENTRE
        </span>

        <h1>{mode === 'signin' ? 'Welcome back.' : 'Create an account.'}</h1>

        <p>
          {mode === 'signin'
            ? 'Sign in to manage questions or operate the live competition.'
            : 'Create the authenticated account first. Staff access is still controlled from quiz_staff.'}
        </p>

        <form onSubmit={submit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="teacher@school.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>

          {error && <div className="error-box">{error}</div>}
          {message && <div className="success-box">{message}</div>}

          <button className="primary-btn wide" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        <button
          className="text-button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError('')
            setMessage('')
          }}
        >
          {mode === 'signin'
            ? 'Create a new authenticated account'
            : 'Back to staff sign in'}
        </button>
      </div>
    </div>
  )
}

function AuthenticatedApp({ staff, session, onSignOut }) {
  const [view, setView] = useState(
    staff.role === 'teacher' ? 'teacher' : 'master',
  )

  const isMaster = staff.role === 'quiz_master' || staff.role === 'admin'

  const go = (next) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const assignedSubjects = useMemo(
    () =>
      (staff.quiz_staff_subjects || [])
        .map((item) => item.quiz_subjects)
        .filter(Boolean)
        .filter((subject) => subject.is_active),
    [staff],
  )

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => go('home')}>
          <span className="brand-mark">
            <Zap size={18} fill="currentColor" />
          </span>

          <span>
            <strong>Advanced Quiz</strong>
            <small>Ebenezer International School</small>
          </span>
        </button>

        <nav>
          <button
            className={view === 'home' ? 'active' : ''}
            onClick={() => go('home')}
          >
            Overview
          </button>

          <button
            className={view === 'teacher' ? 'active' : ''}
            onClick={() => go('teacher')}
          >
            Question Bank
          </button>

          {isMaster && (
            <button
              className={view === 'master' ? 'active' : ''}
              onClick={() => go('master')}
            >
              Quiz Master
            </button>
          )}

          <button
            className={view === 'join' ? 'active' : ''}
            onClick={() => go('join')}
          >
            Join Quiz
          </button>
        </nav>

        <div className="top-actions">
          <span className="live-dot">
            <i />
            {staff.role === 'teacher' ? 'Teacher' : 'Quiz Master'}
          </span>

          <button className="avatar" title={staff.full_name}>
            {initials(staff.full_name)}
          </button>

          <button className="icon-button" onClick={onSignOut} title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {view === 'home' && (
        <Home
          go={go}
          staff={staff}
          assignedSubjects={assignedSubjects}
          isMaster={isMaster}
        />
      )}

      {view === 'teacher' && (
        <TeacherWorkspace
          staff={staff}
          assignedSubjects={assignedSubjects}
        />
      )}

      {view === 'master' && isMaster && (
        <QuizMasterWorkspace staff={staff} />
      )}

      {view === 'join' && (
        <StudentJoin
          session={session}
          go={go}
        />
      )}
    </div>
  )
}

function Home({ go, staff, assignedSubjects, isMaster }) {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">
            <span />
            WEEKLY INTRA-CLASS COMPETITION
          </span>

          <h1>
            Turn every Thursday
            <br />
            into <em>game day.</em>
          </h1>

          <p>
            Teachers prepare the questions. The Quiz Master controls the
            competition. Students join from their own authenticated devices.
          </p>

          <div className="hero-actions">
            {isMaster ? (
              <button className="primary-btn" onClick={() => go('master')}>
                Open Quiz Master
                <ArrowRight size={17} />
              </button>
            ) : (
              <button className="primary-btn" onClick={() => go('teacher')}>
                Manage Questions
                <ArrowRight size={17} />
              </button>
            )}

            <button className="secondary-btn" onClick={() => go('join')}>
              <Radio size={17} />
              Join Quiz
            </button>
          </div>

          <div className="hero-meta">
            <span>
              <CheckCircle2 size={15} />
              Supabase backed
            </span>

            <span>
              <CheckCircle2 size={15} />
              Realtime lobby
            </span>

            <span>
              <CheckCircle2 size={15} />
              Secure scoring architecture
            </span>
          </div>
        </div>

        <div className="hero-console">
          <div className="console-top">
            <span>
              <i /> LIVE CONTROL ROOM
            </span>
            <span>ADVANCED QUIZ</span>
          </div>

          <div className="console-title">
            <div>
              <small>AUTHENTICATED STAFF SESSION</small>
              <h3>{staff.full_name}</h3>
            </div>

            <span className="status-pill">READY</span>
          </div>

          <div className="console-question">
            <div className="question-label">
              STAGE 1 <span>• LIVE FOUNDATION</span>
            </div>

            <h4>
              Prepare questions, create a session and bring the classroom
              online.
            </h4>

            <div className="answer-grid">
              <span>
                <b>01</b> Question bank
              </span>

              <span>
                <b>02</b> Session control
              </span>

              <span>
                <b>03</b> Live lobby
              </span>

              <span>
                <b>04</b> Leaderboard
              </span>
            </div>
          </div>

          <div className="console-footer">
            <span>
              <Clock3 size={14} /> Realtime enabled
            </span>

            <strong>
              {assignedSubjects.length} subject
              {assignedSubjects.length === 1 ? '' : 's'}
            </strong>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow muted">THE PLATFORM</span>
            <h2>Everything starts with clean academic content.</h2>
          </div>

          <p>
            The question bank is connected directly to the competition engine,
            so published questions can become live rounds.
          </p>
        </div>

        <div className="feature-grid">
          <Feature
            icon={BookOpen}
            number="01"
            title="Teacher Question Bank"
            text="Teachers work only with their assigned subjects and prepare weekly question pools."
          />

          <Feature
            icon={ShieldCheck}
            number="02"
            title="Approval Workflow"
            text="Questions can remain drafts, move to submitted review, then become approved or published."
          />

          <Feature
            icon={MonitorPlay}
            number="03"
            title="Quiz Master Control"
            text="Create sessions, select rounds, set timers and open the competition lobby."
          />

          <Feature
            icon={BarChart3}
            number="04"
            title="Realtime Leaderboard"
            text="Participant records update through Supabase Realtime as the competition progresses."
          />
        </div>
      </section>

      <section className="section dark-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">ROUND ENGINE</span>
            <h2>Stage 1 already prepares the foundation for advanced modes.</h2>
          </div>

          {isMaster && (
            <button className="ghost-btn" onClick={() => go('master')}>
              Build a session
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        <div className="mode-strip">
          {MODES.slice(0, 4).map((mode, index) => {
            const Icon = mode.icon

            return (
              <div className="mode-card" key={mode.value}>
                <span className="mode-index">
                  0{index + 1}
                </span>

                <Icon size={21} />

                <h3>{mode.name}</h3>

                <p>{mode.description}</p>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

function Feature({ icon: Icon, number, title, text }) {
  return (
    <article className="feature-card">
      <div className="feature-top">
        <span>{number}</span>
        <Icon size={20} />
      </div>

      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}

function TeacherWorkspace({ staff, assignedSubjects }) {
  const firstSubject = assignedSubjects[0]

  const [filters, setFilters] = useState({
    subjectId: firstSubject?.id || '',
    className: 'SS 2',
    termName: 'First Term',
    weekNumber: 1,
  })

  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)

  const [draft, setDraft] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
    explanation: '',
    points: 10,
    difficulty: 'medium',
    topic: '',
  })

  useEffect(() => {
    if (filters.subjectId) {
      loadQuestions()
    } else {
      setQuestions([])
      setLoading(false)
    }
  }, [
    filters.subjectId,
    filters.className,
    filters.termName,
    filters.weekNumber,
  ])

  async function loadQuestions() {
    setLoading(true)
    setError('')

    const { data, error: queryError } = await supabase
      .from('quiz_question_bank')
      .select(`
        id,
        subject_id,
        class_name,
        term_name,
        week_number,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        explanation,
        points,
        difficulty,
        topic,
        status,
        created_by,
        approved_at,
        created_at
      `)
      .eq('subject_id', filters.subjectId)
      .eq('class_name', filters.className)
      .eq('term_name', filters.termName)
      .eq('week_number', Number(filters.weekNumber))
      .order('created_at', { ascending: false })

    if (queryError) {
      setError(queryError.message)
    } else {
      setQuestions(data || [])
    }

    setLoading(false)
  }

  function resetDraft() {
    setEditingId(null)
    setDraft({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A',
      explanation: '',
      points: 10,
      difficulty: 'medium',
      topic: '',
    })
  }

  function editQuestion(question) {
    setEditingId(question.id)

    setDraft({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
      points: question.points,
      difficulty: question.difficulty,
      topic: question.topic || '',
    })

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function saveQuestion(status) {
    setSaving(true)
    setError('')
    setMessage('')

    if (!filters.subjectId) {
      setError('Select a subject first.')
      setSaving(false)
      return
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

    if (
      !payload.question_text ||
      !payload.option_a ||
      !payload.option_b ||
      !payload.option_c ||
      !payload.option_d
    ) {
      setError('Complete the question and all four options.')
      setSaving(false)
      return
    }

    let query

    if (editingId) {
      query = supabase
        .from('quiz_question_bank')
        .update(payload)
        .eq('id', editingId)
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      query = supabase
        .from('quiz_question_bank')
        .insert({
          ...payload,
          created_by: user?.id || null,
        })
    }

    const { error: saveError } = await query

    if (saveError) {
      setError(saveError.message)
    } else {
      setMessage(
        status === 'submitted'
          ? 'Question submitted for approval.'
          : 'Question draft saved.',
      )
      resetDraft()
      await loadQuestions()
    }

    setSaving(false)
  }

  async function deleteQuestion(id) {
    if (!window.confirm('Delete this question?')) return

    const { error: deleteError } = await supabase
      .from('quiz_question_bank')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
    } else {
      setMessage('Question deleted.')
      await loadQuestions()
    }
  }

  if (!assignedSubjects.length) {
    return (
      <main className="workspace">
        <div className="empty-state">
          <BookOpen size={30} />
          <span className="eyebrow muted">TEACHER WORKSPACE</span>
          <h1>No subject has been assigned.</h1>
          <p>
            Your authenticated account is active, but the Quiz Master has not
            assigned a subject to your staff profile.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="workspace">
      <div className="page-heading">
        <div>
          <span className="eyebrow muted">TEACHER WORKSPACE</span>
          <h1>Question Bank</h1>
          <p>
            {staff.full_name} · Prepare and submit weekly competition
            questions.
          </p>
        </div>

        <button className="secondary-btn" onClick={loadQuestions}>
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      <div className="workspace-grid">
        <aside className="panel filter-panel">
          <div className="panel-title">
            <span>QUESTION POOL</span>
            <Settings2 size={17} />
          </div>

          <label>
            Subject
            <select
              value={filters.subjectId}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  subjectId: event.target.value,
                })
              }
            >
              {assignedSubjects.map((subject) => (
                <option value={subject.id} key={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Class
            <select
              value={filters.className}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  className: event.target.value,
                })
              }
            >
              {CLASSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Term
            <select
              value={filters.termName}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  termName: event.target.value,
                })
              }
            >
              {TERMS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Week
            <select
              value={filters.weekNumber}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  weekNumber: Number(event.target.value),
                })
              }
            >
              {Array.from({ length: 52 }, (_, index) => (
                <option value={index + 1} key={index + 1}>
                  Week {index + 1}
                </option>
              ))}
            </select>
          </label>

          <div className="pool-summary">
            <strong>{questions.length}</strong>
            <span>questions in this pool</span>
            <small>
              {questions.filter((q) => q.status === 'published').length}{' '}
              published
            </small>
          </div>
        </aside>

        <section className="panel question-editor">
          <div className="panel-title">
            <span>{editingId ? 'EDIT QUESTION' : 'NEW QUESTION'}</span>
            <span className="draft-tag">
              {editingId ? 'EDITING' : 'DRAFT'}
            </span>
          </div>

          {error && <div className="error-box">{error}</div>}
          {message && <div className="success-box">{message}</div>}

          <label>
            Question
            <textarea
              value={draft.question_text}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  question_text: event.target.value,
                })
              }
              placeholder="Type the question students will see..."
              rows="4"
            />
          </label>

          <div className="option-grid">
            {['a', 'b', 'c', 'd'].map((letter) => (
              <label key={letter}>
                Option {letter.toUpperCase()}
                <input
                  value={draft[`option_${letter}`]}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      [`option_${letter}`]: event.target.value,
                    })
                  }
                  placeholder={`Enter option ${letter.toUpperCase()}`}
                />
              </label>
            ))}
          </div>

          <div className="editor-row">
            <label>
              Correct answer
              <select
                value={draft.correct_answer}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    correct_answer: event.target.value,
                  })
                }
              >
                {['A', 'B', 'C', 'D'].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label>
              Points
              <input
                type="number"
                min="0"
                value={draft.points}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    points: event.target.value,
                  })
                }
              />
            </label>

            <label>
              Difficulty
              <select
                value={draft.difficulty}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    difficulty: event.target.value,
                  })
                }
              >
                {DIFFICULTIES.map((item) => (
                  <option key={item}>{capitalize(item)}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Topic
            <input
              value={draft.topic}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  topic: event.target.value,
                })
              }
              placeholder="e.g. Mechanics"
            />
          </label>

          <label>
            Explanation
            <textarea
              value={draft.explanation}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  explanation: event.target.value,
                })
              }
              placeholder="Optional explanation..."
              rows="3"
            />
          </label>

          <div className="form-actions">
            {editingId && (
              <button className="secondary-btn" onClick={resetDraft}>
                Cancel
              </button>
            )}

            <button
              className="secondary-btn"
              disabled={saving}
              onClick={() => saveQuestion('draft')}
            >
              Save draft
            </button>

            <button
              className="primary-btn"
              disabled={saving}
              onClick={() => saveQuestion('submitted')}
            >
              {saving ? 'Saving…' : 'Submit for approval'}
              <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>

      <section className="panel question-list-panel">
        <div className="panel-title">
          <span>QUESTION LIST</span>
          <span>{questions.length} TOTAL</span>
        </div>

        {loading ? (
          <div className="inline-loading">
            <div className="loading-spinner small" />
            Loading questions…
          </div>
        ) : questions.length === 0 ? (
          <div className="table-empty">
            No questions exist for the selected subject, class, term and week.
          </div>
        ) : (
          <div className="question-list">
            {questions.map((question, index) => (
              <article className="question-row" key={question.id}>
                <span className="question-number">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <div className="question-content">
                  <strong>{question.question_text}</strong>

                  <small>
                    {question.points} pts ·{' '}
                    {capitalize(question.difficulty)} · Answer{' '}
                    {question.correct_answer}
                  </small>
                </div>

                <span className={`status-badge ${question.status}`}>
                  {question.status}
                </span>

                <button
                  className="row-action"
                  onClick={() => editQuestion(question)}
                >
                  Edit
                </button>

                <button
                  className="row-action danger"
                  onClick={() => deleteQuestion(question.id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

function QuizMasterWorkspace({ staff }) {
  const [view, setView] = useState('builder')
  const [subjects, setSubjects] = useState([])
  const [sessions, setSessions] = useState([])
  const [activeSession, setActiveSession] = useState(null)

  useEffect(() => {
    loadSubjects()
    loadSessions()
  }, [])

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

  async function openSession(session) {
    setActiveSession(session)
    setView('control')
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

    if (sessionError) {
      throw sessionError
    }

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
      await supabase
        .from('quiz_sessions')
        .delete()
        .eq('id', sessionData.id)

      throw roundError
    }

    const selectedQuestions = payload.questionIds.map((questionId, index) => ({
      round_id: roundData.id,
      question_id: questionId,
      question_order: index + 1,
      points: payload.points,
    }))

    if (selectedQuestions.length) {
      const { error: questionError } = await supabase
        .from('quiz_round_questions')
        .insert(selectedQuestions)

      if (questionError) {
        throw questionError
      }
    }

    await loadSessions()
    setActiveSession(sessionData)
    setView('control')
  }

  return (
    <main className="workspace">
      {view === 'builder' && (
        <>
          <div className="page-heading">
            <div>
              <span className="eyebrow muted">QUIZ MASTER</span>
              <h1>Build a Quiz Session</h1>
              <p>
                Create the competition, choose the first round and open the
                lobby.
              </p>
            </div>

            <button className="secondary-btn" onClick={loadSessions}>
              <RefreshCw size={15} />
              Refresh
            </button>
          </div>

          <SessionBuilder
            subjects={subjects}
            onCreate={createSession}
          />

          <section className="panel session-history">
            <div className="panel-title">
              <span>RECENT SESSIONS</span>
              <span>{sessions.length}</span>
            </div>

            {sessions.length === 0 ? (
              <div className="table-empty">
                No quiz sessions have been created yet.
              </div>
            ) : (
              <div className="session-list">
                {sessions.map((item) => (
                  <button
                    className="session-row"
                    key={item.id}
                    onClick={() => openSession(item)}
                  >
                    <span className="session-status">
                      {item.status}
                    </span>

                    <div>
                      <strong>{item.title}</strong>
                      <small>
                        {item.class_name} · {item.term_name} · Week{' '}
                        {item.week_number}
                      </small>
                    </div>

                    <span className="session-code">
                      {item.join_code}
                    </span>

                    <ChevronRight size={17} />
                  </button>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {view === 'control' && activeSession && (
        <ControlRoom
          session={activeSession}
          onBack={() => {
            setView('builder')
            loadSessions()
          }}
        />
      )}
    </main>
  )
}

function SessionBuilder({ subjects, onCreate }) {
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
      setFilters((current) => ({
        ...current,
        subjectId: subjects[0].id,
      }))
    }
  }, [subjects, filters.subjectId])

  useEffect(() => {
    if (filters.subjectId) {
      loadQuestions()
    }
  }, [
    filters.subjectId,
    filters.className,
    filters.termName,
    filters.weekNumber,
  ])

  async function loadQuestions() {
    setLoadingQuestions(true)
    setError('')
    setSelected([])

    const { data, error: queryError } = await supabase
      .from('quiz_question_bank')
      .select(`
        id,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_answer,
        points,
        difficulty,
        status
      `)
      .eq('subject_id', filters.subjectId)
      .eq('class_name', filters.className)
      .eq('term_name', filters.termName)
      .eq('week_number', Number(filters.weekNumber))
      .in('status', ['approved', 'published'])
      .order('created_at', { ascending: true })

    if (queryError) {
      setError(queryError.message)
    } else {
      setQuestions(data || [])
    }

    setLoadingQuestions(false)
  }

  function toggleQuestion(id) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  async function submit(event) {
    event.preventDefault()

    setError('')

    if (!filters.subjectId) {
      setError('Select a subject.')
      return
    }

    if (!selected.length) {
      setError('Select at least one published question.')
      return
    }

    setSaving(true)

    try {
      await onCreate({
        title: title.trim() || 'Thursday Challenge',
        roundName: roundName.trim() || 'Round 1',
        className: filters.className,
        termName: filters.termName,
        weekNumber: Number(filters.weekNumber),
        subjectId: filters.subjectId,
        mode,
        timerSeconds: Number(timerSeconds),
        questionIds: selected,
        points: 10,
        joinCode: generateJoinCode(),
      })
    } catch (createError) {
      setError(createError.message)
    }

    setSaving(false)
  }

  return (
    <form className="setup-grid" onSubmit={submit}>
      <section className="panel setup-main">
        <div className="panel-title">
          <span>SESSION DETAILS</span>
          <span>STAGE 1</span>
        </div>

        {error && <div className="error-box">{error}</div>}

        <div className="field-grid">
          <label>
            Class
            <select
              value={filters.className}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  className: event.target.value,
                })
              }
            >
              {CLASSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Subject
            <select
              value={filters.subjectId}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  subjectId: event.target.value,
                })
              }
            >
              {subjects.map((subject) => (
                <option value={subject.id} key={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Term
            <select
              value={filters.termName}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  termName: event.target.value,
                })
              }
            >
              {TERMS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>

          <label>
            Week
            <select
              value={filters.weekNumber}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  weekNumber: Number(event.target.value),
                })
              }
            >
              {Array.from({ length: 52 }, (_, index) => (
                <option value={index + 1} key={index + 1}>
                  Week {index + 1}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field-grid">
          <label>
            Session title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label>
            First round name
            <input
              value={roundName}
              onChange={(event) => setRoundName(event.target.value)}
            />
          </label>
        </div>

        <div className="panel-subheading">
          <span>GAME MODE</span>
          <small>Stage 1 foundation</small>
        </div>

        <div className="mode-picker">
          {MODES.map((item) => {
            const Icon = item.icon

            return (
              <button
                type="button"
                className={mode === item.value ? 'selected' : ''}
                key={item.value}
                onClick={() => setMode(item.value)}
              >
                <Icon size={20} />
                <strong>{item.name}</strong>
                <small>{item.description}</small>
              </button>
            )
          })}
        </div>

        <div className="timer-picker">
          <span>QUESTION TIMER</span>

          <div>
            {TIMER_OPTIONS.map((seconds) => (
              <button
                type="button"
                className={
                  timerSeconds === seconds ? 'selected' : ''
                }
                key={seconds}
                onClick={() => setTimerSeconds(seconds)}
              >
                {seconds}s
              </button>
            ))}
          </div>
        </div>

        <button
          className="primary-btn wide"
          type="submit"
          disabled={saving}
        >
          {saving ? 'Creating session…' : 'Create session'}
          <ArrowRight size={17} />
        </button>
      </section>

      <aside className="panel question-selector">
        <div className="panel-title">
          <span>PUBLISHED QUESTIONS</span>
          <span>{selected.length} SELECTED</span>
        </div>

        {loadingQuestions ? (
          <div className="inline-loading">
            <div className="loading-spinner small" />
            Loading…
          </div>
        ) : questions.length === 0 ? (
          <div className="small-empty">
            No approved/published questions match the selected filters.
          </div>
        ) : (
          <div className="selection-list">
            {questions.map((question, index) => (
              <label className="question-check" key={question.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(question.id)}
                  onChange={() => toggleQuestion(question.id)}
                />

                <span>
                  <strong>
                    {String(index + 1).padStart(2, '0')}.{' '}
                    {question.question_text}
                  </strong>

                  <small>
                    {question.points} pts ·{' '}
                    {capitalize(question.difficulty)}
                  </small>
                </span>
              </label>
            ))}
          </div>
        )}
      </aside>
    </form>
  )
}

function ControlRoom({ session, onBack }) {
  const [currentSession, setCurrentSession] = useState(session)
  const [round, setRound] = useState(null)
  const [questions, setQuestions] = useState([])
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    loadControlRoom()
  }, [session.id])

  useEffect(() => {
    const channel = supabase
      .channel(`quiz-session-${session.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_sessions',
          filter: `id=eq.${session.id}`,
        },
        (payload) => {
          if (payload.new) {
            setCurrentSession(payload.new)
          }
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_rounds',
          filter: `session_id=eq.${session.id}`,
        },
        () => {
          loadRound()
        },
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_participants',
          filter: `session_id=eq.${session.id}`,
        },
        () => {
          loadParticipants()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session.id])

  useEffect(() => {
    if (!round || round.status !== 'live') return undefined

    const interval = window.setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0))
    }, 1000)

    return () => window.clearInterval(interval)
  }, [round?.status])

  async function loadControlRoom() {
    setLoading(true)

    await Promise.all([
      loadRound(),
      loadParticipants(),
    ])

    setLoading(false)
  }

  async function loadRound() {
    const { data: rounds } = await supabase
      .from('quiz_rounds')
      .select('*')
      .eq('session_id', session.id)
      .order('round_number', { ascending: true })
      .limit(1)

    const currentRound = rounds?.[0] || null
    setRound(currentRound)

    if (!currentRound) {
      setQuestions([])
      return
    }

    const { data: roundQuestions } = await supabase
      .from('quiz_round_questions')
      .select(`
        id,
        question_order,
        points,
        quiz_question_bank (
          id,
          question_text,
          option_a,
          option_b,
          option_c,
          option_d,
          correct_answer,
          explanation
        )
      `)
      .eq('round_id', currentRound.id)
      .order('question_order', { ascending: true })

    setQuestions(roundQuestions || [])

    const seconds =
      Number(currentRound.settings?.timer_seconds) || 30

    setTimeLeft(seconds)
  }

  async function loadParticipants() {
    const { data } = await supabase
      .from('quiz_participants')
      .select('*')
      .eq('session_id', session.id)
      .order('total_score', { ascending: false })
      .order('joined_at', { ascending: true })

    setParticipants(data || [])
  }

  async function updateSessionStatus(status) {
    setBusy(true)

    const { error } = await supabase
      .from('quiz_sessions')
      .update({
        status,
        started_at:
          status === 'live'
            ? new Date().toISOString()
            : currentSession.started_at,
        ended_at:
          status === 'completed'
            ? new Date().toISOString()
            : currentSession.ended_at,
      })
      .eq('id', session.id)

    if (!error) {
      setCurrentSession((current) => ({
        ...current,
        status,
      }))
    }

    setBusy(false)
  }

  async function updateRoundStatus(status) {
    if (!round) return

    setBusy(true)

    const { error } = await supabase
      .from('quiz_rounds')
      .update({
        status,
        started_at:
          status === 'live'
            ? new Date().toISOString()
            : round.started_at,
        ended_at:
          status === 'completed'
            ? new Date().toISOString()
            : round.ended_at,
      })
      .eq('id', round.id)

    if (!error) {
      setRound((current) => ({
        ...current,
        status,
      }))
    }

    setBusy(false)
  }

  async function changeQuestion(direction) {
    if (!round || !questions.length) return

    const currentNumber = Number(
      round.current_question_number || 1,
    )

    const nextNumber =
      direction === 'next'
        ? Math.min(currentNumber + 1, questions.length)
        : Math.max(currentNumber - 1, 1)

    const { error } = await supabase
      .from('quiz_rounds')
      .update({
        current_question_number: nextNumber,
      })
      .eq('id', round.id)

    if (!error) {
      setRound((current) => ({
        ...current,
        current_question_number: nextNumber,
      }))

      const seconds =
        Number(round.settings?.timer_seconds) || 30

      setTimeLeft(seconds)
    }
  }

  const currentQuestion =
    questions[
      Math.max(
        0,
        Number(round?.current_question_number || 1) - 1,
      )
    ]?.quiz_question_bank

  if (loading) {
    return (
      <div className="inline-loading large">
        <div className="loading-spinner" />
        Loading control room…
      </div>
    )
  }

  return (
    <>
      <div className="page-heading">
        <div>
          <button className="back-button" onClick={onBack}>
            ← Back to sessions
          </button>

          <span className="eyebrow muted">LIVE CONTROL ROOM</span>

          <h1>{currentSession.title}</h1>

          <p>
            {currentSession.class_name} · {currentSession.term_name} · Week{' '}
            {currentSession.week_number}
          </p>
        </div>

        <div className="control-heading-actions">
          <span className="join-code-large">
            {currentSession.join_code}
          </span>

          <span className="live-pill">
            <i />
            {currentSession.status}
          </span>
        </div>
      </div>

      <div className="control-grid">
        <section className="panel control-main">
          <div className="control-bar">
            <span>
              <span className="live-pill">
                <i />
                {round?.status || 'READY'}
              </span>
            </span>

            <span>
              {participants.length} participant
              {participants.length === 1 ? '' : 's'} online
            </span>
          </div>

          <div className="round-tabs">
            <button className="active">
              01 · {round?.name || 'Round 1'}
            </button>

            <button disabled>
              <Plus size={15} />
              More rounds in Stage 2
            </button>
          </div>

          <div className="question-stage">
            <div className="stage-meta">
              <span>
                QUESTION {round?.current_question_number || 1} /{' '}
                {questions.length}
              </span>

              <span>{currentQuestion?.correct_answer ? 'LIVE' : ''}</span>
            </div>

            {currentQuestion ? (
              <>
                <h2>{currentQuestion.question_text}</h2>

                <div className="stage-options">
                  <span>
                    <b>A</b> {currentQuestion.option_a}
                  </span>

                  <span>
                    <b>B</b> {currentQuestion.option_b}
                  </span>

                  <span>
                    <b>C</b> {currentQuestion.option_c}
                  </span>

                  <span>
                    <b>D</b> {currentQuestion.option_d}
                  </span>
                </div>
              </>
            ) : (
              <div className="stage-empty">
                <MonitorPlay size={34} />
                <h2>No questions have been attached to this round.</h2>
                <p>
                  Return to the session builder and select published
                  questions.
                </p>
              </div>
            )}

            <div className="stage-bottom">
              <div className="timer-block">
                <Clock3 size={17} />
                <span>{formatTime(timeLeft)}</span>
              </div>

              <div className="stage-actions">
                {currentSession.status !== 'completed' && (
                  <>
                    <button
                      className="secondary-btn"
                      disabled={busy}
                      onClick={() =>
                        updateRoundStatus(
                          round?.status === 'live'
                            ? 'paused'
                            : 'live',
                        )
                      }
                    >
                      {round?.status === 'live'
                        ? 'Pause round'
                        : 'Start round'}
                    </button>

                    <button
                      className="primary-btn"
                      disabled={busy || !currentQuestion}
                      onClick={() => changeQuestion('next')}
                    >
                      Next question
                      <ArrowRight size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="control-footer-actions">
            <button
              className="secondary-btn"
              disabled={busy}
              onClick={() =>
                updateSessionStatus(
                  currentSession.status === 'live'
                    ? 'paused'
                    : 'live',
                )
              }
            >
              <Radio size={15} />
              {currentSession.status === 'live'
                ? 'Pause session'
                : 'Open session'}
            </button>

            <button
              className="danger-btn"
              disabled={busy}
              onClick={() => updateSessionStatus('completed')}
            >
              End competition
            </button>
          </div>
        </section>

        <aside className="panel leaderboard">
          <div className="panel-title">
            <span>LIVE SCOREBOARD</span>
            <span>{participants.length} PLAYERS</span>
          </div>

          {participants.length === 0 ? (
            <div className="leaderboard-empty">
              <Users size={24} />
              <strong>Waiting for students</strong>
              <span>
                Display code{' '}
                <b>{currentSession.join_code}</b>
              </span>
            </div>
          ) : (
            participants.map((person, index) => (
              <div className="contestant" key={person.id}>
                <span className="rank">{index + 1}</span>

                <span className="person-avatar">
                  {initials(person.display_name)}
                </span>

                <div>
                  <strong>{person.display_name}</strong>
                  <small>
                    {person.connected ? 'Connected' : 'Away'}
                  </small>
                </div>

                <b>{Number(person.total_score || 0)}</b>
              </div>
            ))
          )}
        </aside>
      </div>
    </>
  )
}

function StudentJoin({ session, go }) {
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
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'quiz_participants',
          filter: `id=eq.${participant.id}`,
        },
        (payload) => {
          if (payload.new) {
            setParticipant(payload.new)
          }
        },
      )
      .subscribe()

    const heartbeat = window.setInterval(async () => {
      await supabase.rpc('quiz_update_presence', {
        p_participant_id: participant.id,
      })
    }, 15000)

    return () => {
      window.clearInterval(heartbeat)
      supabase.removeChannel(channel)
    }
  }, [participant?.id])

  async function join(event) {
    event.preventDefault()

    setLoading(true)
    setError('')

    const { data, error: joinError } = await supabase.rpc(
      'quiz_join_session',
      {
        p_join_code: code.trim().toUpperCase(),
        p_display_name: displayName.trim(),
        p_class_name: className,
        p_admission_number: admissionNumber.trim() || null,
      },
    )

    if (joinError) {
      setError(joinError.message)
    } else {
      setParticipant(data)
    }

    setLoading(false)
  }

  if (participant) {
    return (
      <main className="join-page">
        <div className="join-card lobby-card">
          <div className="join-icon">
            <CheckCircle2 size={25} />
          </div>

          <span className="eyebrow muted">COMPETITOR LOBBY</span>

          <h1>You are in.</h1>

          <p>
            Welcome, <strong>{participant.display_name}</strong>. Stay on
            this screen until the Quiz Master starts the competition.
          </p>

          <div className="lobby-code">
            <span>JOIN CODE</span>
            <strong>{code.toUpperCase()}</strong>
          </div>

          <div className="lobby-status">
            <i />
            Connected to live competition
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
        <div className="join-icon">
          <Radio size={25} />
        </div>

        <span className="eyebrow muted">STUDENT ENTRY</span>

        <h1>Join the competition.</h1>

        <p>
          Enter the code shown on the classroom screen. You must be
          authenticated to participate.
        </p>

        <label>
          Competition code
          <input
            autoFocus
            value={code}
            onChange={(event) =>
              setCode(event.target.value.toUpperCase())
            }
            placeholder="AQ-4821"
            maxLength="10"
            required
          />
        </label>

        <label>
          Your name
          <input
            value={displayName}
            onChange={(event) =>
              setDisplayName(event.target.value)
            }
            placeholder="Student name"
            required
          />
        </label>

        <label>
          Admission number
          <input
            value={admissionNumber}
            onChange={(event) =>
              setAdmissionNumber(event.target.value)
            }
            placeholder="Optional"
          />
        </label>

        <label>
          Class
          <select
            value={className}
            onChange={(event) =>
              setClassName(event.target.value)
            }
          >
            {CLASSES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        {error && <div className="error-box">{error}</div>}

        <button
          className="primary-btn wide"
          disabled={loading}
        >
          {loading ? 'Joining…' : 'Enter lobby'}
          {!loading && <ArrowRight size={17} />}
        </button>

        <button
          type="button"
          className="text-button"
          onClick={() => go('home')}
        >
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

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase())
    .join('')
}

function capitalize(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function generateJoinCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const numbers = '23456789'

  let result = 'AQ-'

  for (let index = 0; index < 3; index += 1) {
    result += letters[Math.floor(Math.random() * letters.length)]
  }

  result += numbers[Math.floor(Math.random() * numbers.length)]

  return result
}

function formatTime(seconds) {
  const safe = Math.max(0, Number(seconds) || 0)
  const minutes = Math.floor(safe / 60)
  const remaining = safe % 60

  return `${String(minutes).padStart(2, '0')}:${String(
    remaining,
  ).padStart(2, '0')}`
}

export default App