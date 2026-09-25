import { ArrowRight, BookOpen, Calculator, FlaskConical, Globe2 } from 'lucide-react'

const SUBJECTS = [
  { key: 'math',  title: 'MATHEMATICS', desc: 'Numbers, Logic, Patterns & More',   count: 8, icon: Calculator,    tone: 'blue' },
  { key: 'sci',   title: 'SCIENCES',    desc: 'Discover, Experiment, Understand',  count: 6, icon: FlaskConical,  tone: 'teal' },
  { key: 'eng',   title: 'ENGLISH',     desc: 'Language, Grammar, Literature',     count: 7, icon: BookOpen,      tone: 'amber' },
  { key: 'hum',   title: 'HUMANITIES',  desc: 'History, Geography, Civics & More', count: 5, icon: Globe2,        tone: 'pink' },
]

export default function SubjectGrid({ go }) {
  return (
    <section className="subject-section">
      <div className="subject-header">
        <div>
          <span className="hb-eyebrow">CHOOSE YOUR CHALLENGE</span>
          <h3>Select a Subject</h3>
        </div>
        <button className="link-btn" onClick={() => go('teacher')}>
          View All Subjects <ArrowRight size={14} />
        </button>
      </div>

      <div className="subject-grid">
        {SUBJECTS.map((s) => {
          const Icon = s.icon
          return (
            <button key={s.key} className={`subject-card tone-${s.tone}`} onClick={() => go('join')}>
              <span className="subject-icon">
                <Icon size={26} />
              </span>
              <strong>{s.title}</strong>
              <span className="subject-desc">{s.desc}</span>
              <span className="subject-foot">
                <span>{s.count} Active Quizzes</span>
                <span className="subject-arrow"><ArrowRight size={14} /></span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
