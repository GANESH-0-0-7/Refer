import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Sidebar from '@/components/layout/Sidebar'
import { useToastContext } from '@/components/ToastProvider'
import { RootState } from '@/store'
import { JobCard } from '../components/JobCard'
import { JobFilters } from '../components/JobFilters'
import { MarketplaceSkeleton } from '../components/MarketplaceSkeleton'
import { MarketplaceStats } from '../components/MarketplaceStats'
import { PaginationControls } from '../components/PaginationControls'
import { ReferralRequestModal } from '../components/ReferralRequestModal'
import {
  useJobs,
  useMarketplaceDashboard,
  useReferralRequestMutation,
  useReferralRequests,
  useSaveJobMutation,
  useSavedJobs,
  useUnsaveJobMutation,
} from '../hooks/useMarketplace'
import { setMarketplacePage } from '../store/marketplaceSlice'
import { JobSummary } from '../types/marketplace'

type MarketplaceTab = 'jobs' | 'saved' | 'referrals'

export function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('jobs')
  const [selectedJob, setSelectedJob] = useState<JobSummary | null>(null)
  const filters = useSelector((state: RootState) => state.marketplace)
  const dispatch = useDispatch()
  const { addToast } = useToastContext()

  const dashboardQuery = useMarketplaceDashboard()
  const jobsQuery = useJobs({
    search: filters.search,
    location: filters.location,
    workplaceType: filters.workplaceType,
    experienceLevel: filters.experienceLevel,
    page: filters.page,
    size: filters.pageSize,
  })
  const savedJobsQuery = useSavedJobs(filters.page)
  const referralsQuery = useReferralRequests(filters.page)
  const saveMutation = useSaveJobMutation()
  const unsaveMutation = useUnsaveJobMutation()
  const referralMutation = useReferralRequestMutation()

  const handleSaveToggle = (job: JobSummary) => {
    const mutation = job.saved ? unsaveMutation : saveMutation
    mutation.mutate(job.id, {
      onSuccess: () => addToast(job.saved ? 'Job removed from saved jobs' : 'Job saved', 'success'),
      onError: () => addToast('Unable to update saved job', 'error'),
    })
  }

  const handleReferralSubmit = (payload: { message: string; resumeUrl?: string; linkedinUrl?: string; portfolioUrl?: string }) => {
    if (!selectedJob) {
      return
    }

    referralMutation.mutate(
      { jobId: selectedJob.id, payload },
      {
        onSuccess: () => {
          addToast('Referral request submitted', 'success')
          setSelectedJob(null)
        },
        onError: () => addToast('Unable to submit referral request', 'error'),
      }
    )
  }

  const activeJobsPage = activeTab === 'saved' ? savedJobsQuery.data : jobsQuery.data
  const activeJobsLoading = activeTab === 'saved' ? savedJobsQuery.isLoading : jobsQuery.isLoading
  const activeJobsError = activeTab === 'saved' ? savedJobsQuery.isError : jobsQuery.isError

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Job Referral Marketplace</h1>
            <p className="mt-2 text-slate-400">
              Discover companies, save roles, and manage referral requests from one workspace.
            </p>
          </div>
        </div>

        <MarketplaceStats dashboard={dashboardQuery.data} />

        <div className="mt-8 flex flex-wrap gap-2">
          {[
            { id: 'jobs', label: 'Search jobs' },
            { id: 'saved', label: 'Saved jobs' },
            { id: 'referrals', label: 'My referrals' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id as MarketplaceTab)
                dispatch(setMarketplacePage(0))
              }}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-700 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'jobs' ? (
          <div className="mt-6">
            <JobFilters />
          </div>
        ) : null}

        <section className="mt-6">
          {activeTab === 'referrals' ? (
            referralsQuery.isLoading ? (
              <MarketplaceSkeleton />
            ) : referralsQuery.isError ? (
              <p className="rounded-lg border border-red-900 bg-red-950/30 p-4 text-red-200">
                Unable to load referral requests.
              </p>
            ) : (
              <div className="space-y-4">
                {referralsQuery.data?.content.map((request) => (
                  <div key={request.id} className="rounded-lg border border-slate-700 bg-slate-800 p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-300">{request.status}</p>
                        <h3 className="mt-1 text-lg font-semibold text-white">{request.job.title}</h3>
                        <p className="mt-1 text-sm text-slate-400">{request.job.company.name}</p>
                        <p className="mt-3 text-sm text-slate-300">{request.message}</p>
                      </div>
                      <p className="text-sm text-slate-400">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
                {referralsQuery.data ? (
                  <PaginationControls
                    page={referralsQuery.data.page}
                    totalPages={referralsQuery.data.totalPages}
                    onPageChange={(page) => dispatch(setMarketplacePage(page))}
                  />
                ) : null}
              </div>
            )
          ) : activeJobsLoading ? (
            <MarketplaceSkeleton />
          ) : activeJobsError ? (
            <p className="rounded-lg border border-red-900 bg-red-950/30 p-4 text-red-200">
              Unable to load jobs.
            </p>
          ) : (
            <div className="space-y-4">
              {activeJobsPage?.content.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onSaveToggle={handleSaveToggle}
                  onRequestReferral={setSelectedJob}
                  saveLoading={saveMutation.isPending || unsaveMutation.isPending}
                />
              ))}
              {activeJobsPage?.content.length === 0 ? (
                <p className="rounded-lg border border-slate-700 bg-slate-800 p-6 text-slate-300">
                  No jobs found for the selected criteria.
                </p>
              ) : null}
              {activeJobsPage ? (
                <PaginationControls
                  page={activeJobsPage.page}
                  totalPages={activeJobsPage.totalPages}
                  onPageChange={(page) => dispatch(setMarketplacePage(page))}
                />
              ) : null}
            </div>
          )}
        </section>

        <ReferralRequestModal
          job={selectedJob}
          loading={referralMutation.isPending}
          onClose={() => setSelectedJob(null)}
          onSubmit={handleReferralSubmit}
        />
      </main>
    </div>
  )
}
