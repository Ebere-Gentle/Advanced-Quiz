import { useState } from 'react'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  MonitorPlay,
  Plus,
  Radio,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'
import './App.css'

const modes = [
  { name: 'Spark', icon: Sparkles, description: 'Fast individual questions with a timed turn.' },
  { name: 'Buzzer', icon: Zap, description: 'First contestant to buzz earns the chance to answer.' },
  { name: 'Olympiad', icon: Trophy, description: 'Contestants select question numbers from a grid.' },
  { name: 'Duel', icon: Users, description: 'Two contestants answer the same question head-to-head.' },
]

const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'PHE', 'GST']
const classes = ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3']

const contestants = [
  { name: 'David Adewale', score: 86, status: 'Leading', color: 'blue' },
  { name: 'Mariam Yusuf', score: 78, status: 'Active', color: 'violet' },
  { name: 'Samuel Peter', score: 74, status: 'Active', color: 'orange' },
  { name: 'Esther James', score: 69, status: 'Active', color: 'green' },
  { name: 'Daniel Okoro', score: 62, status: 'Active', color: 'pink' },
]

function App() {
  const [view, setView] = useState('home')
  const [selectedMode, setSelectedMode] = useState('Buzzer')
  const [className, setClassName] = useState('SS 2')
  const [subject, setSubject] = useState('Mathematics')
  const [sessionCreated, setSessionCreated] = useState(false)

  const go = (next) => {
    setView(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => go('home')} aria-label="Advanced Quiz home">
          <span className="brand-mark"><Zap size={18} fill="currentColor" /></span>
          <span>
            <strong>Advanced Quiz</strong>
            <small>Ebenezer International School</small>
          </span>
        </button>

        <nav>
          <button className={view === 'home' ? 'active' : ''} onClick={() => go('home')}>Overview</button>
          <button className={view === 'teacher' ? 'active' : ''} onClick={() => go('teacher')}>Teacher</button>
          <button className={view === 'master' ? 'active' : ''} onClick={() => go('master')}>Quiz Master</button>
          <button className={view === 'join' ? 'active' : ''} onClick={() => go('join')}>Join Quiz</button>
        </nav>

        <div className="top-actions">
          <span className="live-dot"><i /> System ready</span>
          <button className="avatar">EG</button>
        </div>
      </header>

      {view === 'home' && <Home go={go} />}
      {view === 'teacher' && <Teacher />}
      {view === 'master' && (
        <QuizMaster
          className={className}
          setClassName={setClassName}
          subject={subject}
          setSubject={setSubject}
          selectedMode={selectedMode}
          setSelectedMode={setSelectedMode}
          sessionCreated={sessionCreated}
          setSessionCreated={setSessionCreated}
        />
      )}
      {view === 'join' && <JoinQuiz go={go} />}
    </div>
  )
}

function Home({ go }) {
  return <main>
    <section className="hero-section">
      <div className="hero-copy">
        <span className="eyebrow"><span /> WEEKLY INTRA-CLASS COMPETITION</span>
        <h1>Turn every Thursday<br />into <em>game day.</em></h1>
        <p>One class. Multiple rounds. Every student competing live. Advanced Quiz gives teachers, quiz masters and students one synchronized competition platform.</p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={() => go('master')}>Open Quiz Master <ArrowRight size={17} /></button>
          <button className="secondary-btn" onClick={() => go('teacher')}><BookOpen size={17} /> Manage Questions</button>
        </div>
        <div className="hero-meta">
          <span><CheckCircle2 size={15} /> Realtime scoring</span>
          <span><CheckCircle2 size={15} /> Multiple rounds</span>
          <span><CheckCircle2 size={15} /> Full audit trail</span>
        </div>
      </div>

      <div className="hero-console">
        <div className="console-top">
          <span><i /> LIVE CONTROL ROOM</span>
          <span>THU • 10:42 AM</span>
        </div>
        <div className="console-title">
          <div><small>SS 2 • WEEK 4</small><h3>Thursday Challenge</h3></div>
          <span className="status-pill">LIVE</span>
        </div>
        <div className="console-question">
          <div className="question-label">QUESTION 08 <span>• 20 PTS</span></div>
          <h4>Which physical quantity is measured in newtons?</h4>
          <div className="answer-grid">
            <span><b>A</b> Energy</span><span><b>B</b> Force</span>
            <span><b>C</b> Power</span><span><b>D</b> Pressure</span>
          </div>
        </div>
        <div className="console-footer">
          <span><Clock3 size={14} /> 00:17 remaining</span>
          <strong>DAVID BUZZED <span>842 ms</span></strong>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-heading">
        <div><span className="eyebrow muted">THE PLATFORM</span><h2>Built around the way your school actually runs quizzes.</h2></div>
        <p>Teachers prepare the content. The quiz master runs the room. Students compete on their own devices.</p>
      </div>
      <div className="feature-grid">
        <Feature icon={BookOpen} number="01" title="Teacher Question Bank" text="Subject teachers choose their class, term and week, then build reusable question pools with approval workflow." />
        <Feature icon={MonitorPlay} number="02" title="Quiz Master Control" text="Create a weekly session, arrange rounds, control the timer and see every contestant update live." />
        <Feature icon={Radio} number="03" title="Live Competition" text="Buzzer, Olympiad, Duel, Spark and other modes can run inside the same class session." />
        <Feature icon={BarChart3} number="04" title="Results & Analytics" text="Capture response time, scores, question performance and a complete event history." />
      </div>
    </section>

    <section className="section dark-section">
      <div className="section-heading">
        <div><span className="eyebrow">ROUND ENGINE</span><h2>One session can contain many game modes.</h2></div>
        <button className="ghost-btn" onClick={() => go('master')}>Build a session <ChevronRight size={16} /></button>
      </div>
      <div className="mode-strip">
        {modes.map((mode, index) => {
          const Icon = mode.icon
          return <div className="mode-card" key={mode.name}>
            <span className="mode-index">0{index + 1}</span>
            <Icon size={21} /><h3>{mode.name}</h3><p>{mode.description}</p>
          </div>
        })}
      </div>
    </section>
  </main>
}

function Feature({ icon: Icon, number, title, text }) {
  return <article className="feature-card">
    <div className="feature-top"><span>{number}</span><Icon size={20} /></div>
    <h3>{title}</h3><p>{text}</p>
  </article>
}

function Teacher() {
  const [saved, setSaved] = useState(false)
  const [draft, setDraft] = useState({ text: '', a: '', b: '', c: '', d: '', answer: 'B' })

  return <main className="workspace">
    <div className="page-heading">
      <div><span className="eyebrow muted">TEACHER WORKSPACE</span><h1>Question Bank</h1><p>Prepare questions for the weekly class competition.</p></div>
      <span className="save-state">{saved ? <><CheckCircle2 size={15} /> Draft saved</> : 'Unsaved changes'}</span>
    </div>

    <div className="workspace-grid">
      <aside className="panel filter-panel">
        <div className="panel-title"><span>QUESTION POOL</span><Settings2 size={17} /></div>
        <label>Subject<select defaultValue="Mathematics">{subjects.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Class<select defaultValue="SS 2">{classes.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Term<select defaultValue="First Term"><option>First Term</option><option>Second Term</option><option>Third Term</option></select></label>
        <label>Week<select defaultValue="Week 4">{Array.from({ length: 12 }, (_, i) => <option key={i}>Week {i + 1}</option>)}</select></label>
        <div className="pool-summary"><strong>24</strong><span>published questions</span><small>8 still need review</small></div>
      </aside>

      <section className="panel question-editor">
        <div className="panel-title"><span>NEW QUESTION</span><span className="draft-tag">DRAFT</span></div>
        <label>Question<textarea value={draft.text} onChange={e => setDraft({ ...draft, text: e.target.value })} placeholder="Type the question students will see..." rows="4" /></label>
        <div className="option-grid">
          {['a', 'b', 'c', 'd'].map(letter => <label key={letter}>Option {letter.toUpperCase()}<input value={draft[letter]} onChange={e => setDraft({ ...draft, [letter]: e.target.value })} placeholder={'Enter option ' + letter.toUpperCase()} /></label>)}
        </div>
        <div className="editor-row">
          <label>Correct answer<select value={draft.answer} onChange={e => setDraft({ ...draft, answer: e.target.value })}><option>A</option><option>B</option><option>C</option><option>D</option></select></label>
          <label>Points<select defaultValue="10"><option>5</option><option>10</option><option>15</option><option>20</option></select></label>
          <label>Difficulty<select defaultValue="Medium"><option>Easy</option><option>Medium</option><option>Hard</option></select></label>
        </div>
        <label>Explanation<textarea placeholder="Optional explanation for review and post-quiz analysis..." rows="3" /></label>
        <div className="form-actions">
          <button className="secondary-btn" onClick={() => setSaved(true)}>Save draft</button>
          <button className="primary-btn" onClick={() => setSaved(true)}>Submit for approval <ArrowRight size={16} /></button>
        </div>
      </section>
    </div>
  </main>
}

function QuizMaster({ className, setClassName, subject, setSubject, selectedMode, setSelectedMode, sessionCreated, setSessionCreated }) {
  return <main className="workspace">
    <div className="page-heading">
      <div><span className="eyebrow muted">QUIZ MASTER</span><h1>{sessionCreated ? 'Mission Control' : 'Build a Quiz Session'}</h1><p>{sessionCreated ? 'SS 2 • Thursday Challenge • Lobby open' : 'Set up one class competition and assemble its rounds.'}</p></div>
      {sessionCreated && <span className="live-pill"><i /> LOBBY</span>}
    </div>

    {!sessionCreated ? <div className="setup-grid">
      <section className="panel setup-main">
        <div className="panel-title"><span>SESSION DETAILS</span><span>STEP 1 OF 2</span></div>
        <div className="field-grid">
          <label>Class<select value={className} onChange={e => setClassName(e.target.value)}>{classes.map(item => <option key={item}>{item}</option>)}</select></label>
          <label>Subject<select value={subject} onChange={e => setSubject(e.target.value)}>{subjects.map(item => <option key={item}>{item}</option>)}</select></label>
          <label>Term<select defaultValue="First Term"><option>First Term</option><option>Second Term</option><option>Third Term</option></select></label>
          <label>Week<select defaultValue="Week 4"><option>Week 4</option><option>Week 5</option><option>Week 6</option></select></label>
        </div>
        <label>Session title<input defaultValue="Thursday Challenge" /></label>
        <div className="panel-subheading"><span>CHOOSE FIRST ROUND</span><small>More rounds can be added after creation.</small></div>
        <div className="mode-picker">{modes.map(mode => {
          const Icon = mode.icon
          return <button className={selectedMode === mode.name ? 'selected' : ''} key={mode.name} onClick={() => setSelectedMode(mode.name)}>
            <Icon size={20} /><strong>{mode.name}</strong><small>{mode.description}</small>
          </button>
        })}</div>
        <button className="primary-btn wide" onClick={() => setSessionCreated(true)}>Create session <ArrowRight size={17} /></button>
      </section>

      <aside className="panel preview-panel">
        <div className="panel-title"><span>SESSION PREVIEW</span></div>
        <div className="preview-logo"><Zap size={24} /></div>
        <h3>Thursday Challenge</h3><p>{className} • Week 4 • First Term</p>
        <div className="preview-stat"><span>First round</span><strong>{selectedMode}</strong></div>
        <div className="preview-stat"><span>Question source</span><strong>{subject}</strong></div>
        <div className="preview-stat"><span>Join method</span><strong>Code + account</strong></div>
      </aside>
    </div> : <ControlRoom />}
  </main>
}

function ControlRoom() {
  const [started, setStarted] = useState(false)
  return <div className="control-grid">
    <section className="panel control-main">
      <div className="control-bar"><span className="live-pill"><i /> {started ? 'ROUND LIVE' : 'LOBBY OPEN'}</span><span>Join code <strong className="join-code">AQ-4821</strong></span></div>
      <div className="round-tabs"><button className="active">01 • Buzzer</button><button>02 • Olympiad</button><button><Plus size={15} /> Add round</button></div>
      <div className="question-stage">
        <div className="stage-meta"><span>QUESTION 01 / 10</span><span>20 POINTS</span></div>
        <h2>{started ? 'Which physical quantity is measured in newtons?' : 'Ready to start the first round?'}</h2>
        {started && <div className="stage-options"><span><b>A</b> Energy</span><span><b>B</b> Force</span><span><b>C</b> Power</span><span><b>D</b> Pressure</span></div>}
        <div className="stage-bottom"><span className="timer">{started ? '00:17' : '00:30'}</span><button className="primary-btn" onClick={() => setStarted(!started)}>{started ? 'Pause round' : 'Start round'} <Radio size={16} /></button></div>
      </div>
    </section>

    <aside className="panel leaderboard">
      <div className="panel-title"><span>LIVE SCOREBOARD</span><span>{contestants.length} ONLINE</span></div>
      {contestants.map((person, index) => <div className="contestant" key={person.name}>
        <span className="rank">{index + 1}</span>
        <span className={'person-avatar ' + person.color}>{person.name.split(' ').map(n => n[0]).join('')}</span>
        <div><strong>{person.name}</strong><small>{person.status}</small></div>
        <b>{person.score}</b>
      </div>)}
    </aside>
  </div>
}

function JoinQuiz({ go }) {
  const [code, setCode] = useState('')
  return <main className="join-page">
    <div className="join-card">
      <div className="join-icon"><Radio size={25} /></div>
      <span className="eyebrow muted">STUDENT ENTRY</span>
      <h1>Join the competition.</h1>
      <p>Enter the code shown on the classroom screen. Your student account identifies you to the session.</p>
      <label>Competition code<input autoFocus value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="AQ-4821" maxLength="7" /></label>
      <button className="primary-btn wide" disabled={code.length < 4} onClick={() => go('master')}>Enter lobby <ArrowRight size={17} /></button>
      <div className="join-note"><ShieldCheck size={15} /> Your account, not your device, is your competition identity.</div>
    </div>
  </main>
}

export default App
