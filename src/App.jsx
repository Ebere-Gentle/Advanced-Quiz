import { useMemo, useState } from 'react'
import { LogOut, ShieldCheck, Zap } from 'lucide-react'
import { supabase } from './lib/supabase'
import { useAuth } from './hooks/useAuth'
import LoadingScreen from './components/ui/LoadingScreen'
import SetupCard from './components/ui/SetupCard'
import AuthScreen from './components/auth/AuthScreen'
import Topbar from './components/layout/Topbar'
import Home from './components/home/Home'
import TeacherWorkspace from './components/teacher/TeacherWorkspace'
import QuizMasterWorkspace from './components/master/QuizMasterWorkspace'
import StudentJoin from './components/student/StudentJoin'
import './styles/home-v2.css'
import './App.css'

function AuthenticatedApp({ staff, session, onSignOut }) {
  const [view, setView] = useState(staff.role === 'teacher' ? 'teacher' : 'master')
  const isMaster = staff.role === 'quiz_master' || staff.role === 'admin'

  const go = (next) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const assignedSubjects = useMemo(
    () => (staff.quiz_staff_subjects || [])
      .map((item) => item.quiz_subjects)
      .filter(Boolean)
      .filter((subject) => subject.is_active),
    [staff],
  )

  return (
    <div className="app">
      <Topbar staff={staff} view={view} isMaster={isMaster} go={go} onSignOut={onSignOut} />

      {view === 'home'    && <Home go={go} staff={staff} assignedSubjects={assignedSubjects} isMaster={isMaster} />}
      {view === 'teacher' && <TeacherWorkspace staff={staff} assignedSubjects={assignedSubjects} />}
      {view === 'master'  && isMaster && <QuizMasterWorkspace staff={staff} />}
      {view === 'join'    && <StudentJoin session={session} go={go} />}
    </div>
  )
}

export default function App() {
  const { session, staff, loading, authError, signOut, setSession } = useAuth()

  if (!supabase) {
    return (
      <SetupCard icon={Zap} title="Supabase configuration required">
        <p>
          Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>{' '}
          to the project environment.
        </p>
      </SetupCard>
    )
  }

  if (loading) return <LoadingScreen label="Loading Advanced Quiz…" />

  if (!session) return <AuthScreen onAuth={setSession} />

  if (!staff) {
    return (
      <SetupCard
        icon={ShieldCheck}
        eyebrow="ACCOUNT NOT PROVISIONED"
        title="Staff access is not configured."
        actions={
          <button className="secondary-btn" onClick={signOut}>
            <LogOut size={16} /> Sign out
          </button>
        }
      >
        <p>
          This authenticated account does not have an active record in
          <code>quiz_staff</code>.
        </p>
        {authError && <div className="error-box">{authError}</div>}
      </SetupCard>
    )
  }

  if (!staff.is_active) {
    return (
      <SetupCard
        icon={ShieldCheck}
        eyebrow="ACCOUNT DISABLED"
        title="Your quiz account is inactive."
        actions={
          <button className="secondary-btn" onClick={signOut}>
            <LogOut size={16} /> Sign out
          </button>
        }
      >
        <p>Contact the Quiz Master or administrator.</p>
      </SetupCard>
    )
  }

  return <AuthenticatedApp staff={staff} session={session} onSignOut={signOut} />
}
