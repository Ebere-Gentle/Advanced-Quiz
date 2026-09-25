import { Zap } from 'lucide-react'

export default function Brand({ onClick }) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag className="brand" onClick={onClick} type={onClick ? 'button' : undefined}>
      <span className="brand-mark" aria-hidden="true">
        <Zap size={18} fill="currentColor" strokeWidth={0} />
      </span>
      <span className="brand-text">
        <strong>Advanced Quiz</strong>
        <small>Ebenezer International School</small>
      </span>
    </Tag>
  )
}
