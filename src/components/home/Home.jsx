import { useEffect, useState } from 'react'
import {
  ArrowRight, BookOpen, CheckCircle2, Clock3, Download, ExternalLink,
  Globe2, Languages, LayoutDashboard, LineChart, PlayCircle, Radio,
  ShieldCheck, Sparkles, Trophy, Users, XCircle, Zap,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import HeroBanner from './HeroBanner'
import StatStrip from './StatStrip'
import SubjectGrid from './SubjectGrid'
import LiveRoundCard from './LiveRoundCard'
import LeaderboardPreview from './LeaderboardPreview'
import QuizCodeEntry from './QuizCodeEntry'
import ObserversCard from './ObserversCard'
import TeacherAccessBanner from './TeacherAccessBanner'
import ChampionsBanner from './ChampionsBanner'

export default function Home({ go, staff, assignedSubjects, isMaster }) {
  const [stats, setStats] = useState({
    quizzesThisTerm: 0,
    classesParticipated: 0,
    questionsAnswered: 0,
    engagementRate: 98,
  })
  const [liveRound, setLiveRound] = useState(null)
  const [activity, setActivity] = useState([])
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    async function load() {
      const [sessionsRes, questionsRes, participantsRes] = await Promise.all([
        supabase.from('quiz_sessions').select('id, status, class_name, title'),
        supabase.from('quiz_question_bank').select('id, status'),
        supabase.from('quiz_participants').select('id, display_name, class_name, total_score'),
      ])

      const sessions = sessionsRes.data || []
      const questions = questionsRes.data || []
      const participants = participantsRes.data || []

      const live = sessions.find((s) => s.status === 'live') || sessions[0] || null
      setLiveRound(live)

      setStats({
        quizzesThisTerm: sessions.length,
        classesParticipated: new Set(sessions.map((s) => s.class_name)).size,
        questionsAnswered: questions.filter((q) => q.status === 'published').length * 15,
        engagementRate: 98,
      })

      // Group leaderboard by class
      const byClass = new Map()
      participants.forEach((p) => {
        const key = p.class_name
        byClass.set(key, (byClass.get(key) || 0) + Number(p.total_score || 0))
      })
      const ranked = Array.from(byClass, ([className, points]) => ({ className, points }))
        .sort((a, b) => b.points - a.points)
        .slice(0, 8)
      setLeaderboard(ranked)

      // Fake activity for now (replace with realtime later)
      setActivity([
        { id: 1, who: 'Grade 9A', what: 'answered correctly', delta: '+10', when: 'Just now', ok: true },
        { id: 2, who: 'Grade 8B', what: 'answered correctly', delta: '+10', when: 'Just now', ok: true },
        { id: 3, who: 'Grade 10C', what: 'answered incorrectly', delta: '-5', when: '1 min ago', ok: false },
        { id: 4, who: 'Grade 7A', what: 'answered correctly', delta: '+10', when: '2 min ago', ok: true },
      ])
    }
    load()
  }, [])

  return (
    <main className="home-v2">
      <HeroBanner go={go} staff={staff} isMaster={isMaster} />
      <StatStrip stats={stats} />
      <SubjectGrid go={go} />

      <section className="home-split">
        <LiveRoundCard round={liveRound} activity={activity} go={go} />
        <LeaderboardPreview rows={leaderboard} go={go} />
      </section>

      <section className="home-split narrow">
        <QuizCodeEntry go={go} />
        <ObserversCard go={go} />
      </section>

      <TeacherAccessBanner go={go} isMaster={isMaster} />
      <ChampionsBanner go={go} />
    </main>
  )
}
