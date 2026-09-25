export default function LoadingSpinner({ small = false }) {
  return <div className={`loading-spinner${small ? ' small' : ''}`} />
}
