import {
  ArrowRight, BarChart3, BookOpen, FilePlus2, MonitorPlay, Users,
} from 'lucide-react'

const ITEMS = [
  { icon: FilePlus2,   label: 'Create Quiz' },
  { icon: Users,       label: 'Manage Classes' },
  { icon: BookOpen,    label: 'Question Bank' },
  { icon: BarChart3,   label: 'Reports & Analytics' },
  { icon: MonitorPlay, label: 'Live Control Room' },
]

export default function TeacherAccessBanner({ go, isMaster }) {
  return (
    <section className="teacher-banner">
      <div className="teacher-banner-left">
        <span className="teacher-banner-eyebrow">TEACHER / QUIZ MASTER ACCESS</span>
        <h3>Manage quizzes, classes, questions and reports</h3>

        <div className="teacher-banner-items">
          {ITEMS.map(({ icon: Icon, label }) => (
            <span key={label} className="teacher-banner-item">
              <Icon size={16} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <button
        className="teacher-banner-cta"
        onClick={() => go(isMaster ? 'master' : 'teacher')}
      >
        Go to Dashboard <ArrowRight size={15} />
      </button>
    </section>
  )
}
