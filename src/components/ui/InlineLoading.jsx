import LoadingSpinner from './LoadingSpinner'

export default function InlineLoading({ label = 'Loading…', large = false, spinnerSize = 'small' }) {
  return (
    <div className={`inline-loading${large ? ' large' : ''}`}>
      <LoadingSpinner small={spinnerSize === 'small'} />
      {label}
    </div>
  )
}
