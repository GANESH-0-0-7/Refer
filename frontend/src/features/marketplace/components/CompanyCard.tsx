import { Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { CompanySummary } from '../types/marketplace'

interface CompanyCardProps {
  company: CompanySummary
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link
      to={`/companies/${company.slug}`}
      className="block rounded-lg border border-slate-700 bg-slate-800 p-5 transition hover:border-blue-500"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-slate-700">
          {company.logoUrl ? (
            <img src={company.logoUrl} alt="" className="h-8 w-8 rounded object-contain" />
          ) : (
            <Building2 className="h-6 w-6 text-slate-300" />
          )}
        </div>

        <div className="min-w-0">
          <h3 className="font-semibold text-white">{company.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{company.industry}</p>
          <p className="mt-2 text-sm text-slate-300">
            {company.openRolesCount} open roles · {company.referralSuccessRate}% referral success
          </p>
        </div>
      </div>
    </Link>
  )
}
