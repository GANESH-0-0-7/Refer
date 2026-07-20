import { MarketplaceDashboard } from '../types/marketplace'

interface MarketplaceStatsProps {
  dashboard?: MarketplaceDashboard
}

export function MarketplaceStats({ dashboard }: MarketplaceStatsProps) {
  const stats = [
    { label: 'Open jobs', value: dashboard?.openJobs ?? 0 },
    { label: 'Saved jobs', value: dashboard?.savedJobs ?? 0 },
    { label: 'Referral requests', value: dashboard?.referralRequests ?? 0 },
    { label: 'Referred', value: dashboard?.referredRequests ?? 0 },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border border-slate-700 bg-slate-800 p-5">
          <p className="text-sm text-slate-400">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
