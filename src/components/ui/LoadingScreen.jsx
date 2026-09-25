import LoadingSpinner from './LoadingSpinner'

export default function LoadingScreen({ label = 'Loading…' }) {
  return (
    <div className="loading-screen">
      <LoadingSpinner />
      <span>{label}</span>
    </div>
  )
}
