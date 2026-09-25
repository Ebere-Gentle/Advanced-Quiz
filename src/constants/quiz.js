import {
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react'

export const MODES = [
  { value: 'buzzer',     name: 'Buzzer',     icon: Zap,         description: 'Fast-response competition.' },
  { value: 'spark',      name: 'Spark',      icon: Sparkles,    description: 'Individual timed questions.' },
  { value: 'olympiad',   name: 'Olympiad',   icon: Trophy,      description: 'Strategic question selection.' },
  { value: 'duel',       name: 'Duel',       icon: Users,       description: 'Head-to-head questions.' },
  { value: 'survival',   name: 'Survival',   icon: ShieldCheck, description: 'Lives and elimination.' },
  { value: 'rapid_fire', name: 'Rapid Fire', icon: Radio,       description: 'Continuous quick questions.' },
]

export const CLASSES = ['JSS 1', 'JSS 2', 'JSS 3', 'SS 1', 'SS 2', 'SS 3']
export const TERMS = ['First Term', 'Second Term', 'Third Term']
export const DIFFICULTIES = ['easy', 'medium', 'hard']
export const TIMER_OPTIONS = [10, 15, 20, 30, 45, 60]
export const WEEKS = Array.from({ length: 52 }, (_, i) => i + 1)
