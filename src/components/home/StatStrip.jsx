import { Activity, CheckCircle2, Trophy, Users } from 'lucide-react'

export default function StatStrip({ stats }) {
  const items = [
    { icon: Trophy,       value: stats.quizzesThisTerm,    label: 'Quizzes Conducted',    hint: 'This Term',      tint: 'blue' },
    { icon: Users,        value: stats.classesParticipated,label: 'Classes Participated', hint: 'Across All Grades', tint: 'purple' },
    { icon: CheckCircle2, value: stats.questionsAnswered.toLocaleString(), label: 'Questions Answered', hint: 'This Week', tint: 'green' },
    { icon: Activity,     value: `${stats.engagementRate}%`, label: 'Engagement Rate',    hint: 'Keep it up!',    tint: 'amber' },
  ]

  return (
    <section className="stat-strip">
      {items.map(({ icon: Icon, value, label, hint, tint }) => (
        <div className="stat-strip-item" key={label}>
          <span className={`stat-icon tint-${tint}`}>
            <Icon size={22} />
          </span>
          <div>
            <strong>{value}</strong>
            <span>{label}</span>
            <small>{hint}</small>
          </div>
        </div>
      ))}
    </section>
  )
}
