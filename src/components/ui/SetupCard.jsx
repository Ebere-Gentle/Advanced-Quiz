export default function SetupCard({ icon: Icon, eyebrow, title, children, actions }) {
  return (
    <div className="setup-screen">
      <div className="setup-card">
        {Icon && <Icon size={28} />}
        {eyebrow && <span className="eyebrow muted">{eyebrow}</span>}
        <h1>{title}</h1>
        {children}
        {actions}
      </div>
    </div>
  )
}
