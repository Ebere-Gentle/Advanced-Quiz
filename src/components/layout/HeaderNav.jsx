import { BookOpen, Home, Radio, Trophy, Tv } from 'lucide-react'

export default function HeaderNav({ view, isMaster, go }) {
  const items = [
    { key: 'home',        label: 'Overview',      icon: Home },
    { key: 'teacher',     label: 'Question Bank', icon: BookOpen },
    ...(isMaster ? [{ key: 'master', label: 'Quiz Master', icon: Tv }] : []),
    { key: 'leaderboard', label: 'Leaderboard',   icon: Trophy },
    { key: 'join',        label: 'Join Quiz',     icon: Radio },
  ]

  return (
    <nav className="topbar-nav" aria-label="Primary">
      {items.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          className={view === key ? 'active' : ''}
          onClick={() => go(key)}
          aria-current={view === key ? 'page' : undefined}
        >
          <Icon size={14} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
