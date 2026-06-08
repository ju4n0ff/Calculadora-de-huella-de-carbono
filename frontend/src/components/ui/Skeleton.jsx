export default function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  )
}

export function CardSkeleton({ lines = 3 }) {
  return (
    <div className="metric-card" style={{ padding: 24 }}>
      <Skeleton width="40%" height={14} style={{ marginBottom: 12 }} />
      <Skeleton width="60%" height={28} style={{ marginBottom: 8 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${50 + Math.random() * 40}%`} height={12} style={{ marginTop: 6 }} />
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 6 }) {
  return (
    <div style={{ padding: 20 }}>
      <Skeleton width="100%" height={40} style={{ marginBottom: 8 }} />
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: 'flex', gap: 12, marginTop: 12 }}>
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} width={`${100 / cols}%`} height={24} />
          ))}
        </div>
      ))}
    </div>
  )
}
