import { Plus } from 'lucide-react'

export default function RoundTabs({ round }) {
  return (
    <div className="round-tabs">
      <button className="active">01 · {round?.name || 'Round 1'}</button>
      <button disabled><Plus size={15} /> More rounds in Stage 2</button>
    </div>
  )
}
