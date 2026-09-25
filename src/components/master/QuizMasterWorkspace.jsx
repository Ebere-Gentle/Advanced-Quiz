import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { useQuizSessions } from '../../hooks/useQuizSessions'
import Eyebrow from '../ui/Eyebrow'
import SessionBuilder from './SessionBuilder'
import SessionHistory from './SessionHistory'
import ControlRoom from './ControlRoom/ControlRoom'

export default function QuizMasterWorkspace({ staff }) {
  const [view, setView] = useState('builder')
  const [activeSession, setActiveSession] = useState(null)
  const { subjects, sessions, loadSessions, createSession } = useQuizSessions(staff)

  async function handleCreate(payload) {
    const created = await createSession(payload)
    setActiveSession(created)
    setView('control')
  }

  function openSession(session) {
    setActiveSession(session)
    setView('control')
  }

  return (
    <main className="workspace">
      {view === 'builder' && (
        <>
          <div className="page-heading">
            <div>
              <Eyebrow muted>QUIZ MASTER</Eyebrow>
              <h1>Build a Quiz Session</h1>
              <p>Create the competition, choose the first round and open the lobby.</p>
            </div>
            <button className="secondary-btn" onClick={loadSessions}>
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          <SessionBuilder subjects={subjects} onCreate={handleCreate} />
          <SessionHistory sessions={sessions} onOpen={openSession} />
        </>
      )}

      {view === 'control' && activeSession && (
        <ControlRoom
          session={activeSession}
          onBack={() => { setView('builder'); loadSessions() }}
        />
      )}
    </main>
  )
}
