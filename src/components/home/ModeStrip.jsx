import { MODES } from '../../constants/quiz'

export default function ModeStrip({ limit = 4 }) {
  return (
    <div className="mode-strip">
      {MODES.slice(0, limit).map((mode, index) => {
        const Icon = mode.icon
        return (
          <div className="mode-card" key={mode.value}>
            <span className="mode-index">0{index + 1}</span>
            <Icon size={21} />
            <h3>{mode.name}</h3>
            <p>{mode.description}</p>
          </div>
        )
      })}
    </div>
  )
}
