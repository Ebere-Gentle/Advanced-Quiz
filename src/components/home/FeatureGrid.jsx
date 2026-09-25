import { BarChart3, BookOpen, MonitorPlay, ShieldCheck } from 'lucide-react'
import Feature from './Feature'

export default function FeatureGrid() {
  return (
    <div className="feature-grid">
      <Feature icon={BookOpen}    number="01" title="Teacher Question Bank"
        text="Teachers work only with their assigned subjects and prepare weekly question pools." />
      <Feature icon={ShieldCheck} number="02" title="Approval Workflow"
        text="Questions can remain drafts, move to submitted review, then become approved or published." />
      <Feature icon={MonitorPlay} number="03" title="Quiz Master Control"
        text="Create sessions, select rounds, set timers and open the competition lobby." />
      <Feature icon={BarChart3}   number="04" title="Realtime Leaderboard"
        text="Participant records update through Supabase Realtime as the competition progresses." />
    </div>
  )
}
