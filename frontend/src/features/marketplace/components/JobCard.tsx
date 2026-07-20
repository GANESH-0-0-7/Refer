import { Bookmark, BookmarkCheck, Building2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'

import { JobSummary } from '../types/marketplace'

interface JobCardProps {
  job: JobSummary
  onSaveToggle: (job: JobSummary) => void
  onRequestReferral: (job: JobSummary) => void
  saveLoading?: boolean
}

const formatSalary = (job: JobSummary) => {
  if (!job.minSalary && !job.maxSalary) {
    return 'Salary undisclosed'
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: job.currency,
    maximumFractionDigits: 0,
  })

  return `${job.minSalary ? formatter.format(job.minSalary) : 'Open'} - ${
    job.maxSalary ? formatter.format(job.maxSalary) : 'Open'
  }`
}

export function JobCard({ job, onSaveToggle, onRequestReferral, saveLoading = false }: JobCardProps) {
  return (
    <article className="rounded-lg border border-slate-700 bg-slate-800 p-5 transition hover:border-blue-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <Link to={`/jobs/${job.slug}`} className="text-xl font-semibold text-white hover:text-blue-300">
            {job.title}
          </Link>

          <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-400">
            <Link to={`/companies/${job.company.slug}`} className="inline-flex items-center gap-1 hover:text-blue-300">
              <Building2 className="h-4 w-4" />
              {job.company.name}
            </Link>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {job.location}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {[job.workplaceType, job.employmentType, job.experienceLevel].map((tag) => (
              <span key={tag} className="rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200">
                {tag.replace('_', ' ')}
              </span>
            ))}
          </div>

          <p className="mt-4 text-sm text-slate-300">{formatSalary(job)}</p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
          <button
            type="button"
            disabled={saveLoading}
            onClick={() => onSaveToggle(job)}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700 disabled:opacity-50"
          >
            {job.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {job.saved ? 'Saved' : 'Save'}
          </button>

          <button
            type="button"
            disabled={job.referralRequested}
            onClick={() => onRequestReferral(job)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-600"
          >
            {job.referralRequested ? 'Requested' : 'Request referral'}
          </button>
        </div>
      </div>
    </article>
  )
}
