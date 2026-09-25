export default function PanelTitle({ left, right }) {
  return (
    <div className="panel-title">
      <span>{left}</span>
      {right != null && <span>{right}</span>}
    </div>
  )
}
