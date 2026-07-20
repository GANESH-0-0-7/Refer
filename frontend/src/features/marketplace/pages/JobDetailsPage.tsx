import { ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Sidebar from '@/components/layout/Sidebar'
import { useToastContext } from '@/components/ToastProvider'
import { MarketplaceSkeleton } from '../components/MarketplaceSkeleton'
import { ReferralRequestModal } from '../components/ReferralRequestModal'
import {
  useJob,
  useReferralRequestMutation,
  useSaveJobMutation,
  useUnsaveJobMutation,
} from '../hooks/useMarketplace'
import { JobSummary } from '../types/marketplace'

export function JobDetailsPage() {
  const { slug = '' } = useParams()
  const [selectedJob, setSelectedJob] = useState<JobSummary | null>(null)
  const { addToast } = useToastContext()
  const jobQuery = useJob(slug)
  const saveMutation = useSaveJobMutation()
  const unsaveMutation = useUnsaveJobMutation()
  const referralMutation = useReferralRequestMutation()

  const job = jobQuery.data

  const handleSaveToggle = () => {
    if (!job) {
      return
    }

    const mutation = job.saved ? unsaveMutation : saveMutation
    mutation.mutate(job.id, {
      onSuccess: () => addToast(job.saved ? 'Job removed from saved jobs' : 'Job saved', 'success'),
      onError: () => addToast('Unable to update saved job', 'error'),
    })
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 md:p-8">
        {jobQuery.isLoading ? (
          <MarketplaceSkeleton />
        ) : jobQuery.isError || !job ? (
          <p className="rounded-lg border border-red-900 bg-red-950/30 p-4 text-red-200">
            Unable to load job details.
          </p>
        ) : (
          <div className="mx-auto max-w-5xl">
            <Link to="/jobs" className="text-sm text-blue-300 hover:text-blue-200">
              Back to jobs
            </Link>

            <section className="mt-5 rounded-lg border border-slate-700 bg-slate-800 p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-300">{job.company.name}</p>
                  <h1 className="mt-2 text-3xl font-bold text-white">{job.title}</h1>
                  <p className="mt-3 text-slate-400">
                    {job.location} · {job.workplaceType.replace('_', ' ')} · {job.employmentType.replace('_', ' ')}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleSaveToggle}
                    className="rounded-md border border-slate-600 px-4 py-2 text-sm text-slate-100 hover:bg-slate-700"
                  >
                    {job.saved ? 'Saved' : 'Save job'}
                  </button>
                  <button
                    type="button"
                    disabled={job.referralRequested}
                    onClick={() => setSelectedJob(job)}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-600"
                  >
                    {job.referralRequested ? 'Referral requested' : 'Request referral'}
                  </button>
                  {job.applyUrl ? (
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      Apply
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
              <div className="space-y-6">
                <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                  <h2 className="text-xl font-semibold text-white">Role overview</h2>
                  <p className="mt-3 whitespace-pre-line text-slate-300">{job.description}</p>
                </div>

                <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                  <h2 className="text-xl font-semibold text-white">Requirements</h2>
                  <p className="mt-3 whitespace-pre-line text-slate-300">{job.requirements}</p>
                </div>
              </div>

              <aside className="rounded-lg border border-slate-700 bg-slate-800 p-6">
                <h2 className="text-lg font-semibold text-white">Company</h2>
                <Link to={`/companies/${job.company.slug}`} className="mt-3 block text-blue-300 hover:text-blue-200">
                  {job.company.name}
                </Link>
                <p className="mt-3 text-sm text-slate-400">{job.company.industry}</p>
                <p className="mt-4 text-sm text-slate-300">
                  Referral bonus: {job.referralBonus ? `$${job.referralBonus.toLocaleString()}` : 'Not listed'}
                </p>
              </aside>
            </section>
          </div>
        )}

        <ReferralRequestModal
          job={selectedJob}
          loading={referralMutation.isPending}
          onClose={() => setSelectedJob(null)}
          onSubmit={(payload) => {
            if (!job) {
              return
            }
            referralMutation.mutate(
              { jobId: job.id, payload },
              {
                onSuccess: () => {
                  addToast('Referral request submitted', 'success')
                  setSelectedJob(null)
                },
                onError: () => addToast('Unable to submit referral request', 'error'),
              }
            )
          }}
        />
      </main>
    </div>
  )
}
