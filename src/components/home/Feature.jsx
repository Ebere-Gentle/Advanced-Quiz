export default function Feature({ icon: Icon, number, title, text }) {
  return (
    <article className="feature-card">
      <div className="feature-top">
        <span>{number}</span>
        <Icon size={20} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  )
}
