import { Zap } from 'lucide-react'

export default function Brand({ onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className="brand" onClick={onClick}>
      <span className="brand-mark">
        <Zap size={18} fill="currentColor" />
      </span>
      <span>
        <strong>Advanced Quiz</strong>
        <small>Ebenezer International School</small>
      </span>
    </Tag>
  )
}
