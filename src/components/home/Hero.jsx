import { ArrowRight, CheckCircle2, Radio } from 'lucide-react'
import Eyebrow from '../ui/Eyebrow'
import HeroConsole from './HeroConsole'

export default function Hero({ staff, assignedSubjects, isMaster, go }) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <Eyebrow>WEEKLY INTRA-CLASS COMPETITION</Eyebrow>

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
              Open Quiz Master <ArrowRight size={17} />
            </button>
          ) : (
            <button className="primary-btn" onClick={() => go('teacher')}>
              Manage Questions <ArrowRight size={17} />
            </button>
          )}

          <button className="secondary-btn" onClick={() => go('join')}>
            <Radio size={17} /> Join Quiz
          </button>
        </div>

        <div className="hero-meta">
          <span><CheckCircle2 size={15} /> Supabase backed</span>
          <span><CheckCircle2 size={15} /> Realtime lobby</span>
          <span><CheckCircle2 size={15} /> Secure scoring architecture</span>
        </div>
      </div>

      <HeroConsole staff={staff} assignedSubjects={assignedSubjects} />
    </section>
  )
}
