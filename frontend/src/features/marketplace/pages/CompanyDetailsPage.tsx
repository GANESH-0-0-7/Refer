import { ExternalLink } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import Sidebar from '@/components/layout/Sidebar'
import { CompanyCard } from '../components/CompanyCard'
import { MarketplaceSkeleton } from '../components/MarketplaceSkeleton'
import { useCompany } from '../hooks/useMarketplace'

export function CompanyDetailsPage() {
  const { slug = '' } = useParams()
  const companyQuery = useCompany(slug)
  const company = companyQuery.data

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 md:p-8">
        {companyQuery.isLoading ? (
          <MarketplaceSkeleton />
        ) : companyQuery.isError || !company ? (
          <p className="rounded-lg border border-red-900 bg-red-950/30 p-4 text-red-200">
            Unable to load company details.
          </p>
        ) : (
          <div className="mx-auto max-w-5xl">
            <Link to="/jobs" className="text-sm text-blue-300 hover:text-blue-200">
              Back to marketplace
            </Link>

            <section className="mt-5 rounded-lg border border-slate-700 bg-slate-800 p-6">
              <CompanyCard company={company} />
              <p className="mt-6 text-slate-300">{company.description}</p>
              {company.websiteUrl ? (
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
                >
                  Visit website
                  <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
            </section>

            <section className="mt-6">
              <h2 className="mb-4 text-xl font-semibold text-white">Open roles</h2>
              <div className="grid gap-4">
                {company.openJobs.map((job) => (
                  <Link
                    key={job.id}
                    to={`/jobs/${job.slug}`}
                    className="rounded-lg border border-slate-700 bg-slate-800 p-5 transition hover:border-blue-500"
                  >
                    <h3 className="font-semibold text-white">{job.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {job.location} · {job.workplaceType.replace('_', ' ')}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  )
}
