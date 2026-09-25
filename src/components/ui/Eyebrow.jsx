export default function Eyebrow({ children, muted = false }) {
  return (
    <span className={`eyebrow${muted ? ' muted' : ''}`}>
      {!muted && <span />}
      {children}
    </span>
  )
}
