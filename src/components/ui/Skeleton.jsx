export default function Skeleton({ width = '100%', height = 14, radius = 6, className = '' }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius: radius }}
      aria-hidden="true"
    />
  )
}

export function SkeletonRow({ columns = 4 }) {
  return (
    <div className="skeleton-row">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} height={12} width={i === 0 ? '30%' : '18%'} />
      ))}
    </div>
  )
}
