export function MarketplaceSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-36 animate-pulse rounded-lg border border-slate-700 bg-slate-800"
        />
      ))}
    </div>
  )
}
