export default function EmptyState({ icon: Icon, eyebrow, title, children }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={30} />}
      {eyebrow && <span className="eyebrow muted">{eyebrow}</span>}
      <h1>{title}</h1>
      {children}
    </div>
  )
}
