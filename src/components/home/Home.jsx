import { ChevronRight } from 'lucide-react'
import Eyebrow from '../ui/Eyebrow'
import Hero from './Hero'
import FeatureGrid from './FeatureGrid'
import ModeStrip from './ModeStrip'

export default function Home({ go, staff, assignedSubjects, isMaster }) {
  return (
    <main>
      <Hero staff={staff} assignedSubjects={assignedSubjects}
        isMaster={isMaster} go={go} />

      <section className="section">
        <div className="section-heading">
          <div>
            <Eyebrow muted>THE PLATFORM</Eyebrow>
            <h2>Everything starts with clean academic content.</h2>
          </div>
          <p>
            The question bank is connected directly to the competition engine,
            so published questions can become live rounds.
          </p>
        </div>
        <FeatureGrid />
      </section>

      <section className="section dark-section">
        <div className="section-heading">
          <div>
            <Eyebrow>ROUND ENGINE</Eyebrow>
            <h2>Stage 1 already prepares the foundation for advanced modes.</h2>
          </div>
          {isMaster && (
            <button className="ghost-btn" onClick={() => go('master')}>
              Build a session <ChevronRight size={16} />
            </button>
          )}
        </div>
        <ModeStrip />
      </section>
    </main>
  )
}
